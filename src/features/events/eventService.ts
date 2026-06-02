import { supabase } from '../../lib/supabase'
import type { Event as AppEvent, EventRsvp } from '../../types/database'

export type EventWithRsvps = AppEvent & {
  event_rsvps?: EventRsvp[]
  rsvpCount: number
  myRsvp: EventRsvp | null
}

function mapEvent(
  event: AppEvent,
  rsvpCount = 0,
  myRsvp: EventRsvp | null = null,
) {
  return {
    ...event,
    rsvpCount,
    myRsvp,
  } satisfies EventWithRsvps
}

export async function getUpcomingEvents(userId?: string) {
  const { data, error } = await supabase
    .from('events')
    .select(
      [
        'id',
        'group_id',
        'created_by',
        'title',
        'description',
        'event_type',
        'modality',
        'country',
        'city',
        'location_text',
        'meeting_link',
        'starts_at',
        'ends_at',
        'is_active',
        'created_at',
        'updated_at',
      ].join(', '),
    )
    .eq('is_active', true)
    .gte('starts_at', new Date(Date.now() - 86_400_000).toISOString())
    .order('starts_at', { ascending: true })
    .limit(30)

  if (error) throw error
  const events = (data ?? []) as unknown as AppEvent[]
  const eventIds = events.map((event) => event.id)
  if (!eventIds.length) return []

  const [rsvpRowsResult, myRsvpsResult] = await Promise.all([
    supabase
      .from('event_rsvps')
      .select('event_id')
      .eq('status', 'going')
      .in('event_id', eventIds)
      .limit(10_000),
    userId
      ? supabase
          .from('event_rsvps')
          .select('id, event_id, user_id, status, created_at')
          .eq('user_id', userId)
          .in('event_id', eventIds)
      : Promise.resolve({ data: [], error: null }),
  ])

  if (rsvpRowsResult.error) throw rsvpRowsResult.error
  if (myRsvpsResult.error) throw myRsvpsResult.error

  const countsByEvent = new Map<string, number>()
  for (const row of rsvpRowsResult.data ?? []) {
    countsByEvent.set(row.event_id, (countsByEvent.get(row.event_id) ?? 0) + 1)
  }

  const myRsvpsByEvent = new Map(
    ((myRsvpsResult.data ?? []) as EventRsvp[]).map((rsvp) => [
      rsvp.event_id,
      rsvp,
    ]),
  )

  return events.map((event) =>
    mapEvent(
      event,
      countsByEvent.get(event.id) ?? 0,
      myRsvpsByEvent.get(event.id) ?? null,
    ),
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
