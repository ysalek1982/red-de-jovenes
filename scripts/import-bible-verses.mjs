import { existsSync, readFileSync } from 'node:fs'
import { extname } from 'node:path'
import { performance } from 'node:perf_hooks'
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
      let value = trimmed.slice(separatorIndex + 1).trim()
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      if (!process.env[key]) process.env[key] = value
    }
  }
}

function getArg(name) {
  const index = process.argv.indexOf(`--${name}`)
  return index === -1 ? '' : process.argv[index + 1] || ''
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`)
}

function parseCsvLine(line) {
  const values = []
  let current = ''
  let quoted = false
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    const next = line[index + 1]
    if (char === '"' && quoted && next === '"') {
      current += '"'
      index += 1
    } else if (char === '"') {
      quoted = !quoted
    } else if (char === ',' && !quoted) {
      values.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  values.push(current.trim())
  return values
}

function parseCsv(content) {
  const [headerLine, ...lines] = content.split(/\r?\n/).filter(Boolean)
  const headers = parseCsvLine(headerLine).map((item) => item.trim())
  return lines.map((line) => {
    const values = parseCsvLine(line)
    return Object.fromEntries(headers.map((header, index) => [header, values[index]?.trim() ?? '']))
  })
}

function normalizeBool(value) {
  return value === true || String(value).toLowerCase() === 'true'
}

function normalizeText(value) {
  return String(value ?? '').trim()
}

function normalizeRow(row, index) {
  const chapter = Number(row.chapter)
  const verse = Number(row.verse)
  const bookOrder = Number(row.book_order)
  const chaptersCount = Number(row.chapters_count)
  const translation_code = normalizeText(row.translation_code)
  const book_code = normalizeText(row.book_code).toUpperCase()
  const book_name = normalizeText(row.book_name)
  const testament = normalizeText(row.testament)
  const verse_text = normalizeText(row.verse_text)
  const errors = []

  if (!translation_code) errors.push('translation_code requerido')
  if (!book_code) errors.push('book_code requerido')
  if (!Number.isInteger(chapter) || chapter <= 0) errors.push('chapter invalido')
  if (!Number.isInteger(verse) || verse <= 0) errors.push('verse invalido')
  if (!verse_text) errors.push('verse_text requerido')
  if (testament && !['old', 'new'].includes(testament)) errors.push('testament invalido')
  if (row.book_order && (!Number.isInteger(bookOrder) || bookOrder <= 0)) {
    errors.push('book_order invalido')
  }
  if (row.chapters_count && (!Number.isInteger(chaptersCount) || chaptersCount <= 0)) {
    errors.push('chapters_count invalido')
  }

  return {
    ok: errors.length === 0,
    errors,
    rowNumber: index + 1,
    key: `${translation_code}:${book_code}:${chapter}:${verse}`,
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
    book: book_name && testament && Number.isInteger(bookOrder)
      ? {
          code: book_code,
          name: book_name,
          testament,
          book_order: bookOrder,
          chapters_count: Number.isInteger(chaptersCount) ? chaptersCount : chapter,
        }
      : null,
  }
}

function normalizePayload(raw, extension) {
  const parsed = extension === '.csv' ? parseCsv(raw) : JSON.parse(raw)
  if (Array.isArray(parsed)) {
    return {
      metadata: {
        translation_code: getArg('translation-code') || parsed[0]?.translation_code,
        translation_name: getArg('translation-name') || parsed[0]?.translation_name,
        language: getArg('language') || parsed[0]?.language || 'es',
        license: getArg('license') || parsed[0]?.license,
        source_name: getArg('source-name') || parsed[0]?.source_name,
        source_url: getArg('source-url') || parsed[0]?.source_url,
        is_public_domain:
          getArg('is-public-domain') === 'true' ||
          normalizeBool(parsed[0]?.is_public_domain),
        license_confirmed:
          hasFlag('confirm-license') || normalizeBool(parsed[0]?.license_confirmed),
      },
      rows: parsed,
    }
  }

  if (!Array.isArray(parsed.verses)) {
    throw new Error('El JSON debe ser un arreglo o un objeto con metadata y verses.')
  }

  return {
    metadata: parsed.metadata ?? {},
    rows: parsed.verses,
  }
}

function validateMetadata(metadata) {
  const normalized = {
    translation_code: normalizeText(metadata.translation_code),
    translation_name: normalizeText(metadata.translation_name || metadata.name),
    language: normalizeText(metadata.language || 'es'),
    license: normalizeText(metadata.license),
    source_name: normalizeText(metadata.source_name),
    source_url: normalizeText(metadata.source_url),
    is_public_domain: normalizeBool(metadata.is_public_domain),
    license_confirmed: normalizeBool(metadata.license_confirmed) || hasFlag('confirm-license'),
  }
  const errors = []
  if (!normalized.translation_code) errors.push('translation_code requerido')
  if (!normalized.translation_name) errors.push('translation_name requerido')
  if (!normalized.language) errors.push('language requerido')
  if (!normalized.license) errors.push('license requerido')
  if (!normalized.source_name) errors.push('source_name requerido')
  if (!normalized.source_url) errors.push('source_url requerido')
  if (!normalized.is_public_domain && !normalized.license_confirmed) {
    errors.push('is_public_domain o license_confirmed requerido')
  }
  return { metadata: normalized, errors }
}

function analyzeRows(rows) {
  const normalized = rows.map(normalizeRow)
  const seen = new Set()
  const duplicates = []
  const valid = []
  const invalid = []

  for (const item of normalized) {
    if (!item.ok) {
      invalid.push(item)
      continue
    }
    if (seen.has(item.key)) {
      duplicates.push(item)
      continue
    }
    seen.add(item.key)
    valid.push(item)
  }

  return { valid, invalid, duplicates }
}

async function getExistingKeys(supabase, translationCode) {
  const keys = new Set()
  const { data, error } = await supabase
    .from('bible_verses')
    .select('book_code, chapter, verse')
    .eq('translation_code', translationCode)
    .limit(50000)
  if (error) throw error
  for (const row of data ?? []) {
    keys.add(`${translationCode}:${row.book_code}:${row.chapter}:${row.verse}`)
  }
  return keys
}

function buildReport(input) {
  return {
    status: input.status,
    translation: input.metadata.translation_code,
    translationName: input.metadata.translation_name,
    source: input.metadata.source_name,
    sourceUrl: input.metadata.source_url,
    license: input.metadata.license,
    language: input.metadata.language,
    publicDomain: input.metadata.is_public_domain,
    booksRead: input.booksRead,
    chaptersRead: input.chaptersRead,
    versesRead: input.rowsRead,
    inserted: input.inserted,
    updated: input.updated,
    omitted: input.omitted,
    duplicateRows: input.duplicates,
    errors: input.errors,
    elapsedMs: Math.round(input.elapsedMs),
  }
}

async function main() {
  const started = performance.now()
  loadLocalEnv()
  const file = getArg('file')
  const dryRun = hasFlag('dry-run')
  const confirmLicense = hasFlag('confirm-license')
  if (!file || !existsSync(file)) {
    console.log(JSON.stringify({ status: 'BLOCKED_MISSING_BIBLE_FILE' }, null, 2))
    return
  }

  const raw = readFileSync(file, 'utf8')
  const extension = extname(file).toLowerCase()
  if (!['.json', '.csv'].includes(extension)) {
    console.log(JSON.stringify({ status: 'BLOCKED_UNSUPPORTED_BIBLE_FORMAT' }, null, 2))
    return
  }

  const { metadata, rows } = normalizePayload(raw, extension)
  const metadataValidation = validateMetadata(metadata)
  if (metadataValidation.errors.length) {
    console.log(
      JSON.stringify(
        {
          status: 'BLOCKED_MISSING_LICENSE_METADATA',
          errors: metadataValidation.errors,
        },
        null,
        2,
      ),
    )
    return
  }
  if (!dryRun && !confirmLicense) {
    console.log(JSON.stringify({ status: 'BLOCKED_LICENSE_CONFIRMATION_REQUIRED' }, null, 2))
    return
  }

  const { valid, invalid, duplicates } = analyzeRows(rows)
  const validRows = valid.map((item) => item.value)
  const books = new Map()
  for (const item of valid) {
    if (item.book) books.set(item.book.code, item.book)
  }
  const uniqueBooks = new Set(validRows.map((row) => row.book_code))
  const uniqueChapters = new Set(validRows.map((row) => `${row.book_code}-${row.chapter}`))

  if (dryRun) {
    console.log(
      JSON.stringify(
        buildReport({
          status: 'BIBLE_IMPORT_DRY_RUN_OK',
          metadata: metadataValidation.metadata,
          rowsRead: rows.length,
          booksRead: uniqueBooks.size,
          chaptersRead: uniqueChapters.size,
          inserted: 0,
          updated: 0,
          omitted: invalid.length + duplicates.length,
          duplicates: duplicates.length,
          errors: invalid.slice(0, 20),
          elapsedMs: performance.now() - started,
        }),
        null,
        2,
      ),
    )
    return
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) {
    console.log(JSON.stringify({ status: 'BLOCKED_MISSING_ADMIN_ENV' }, null, 2))
    return
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  })

  const existingKeys = await getExistingKeys(
    supabase,
    metadataValidation.metadata.translation_code,
  )
  const inserted = valid.filter((item) => !existingKeys.has(item.key)).length
  const updated = valid.length - inserted

  const { error: translationError } = await supabase.from('bible_translations').upsert(
    {
      code: metadataValidation.metadata.translation_code,
      name: metadataValidation.metadata.translation_name,
      language: metadataValidation.metadata.language,
      license: metadataValidation.metadata.license,
      source_name: metadataValidation.metadata.source_name,
      source_url: metadataValidation.metadata.source_url,
      is_public_domain: metadataValidation.metadata.is_public_domain,
      is_active: true,
    },
    { onConflict: 'code' },
  )
  if (translationError) throw translationError

  if (books.size) {
    const { error: booksError } = await supabase
      .from('bible_books')
      .upsert(Array.from(books.values()), { onConflict: 'code' })
    if (booksError) throw booksError
  }

  for (let index = 0; index < validRows.length; index += BATCH_SIZE) {
    const batch = validRows.slice(index, index + BATCH_SIZE)
    const { error } = await supabase
      .from('bible_verses')
      .upsert(batch, {
        onConflict: 'translation_code,book_code,chapter,verse',
      })
    if (error) throw error
  }

  console.log(
    JSON.stringify(
      buildReport({
        status: 'BIBLE_IMPORT_OK',
        metadata: metadataValidation.metadata,
        rowsRead: rows.length,
        booksRead: uniqueBooks.size,
        chaptersRead: uniqueChapters.size,
        inserted,
        updated,
        omitted: invalid.length + duplicates.length,
        duplicates: duplicates.length,
        errors: invalid.slice(0, 20),
        elapsedMs: performance.now() - started,
      }),
      null,
      2,
    ),
  )
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
