import { ensureQaEnv, printOk, signInQaUser } from './qa-shared.mjs'

async function main() {
  if (!ensureQaEnv()) return
  const userA = await signInQaUser('A')
  const notification = await userA.supabase
    .from('notifications')
    .insert({
      user_id: userA.user.id,
      type: 'qa',
      title: `QA Notificacion ${Date.now()}`,
      body: 'Notificacion interna QA',
      link_path: '/app',
    })
    .select()
    .single()
  if (notification.error) throw notification.error

  const marked = await userA.supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', notification.data.id)
    .eq('user_id', userA.user.id)
    .select()
    .single()
  if (marked.error) throw marked.error

  printOk('QA_NOTIFICATIONS_OK')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
