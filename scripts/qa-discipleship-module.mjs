import { ensureQaEnv, printOk, signInQaUser } from './qa-shared.mjs'

async function main() {
  if (!ensureQaEnv()) return
  const userA = await signInQaUser('A')
  const tracks = await userA.supabase
    .from('discipleship_tracks')
    .select('*, discipleship_steps(*)')
    .eq('is_active', true)
    .limit(1)
  if (tracks.error) throw tracks.error
  const track = tracks.data?.[0]
  const step = track?.discipleship_steps?.[0]
  if (!track || !step) throw new Error('No hay discipulado activo para QA.')

  const progress = await userA.supabase
    .from('discipleship_progress')
    .upsert(
      { user_id: userA.user.id, track_id: track.id, step_id: step.id },
      { onConflict: 'user_id,step_id' },
    )
    .select()
    .single()
  if (progress.error) throw progress.error

  const userB = await signInQaUser('B')
  const blocked = await userB.supabase
    .from('discipleship_progress')
    .delete()
    .eq('id', progress.data.id)
    .select()
  if (blocked.error) throw blocked.error
  if ((blocked.data ?? []).length !== 0) throw new Error('RLS permitio borrar progreso ajeno.')

  printOk('QA_DISCIPLESHIP_OK')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
