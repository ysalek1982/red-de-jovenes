import { existsSync, readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const ENV_FILES = ['.env.qa.local', '.env.local', '.env.admin.local']
const REQUIRED_KEYS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_PUBLISHABLE_KEY',
  'QA_USER_A_EMAIL',
  'QA_USER_A_PASSWORD',
  'QA_USER_B_EMAIL',
  'QA_USER_B_PASSWORD',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
]

function loadEnv() {
  for (const file of ENV_FILES) {
    if (!existsSync(file)) continue
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
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
}

function makeClient() {
  return createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY)
}

async function signIn(email, password) {
  const supabase = makeClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error || !data.user) throw error ?? new Error('No se obtuvo usuario.')
  return { supabase, user: data.user }
}

function denied(result) {
  return Boolean(result.error) || !result.data || result.data.length === 0
}

async function main() {
  loadEnv()
  const missing = REQUIRED_KEYS.filter((key) => !process.env[key])
  if (missing.length) {
    console.log(JSON.stringify({ status: 'BLOCKED_MISSING_QA_ENV', missing }, null, 2))
    return
  }

  const suffix = new Date().toISOString()
  const userA = await signIn(process.env.QA_USER_A_EMAIL, process.env.QA_USER_A_PASSWORD)
  const userB = await signIn(process.env.QA_USER_B_EMAIL, process.env.QA_USER_B_PASSWORD)
  const admin = await signIn(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD)

  const created = await userA.supabase
    .from('pilot_feedback')
    .insert({
      user_id: userA.user.id,
      category: 'mejora',
      module: 'QA',
      rating: 5,
      title: `QA feedback piloto ${suffix}`,
      detail: 'Feedback temporal para validar RLS y monitoreo de piloto.',
      device: 'QA',
      browser: 'node',
    })
    .select('id, status')
    .single()
  if (created.error || !created.data) throw created.error ?? new Error('No se creo feedback.')

  const ownRead = await userA.supabase
    .from('pilot_feedback')
    .select('id')
    .eq('id', created.data.id)
    .maybeSingle()

  const crossRead = await userB.supabase
    .from('pilot_feedback')
    .select('id')
    .eq('id', created.data.id)

  const adminUpdate = await admin.supabase
    .from('pilot_feedback')
    .update({ status: 'reviewing', admin_note: 'Revisado por QA.' })
    .eq('id', created.data.id)
    .select('id, status')
    .single()

  await Promise.all([
    userA.supabase.auth.signOut(),
    userB.supabase.auth.signOut(),
    admin.supabase.auth.signOut(),
  ])

  const status =
    ownRead.data?.id === created.data.id &&
    denied(crossRead) &&
    adminUpdate.data?.status === 'reviewing'
      ? 'QA_PILOT_FEEDBACK_OK'
      : 'QA_PILOT_FEEDBACK_FAILED'

  if (status !== 'QA_PILOT_FEEDBACK_OK') process.exitCode = 1

  console.log(JSON.stringify({
    status,
    createOwn: created.data ? 'OK' : 'FAILED',
    ownRead: ownRead.data ? 'OK' : 'FAILED',
    crossUserBlocked: denied(crossRead) ? 'OK' : 'FAILED',
    adminUpdate: adminUpdate.data ? 'OK' : 'FAILED',
  }, null, 2))
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
