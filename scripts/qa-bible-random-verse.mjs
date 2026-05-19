import { ensureQaEnv, printOk, signInQaUser } from './qa-shared.mjs'

async function main() {
  if (!ensureQaEnv()) return
  const userA = await signInQaUser('A')
  const first = await userA.supabase.rpc('get_random_bible_verse', {
    p_translation_code: 'RVR1909',
    p_testament: null,
    p_book_code: null,
  })
  const second = await userA.supabase.rpc('get_random_bible_verse', {
    p_translation_code: 'RVR1909',
    p_testament: 'new',
    p_book_code: null,
  })
  if (first.error) throw first.error
  if (second.error) throw second.error
  if (!first.data?.[0] || !second.data?.[0]) {
    throw new Error('No se obtuvo versiculo aleatorio.')
  }
  printOk('QA_BIBLE_RANDOM_OK', {
    first: first.data[0].reference,
    second: second.data[0].reference,
  })
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
