import { ensureQaEnv, printOk, signInQaUser } from './qa-shared.mjs'

async function main() {
  if (!ensureQaEnv()) return
  const userA = await signInQaUser('A')
  const userB = await signInQaUser('B')

  const plans = await userA.supabase
    .from('bible_reading_plans')
    .select('id, plan_key, title, duration_days, is_active, bible_reading_plan_days(id, day_number, reading_reference)')
    .eq('is_active', true)
  if (plans.error) throw plans.error
  if ((plans.data ?? []).length < 5) throw new Error('Faltan planes biblicos iniciales.')

  const firstPlan = plans.data[0]
  const firstDay = firstPlan.bible_reading_plan_days?.[0]
  if (!firstDay) throw new Error('El primer plan no tiene dias.')

  const progress = await userA.supabase
    .from('bible_plan_progress')
    .upsert(
      {
        user_id: userA.user.id,
        plan_id: firstPlan.id,
        day_id: firstDay.id,
        note: 'QA plan biblico',
      },
      { onConflict: 'user_id,day_id' },
    )
    .select()
    .single()
  if (progress.error) throw progress.error

  const ownProgress = await userA.supabase
    .from('bible_plan_progress')
    .select('id')
    .eq('user_id', userA.user.id)
  if (ownProgress.error) throw ownProgress.error
  if (!ownProgress.data?.length) throw new Error('Usuario no puede leer su propio progreso.')

  const blocked = await userB.supabase.from('bible_plan_progress').insert({
    user_id: userA.user.id,
    plan_id: firstPlan.id,
    day_id: firstDay.id,
    note: 'No permitido',
  })
  if (!blocked.error) throw new Error('Usuario B pudo escribir progreso ajeno.')

  printOk('QA_BIBLE_PLANS_OK', {
    plans: plans.data.length,
    firstPlan: firstPlan.plan_key,
    progress: 'OWN_ONLY',
  })
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
