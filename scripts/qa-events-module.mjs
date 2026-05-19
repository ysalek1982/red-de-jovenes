import { ensureQaEnv, printOk, signInQaUser } from './qa-shared.mjs'

async function main() {
  if (!ensureQaEnv()) return
  const userA = await signInQaUser('A')
  const event = await userA.supabase
    .from('events')
    .insert({
      created_by: userA.user.id,
      title: `QA Evento ${Date.now()}`,
      description: 'Evento QA',
      modality: 'online',
      event_type: 'encuentro',
      country: 'Bolivia',
      city: 'Santa Cruz',
      starts_at: new Date(Date.now() + 86_400_000).toISOString(),
      is_active: true,
    })
    .select()
    .single()
  if (event.error) throw event.error

  const rsvp = await userA.supabase
    .from('event_rsvps')
    .upsert(
      { event_id: event.data.id, user_id: userA.user.id, status: 'going' },
      { onConflict: 'event_id,user_id' },
    )
    .select()
    .single()
  if (rsvp.error) throw rsvp.error

  const userB = await signInQaUser('B')
  const blocked = await userB.supabase
    .from('events')
    .update({ title: 'no permitido' })
    .eq('id', event.data.id)
    .select()
  if (blocked.error) throw blocked.error
  if ((blocked.data ?? []).length !== 0) throw new Error('RLS permitio editar evento ajeno.')

  printOk('QA_EVENTS_OK')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
