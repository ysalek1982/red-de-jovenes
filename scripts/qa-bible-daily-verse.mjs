import { ensureQaEnv, printOk, signInQaUser } from './qa-shared.mjs'

async function main() {
  if (!ensureQaEnv()) return
  const userA = await signInQaUser('A')

  const today = await userA.supabase.rpc('get_daily_bible_verse', {
    p_date: new Date().toISOString().slice(0, 10),
    p_translation_code: 'RVR1909',
  })
  if (today.error) throw today.error
  if (!today.data?.[0]?.verse_text) throw new Error('Versiculo diario no devolvio fallback ni programado.')

  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10)
  const tomorrowVerse = await userA.supabase.rpc('get_daily_bible_verse', {
    p_date: tomorrow,
    p_translation_code: 'RVR1909',
  })
  if (tomorrowVerse.error) throw tomorrowVerse.error
  if (!tomorrowVerse.data?.[0]?.verse_text) throw new Error('Fallback de versiculo diario futuro fallo.')

  printOk('QA_BIBLE_DAILY_OK', {
    today: today.data[0].reference,
    tomorrowMode: tomorrowVerse.data[0].devotional_hint ? 'SCHEDULED' : 'RANDOM_FALLBACK',
  })
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
