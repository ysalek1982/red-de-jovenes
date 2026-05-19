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

function hasFlag(name) {
  return process.argv.includes(`--${name}`)
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

function normalizePayload(raw, extension) {
  const parsed = extension === '.csv' ? parseCsv(raw) : JSON.parse(raw)
  if (Array.isArray(parsed)) {
    return {
      metadata: {
        translation_code: getArg('translation-code') || parsed[0]?.translation_code,
        translation_name: getArg('translation-name') || parsed[0]?.translation_name,
        license: getArg('license') || parsed[0]?.license,
        source_name: getArg('source-name') || parsed[0]?.source_name,
        source_url: getArg('source-url') || parsed[0]?.source_url,
        is_public_domain:
          getArg('is-public-domain') === 'true' ||
          parsed[0]?.is_public_domain === true,
        license_confirmed:
          hasFlag('confirm-license') || parsed[0]?.license_confirmed === true,
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
    translation_code: String(metadata.translation_code || '').trim(),
    translation_name: String(metadata.translation_name || metadata.name || '').trim(),
    license: String(metadata.license || '').trim(),
    source_name: String(metadata.source_name || '').trim(),
    source_url: String(metadata.source_url || '').trim(),
    is_public_domain: metadata.is_public_domain === true,
    license_confirmed: metadata.license_confirmed === true || hasFlag('confirm-license'),
  }
  const errors = []
  if (!normalized.translation_code) errors.push('translation_code requerido')
  if (!normalized.translation_name) errors.push('translation_name requerido')
  if (!normalized.license) errors.push('license requerido')
  if (!normalized.source_name) errors.push('source_name requerido')
  if (!normalized.source_url) errors.push('source_url requerido')
  if (!normalized.is_public_domain && !normalized.license_confirmed) {
    errors.push('is_public_domain o license_confirmed requerido')
  }
  return { metadata: normalized, errors }
}

async function main() {
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

  const normalized = rows.map(normalizeRow)
  const validRows = normalized.filter((item) => item.ok).map((item) => item.value)
  const invalidRows = normalized.filter((item) => !item.ok)
  const uniqueBooks = new Set(validRows.map((row) => row.book_code))
  const uniqueChapters = new Set(
    validRows.map((row) => `${row.book_code}-${row.chapter}`),
  )

  if (dryRun) {
    console.log(
      JSON.stringify(
        {
          status: 'BIBLE_IMPORT_DRY_RUN_OK',
          translation: metadataValidation.metadata.translation_code,
          read: rows.length,
          valid: validRows.length,
          omitted: invalidRows.length,
          books: uniqueBooks.size,
          chapters: uniqueChapters.size,
          errors: invalidRows.slice(0, 20),
        },
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

  const { error: translationError } = await supabase.from('bible_translations').upsert(
    {
      code: metadataValidation.metadata.translation_code,
      name: metadataValidation.metadata.translation_name,
      language: 'es',
      license: metadataValidation.metadata.license,
      source_name: metadataValidation.metadata.source_name,
      source_url: metadataValidation.metadata.source_url,
      is_public_domain: metadataValidation.metadata.is_public_domain,
      is_active: true,
    },
    { onConflict: 'code' },
  )
  if (translationError) throw translationError

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
        translation: metadataValidation.metadata.translation_code,
        read: rows.length,
        upserted,
        omitted: invalidRows.length,
        books: uniqueBooks.size,
        chapters: uniqueChapters.size,
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
