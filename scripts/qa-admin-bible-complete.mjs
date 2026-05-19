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
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    process.env[key] ??= value
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

  const admin = await signIn(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD)
  const status = await admin.supabase.functions.invoke('admin-ai-settings', {
    body: { action: 'get_bible_admin_status' },
  })
  if (status.error) throw status.error
  if ((status.data?.translations ?? []).length < 1) throw new Error('Sin traducciones en Admin Biblia.')
  if ((status.data?.booksCount ?? 0) < 66) throw new Error('Catalogo de libros incompleto en Admin Biblia.')
  const stats =
    status.data?.translationStats ??
    (await admin.supabase.from('bible_translation_stats').select('*')).data ??
    []
  const plans =
    status.data?.readingPlans ??
    (await admin.supabase
      .from('bible_reading_plans')
      .select('id, title')
      .eq('is_active', true)).data ??
    []
  const missing =
    status.data?.missingChapters ??
    (await admin.supabase.from('bible_missing_chapters_report').select('*').limit(5)).data
  if (stats.length < 1) throw new Error('Sin estadisticas de traduccion.')
  if (plans.length < 5) throw new Error('Sin planes biblicos en Admin Biblia.')
  if (!Array.isArray(missing)) throw new Error('Diagnostico de capitulos no disponible.')

  const test = await admin.supabase.functions.invoke('admin-ai-settings', {
    body: { action: 'test_random_bible_verse' },
  })
  if (test.error || test.data?.status !== 'BIBLE_RANDOM_OK') {
    throw test.error ?? new Error('Admin Biblia no pudo probar versiculo aleatorio.')
  }

  printOk('QA_ADMIN_BIBLE_COMPLETE_OK', {
    translations: status.data.translations.length,
    verses: status.data.versesCount,
    plans: plans.length,
    diagnostics: missing.length,
  })
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
