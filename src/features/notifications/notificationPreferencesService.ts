import { supabase } from '../../lib/supabase'

export interface NotificationPreferenceInput {
  userId: string
  dailyDevotional: boolean
  prayerUpdates: boolean
  communityUpdates: boolean
}

export async function getNotificationPreferences(userId: string) {
  const { data, error } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function upsertNotificationPreferences(
  input: NotificationPreferenceInput,
) {
  const { data, error } = await supabase
    .from('notification_preferences')
    .upsert(
      {
        user_id: input.userId,
        daily_devotional: input.dailyDevotional,
        prayer_updates: input.prayerUpdates,
        community_updates: input.communityUpdates,
      },
      { onConflict: 'user_id' },
    )
    .select()
    .single()

  if (error) throw error
  return data
}
