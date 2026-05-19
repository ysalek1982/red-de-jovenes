import { ensureQaEnv, printOk, signInQaUser } from './qa-shared.mjs'

async function main() {
  if (!ensureQaEnv()) return
  const userA = await signInQaUser('A')
  const reference = `QA Biblia ${Date.now()}`

  const saved = await userA.supabase
    .from('bible_saved_verses')
    .upsert(
      {
        user_id: userA.user.id,
        reference,
        verse_text: 'Todo lo puedo en Cristo que me fortalece.',
        note: 'QA',
      },
      { onConflict: 'user_id,reference' },
    )
    .select()
    .single()
  if (saved.error) throw saved.error

  const progress = await userA.supabase
    .from('bible_reading_progress')
    .upsert(
      { user_id: userA.user.id, plan_key: 'qa-plan', day_number: 1 },
      { onConflict: 'user_id,plan_key,day_number' },
    )
    .select()
    .single()
  if (progress.error) throw progress.error

  const highlight = await userA.supabase
    .from('bible_highlights')
    .insert({
      user_id: userA.user.id,
      reference,
      highlight_text: 'Fragmento QA',
    })
    .select()
    .single()
  if (highlight.error) throw highlight.error

  const userB = await signInQaUser('B')
  const blocked = await userB.supabase
    .from('bible_saved_verses')
    .update({ note: 'no permitido' })
    .eq('id', saved.data.id)
    .select()
  if (blocked.error) throw blocked.error
  if ((blocked.data ?? []).length !== 0) throw new Error('RLS permitio editar Biblia ajena.')

  printOk('QA_BIBLE_OK')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
