import { existsSync, readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const LOCAL_ENV_FILES = ['.env.qa.local', '.env.local', '.env.admin.local']
const REQUIRED_KEYS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_PUBLISHABLE_KEY',
  'QA_USER_A_EMAIL',
  'QA_USER_A_PASSWORD',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
]

function loadLocalEnv() {
  for (const file of LOCAL_ENV_FILES) {
    if (!existsSync(file)) continue
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const separatorIndex = trimmed.indexOf('=')
      if (separatorIndex === -1) continue
      const key = trimmed.slice(0, separatorIndex).trim()
      const value = trimmed.slice(separatorIndex + 1).trim()
      if (!process.env[key]) process.env[key] = value
    }
  }
}

function makeClient() {
  return createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  )
}

async function signIn(email, password) {
  const supabase = makeClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error || !data.user) throw error ?? new Error('No se obtuvo usuario.')
  return { supabase, user: data.user }
}

async function main() {
  loadLocalEnv()
  const missing = REQUIRED_KEYS.filter((key) => !process.env[key])
  if (missing.length) {
    console.log(JSON.stringify({ status: 'BLOCKED_MISSING_QA_ENV', missing }, null, 2))
    return
  }

  const suffix = new Date().toISOString()
  const userA = await signIn(
    process.env.QA_USER_A_EMAIL,
    process.env.QA_USER_A_PASSWORD,
  )
  const admin = await signIn(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD)

  const groupsRead = await userA.supabase
    .from('groups')
    .select('id, country, city')
    .eq('is_active', true)
    .limit(5)

  const suggestion = await userA.supabase
    .from('group_suggestions')
    .insert({
      user_id: userA.user.id,
      name: `QA comunidad mapa ${suffix}`,
      country: 'Bolivia',
      city: 'Santa Cruz de la Sierra',
      church_name: 'Red de Jovenes QA',
      meeting_info: 'Reunion temporal de QA.',
    })
    .select('id')
    .single()

  const suggestionUpdate = suggestion.data?.id
    ? await admin.supabase
        .from('group_suggestions')
        .update({
          status: 'rejected',
          internal_note: 'Rechazada por QA para evitar crear grupo real.',
          reviewed_by: admin.user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', suggestion.data.id)
        .select('id')
        .single()
    : { data: null, error: suggestion.error ?? new Error('No se creo sugerencia.') }

  await userA.supabase.auth.signOut()
  await admin.supabase.auth.signOut()

  const status =
    !groupsRead.error && suggestion.data && suggestionUpdate.data
      ? 'QA_MAP_OK'
      : 'QA_MAP_FAILED'

  if (status !== 'QA_MAP_OK') process.exitCode = 1

  console.log(
    JSON.stringify(
      {
        status,
        groupsRead: groupsRead.error ? 'FAILED' : 'OK',
        suggestionCreate: suggestion.data ? 'OK' : 'FAILED',
        suggestionModeration: suggestionUpdate.data ? 'OK' : 'FAILED',
      },
      null,
      2,
    ),
  )
}

await main()
