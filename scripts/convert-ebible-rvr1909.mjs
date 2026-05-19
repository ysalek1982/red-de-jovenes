import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { basename, extname, join, resolve } from 'node:path'
import { tmpdir } from 'node:os'

const SOURCE_URL = 'https://ebible.org/bible/details.php?id=spaRV1909'
const DOWNLOAD_URL = 'https://ebible.org/Scriptures/spaRV1909_vpl.zip'
const DEFAULT_INPUT = 'supabase/seed/bible/ebible-rvr1909/spaRV1909_vpl.zip'
const DEFAULT_OUTPUT =
  'supabase/seed/bible/ebible-rvr1909/rvr1909-normalized.json'
const DEFAULT_REPORT =
  'supabase/seed/bible/ebible-rvr1909/conversion-report.json'

const BOOKS = [
  ['GEN', 'GEN', 'Génesis', 'old', 1, 50],
  ['EXO', 'EXO', 'Éxodo', 'old', 2, 40],
  ['LEV', 'LEV', 'Levítico', 'old', 3, 27],
  ['NUM', 'NUM', 'Números', 'old', 4, 36],
  ['DEU', 'DEU', 'Deuteronomio', 'old', 5, 34],
  ['JOS', 'JOS', 'Josué', 'old', 6, 24],
  ['JDG', 'JDG', 'Jueces', 'old', 7, 21],
  ['RUT', 'RUT', 'Rut', 'old', 8, 4],
  ['1SA', '1SA', '1 Samuel', 'old', 9, 31],
  ['2SA', '2SA', '2 Samuel', 'old', 10, 24],
  ['1KI', '1KI', '1 Reyes', 'old', 11, 22],
  ['2KI', '2KI', '2 Reyes', 'old', 12, 25],
  ['1CH', '1CH', '1 Crónicas', 'old', 13, 29],
  ['2CH', '2CH', '2 Crónicas', 'old', 14, 36],
  ['EZR', 'EZR', 'Esdras', 'old', 15, 10],
  ['NEH', 'NEH', 'Nehemías', 'old', 16, 13],
  ['EST', 'EST', 'Ester', 'old', 17, 10],
  ['JOB', 'JOB', 'Job', 'old', 18, 42],
  ['PSA', 'PSA', 'Salmos', 'old', 19, 150],
  ['PRO', 'PRO', 'Proverbios', 'old', 20, 31],
  ['ECC', 'ECC', 'Eclesiastés', 'old', 21, 12],
  ['SOL', 'SNG', 'Cantares', 'old', 22, 8],
  ['ISA', 'ISA', 'Isaías', 'old', 23, 66],
  ['JER', 'JER', 'Jeremías', 'old', 24, 52],
  ['LAM', 'LAM', 'Lamentaciones', 'old', 25, 5],
  ['EZE', 'EZK', 'Ezequiel', 'old', 26, 48],
  ['DAN', 'DAN', 'Daniel', 'old', 27, 12],
  ['HOS', 'HOS', 'Oseas', 'old', 28, 14],
  ['JOE', 'JOL', 'Joel', 'old', 29, 3],
  ['AMO', 'AMO', 'Amós', 'old', 30, 9],
  ['OBA', 'OBA', 'Abdías', 'old', 31, 1],
  ['JON', 'JON', 'Jonás', 'old', 32, 4],
  ['MIC', 'MIC', 'Miqueas', 'old', 33, 7],
  ['NAH', 'NAM', 'Nahúm', 'old', 34, 3],
  ['HAB', 'HAB', 'Habacuc', 'old', 35, 3],
  ['ZEP', 'ZEP', 'Sofonías', 'old', 36, 3],
  ['HAG', 'HAG', 'Hageo', 'old', 37, 2],
  ['ZEC', 'ZEC', 'Zacarías', 'old', 38, 14],
  ['MAL', 'MAL', 'Malaquías', 'old', 39, 4],
  ['MAT', 'MAT', 'Mateo', 'new', 40, 28],
  ['MAR', 'MRK', 'Marcos', 'new', 41, 16],
  ['LUK', 'LUK', 'Lucas', 'new', 42, 24],
  ['JOH', 'JHN', 'Juan', 'new', 43, 21],
  ['ACT', 'ACT', 'Hechos', 'new', 44, 28],
  ['ROM', 'ROM', 'Romanos', 'new', 45, 16],
  ['1CO', '1CO', '1 Corintios', 'new', 46, 16],
  ['2CO', '2CO', '2 Corintios', 'new', 47, 13],
  ['GAL', 'GAL', 'Gálatas', 'new', 48, 6],
  ['EPH', 'EPH', 'Efesios', 'new', 49, 6],
  ['PHI', 'PHP', 'Filipenses', 'new', 50, 4],
  ['COL', 'COL', 'Colosenses', 'new', 51, 4],
  ['1TH', '1TH', '1 Tesalonicenses', 'new', 52, 5],
  ['2TH', '2TH', '2 Tesalonicenses', 'new', 53, 3],
  ['1TI', '1TI', '1 Timoteo', 'new', 54, 6],
  ['2TI', '2TI', '2 Timoteo', 'new', 55, 4],
  ['TIT', 'TIT', 'Tito', 'new', 56, 3],
  ['PHM', 'PHM', 'Filemón', 'new', 57, 1],
  ['HEB', 'HEB', 'Hebreos', 'new', 58, 13],
  ['JAM', 'JAS', 'Santiago', 'new', 59, 5],
  ['1PE', '1PE', '1 Pedro', 'new', 60, 5],
  ['2PE', '2PE', '2 Pedro', 'new', 61, 3],
  ['1JO', '1JN', '1 Juan', 'new', 62, 5],
  ['2JO', '2JN', '2 Juan', 'new', 63, 1],
  ['3JO', '3JN', '3 Juan', 'new', 64, 1],
  ['JUD', 'JUD', 'Judas', 'new', 65, 1],
  ['REV', 'REV', 'Apocalipsis', 'new', 66, 22],
]

