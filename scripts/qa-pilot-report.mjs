import { existsSync, readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const ENV_FILES = ['.env.qa.local', '.env.local', '.env.admin.local']
const REQUIRED_KEYS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_PUBLISHABLE_KEY',
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

async function countRows(supabase, table) {
  const { count, error } = await supabase
    .from(table)
    .select('id', { count: 'exact', head: true })
  if (error) throw error
  return count ?? 0
}

async function main() {
  loadEnv()
  const missing = REQUIRED_KEYS.filter((key) => !process.env[key])
  if (missing.length) {
    console.log(JSON.stringify({ status: 'BLOCKED_MISSING_ADMIN_ENV', missing }, null, 2))
    return
  }

  const admin = await signIn(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD)
  const [profiles, feedback, incidents, reports, aiLogs] = await Promise.all([
    countRows(admin.supabase, 'profiles'),
    countRows(admin.supabase, 'pilot_feedback'),
    countRows(admin.supabase, 'pilot_incidents'),
    countRows(admin.supabase, 'content_reports'),
    countRows(admin.supabase, 'ai_action_logs'),
  ])

  const markdown = `# Reporte de cierre del piloto

## Resumen ejecutivo

Usuarios registrados: ${profiles}
Feedback recibido: ${feedback}
Incidentes registrados: ${incidents}
Reportes de moderacion: ${reports}
Solicitudes IA: ${aiLogs}

## Decision

- [ ] Continuar piloto
- [ ] Pasar a beta
- [ ] Corregir antes de beta
- [ ] Detener`

  await admin.supabase.auth.signOut()

  const status = markdown.includes('Reporte de cierre del piloto')
    ? 'QA_PILOT_REPORT_OK'
    : 'QA_PILOT_REPORT_FAILED'
  if (status !== 'QA_PILOT_REPORT_OK') process.exitCode = 1
  console.log(JSON.stringify({ status, profiles, feedback, incidents, reports, aiLogs }, null, 2))
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
