import { supabase } from '../../lib/supabase'
import type { PrayerRequest } from '../../types/database'

export interface CreatePrayerRequestInput {
  userId: string
  title: string
  body: string
}

export interface PrayerAuthor {
  full_name: string
  username: string | null
  city: string | null
  country: string | null
}

export type PrayerRequestWithAuthor = PrayerRequest & {
  profiles: PrayerAuthor | null
}

export async function getPublicPrayerRequests() {
  const { data, error } = await supabase
    .from('prayer_requests')
    .select(
      '*, profiles:user_id(full_name, username, city, country)',
    )
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) throw error
  return (data ?? []) as PrayerRequestWithAuthor[]
}

export async function createPrayerRequest(input: CreatePrayerRequestInput) {
  const { data, error } = await supabase
    .from('prayer_requests')
    .insert({
      user_id: input.userId,
      title: input.title,
      body: input.body,
      visibility: 'public',
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
}) {
  const { data, error } = await supabase
    .from('prayer_requests')
    .update({ is_answered: input.isAnswered ?? true })
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