const BOOK_BY_SOURCE = new Map(
  BOOKS.map(([sourceCode, code, name, testament, bookOrder, chaptersCount]) => [
    sourceCode,
    { sourceCode, code, name, testament, bookOrder, chaptersCount },
  ]),
)

function getArg(name, fallback = '') {
  const index = process.argv.indexOf(`--${name}`)
  return index === -1 ? fallback : process.argv[index + 1] || fallback
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex').toUpperCase()
}

function ensureExtractedText(inputPath) {
  if (extname(inputPath).toLowerCase() === '.txt') return inputPath
  if (extname(inputPath).toLowerCase() !== '.zip') {
    throw new Error('El convertidor acepta .zip oficial de eBible o .txt VPL extraido.')
  }
  const extractDir = join(tmpdir(), `red-jovenes-ebible-${Date.now()}`)
  mkdirSync(extractDir, { recursive: true })
  if (process.platform === 'win32') {
    execFileSync(
      'powershell',
      [
        '-NoProfile',
        '-Command',
        `Expand-Archive -LiteralPath '${inputPath.replace(/'/g, "''")}' -DestinationPath '${extractDir.replace(/'/g, "''")}' -Force`,
      ],
      { stdio: 'ignore' },
    )
  } else {
    execFileSync('unzip', ['-q', inputPath, '-d', extractDir], { stdio: 'ignore' })
  }
  const txtPath = join(extractDir, 'spaRV1909_vpl.txt')
  if (!existsSync(txtPath)) throw new Error('El ZIP no contiene spaRV1909_vpl.txt.')
  return txtPath
}

