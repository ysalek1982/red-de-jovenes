import { supabase } from '../../lib/supabase'
import type { FeedbackSuggestion, GroupSuggestion } from '../../types/database'
import { getMyGroupSuggestions } from '../map/worldMapService'

export async function createFeedbackSuggestion(input: {
  userId: string
  category: string
  title: string
  detail?: string
}) {
  const { data, error } = await supabase
    .from('feedback_suggestions')
    .insert({
      user_id: input.userId,
      category: input.category,
      title: input.title,
      detail: input.detail || null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getMyFeedbackSuggestions(userId: string) {
  const { data, error } = await supabase
    .from('feedback_suggestions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as FeedbackSuggestion[]
}

export async function getMyNetworkSuggestions(userId: string): Promise<{
  groups: GroupSuggestion[]
  feedback: FeedbackSuggestion[]
}> {
  const [groups, feedback] = await Promise.all([
    getMyGroupSuggestions(userId),
    getMyFeedbackSuggestions(userId),
  ])
  return { groups, feedback }
}
