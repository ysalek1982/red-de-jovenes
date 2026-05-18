import { supabase } from '../../lib/supabase'
import type { GroupSuggestion } from '../../types/database'

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

export async function getMyGroupSuggestions(userId: string) {
  const { data, error } = await supabase
    .from('group_suggestions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as GroupSuggestion[]
}

export async function getPendingGroupSuggestionsCount() {
  const { count, error } = await supabase
    .from('group_suggestions')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending')

  if (error) throw error
  return count ?? 0
}

export async function suggestGroup(input: {
  userId: string
  name: string
  country: string
  city?: string
  churchName?: string
  contactUrl?: string
  meetingInfo?: string
  description?: string
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
      description: input.description || null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}
