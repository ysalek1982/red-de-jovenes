import { existsSync, readFileSync } from 'node:fs'
import { extname } from 'node:path'
import { createClient } from '@supabase/supabase-js'

const LOCAL_ENV_FILES = ['.env.admin.local', '.env.local']
const BATCH_SIZE = 500

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

function getArg(name) {
  const index = process.argv.indexOf(`--${name}`)
  return index === -1 ? '' : process.argv[index + 1] || ''
}

function parseCsv(content) {
  const [headerLine, ...lines] = content.split(/\r?\n/).filter(Boolean)
  const headers = headerLine.split(',').map((item) => item.trim())
  return lines.map((line) => {
    const values = line.split(',')
    return Object.fromEntries(headers.map((header, index) => [header, values[index]?.trim() ?? '']))
  })
}

function normalizeRow(row, index) {
  const chapter = Number(row.chapter)
  const verse = Number(row.verse)
  const translation_code = String(row.translation_code || '').trim()
  const book_code = String(row.book_code || '').trim()
  const verse_text = String(row.verse_text || '').trim()
  const errors = []

  if (!translation_code) errors.push('translation_code requerido')
  if (!book_code) errors.push('book_code requerido')
  if (!Number.isInteger(chapter) || chapter <= 0) errors.push('chapter invalido')
  if (!Number.isInteger(verse) || verse <= 0) errors.push('verse invalido')
  if (!verse_text) errors.push('verse_text requerido')

  return {
    ok: errors.length === 0,
    errors,
    rowNumber: index + 1,
    value: {
      translation_code,
      book_code,
      chapter,
      verse,
      verse_text,
      normalized_text: verse_text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase(),
    },
  }
}

async function main() {
  loadLocalEnv()
  const file = getArg('file')
  if (!file || !existsSync(file)) {
    console.log(JSON.stringify({ status: 'BLOCKED_MISSING_BIBLE_FILE' }, null, 2))
    return
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) {
    console.log(JSON.stringify({ status: 'BLOCKED_MISSING_ADMIN_ENV' }, null, 2))
    return
  }

  const raw = readFileSync(file, 'utf8')
  const extension = extname(file).toLowerCase()
  const rows = extension === '.csv' ? parseCsv(raw) : JSON.parse(raw)
  if (!Array.isArray(rows)) throw new Error('El archivo debe contener un arreglo.')

  const normalized = rows.map(normalizeRow)
  const validRows = normalized.filter((item) => item.ok).map((item) => item.value)
  const invalidRows = normalized.filter((item) => !item.ok)
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  })

  let upserted = 0
  for (let index = 0; index < validRows.length; index += BATCH_SIZE) {
    const batch = validRows.slice(index, index + BATCH_SIZE)
    const { error } = await supabase
      .from('bible_verses')
      .upsert(batch, {
        onConflict: 'translation_code,book_code,chapter,verse',
      })
    if (error) throw error
    upserted += batch.length
  }

  console.log(
    JSON.stringify(
      {
        status: 'BIBLE_IMPORT_READY',
        read: rows.length,
        upserted,
        omitted: invalidRows.length,
        errors: invalidRows.slice(0, 20),
      },
      null,
      2,
    ),
  )
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
