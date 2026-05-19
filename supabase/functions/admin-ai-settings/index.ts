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
        prompt: 'Responde solo: GEMINI_OK',
      })
      const testedAt = new Date().toISOString()
      const { error } = await supabase
        .from('ai_provider_settings')
        .update({ last_tested_at: testedAt, last_test_status: 'OK' })
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

    return jsonResponse({ error: 'UNKNOWN_ACTION' }, 400)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR'
    const status = message === 'FORBIDDEN' ? 403 : message === 'UNAUTHENTICATED' ? 401 : 500
    return jsonResponse({ error: message }, status)
  }
})