function cleanVerseText(value) {
  return value
    .replace(/\[([^\]]+)\]/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

function convertVplText(inputText) {
  const rows = []
  const errors = []
  const seen = new Set()
  const booksSeen = new Set()
  const chaptersSeen = new Set()
  let blankVerseMarkers = 0

  for (const [index, line] of inputText.split(/\r?\n/).entries()) {
    if (!line.trim()) continue
    const match = line.match(/^([1-3]?[A-Z]{2,3})\s+([0-9]+):([0-9]+)\s*(.*)$/)
    if (!match) {
      errors.push({ line: index + 1, error: 'LINE_NOT_PARSEABLE', sample: line.slice(0, 80) })
      continue
    }
    const [, sourceBookCode, chapterText, verseText, rawVerse] = match
    const book = BOOK_BY_SOURCE.get(sourceBookCode)
    if (!book) {
      errors.push({ line: index + 1, error: 'UNKNOWN_BOOK_CODE', sourceBookCode })
      continue
    }
    const chapter = Number(chapterText)
    const verse = Number(verseText)
    const text = cleanVerseText(rawVerse)
    if (!text) {
      blankVerseMarkers += 1
      continue
    }
    if (!Number.isInteger(chapter) || chapter <= 0 || chapter > book.chaptersCount) {
      errors.push({ line: index + 1, error: 'INVALID_CHAPTER', sourceBookCode, chapter })
      continue
    }
    if (!Number.isInteger(verse) || verse <= 0) {
      errors.push({ line: index + 1, error: 'INVALID_VERSE', sourceBookCode, chapter, verse })
      continue
    }
    const key = `RVR1909:${book.code}:${chapter}:${verse}`
    if (seen.has(key)) {
      errors.push({ line: index + 1, error: 'DUPLICATE_VERSE', key })
      continue
    }
    seen.add(key)
    booksSeen.add(book.code)
    chaptersSeen.add(`${book.code}:${chapter}`)
    rows.push({
      translation_code: 'RVR1909',
      translation_name: 'Reina-Valera 1909',
      language: 'es',
      license: 'public domain',
      source_name: 'eBible RVR1909 / spaRV1909',
      source_url: SOURCE_URL,
      is_public_domain: true,
      book_code: book.code,
      book_name: book.name,
      testament: book.testament,
      book_order: book.bookOrder,
      chapters_count: book.chaptersCount,
      chapter,
      verse,
      verse_text: text,
    })
  }

  return { rows, errors, booksSeen, chaptersSeen, blankVerseMarkers }
}

function main() {
  const input = resolve(getArg('input', DEFAULT_INPUT))
  const output = resolve(getArg('output', DEFAULT_OUTPUT))
  const reportPath = resolve(getArg('report', DEFAULT_REPORT))
  if (!existsSync(input)) throw new Error(`No existe input: ${input}`)
  const sourceChecksum = sha256(input)
  const textPath = ensureExtractedText(input)
  const inputText = readFileSync(textPath, 'utf8')
  const { rows, errors, booksSeen, chaptersSeen, blankVerseMarkers } = convertVplText(inputText)
  const duplicateKeys = rows.length - new Set(rows.map((row) => `${row.translation_code}:${row.book_code}:${row.chapter}:${row.verse}`)).size
  const expectedChapters = BOOKS.reduce((sum, book) => sum + book[5], 0)
  const report = {
    status:
      errors.length === 0 &&
      rows.length > 30000 &&
      booksSeen.size === 66 &&
      chaptersSeen.size === expectedChapters &&
      duplicateKeys === 0
        ? 'EBIBLE_RVR1909_CONVERSION_OK'
        : 'EBIBLE_RVR1909_CONVERSION_BLOCKED',
    source: {
      input: input.replace(/\\/g, '/'),
      source_id: 'spaRV1909',
      source_name: 'eBible RVR1909 / spaRV1909',
      source_url: SOURCE_URL,
      download_url: DOWNLOAD_URL,
      format: basename(input).endsWith('.zip') ? 'VPL ZIP' : 'VPL TXT',
      license: 'public domain',
      is_public_domain: true,
      checksum_sha256: sourceChecksum,
    },
    counts: {
      books: booksSeen.size,
      chapters: chaptersSeen.size,
      expectedChapters,
      verses: rows.length,
      blankVerseMarkers,
      duplicateKeys,
      errors: errors.length,
    },
    validation: {
      hasGenesis1: rows.some((row) => row.book_code === 'GEN' && row.chapter === 1),
      hasPsalms23: rows.some((row) => row.book_code === 'PSA' && row.chapter === 23),
      hasJohn3: rows.some((row) => row.book_code === 'JHN' && row.chapter === 3),
      hasRevelation22: rows.some((row) => row.book_code === 'REV' && row.chapter === 22),
    },
    errors: errors.slice(0, 50),
    generated_at: new Date().toISOString(),
    output: output.replace(/\\/g, '/'),
  }

  mkdirSync(resolve(output, '..'), { recursive: true })
  writeFileSync(output, `${JSON.stringify(rows)}\n`, 'utf8')
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')

  if (report.status !== 'EBIBLE_RVR1909_CONVERSION_OK') {
    console.log(JSON.stringify(report, null, 2))
    process.exitCode = 1
    return
  }
  console.log(
    JSON.stringify(
      {
        status: report.status,
        books: report.counts.books,
        chapters: report.counts.chapters,
        verses: report.counts.verses,
        checksum_sha256: sourceChecksum,
        output: report.output,
      },
      null,
      2,
    ),
  )
}

main()
