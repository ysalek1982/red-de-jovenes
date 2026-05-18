import { supabase } from '../../lib/supabase'

export interface CreatePrayerRequestInput {
  userId: string
  title: string
  body: string
}

export async function getPublicPrayerRequests() {
  const { data, error } = await supabase
    .from('prayer_requests')
    .select('*')
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) throw error
  return data ?? []
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
