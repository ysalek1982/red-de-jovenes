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

async function main() {
  loadLocalEnv()
  loadAdminEnv()
  if (!ensureQaEnv()) return
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    console.log(JSON.stringify({ status: 'BLOCKED_MISSING_ADMIN_ENV' }, null, 2))
    return
  }
  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY)
  const { data, error } = await supabase.auth.signInWithPassword({
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  })
  if (error || !data.user) throw error ?? new Error('No se obtuvo admin.')

  const status = await supabase.functions.invoke('admin-ai-settings', {
    body: { action: 'get_provider_status' },
  })
  if (status.error) throw status.error
  if (!status.data?.provider?.is_enabled || !status.data.provider.key_last4) {
    printOk('QA_AI_REAL_PROVIDER_SKIPPED', { reason: 'GEMINI_NOT_CONFIGURED' })
    return
  }

  const test = await supabase.functions.invoke('admin-ai-settings', {
    body: { action: 'test_provider_key' },
  })
  if (test.error || test.data?.status !== 'GEMINI_TEST_OK') {
    throw test.error ?? new Error('Gemini configurado no respondio OK.')
  }
  printOk('QA_AI_REAL_PROVIDER_OK', { key: `****${status.data.provider.key_last4}` })
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
