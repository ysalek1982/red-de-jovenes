import { existsSync, readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'
import { ensureQaEnv, loadLocalEnv, printOk } from './qa-shared.mjs'

function loadAdminEnv() {
  if (!existsSync('.env.admin.local')) return
  for (const line of readFileSync('.env.admin.local', 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const index = trimmed.indexOf('=')
    if (index === -1) continue
    const key = trimmed.slice(0, index).trim()
    let value = trimmed.slice(index + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1)
    process.env[key] ??= value
  }
}

async function signIn(email, password) {
  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY)
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error || !data.user) throw error ?? new Error('No se obtuvo usuario.')
  return { supabase, user: data.user }
}

async function main() {
  loadLocalEnv()
  loadAdminEnv()
  if (!ensureQaEnv()) return
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    console.log(JSON.stringify({ status: 'BLOCKED_MISSING_ADMIN_ENV' }, null, 2))
    return
  }

  const admin = await signIn(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD)
  const nonAdmin = await signIn(process.env.QA_USER_A_EMAIL, process.env.QA_USER_A_PASSWORD)

  const templates = await admin.supabase.functions.invoke('admin-ai-settings', {
    body: { action: 'get_prompt_templates' },
  })
  if (templates.error) throw templates.error
  const active = (templates.data?.templates ?? []).filter((template) => template.is_active)
  if (active.length < 5) throw new Error('Faltan plantillas pastorales activas.')
  if (!active.some((template) => template.user_prompt_template.includes('{{prompt}}'))) {
    throw new Error('Las plantillas no incluyen placeholder {{prompt}}.')
  }

  const denied = await nonAdmin.supabase.functions.invoke('admin-ai-settings', {
    body: { action: 'get_prompt_templates' },
  })
  if (!denied.error && !denied.data?.error) throw new Error('No admin pudo leer plantillas IA.')

  printOk('QA_AI_PROMPTS_OK', {
    activeTemplates: active.length,
    nonAdmin: 'DENIED',
  })
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
