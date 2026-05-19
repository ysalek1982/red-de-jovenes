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

export async function getGeminiSettings(supabase: ReturnType<typeof getAdminClient>) {
  const { data, error } = await supabase
    .from('ai_provider_settings')
    .select('*')
    .eq('provider', 'gemini')
    .single()
  if (error) throw error
  return data
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
