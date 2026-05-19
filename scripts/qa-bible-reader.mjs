import { ensureQaEnv, printOk, signInQaUser } from './qa-shared.mjs'

async function main() {
  if (!ensureQaEnv()) return
  const userA = await signInQaUser('A')
  const userB = await signInQaUser('B')

  const random = await userA.supabase.rpc('get_random_bible_verse', {
    p_translation_code: 'RVR1909',
    p_testament: null,
    p_book_code: null,
  })
  if (random.error) throw random.error
  const verse = random.data?.[0]
  if (!verse) throw new Error('No hay versiculo base para probar lector.')

  const chapter = await userA.supabase.rpc('get_bible_chapter', {
    p_translation_code: verse.translation_code,
    p_book_code: verse.book_code,
    p_chapter: verse.chapter,
  })
  if (chapter.error) throw chapter.error
  if (!chapter.data?.length) throw new Error('Capitulo existente no devolvio versiculos.')

  const missing = await userA.supabase.rpc('get_bible_chapter', {
    p_translation_code: verse.translation_code,
    p_book_code: verse.book_code,
    p_chapter: 999,
  })
  if (missing.error) throw missing.error
  if (missing.data?.length) throw new Error('Capitulo inexistente devolvio contenido.')

  const saved = await userA.supabase
    .from('bible_saved_verses')
    .upsert(
      {
        user_id: userA.user.id,
        reference: `QA Reader ${verse.reference}`,
        verse_text: verse.verse_text,
      },
      { onConflict: 'user_id,reference' },
    )
    .select()
    .single()
  if (saved.error) throw saved.error

  const plans = await userA.supabase
    .from('bible_reading_plans')
    .select('id, bible_reading_plan_days(id)')
    .eq('is_active', true)
    .limit(1)
    .single()
  if (plans.error) throw plans.error
  const day = plans.data.bible_reading_plan_days?.[0]
  if (!day) throw new Error('No hay dias de planes biblicos para progreso.')

  const progress = await userA.supabase
    .from('bible_plan_progress')
    .upsert(
      {
        user_id: userA.user.id,
        plan_id: plans.data.id,
        day_id: day.id,
        note: 'QA lector biblico',
      },
      { onConflict: 'user_id,day_id' },
    )
    .select()
    .single()
  if (progress.error) throw progress.error

  const blocked = await userB.supabase.from('bible_plan_progress').insert({
    user_id: userA.user.id,
    plan_id: plans.data.id,
    day_id: day.id,
    note: 'No permitido',
  })
  if (!blocked.error) throw new Error('Usuario B pudo escribir progreso de Usuario A.')

  printOk('QA_BIBLE_READER_OK', {
    chapter: `${verse.book_code} ${verse.chapter}`,
    chapterVerses: chapter.data.length,
    missingChapter: 'EMPTY_OK',
    progress: 'OWN_ONLY',
  })
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
