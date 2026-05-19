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
  const userA = await signIn(process.env.QA_USER_A_EMAIL, process.env.QA_USER_A_PASSWORD)
  const actionType = 'suggest_prayer_response'
  const today = new Date().toISOString().slice(0, 10)
  await admin.supabase
    .from('ai_usage_daily')
    .delete()
    .eq('user_id', userA.user.id)
    .eq('usage_date', today)
    .eq('action_type', actionType)

  const generated = await userA.supabase.functions.invoke('ai-generate', {
    body: {
      actionType,
      prompt: 'QA aprobacion humana para una respuesta pastoral breve.',
    },
  })
  if (generated.error) throw generated.error

  if (generated.data?.status === 'AI_GENERATION_OK') {
    if (!String(generated.data.text ?? '').startsWith('Sugerido por IA')) {
      throw new Error('Salida real IA no esta etiquetada como sugerencia revisable.')
    }
    printOk('QA_AI_HUMAN_APPROVAL_OK', { mode: 'REAL_PROVIDER_REVIEW_LABEL' })
    return
  }

  const queueId = generated.data?.queue?.id
  if (!queueId) throw new Error('La solicitud IA no configurada no entro en cola.')

  const approved = await admin.supabase.functions.invoke('ai-action-executor', {
    body: { action: 'approve', queueId },
  })
  if (approved.error || approved.data?.status !== 'AI_ACTION_APPROVED') {
    throw approved.error ?? new Error('Admin no aprobo accion IA.')
  }
  const executed = await admin.supabase.functions.invoke('ai-action-executor', {
    body: { action: 'execute', queueId },
  })
  if (executed.error || executed.data?.status !== 'AI_ACTION_EXECUTED') {
    throw executed.error ?? new Error('Admin no ejecuto accion aprobada.')
  }

  printOk('QA_AI_HUMAN_APPROVAL_OK', { mode: 'QUEUE_APPROVED_AND_EXECUTED' })
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
