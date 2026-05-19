import { existsSync, readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'
import { ensureQaEnv, printOk, signInQaUser } from './qa-shared.mjs'

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

function makeAdminClient() {
  return createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    { auth: { persistSession: false } },
  )
}

async function signInAdmin() {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error('Faltan ADMIN_EMAIL o ADMIN_PASSWORD para validar Admin Biblia.')
  }
  const supabase = makeAdminClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  })
  if (error || !data.user) throw error ?? new Error('No se obtuvo usuario admin.')
  return { supabase, user: data.user }
}

async function exactCount(supabase, table, queryBuilder) {
  const base = supabase.from(table).select('id', { count: 'exact', head: true })
  const query = queryBuilder ? queryBuilder(base) : base
  const { count, error } = await query
  if (error) throw error
  return count ?? 0
}

async function fetchAllVerseKeys(supabase) {
  const keys = []
  const pageSize = 1000
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from('bible_verses')
      .select('book_code, chapter, verse')
      .eq('translation_code', 'RVR1909')
      .order('book_code')
      .range(from, from + pageSize - 1)
    if (error) throw error
    if (!data?.length) break
    keys.push(...data.map((row) => `${row.book_code}:${row.chapter}:${row.verse}`))
    if (data.length < pageSize) break
  }
  return keys
}

async function assertChapter(supabase, bookCode, chapter, minVerses) {
  const result = await supabase.rpc('get_bible_chapter', {
    p_translation_code: 'RVR1909',
    p_book_code: bookCode,
    p_chapter: chapter,
  })
  if (result.error) throw result.error
  if ((result.data ?? []).length < minVerses) {
    throw new Error(`Capitulo incompleto o ausente: ${bookCode} ${chapter}.`)
  }
  return result.data.length
}

async function main() {
  loadAdminEnv()
  if (!ensureQaEnv()) return

  const userA = await signInQaUser('A')
  const supabase = userA.supabase

  const translation = await supabase
    .from('bible_translations')
    .select('code, name, is_public_domain, is_active, source_name')
    .eq('code', 'RVR1909')
    .maybeSingle()
  if (translation.error) throw translation.error
  if (!translation.data?.is_active || !translation.data?.is_public_domain) {
    throw new Error('RVR1909 no existe activa como dominio publico.')
  }

  const booksCount = await exactCount(supabase, 'bible_books')
  if (booksCount !== 66) throw new Error(`Se esperaban 66 libros, hay ${booksCount}.`)

  const versesCount = await exactCount(supabase, 'bible_verses', (query) =>
    query.eq('translation_code', 'RVR1909'),
  )
  if (versesCount <= 30000) {
    throw new Error(`Corpus RVR1909 incompleto: ${versesCount} versiculos.`)
  }

  const emptyTextCount =
    (await exactCount(supabase, 'bible_verses', (query) =>
      query.eq('translation_code', 'RVR1909').eq('verse_text', ''),
    )) +
    (await exactCount(supabase, 'bible_verses', (query) =>
      query.eq('translation_code', 'RVR1909').is('verse_text', null),
    ))
  if (emptyTextCount !== 0) throw new Error(`Hay ${emptyTextCount} versiculos vacios.`)

  const chapterCounts = {
    genesis1: await assertChapter(supabase, 'GEN', 1, 20),
    psalm23: await assertChapter(supabase, 'PSA', 23, 6),
    john3: await assertChapter(supabase, 'JHN', 3, 20),
    revelation22: await assertChapter(supabase, 'REV', 22, 10),
  }

  const search = await supabase.rpc('search_bible_verses', {
    p_query: 'amor',
    p_translation_code: 'RVR1909',
    p_book_code: null,
    p_limit: 10,
  })
  if (search.error) throw search.error
  if (!search.data?.length) throw new Error('search_bible_verses no encontro amor.')

  const random = await supabase.rpc('get_random_bible_verse', {
    p_translation_code: 'RVR1909',
    p_testament: null,
    p_book_code: null,
  })
  if (random.error) throw random.error
  if (!random.data?.[0]?.verse_text) throw new Error('get_random_bible_verse no devolvio texto.')

  const keys = await fetchAllVerseKeys(supabase)
  const duplicateKeys = keys.length - new Set(keys).size
  if (duplicateKeys !== 0) throw new Error(`Hay ${duplicateKeys} duplicados.`)

  const normalUserWrite = await supabase
    .from('bible_verses')
    .update({ verse_text: 'QA no autorizado' })
    .eq('translation_code', 'RVR1909')
    .eq('book_code', 'GEN')
    .eq('chapter', 1)
    .eq('verse', 1)
    .select('id')
    .maybeSingle()
  if (normalUserWrite.data) throw new Error('Usuario normal pudo modificar bible_verses.')

  const admin = await signInAdmin()
  const adminStatus = await admin.supabase.functions.invoke('admin-ai-settings', {
    body: { action: 'get_bible_admin_status' },
  })
  if (adminStatus.error) throw adminStatus.error
  if ((adminStatus.data?.versesCount ?? 0) <= 30000) {
    throw new Error('Admin Biblia no muestra conteos completos.')
  }
  await admin.supabase.auth.signOut()
  await userA.supabase.auth.signOut()

  printOk('QA_BIBLE_CORPUS_COMPLETE_OK', {
    translation: translation.data.code,
    books: booksCount,
    verses: versesCount,
    duplicateKeys,
    emptyTextCount,
    chapterCounts,
    searchResults: search.data.length,
    randomReference: random.data[0].reference,
    adminVerses: adminStatus.data.versesCount,
  })
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
