import { ensureQaEnv, printOk, signInQaUser } from './qa-shared.mjs'

async function main() {
  if (!ensureQaEnv()) return
  const userA = await signInQaUser('A')
  const userB = await signInQaUser('B')
  const conversationId = crypto.randomUUID()

  const conversation = await userA.supabase
    .from('conversations')
    .insert({
      id: conversationId,
      created_by: userA.user.id,
      conversation_type: 'direct',
    })
  if (conversation.error) throw conversation.error

  const members = await userA.supabase.from('conversation_members').insert([
    { conversation_id: conversationId, user_id: userA.user.id, role: 'owner' },
    { conversation_id: conversationId, user_id: userB.user.id, role: 'member' },
  ])
  if (members.error) throw members.error

  const message = await userA.supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: userA.user.id,
      body: 'Mensaje QA',
    })
    .select()
    .single()
  if (message.error) throw message.error

  const readByB = await userB.supabase
    .from('messages')
    .select('id')
    .eq('conversation_id', conversationId)
  if (readByB.error) throw readByB.error
  if (!readByB.data?.length) throw new Error('Usuario B no pudo leer conversacion donde es miembro.')

  printOk('QA_MESSAGES_OK')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
