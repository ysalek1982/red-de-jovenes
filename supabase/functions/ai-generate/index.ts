import {
  callGemini,
  checkAiUsageLimit,
  corsHeaders,
  decryptSecret,
  estimateTokens,
  getActivePromptTemplate,
  getGeminiSettings,
  jsonResponse,
  recordAiUsage,
  requireUser,
  summarize,
} from '../_shared/ai-helpers.ts'

const allowedActions = new Set([
  'generate_devotional_draft',
  'suggest_forum_reply',
  'summarize_report',
  'classify_content_report',
  'suggest_prayer_response',
  'explain_bible_verse',
  'create_bible_reflection',
  'create_bible_group_question',
  'create_bible_prayer',
  'suggest_bible_forum_post',
  'generate_event_description',
  'create_discipleship_reflection',
  'summarize_community_activity',
])

const pastoralPrefix = `Eres un asistente cristiano pastoral para jovenes. Responde en espanol claro, breve, respetuoso y biblico. No reemplaces consejeria profesional, liderazgo pastoral ni atencion de emergencia. No inventes datos privados.`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { supabase, user } = await requireUser(req)
    const body = await req.json()
    const actionType = String(body.actionType || '')
    const prompt = String(body.prompt || '').trim()
    if (!allowedActions.has(actionType)) return jsonResponse({ error: 'INVALID_ACTION' }, 400)
    if (!prompt || prompt.length > 4000) return jsonResponse({ error: 'INVALID_PROMPT' }, 400)

    const estimatedInputTokens = estimateTokens(prompt)
    const limitCheck = await checkAiUsageLimit({
      supabase,
      userId: user.id,
      actionType,
      tokensEstimated: estimatedInputTokens,
    })
    if (!limitCheck.allowed) {
      await supabase.from('ai_action_logs').insert({
        user_id: user.id,
        action_type: actionType,
        provider: 'gemini',
        prompt_summary: summarize(prompt),
        input_ref_type: body.targetType || null,
        input_ref_id: body.targetId || null,
        output_summary: 'Solicitud bloqueada por limite diario.',
        status: 'rate_limited',
        tokens_estimated: estimatedInputTokens,
      })
      return jsonResponse(
        {
          status: 'AI_DAILY_LIMIT_REACHED',
          message:
            'Alcanzaste el limite diario de IA. Intenta manana o pide apoyo a un lider.',
        },
        429,
      )
    }

    const settings = await getGeminiSettings(supabase)
    if (!settings?.is_enabled || !settings.encrypted_api_key) {
      await recordAiUsage({
        supabase,
        userId: user.id,
        actionType,
        model: settings?.model ?? 'gemini-2.0-flash',
        inputChars: prompt.length,
        outputChars: 0,
        tokensEstimated: estimatedInputTokens,
        status: 'provider_not_configured',
      })
      await supabase.from('ai_action_logs').insert({
        user_id: user.id,
        action_type: actionType,
        provider: 'gemini',
        model: settings?.model ?? 'gemini-2.0-flash',
        prompt_summary: summarize(prompt),
        input_ref_type: body.targetType || null,
        input_ref_id: body.targetId || null,
        output_summary: 'Proveedor IA no configurado; solicitud enviada a cola humana.',
        status: 'queued_without_provider',
        tokens_estimated: estimatedInputTokens,
      })
      const { data: queue, error: queueError } = await supabase
        .from('ai_action_queue')
        .insert({
          requested_by: user.id,
          action_type: actionType,
          target_type: body.targetType || null,
          target_id: body.targetId || null,
          prompt,
          status: 'pending',
          requires_approval: true,
          proposed_result: { mode: 'mock', text: 'IA no configurada. Revisa la solicitud manualmente.' },
        })
        .select()
        .single()
      if (queueError) throw queueError
      return jsonResponse({ status: 'AI_PROVIDER_NOT_CONFIGURED', queue })
    }

    const apiKey = await decryptSecret(settings.encrypted_api_key)
    const template = await getActivePromptTemplate(supabase, actionType)
    const systemPrompt = template?.system_prompt || pastoralPrefix
    const userPrompt = (template?.user_prompt_template || 'Solicitud: {{prompt}}').replace(
      '{{prompt}}',
      prompt,
    )
    const finalPrompt = `${pastoralPrefix}\n\n${systemPrompt}\n\nAccion: ${actionType}\n${userPrompt}\n\nEtiqueta la salida como sugerencia revisable cuando corresponda.`
    const result = await callGemini({
      apiKey,
      model: settings.model || 'gemini-2.0-flash',
      prompt: finalPrompt,
    })
    const tokensEstimated = estimateTokens(finalPrompt, result.text)

    await supabase.from('ai_action_logs').insert({
      user_id: user.id,
      action_type: actionType,
      provider: 'gemini',
      model: settings.model,
      prompt_summary: summarize(prompt),
      input_ref_type: body.targetType || null,
      input_ref_id: body.targetId || null,
      output_summary: summarize(result.text),
      status: 'completed',
      tokens_estimated: tokensEstimated,
    })

    await recordAiUsage({
      supabase,
      userId: user.id,
      actionType,
      model: settings.model,
      inputChars: finalPrompt.length,
      outputChars: result.text.length,
      tokensEstimated,
      status: 'ok',
    })

    return jsonResponse({
      status: 'AI_GENERATION_OK',
      text: `Sugerido por IA · revisalo antes de publicar.\n\n${result.text}`,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR'
    const status =
      message === 'UNAUTHENTICATED' ? 401 : message === 'AI_DAILY_LIMIT_REACHED' ? 429 : 500
    return jsonResponse({ error: message }, status)
  }
})
