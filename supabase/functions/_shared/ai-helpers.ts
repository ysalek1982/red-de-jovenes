import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.105.4'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

export function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

export function getAdminClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase Edge Function secrets.')
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  })
}

export async function requireUser(req: Request) {
  const authHeader = req.headers.get('Authorization') || ''
  const token = authHeader.replace('Bearer ', '')
  if (!token) throw new Error('UNAUTHENTICATED')
  const supabase = getAdminClient()
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) throw new Error('UNAUTHENTICATED')
  return { supabase, user: data.user }
}

export async function requireAdmin(req: Request) {
  const context = await requireUser(req)
  const { data, error } = await context.supabase
    .from('user_roles')
    .select('id')
    .eq('user_id', context.user.id)
    .eq('role', 'admin')
    .maybeSingle()
  if (error) throw error
  if (!data) throw new Error('FORBIDDEN')
  return context
}

function getMasterKey() {
  const key = Deno.env.get('AI_CONFIG_MASTER_KEY')
  if (!key || key.length < 24) throw new Error('MISSING_AI_CONFIG_MASTER_KEY')
  return key
}

async function deriveKey() {
  const raw = new TextEncoder().encode(getMasterKey())
  const hash = await crypto.subtle.digest('SHA-256', raw)
  return crypto.subtle.importKey('raw', hash, 'AES-GCM', false, [
    'encrypt',
    'decrypt',
  ])
}

export async function encryptSecret(value: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey()
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(value),
  )
  return `${btoa(String.fromCharCode(...iv))}.${btoa(
    String.fromCharCode(...new Uint8Array(encrypted)),
  )}`
}

export async function decryptSecret(payload: string) {
  const [ivText, encryptedText] = payload.split('.')
  if (!ivText || !encryptedText) throw new Error('INVALID_ENCRYPTED_SECRET')
  const iv = Uint8Array.from(atob(ivText), (char) => char.charCodeAt(0))
  const encrypted = Uint8Array.from(atob(encryptedText), (char) =>
    char.charCodeAt(0),
  )
  const key = await deriveKey()
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encrypted,
  )
  return new TextDecoder().decode(decrypted)
}

export function summarize(value: string, max = 240) {
  return value.length <= max ? value : `${value.slice(0, max - 3)}...`
}

export function estimateTokens(...values: string[]) {
  const totalChars = values.reduce((sum, value) => sum + value.length, 0)
  return Math.max(1, Math.ceil(totalChars / 4))
}

export async function getGeminiSettings(supabase: ReturnType<typeof getAdminClient>) {
  const { data, error } = await supabase
    .from('ai_provider_settings')
    .select('*')
    .eq('provider', 'gemini')
    .single()
  if (error) throw error
  return data
}

export async function getActivePromptTemplate(
  supabase: ReturnType<typeof getAdminClient>,
  actionType: string,
) {
  const { data, error } = await supabase
    .from('ai_prompt_templates')
    .select('action_type, version, system_prompt, user_prompt_template, safety_notes')
    .eq('action_type', actionType)
    .eq('is_active', true)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function checkAiUsageLimit(input: {
  supabase: ReturnType<typeof getAdminClient>
  userId: string
  actionType: string
  tokensEstimated: number
}) {
  const today = new Date().toISOString().slice(0, 10)
  const { data: limits, error: limitsError } = await input.supabase
    .from('ai_usage_limits')
    .select('*')
    .eq('action_type', input.actionType)
    .eq('is_enabled', true)
    .order('created_at', { ascending: false })
  if (limitsError) throw limitsError

  const userLimit = (limits ?? []).find((limit) => limit.scope === 'user' && limit.user_id === input.userId)
  const globalLimit = (limits ?? []).find((limit) => limit.scope === 'global')
  const limit = userLimit ?? globalLimit
  if (!limit) return { allowed: true, today }

  const { data: usage, error: usageError } = await input.supabase
    .from('ai_usage_daily')
    .select('requests_count, tokens_estimated')
    .eq('user_id', input.userId)
    .eq('usage_date', today)
    .eq('action_type', input.actionType)
    .maybeSingle()
  if (usageError) throw usageError

  const nextRequests = (usage?.requests_count ?? 0) + 1
  const nextTokens = (usage?.tokens_estimated ?? 0) + input.tokensEstimated
  const allowed =
    nextRequests <= limit.daily_request_limit && nextTokens <= limit.daily_token_limit

  return {
    allowed,
    today,
    limit,
    currentRequests: usage?.requests_count ?? 0,
    currentTokens: usage?.tokens_estimated ?? 0,
    nextRequests,
    nextTokens,
  }
}

export async function recordAiUsage(input: {
  supabase: ReturnType<typeof getAdminClient>
  userId: string
  actionType: string
  model?: string | null
  inputChars: number
  outputChars: number
  tokensEstimated: number
  status: string
}) {
  const today = new Date().toISOString().slice(0, 10)
  const { data: existing, error: readError } = await input.supabase
    .from('ai_usage_daily')
    .select('id, requests_count, tokens_estimated')
    .eq('user_id', input.userId)
    .eq('usage_date', today)
    .eq('action_type', input.actionType)
    .maybeSingle()
  if (readError) throw readError

  if (existing) {
    const { error } = await input.supabase
      .from('ai_usage_daily')
      .update({
        requests_count: existing.requests_count + 1,
        tokens_estimated: existing.tokens_estimated + input.tokensEstimated,
      })
      .eq('id', existing.id)
    if (error) throw error
  } else {
    const { error } = await input.supabase.from('ai_usage_daily').insert({
      user_id: input.userId,
      usage_date: today,
      action_type: input.actionType,
      requests_count: 1,
      tokens_estimated: input.tokensEstimated,
    })
    if (error) throw error
  }

  const { error: costError } = await input.supabase.from('ai_cost_events').insert({
    user_id: input.userId,
    action_type: input.actionType,
    provider: 'gemini',
    model: input.model ?? null,
    input_chars: input.inputChars,
    output_chars: input.outputChars,
    tokens_estimated: input.tokensEstimated,
    status: input.status,
  })
  if (costError) throw costError
}

export async function callGemini(input: {
  apiKey: string
  model: string
  prompt: string
}) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${input.model}:generateContent?key=${input.apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: input.prompt }] }],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 700,
        },
      }),
    },
  )

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`GEMINI_REQUEST_FAILED: ${response.status} ${text}`)
  }

  const data = await response.json()
  const text =
    data?.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text || '')
      .join('\n')
      .trim() || ''
  return { text, raw: data }
}
