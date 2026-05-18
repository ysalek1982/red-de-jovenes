import { readdir, readFile, stat } from 'node:fs/promises'
import { join, relative } from 'node:path'

const DIST_DIR = 'dist'
const REQUIRED_FILES = [
  'index.html',
  'manifest.webmanifest',
  'sw.js',
  'offline.html',
]

const FORBIDDEN_PATTERNS = [
  /SUPABASE_SERVICE_ROLE_KEY/i,
  /service_role/i,
  /sb_secret_/i,
  /postgres:\/\//i,
  /postgresql:\/\//i,
  /ADMIN_PASSWORD/i,
  /QA_USER_A_PASSWORD/i,
  /QA_USER_B_PASSWORD/i,
  /SUPABASE_DB_PASSWORD/i,
  /SUPABASE_POOLER_PASSWORD/i,
  /\.env(?:\.|$)/i,
  /PEGAR_SOLO_EN_ENV/i,
  /REEMPLAZAR_SOLO_EN_ENV/i,
]

const TEXT_EXTENSIONS = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.map',
  '.svg',
  '.txt',
  '.webmanifest',
  '.xml',
])

function extensionOf(filePath) {
  const match = filePath.match(/(\.[^.]+)$/)
  return match?.[1]?.toLowerCase() ?? ''
}

async function pathExists(path) {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)))
    } else if (entry.isFile()) {
      files.push(fullPath)
    }
  }

  return files
}

function fail(message, details = {}) {
  console.error(
    JSON.stringify(
      {
        status: 'FAILED_SMOKE_BUILD',
        message,
        ...details,
      },
      null,
      2,
    ),
  )
  process.exit(1)
}

if (!(await pathExists(DIST_DIR))) {
  fail('No existe la carpeta dist. Ejecuta npm run build primero.')
}

for (const file of REQUIRED_FILES) {
  if (!(await pathExists(join(DIST_DIR, file)))) {
    fail(`Falta archivo requerido en dist: ${file}`)
  }
}

const assetsDir = join(DIST_DIR, 'assets')
if (!(await pathExists(assetsDir))) {
  fail('No existe dist/assets.')
}

const allFiles = await walk(DIST_DIR)
const assetFiles = allFiles.filter((file) =>
  relative(assetsDir, file).startsWith('..') ? false : true,
)

if (assetFiles.length === 0) {
  fail('dist/assets no contiene archivos.')
}

const envFiles = allFiles.filter((file) => {
  const name = relative(DIST_DIR, file).replaceAll('\\', '/')
  return name.includes('.env')
})

if (envFiles.length > 0) {
  fail('Se encontraron archivos .env dentro de dist.', {
    files: envFiles.map((file) => relative(DIST_DIR, file)),
  })
}

const findings = []

for (const file of allFiles) {
  if (!TEXT_EXTENSIONS.has(extensionOf(file))) continue

  const content = await readFile(file, 'utf8')
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(content)) {
      findings.push({
        file: relative(DIST_DIR, file),
        pattern: pattern.source,
      })
    }
  }
}

if (findings.length > 0) {
  fail('Se encontraron patrones sensibles en dist.', { findings })
}

console.log(
  JSON.stringify(
    {
      status: 'SMOKE_BUILD_OK',
      files: allFiles.length,
      assets: assetFiles.length,
      requiredFiles: REQUIRED_FILES,
    },
    null,
    2,
  ),
)
