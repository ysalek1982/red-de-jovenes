import { supabase } from '../../lib/supabase'

export async function getActiveGroups() {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('is_active', true)
    .order('country', { ascending: true })
    .order('city', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function suggestGroup(input: {
  userId: string
  name: string
  country: string
  city?: string
  churchName?: string
  contactUrl?: string
  meetingInfo?: string
}) {
  const { data, error } = await supabase
    .from('group_suggestions')
    .insert({
      user_id: input.userId,
      name: input.name,
      country: input.country,
      city: input.city || null,
      church_name: input.churchName || null,
      contact_url: input.contactUrl || null,
      meeting_info: input.meetingInfo || null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}
