import { existsSync, readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'
import { ensureQaEnv, loadLocalEnv, printOk } from './qa-shared.mjs'

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

function loadAdminEnv() {
  if (!existsSync('.env.admin.local')) return
  for (const line of readFileSync('.env.admin.local', 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex === -1) continue
    const key = trimmed.slice(0, separatorIndex).trim()
    const value = parseEnvValue(trimmed.slice(separatorIndex + 1))
    if (!process.env[key]) process.env[key] = value
  }
}

async function signIn(email, password) {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  )
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

  process.env.ADMIN_EMAIL = parseEnvValue(process.env.ADMIN_EMAIL)
  process.env.ADMIN_PASSWORD = parseEnvValue(process.env.ADMIN_PASSWORD)
  const admin = await signIn(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD)
  const nonAdmin = await signIn(process.env.QA_USER_A_EMAIL, process.env.QA_USER_A_PASSWORD)

  const directAdminRead = await admin.supabase
    .from('ai_provider_settings')
    .select('encrypted_api_key')
    .limit(1)
  if (!directAdminRead.error && (directAdminRead.data ?? []).length > 0) {
    throw new Error('Admin pudo leer ai_provider_settings directo desde cliente.')
  }

  const adminStatus = await admin.supabase.functions.invoke('admin-ai-settings', {
    body: { action: 'get_provider_status' },
  })
  if (adminStatus.error) throw adminStatus.error
  const serialized = JSON.stringify(adminStatus.data)
  if (serialized.includes('encrypted_api_key')) {
    throw new Error('Respuesta admin expuso encrypted_api_key.')
  }

  const nonAdminStatus = await nonAdmin.supabase.functions.invoke('admin-ai-settings', {
    body: { action: 'get_provider_status' },
  })
  if (!nonAdminStatus.error && !nonAdminStatus.data?.error) {
    throw new Error('No admin pudo consultar estado IA admin.')
  }

  printOk('QA_AI_SETTINGS_OK', {
    adminStatus: adminStatus.data?.status ?? 'OK',
    nonAdmin: 'DENIED',
    encryptedKey: 'NOT_EXPOSED',
  })
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
