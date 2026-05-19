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
  const sample = 'supabase/seed/bible/sample-bible-import-full-format.json'
  if (!existsSync(sample)) throw new Error('Falta sample-bible-import-full-format.json.')

  const dryRun = runImporter(['--file', sample, '--dry-run'])
  if (dryRun.status !== 'BIBLE_IMPORT_DRY_RUN_OK') {
    throw new Error(`Dry-run inesperado: ${dryRun.status}`)
  }
  if (dryRun.versesRead < 2 || dryRun.booksRead < 2) {
    throw new Error('Dry-run no reporto libros y versiculos esperados.')
  }

  const csvPath = join(tmpdir(), `red-jovenes-bible-sample-${Date.now()}.csv`)
  writeFileSync(
    csvPath,
    [
      'translation_code,translation_name,language,license,source_name,source_url,is_public_domain,book_code,book_name,testament,book_order,chapters_count,chapter,verse,verse_text',
      '"RVR1909_SAMPLE_CSV","Reina-Valera 1909 - muestra CSV","es","Dominio publico; muestra minima para validar CSV.","Proyecto Red de Jovenes QA","https://red-de-jovenes.vercel.app/","true","JHN","Juan","new","43","21","3","16","Porque de tal manera amo Dios al mundo."',
    ].join('\n'),
  )
  const csvDryRun = runImporter(['--file', csvPath, '--dry-run'])
  if (csvDryRun.status !== 'BIBLE_IMPORT_DRY_RUN_OK' || csvDryRun.versesRead !== 1) {
    throw new Error('Dry-run CSV no valido el formato esperado.')
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

  const noConfirm = runImporter(['--file', sample])
  if (noConfirm.status !== 'BLOCKED_LICENSE_CONFIRMATION_REQUIRED') {
    throw new Error('Importador no exigio --confirm-license.')
  }

  let confirmed = 'SKIPPED_MISSING_ADMIN_ENV'
  if (process.env.SUPABASE_SERVICE_ROLE_KEY || existsSync('.env.admin.local')) {
    const confirmedRun = runImporter(['--file', sample, '--confirm-license'])
    if (confirmedRun.status !== 'BIBLE_IMPORT_OK') {
      throw new Error(`Confirm-license inesperado: ${confirmedRun.status}`)
    }
    confirmed = confirmedRun.status
  }

  printOk('QA_BIBLE_IMPORT_GOVERNANCE_OK', {
    dryRun: dryRun.status,
    invalid: invalid.status,
    noConfirm: noConfirm.status,
    csv: csvDryRun.status,
    confirmed,
  })
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
