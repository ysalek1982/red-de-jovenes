import { supabase } from '../../lib/supabase'
import type { AiActionQueue } from '../../types/database'
import type { AiActionType } from './aiGuardrails'

export interface AiProviderStatus {
  provider: string
  key_last4: string | null
  model: string | null
  is_enabled: boolean | null
  configured_at: string | null
  last_tested_at: string | null
  last_test_status: string | null
}

async function invokeAiFunction<T>(name: string, body: unknown) {
  const { data, error } = await supabase.functions.invoke<T>(name, { body })
  if (error) throw error
  return data
}

export async function getAiProviderStatus() {
  return invokeAiFunction<{ status: string; provider: AiProviderStatus | null }>(
    'admin-ai-settings',
    { action: 'get_provider_status' },
  )
}

export async function saveAiProviderKey(input: {
  apiKey: string
  model: string
}) {
  return invokeAiFunction<{ status: string; key_last4: string; model: string }>(
    'admin-ai-settings',
    {
      action: 'save_provider_key',
      apiKey: input.apiKey,
      model: input.model,
    },
  )
}

export async function testAiProviderKey() {
  return invokeAiFunction<{ status: string; last_tested_at?: string }>(
    'admin-ai-settings',
    { action: 'test_provider_key' },
  )
}

export async function disableAiProvider() {
  return invokeAiFunction<{ status: string }>('admin-ai-settings', {
    action: 'disable_provider',
  })
}

export async function generateAiContent(input: {
  actionType: AiActionType
  prompt: string
  targetType?: string
  targetId?: string
}) {
  return invokeAiFunction<{
    status: string
    text?: string
    queue?: AiActionQueue
  }>('ai-generate', input)
}

export async function approveAiAction(queueId: string) {
  return invokeAiFunction<{ status: string; item: AiActionQueue }>(
    'ai-action-executor',
    { action: 'approve', queueId },
  )
}

export async function rejectAiAction(queueId: string) {
  return invokeAiFunction<{ status: string; item: AiActionQueue }>(
    'ai-action-executor',
    { action: 'reject', queueId },
  )
}

export async function getPendingAiActions() {
  const { data, error } = await supabase
    .from('ai_action_queue')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) throw error
  return (data ?? []) as AiActionQueue[]
}
