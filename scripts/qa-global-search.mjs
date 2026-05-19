import { ensureQaEnv, printOk, signInQaUser } from './qa-shared.mjs'

async function main() {
  if (!ensureQaEnv()) return
  const userA = await signInQaUser('A')
  const [posts, groups, events, tracks] = await Promise.all([
    userA.supabase.from('posts').select('id').limit(1),
    userA.supabase.from('groups').select('id').eq('is_active', true).limit(1),
    userA.supabase.from('events').select('id').eq('is_active', true).limit(1),
    userA.supabase.from('discipleship_tracks').select('id').eq('is_active', true).limit(1),
  ])
  for (const result of [posts, groups, events, tracks]) {
    if (result.error) throw result.error
  }
  printOk('QA_SEARCH_OK', {
    checked: ['posts', 'groups', 'events', 'discipleship_tracks'],
  })
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
