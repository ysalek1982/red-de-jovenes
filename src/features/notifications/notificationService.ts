import { supabase } from '../../lib/supabase'
import type { Notification } from '../../types/database'

export async function getMyNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('id, user_id, type, title, body, link_path, read_at, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(30)

  if (error) throw error
  return (data ?? []) as Notification[]
}

export async function createNotification(input: {
  userId: string
  type: string
  title: string
  body?: string
  linkPath?: string
}) {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: input.userId,
      type: input.type,
      title: input.title,
      body: input.body || null,
      link_path: input.linkPath || null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function markNotificationRead(input: {
  notificationId: string
  userId: string
}) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', input.notificationId)
    .eq('user_id', input.userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function markAllNotificationsRead(userId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .is('read_at', null)

  if (error) throw error
}
