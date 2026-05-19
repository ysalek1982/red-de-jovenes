import { ensureQaEnv, printOk, signInQaUser } from './qa-shared.mjs'

async function main() {
  if (!ensureQaEnv()) return
  const userA = await signInQaUser('A')

  const translations = await userA.supabase
    .from('bible_translations')
    .select('code,name,is_active')
    .eq('is_active', true)
  if (translations.error) throw translations.error
  if (!translations.data?.length) throw new Error('No hay traducciones activas.')

  const books = await userA.supabase.from('bible_books').select('code,name').limit(66)
  if (books.error) throw books.error
  if ((books.data ?? []).length < 66) throw new Error('Catalogo de libros incompleto.')

  const random = await userA.supabase.rpc('get_random_bible_verse', {
    p_translation_code: 'RVR1909',
    p_testament: null,
    p_book_code: null,
  })
  if (random.error) throw random.error
  if (!random.data?.[0]?.verse_text) throw new Error('RPC aleatorio sin versiculo.')

  const verse = random.data[0]
  const chapter = await userA.supabase.rpc('get_bible_chapter', {
    p_translation_code: verse.translation_code,
    p_book_code: verse.book_code,
    p_chapter: verse.chapter,
  })
  if (chapter.error) throw chapter.error
  if (!chapter.data?.length) throw new Error('RPC capitulo sin contenido.')

  const saved = await userA.supabase
    .from('bible_saved_verses')
    .upsert(
      {
        user_id: userA.user.id,
        reference: `QA DB ${verse.reference}`,
        verse_text: verse.verse_text,
      },
      { onConflict: 'user_id,reference' },
    )
    .select()
    .single()
  if (saved.error) throw saved.error

  const blocked = await userA.supabase
    .from('bible_verses')
    .insert({
      translation_code: 'RVR1909',
      book_code: 'JHN',
      chapter: 99,
      verse: 99,
      verse_text: 'No permitido',
    })
  if (!blocked.error) throw new Error('Usuario normal pudo insertar texto biblico.')

  printOk('QA_BIBLE_DB_OK', {
    translations: translations.data.length,
    books: books.data.length,
    random: verse.reference,
    chapterVerses: chapter.data.length,
  })
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
