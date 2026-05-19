import { ensureQaEnv, printOk, signInQaUser } from './qa-shared.mjs'

async function main() {
  if (!ensureQaEnv()) return
  const userA = await signInQaUser('A')
  const feedback = await userA.supabase
    .from('feedback_suggestions')
    .insert({
      user_id: userA.user.id,
      category: 'mejora',
      title: `QA Mejora ${Date.now()}`,
      detail: 'Sugerencia QA',
    })
    .select()
    .single()
  if (feedback.error) throw feedback.error

  const ownRead = await userA.supabase
    .from('feedback_suggestions')
    .select('id')
    .eq('id', feedback.data.id)
  if (ownRead.error) throw ownRead.error
  if (!ownRead.data?.length) throw new Error('Usuario no pudo leer su sugerencia.')

  printOk('QA_BUILD_NETWORK_OK')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
