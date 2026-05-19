import { existsSync, readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const ENV_FILES = ['.env.qa.local', '.env.local', '.env.admin.local']
const REQUIRED_KEYS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_PUBLISHABLE_KEY',
  'QA_USER_A_EMAIL',
  'QA_USER_A_PASSWORD',
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
  const admin = await signIn(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD)

  const userInsert = await userA.supabase
    .from('pilot_incidents')
    .insert({
      reported_by: userA.user.id,
      severity: 'low',
      module: 'QA',
      title: `Incidente usuario ${suffix}`,
    })
    .select('id')

  const created = await admin.supabase
    .from('pilot_incidents')
    .insert({
      reported_by: admin.user.id,
      severity: 'medium',
      module: 'QA',
      title: `QA incidente piloto ${suffix}`,
      description: 'Incidente temporal para validar bitacora del piloto.',
    })
    .select('id, status')
    .single()
  if (created.error || !created.data) throw created.error ?? new Error('No se creo incidente.')

  const userRead = await userA.supabase
    .from('pilot_incidents')
    .select('id')
    .eq('id', created.data.id)

  const adminUpdate = await admin.supabase
    .from('pilot_incidents')
    .update({
      status: 'resolved',
      resolution: 'Resuelto por QA.',
      resolved_by: admin.user.id,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', created.data.id)
    .select('id, status')
    .single()

  await Promise.all([userA.supabase.auth.signOut(), admin.supabase.auth.signOut()])

  const status =
    denied(userInsert) &&
    denied(userRead) &&
    adminUpdate.data?.status === 'resolved'
      ? 'QA_PILOT_INCIDENTS_OK'
      : 'QA_PILOT_INCIDENTS_FAILED'

  if (status !== 'QA_PILOT_INCIDENTS_OK') process.exitCode = 1

  console.log(JSON.stringify({
    status,
    nonAdminInsertBlocked: denied(userInsert) ? 'OK' : 'FAILED',
    nonAdminReadBlocked: denied(userRead) ? 'OK' : 'FAILED',
    adminCreate: created.data ? 'OK' : 'FAILED',
    adminResolve: adminUpdate.data ? 'OK' : 'FAILED',
  }, null, 2))
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
