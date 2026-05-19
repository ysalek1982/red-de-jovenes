import { corsHeaders, jsonResponse, requireAdmin } from '../_shared/ai-helpers.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { supabase, user } = await requireAdmin(req)
    const body = await req.json()
    const action = String(body.action || '')
    const queueId = String(body.queueId || '')
    if (!queueId) return jsonResponse({ error: 'MISSING_QUEUE_ID' }, 400)

    if (action === 'approve') {
      const { data, error } = await supabase
        .from('ai_action_queue')
        .update({
          status: 'approved',
          approved_by: user.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', queueId)
        .select()
        .single()
      if (error) throw error
      return jsonResponse({ status: 'AI_ACTION_APPROVED', item: data })
    }

    if (action === 'reject') {
      const { data, error } = await supabase
        .from('ai_action_queue')
        .update({ status: 'rejected', approved_by: user.id, approved_at: new Date().toISOString() })
        .eq('id', queueId)
        .select()
        .single()
      if (error) throw error
      return jsonResponse({ status: 'AI_ACTION_REJECTED', item: data })
    }

    if (action === 'execute') {
      const { data, error } = await supabase
        .from('ai_action_queue')
        .update({ status: 'executed', executed_at: new Date().toISOString() })
        .eq('id', queueId)
        .eq('status', 'approved')
        .select()
        .single()
      if (error) throw error
      return jsonResponse({ status: 'AI_ACTION_EXECUTED', item: data })
    }

    return jsonResponse({ error: 'UNKNOWN_ACTION' }, 400)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR'
    const status = message === 'FORBIDDEN' ? 403 : message === 'UNAUTHENTICATED' ? 401 : 500
    return jsonResponse({ error: message }, status)
  }
})
