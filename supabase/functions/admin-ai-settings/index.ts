import {
  corsHeaders,
  decryptSecret,
  encryptSecret,
  getGeminiSettings,
  jsonResponse,
  requireAdmin,
  callGemini,
} from '../_shared/ai-helpers.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { supabase, user } = await requireAdmin(req)
    const body = await req.json()
    const action = body.action as string

    if (action === 'get_provider_status') {
      const { data, error } = await supabase
        .from('admin_ai_provider_status')
        .select('*')
        .eq('provider', 'gemini')
        .maybeSingle()
      if (error) throw error
      return jsonResponse({ status: 'OK', provider: data })
    }

    if (action === 'save_provider_key' || action === 'rotate_provider_key') {
      const apiKey = String(body.apiKey || '').trim()
      const model = String(body.model || 'gemini-2.0-flash').trim()
      if (apiKey.length < 12) return jsonResponse({ error: 'INVALID_KEY' }, 400)
      const encrypted = await encryptSecret(apiKey)
      const keyLast4 = apiKey.slice(-4)
      const { error } = await supabase.from('ai_provider_settings').upsert(
        {
          provider: 'gemini',
          encrypted_api_key: encrypted,
          key_last4: keyLast4,
          model,
          is_enabled: true,
          configured_by: user.id,
          configured_at: new Date().toISOString(),
          last_test_status: 'pending',
        },
        { onConflict: 'provider' },
      )
      if (error) throw error
      return jsonResponse({ status: 'AI_PROVIDER_SAVED', key_last4: keyLast4, model })
    }

    if (action === 'test_provider_key') {
      const settings = await getGeminiSettings(supabase)
      if (!settings?.encrypted_api_key || !settings.is_enabled) {
        return jsonResponse({ status: 'AI_PROVIDER_NOT_CONFIGURED' }, 200)
      }
      const apiKey = await decryptSecret(settings.encrypted_api_key)
      await callGemini({
        apiKey,
        model: settings.model || 'gemini-2.0-flash',
        prompt: 'Responde solo: OK',
      })
      const testedAt = new Date().toISOString()
      const { error } = await supabase
        .from('ai_provider_settings')
        .update({ last_tested_at: testedAt, last_test_status: 'success' })
        .eq('provider', 'gemini')
      if (error) throw error
      return jsonResponse({ status: 'GEMINI_TEST_OK', last_tested_at: testedAt })
    }

    if (action === 'disable_provider') {
      const { error } = await supabase
        .from('ai_provider_settings')
        .update({ is_enabled: false })
        .eq('provider', 'gemini')
      if (error) throw error
      return jsonResponse({ status: 'AI_PROVIDER_DISABLED' })
    }

    if (action === 'get_usage_summary') {
      const today = new Date().toISOString().slice(0, 10)
      const [usage, limits, costs] = await Promise.all([
        supabase
          .from('ai_usage_daily')
          .select('user_id, action_type, requests_count, tokens_estimated, usage_date')
          .eq('usage_date', today)
          .order('requests_count', { ascending: false })
          .limit(50),
        supabase
          .from('ai_usage_limits')
          .select('*')
          .order('action_type', { ascending: true }),
        supabase
          .from('ai_cost_events')
          .select('action_type, tokens_estimated, status, created_at')
          .gte('created_at', `${today}T00:00:00.000Z`)
          .order('created_at', { ascending: false })
          .limit(100),
      ])
      for (const result of [usage, limits, costs]) {
        if (result.error) throw result.error
      }
      return jsonResponse({
        status: 'OK',
        today,
        usage: usage.data ?? [],
        limits: limits.data ?? [],
        costs: costs.data ?? [],
      })
    }

    if (action === 'set_usage_limit') {
      const actionType = String(body.actionType || '').trim()
      if (!actionType) return jsonResponse({ error: 'INVALID_ACTION_TYPE' }, 400)
      const dailyRequestLimit = Number(body.dailyRequestLimit ?? 20)
      const dailyTokenLimit = Number(body.dailyTokenLimit ?? 20000)
      const isEnabled = Boolean(body.isEnabled ?? true)
      const { data: existingLimit, error: existingLimitError } = await supabase
        .from('ai_usage_limits')
        .select('id')
        .eq('scope', 'global')
        .eq('action_type', actionType)
        .maybeSingle()
      if (existingLimitError) throw existingLimitError

      const payload = {
        scope: 'global',
        action_type: actionType,
        daily_request_limit: dailyRequestLimit,
        daily_token_limit: dailyTokenLimit,
        is_enabled: isEnabled,
      }
      const { data, error } = existingLimit
        ? await supabase
            .from('ai_usage_limits')
            .update(payload)
            .eq('id', existingLimit.id)
            .select()
            .single()
        : await supabase
            .from('ai_usage_limits')
            .insert(
          {
              ...payload,
          },
        )
        .select()
        .single()
      if (error) throw error
      return jsonResponse({ status: 'AI_LIMIT_SAVED', limit: data })
    }

    if (action === 'get_prompt_templates') {
      const { data, error } = await supabase
        .from('ai_prompt_templates')
        .select('*')
        .order('action_type', { ascending: true })
        .order('version', { ascending: false })
      if (error) throw error
      return jsonResponse({ status: 'OK', templates: data ?? [] })
    }

    if (action === 'create_prompt_template') {
      const actionType = String(body.actionType || '').trim()
      const title = String(body.title || '').trim()
      const systemPrompt = String(body.systemPrompt || '').trim()
      const userPromptTemplate = String(body.userPromptTemplate || '').trim()
      const safetyNotes = String(body.safetyNotes || '').trim() || null
      if (!actionType || !title || !systemPrompt || !userPromptTemplate) {
        return jsonResponse({ error: 'INVALID_TEMPLATE' }, 400)
      }
      const { data: latest, error: latestError } = await supabase
        .from('ai_prompt_templates')
        .select('version')
        .eq('action_type', actionType)
        .order('version', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (latestError) throw latestError
      const version = (latest?.version ?? 0) + 1
      const { error: deactivateError } = await supabase
        .from('ai_prompt_templates')
        .update({ is_active: false })
        .eq('action_type', actionType)
      if (deactivateError) throw deactivateError
      const { data, error } = await supabase
        .from('ai_prompt_templates')
        .insert({
          action_type: actionType,
          version,
          title,
          system_prompt: systemPrompt,
          user_prompt_template: userPromptTemplate,
          safety_notes: safetyNotes,
          is_active: true,
          created_by: user.id,
        })
        .select()
        .single()
      if (error) throw error
      return jsonResponse({ status: 'AI_PROMPT_TEMPLATE_CREATED', template: data })
    }

    if (action === 'activate_prompt_template') {
      const templateId = String(body.templateId || '').trim()
      if (!templateId) return jsonResponse({ error: 'MISSING_TEMPLATE_ID' }, 400)
      const { data: template, error: readError } = await supabase
        .from('ai_prompt_templates')
        .select('id, action_type')
        .eq('id', templateId)
        .single()
      if (readError) throw readError
      const { error: deactivateError } = await supabase
        .from('ai_prompt_templates')
        .update({ is_active: false })
        .eq('action_type', template.action_type)
      if (deactivateError) throw deactivateError
      const { data, error } = await supabase
        .from('ai_prompt_templates')
        .update({ is_active: true })
        .eq('id', templateId)
        .select()
        .single()
      if (error) throw error
      return jsonResponse({ status: 'AI_PROMPT_TEMPLATE_ACTIVATED', template: data })
    }

    if (action === 'get_bible_admin_status') {
      const [translations, books, verses, daily] = await Promise.all([
        supabase.from('bible_translations').select('*').order('code', { ascending: true }),
        supabase.from('bible_books').select('id', { count: 'exact', head: true }),
        supabase
          .from('bible_verses')
          .select('translation_code', { count: 'exact' })
          .limit(5000),
        supabase
          .from('bible_daily_verses')
          .select('*')
          .order('active_date', { ascending: false })
          .limit(7),
      ])
      for (const result of [translations, books, verses, daily]) {
        if (result.error) throw result.error
      }
      return jsonResponse({
        status: 'OK',
        translations: translations.data ?? [],
        booksCount: books.count ?? 0,
        versesCount: verses.count ?? 0,
        recentDailyVerses: daily.data ?? [],
      })
    }

    if (action === 'set_daily_bible_verse') {
      const translationCode = String(body.translationCode || 'RVR1909').trim()
      const bookCode = String(body.bookCode || '').trim()
      const chapter = Number(body.chapter)
      const verse = Number(body.verse)
      const activeDate = String(body.activeDate || '').trim()
      if (!bookCode || !chapter || !verse || !activeDate) {
        return jsonResponse({ error: 'INVALID_DAILY_VERSE' }, 400)
      }
      const { data, error } = await supabase
        .from('bible_daily_verses')
        .upsert(
          {
            translation_code: translationCode,
            book_code: bookCode,
            chapter,
            verse,
            active_date: activeDate,
            devotional_hint: body.devotionalHint || null,
          },
          { onConflict: 'active_date' },
        )
        .select()
        .single()
      if (error) throw error
      return jsonResponse({ status: 'BIBLE_DAILY_VERSE_SAVED', dailyVerse: data })
    }

    if (action === 'test_random_bible_verse') {
      const { data, error } = await supabase
        .rpc('get_random_bible_verse', { p_translation_code: 'RVR1909' })
        .maybeSingle()
      if (error) throw error
      return jsonResponse({ status: data ? 'BIBLE_RANDOM_OK' : 'BIBLE_RANDOM_EMPTY', verse: data })
    }

    return jsonResponse({ error: 'UNKNOWN_ACTION' }, 400)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR'
    const status = message === 'FORBIDDEN' ? 403 : message === 'UNAUTHENTICATED' ? 401 : 500
    return jsonResponse({ error: message }, status)
  }
})
