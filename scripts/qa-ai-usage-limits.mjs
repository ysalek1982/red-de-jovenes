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
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
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
  const userA = await signIn(process.env.QA_USER_A_EMAIL, process.env.QA_USER_A_PASSWORD)
  const actionType = 'summarize_community_activity'
  const today = new Date().toISOString().slice(0, 10)

  await admin.supabase
    .from('ai_usage_daily')
    .delete()
    .eq('user_id', userA.user.id)
    .eq('usage_date', today)
    .eq('action_type', actionType)

  const saved = await admin.supabase.functions.invoke('admin-ai-settings', {
    body: {
      action: 'set_usage_limit',
      actionType,
      dailyRequestLimit: 1,
      dailyTokenLimit: 10000,
      isEnabled: true,
    },
  })
  if (saved.error || saved.data?.status !== 'AI_LIMIT_SAVED') throw saved.error ?? new Error('No se guardo limite IA.')

  const first = await userA.supabase.functions.invoke('ai-generate', {
    body: { actionType, prompt: 'Resume actividad comunitaria QA breve.' },
  })
  if (first.error) throw first.error

  const second = await userA.supabase.functions.invoke('ai-generate', {
    body: { actionType, prompt: 'Debe bloquear por limite diario QA.' },
  })
  if (!second.error && second.data?.status !== 'AI_DAILY_LIMIT_REACHED') {
    throw new Error('El limite diario IA no bloqueo la segunda solicitud.')
  }

  await admin.supabase.functions.invoke('admin-ai-settings', {
    body: {
      action: 'set_usage_limit',
      actionType,
      dailyRequestLimit: 20,
      dailyTokenLimit: 20000,
      isEnabled: true,
    },
  })

  printOk('QA_AI_USAGE_LIMITS_OK', {
    first: first.data?.status,
    second: 'DENIED_BY_LIMIT',
  })
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
