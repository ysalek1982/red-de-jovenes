import { supabase } from '../../lib/supabase'
import type { Event as AppEvent, EventRsvp } from '../../types/database'

export type EventWithRsvps = AppEvent & {
  event_rsvps?: EventRsvp[]
  rsvpCount: number
  myRsvp: EventRsvp | null
}

function mapEvent(event: AppEvent & { event_rsvps?: EventRsvp[] }, userId?: string) {
  const rsvps = event.event_rsvps ?? []
  return {
    ...event,
    rsvpCount: rsvps.length,
    myRsvp: userId ? rsvps.find((rsvp) => rsvp.user_id === userId) ?? null : null,
  } satisfies EventWithRsvps
}

export async function getUpcomingEvents(userId?: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*, event_rsvps(*)')
    .eq('is_active', true)
    .gte('starts_at', new Date(Date.now() - 86_400_000).toISOString())
    .order('starts_at', { ascending: true })
    .limit(30)

  if (error) throw error
  return ((data ?? []) as Array<AppEvent & { event_rsvps?: EventRsvp[] }>).map(
    (event) => mapEvent(event, userId),
  )
}

export async function createEvent(input: {
  userId: string
  title: string
  description?: string
  eventType?: string
  modality?: string
  country?: string
  city?: string
  locationText?: string
  meetingLink?: string
  startsAt: string
  endsAt?: string
  groupId?: string | null
}) {
  const { data, error } = await supabase
    .from('events')
    .insert({
      created_by: input.userId,
      group_id: input.groupId ?? null,
      title: input.title,
      description: input.description || null,
      event_type: input.eventType || 'encuentro',
      modality: input.modality || 'presencial',
      country: input.country || null,
      city: input.city || null,
      location_text: input.locationText || null,
      meeting_link: input.meetingLink || null,
      starts_at: input.startsAt,
      ends_at: input.endsAt || null,
      is_active: true,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateEvent(input: {
  eventId: string
  title: string
  description?: string
  startsAt: string
  isActive: boolean
}) {
  const { data, error } = await supabase
    .from('events')
    .update({
      title: input.title,
      description: input.description || null,
      starts_at: input.startsAt,
      is_active: input.isActive,
    })
    .eq('id', input.eventId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function setEventRsvp(input: {
  eventId: string
  userId: string
  status: 'going' | 'interested'
}) {
  const { data, error } = await supabase
    .from('event_rsvps')
    .upsert(
      {
        event_id: input.eventId,
        user_id: input.userId,
        status: input.status,
      },
      { onConflict: 'event_id,user_id' },
    )
    .select()
    .single()

  if (error) throw error
  return data
}

export async function cancelEventRsvp(input: { eventId: string; userId: string }) {
  const { error } = await supabase
    .from('event_rsvps')
    .delete()
    .eq('event_id', input.eventId)
    .eq('user_id', input.userId)

  if (error) throw error
}
