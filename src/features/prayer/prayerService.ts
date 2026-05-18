import { supabase } from '../../lib/supabase'
import type { PrayerRequest } from '../../types/database'

export interface CreatePrayerRequestInput {
  userId: string
  title: string
  body: string
  category: string
  isAnonymous: boolean
}

export interface PrayerAuthor {
  full_name: string
  username: string | null
  city: string | null
  country: string | null
}

export type PrayerRequestWithAuthor = PrayerRequest & {
  profiles: PrayerAuthor | null
  prayer_supports?: Array<{ id: string; user_id: string }>
  supportsCount: number
  supportedByMe: boolean
}

function mapPrayerRequest(
  prayer: PrayerRequest & {
    profiles: PrayerAuthor | null
    prayer_supports?: Array<{ id: string; user_id: string }>
  },
  userId?: string,
): PrayerRequestWithAuthor {
  const supports = prayer.prayer_supports ?? []
  return {
    ...prayer,
    supportsCount: supports.length,
    supportedByMe: Boolean(userId && supports.some((item) => item.user_id === userId)),
  }
}

export async function getPublicPrayerRequests(userId?: string) {
  const { data, error } = await supabase
    .from('prayer_requests')
    .select(
      '*, profiles:user_id(full_name, username, city, country), prayer_supports(id, user_id)',
    )
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) throw error
  return ((data ?? []) as Array<
    PrayerRequest & {
      profiles: PrayerAuthor | null
      prayer_supports?: Array<{ id: string; user_id: string }>
    }
  >).map((prayer) => mapPrayerRequest(prayer, userId))
}

export async function createPrayerRequest(input: CreatePrayerRequestInput) {
  const { data, error } = await supabase
    .from('prayer_requests')
    .insert({
      user_id: input.userId,
      title: input.title,
      body: input.body,
      visibility: 'public',
      category: input.category,
      is_anonymous: input.isAnonymous,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function markPrayerRequestAnswered(input: {
  prayerId: string
  userId: string
  isAnswered?: boolean
  answeredTestimony?: string
}) {
  const { data, error } = await supabase
    .from('prayer_requests')
    .update({
      is_answered: input.isAnswered ?? true,
      answered_testimony: input.answeredTestimony || null,
      answered_at: input.isAnswered === false ? null : new Date().toISOString(),
    })
    .eq('id', input.prayerId)
    .eq('user_id', input.userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteOwnPrayerRequest(input: {
  prayerId: string
  userId: string
}) {
  const { error } = await supabase
    .from('prayer_requests')
    .delete()
    .eq('id', input.prayerId)
    .eq('user_id', input.userId)

  if (error) throw error
}

export async function supportPrayer(input: { prayerId: string; userId: string }) {
  const { data, error } = await supabase
    .from('prayer_supports')
    .upsert(
      {
        prayer_request_id: input.prayerId,
        user_id: input.userId,
      },
      { onConflict: 'prayer_request_id,user_id' },
    )
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removePrayerSupport(input: {
  prayerId: string
  userId: string
}) {
  const { error } = await supabase
    .from('prayer_supports')
    .delete()
    .eq('prayer_request_id', input.prayerId)
    .eq('user_id', input.userId)

  if (error) throw error
}
