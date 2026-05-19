import { execFileSync } from 'node:child_process'
import { existsSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { printOk } from './qa-shared.mjs'

function runImporter(args) {
  const output = execFileSync('node', ['scripts/import-bible-verses.mjs', ...args], {
    encoding: 'utf8',
  })
  return JSON.parse(output)
}

async function main() {
  const sample = 'supabase/seed/bible/sample-authorized-bible.json'
  if (!existsSync(sample)) throw new Error('Falta sample-authorized-bible.json.')

  const dryRun = runImporter(['--file', sample, '--dry-run'])
  if (dryRun.status !== 'BIBLE_IMPORT_DRY_RUN_OK') {
    throw new Error(`Dry-run inesperado: ${dryRun.status}`)
  }

  const invalidPath = join(tmpdir(), `red-jovenes-invalid-bible-${Date.now()}.json`)
  writeFileSync(
    invalidPath,
    JSON.stringify({
      metadata: { translation_code: 'QA_BAD' },
      verses: [],
    }),
  )
  const invalid = runImporter(['--file', invalidPath, '--dry-run'])
  if (invalid.status !== 'BLOCKED_MISSING_LICENSE_METADATA') {
    throw new Error('Importador no bloqueo metadata incompleta.')
  }

  printOk('QA_BIBLE_IMPORT_GOVERNANCE_OK', {
    dryRun: dryRun.status,
    invalid: invalid.status,
  })
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
