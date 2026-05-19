import {
  callGemini,
  corsHeaders,
  decryptSecret,
  getGeminiSettings,
  jsonResponse,
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

    const settings = await getGeminiSettings(supabase)
    if (!settings?.is_enabled || !settings.encrypted_api_key) {
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
    const finalPrompt = `${pastoralPrefix}\n\nAccion: ${actionType}\nSolicitud: ${prompt}`
    const result = await callGemini({
      apiKey,
      model: settings.model || 'gemini-2.0-flash',
      prompt: finalPrompt,
    })

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
      tokens_estimated: Math.ceil((prompt.length + result.text.length) / 4),
    })

    return jsonResponse({ status: 'AI_GENERATION_OK', text: result.text })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR'
    return jsonResponse({ error: message }, message === 'UNAUTHENTICATED' ? 401 : 500)
  }
})
