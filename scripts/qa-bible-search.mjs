import { ensureQaEnv, printOk, signInQaUser } from './qa-shared.mjs'

async function main() {
  if (!ensureQaEnv()) return
  const userA = await signInQaUser('A')

  const byReference = await userA.supabase.rpc('search_bible_verses', {
    p_query: 'Juan 3:16',
    p_translation_code: 'RVR1909',
    p_book_code: null,
    p_limit: 10,
  })
  if (byReference.error) throw byReference.error
  if (!byReference.data?.some((item) => item.book_code === 'JHN' && item.chapter === 3 && item.verse === 16)) {
    throw new Error('Busqueda por referencia no encontro Juan 3:16.')
  }

  const byWord = await userA.supabase.rpc('search_bible_verses', {
    p_query: 'Cristo',
    p_translation_code: 'RVR1909',
    p_book_code: null,
    p_limit: 10,
  })
  if (byWord.error) throw byWord.error
  if (!byWord.data?.length) throw new Error('Busqueda por palabra no devolvio resultados.')

  const byBook = await userA.supabase.rpc('search_bible_verses', {
    p_query: 'Cristo',
    p_translation_code: 'RVR1909',
    p_book_code: byWord.data[0].book_code,
    p_limit: 10,
  })
  if (byBook.error) throw byBook.error
  if (byBook.data?.some((item) => item.book_code !== byWord.data[0].book_code)) {
    throw new Error('Filtro por libro devolvio resultados de otro libro.')
  }

  printOk('QA_BIBLE_SEARCH_OK', {
    reference: byReference.data[0].reference,
    wordResults: byWord.data.length,
    filteredResults: byBook.data.length,
  })
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
