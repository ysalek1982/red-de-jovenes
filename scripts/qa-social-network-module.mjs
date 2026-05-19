import { ensureQaEnv, printOk, signInQaUser } from './qa-shared.mjs'

async function main() {
  if (!ensureQaEnv()) return
  const userA = await signInQaUser('A')
  const userB = await signInQaUser('B')

  const cleanup = await userA.supabase
    .from('user_follows')
    .delete()
    .eq('follower_id', userA.user.id)
    .eq('following_id', userB.user.id)
  if (cleanup.error) throw cleanup.error

  const follow = await userA.supabase
    .from('user_follows')
    .insert({ follower_id: userA.user.id, following_id: userB.user.id })
    .select()
    .single()
  if (follow.error) throw follow.error

  const blocked = await userB.supabase
    .from('user_follows')
    .delete()
    .eq('id', follow.data.id)
    .select()
  if (blocked.error) throw blocked.error
  if ((blocked.data ?? []).length !== 0) throw new Error('RLS permitio borrar seguimiento ajeno.')

  printOk('QA_SOCIAL_OK')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
