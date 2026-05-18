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

function parseEnvValue(value) {
  const trimmed = value.trim()
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

function loadLocalEnv() {
  for (const file of LOCAL_ENV_FILES) {
    if (!existsSync(file)) continue

    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const separatorIndex = trimmed.indexOf('=')
      if (separatorIndex === -1) continue
      const key = trimmed.slice(0, separatorIndex).trim()
      const value = parseEnvValue(trimmed.slice(separatorIndex + 1))
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
  const admin = await signIn(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD)
  const userA = await signIn(
    process.env.QA_USER_A_EMAIL,
    process.env.QA_USER_A_PASSWORD,
  )

  const adminRole = await admin.supabase.rpc('has_role', { required_role: 'admin' })
  const userRole = await userA.supabase.rpc('has_role', { required_role: 'admin' })

  const report = await userA.supabase
    .from('content_reports')
    .insert({
      reporter_id: userA.user.id,
      target_type: 'profile',
      target_id: userA.user.id,
      reason: 'QA admin',
      details: 'Reporte temporal para QA de administracion.',
    })
    .select('id')
    .single()

  const reportUpdate = report.data?.id
    ? await admin.supabase
        .from('content_reports')
        .update({
          status: 'reviewed',
          internal_note: 'Revisado por QA admin.',
        })
        .eq('id', report.data.id)
        .select('id')
        .single()
    : { data: null, error: report.error ?? new Error('No se creo reporte.') }

  const devotionalDate = `2099-12-${String(new Date().getUTCDate()).padStart(2, '0')}`
  const devotional = await admin.supabase
    .from('devotionals')
    .upsert(
      {
        title: `QA devocional admin ${suffix}`,
        verse_reference: 'Mateo 5:14',
        verse_text: 'Vosotros sois la luz del mundo.',
        reflection: 'Contenido temporal de QA.',
        prayer: 'Oracion temporal de QA.',
        devotional_date: devotionalDate,
        is_active: false,
        created_by: admin.user.id,
      },
      { onConflict: 'devotional_date' },
    )
    .select('id')
    .single()

  const devotionalUpdate = devotional.data?.id
    ? await admin.supabase
        .from('devotionals')
        .update({ reflection: 'Contenido temporal de QA actualizado.' })
        .eq('id', devotional.data.id)
        .select('id')
        .single()
    : { data: null, error: devotional.error ?? new Error('No se creo devocional.') }

  if (devotional.data?.id) {
    await admin.supabase.from('devotionals').delete().eq('id', devotional.data.id)
  }

  await admin.supabase.auth.signOut()
  await userA.supabase.auth.signOut()

  const status =
    adminRole.data === true &&
    userRole.data === false &&
    reportUpdate.data &&
    devotionalUpdate.data
      ? 'QA_ADMIN_OK'
      : 'QA_ADMIN_FAILED'

  if (status !== 'QA_ADMIN_OK') process.exitCode = 1

  console.log(
    JSON.stringify(
      {
        status,
        adminRole: adminRole.data === true ? 'OK' : 'FAILED',
        nonAdminBlocked: userRole.data === false ? 'OK' : 'FAILED',
        reportModeration: reportUpdate.data ? 'OK' : 'FAILED',
        devotionalAdminWrite: devotionalUpdate.data ? 'OK' : 'FAILED',
      },
      null,
      2,
    ),
  )
}

await main()
