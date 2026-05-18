import { supabase } from '../../lib/supabase'

function getTodayDate() {
  return new Date().toISOString().slice(0, 10)
}

export async function getTodayDevotional() {
  const today = getTodayDate()
  const { data, error } = await supabase
    .from('devotionals')
    .select('*')
    .eq('devotional_date', today)
    .maybeSingle()

  if (error) throw error
  return data ?? getLatestDevotionalFallback()
}

export async function getLatestDevotionalFallback() {
  const today = getTodayDate()
  const { data, error } = await supabase
    .from('devotionals')
    .select('*')
    .lte('devotional_date', today)
    .order('devotional_date', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getRecentDevotionals(limit = 5) {
  const today = getTodayDate()
  const { data, error } = await supabase
    .from('devotionals')
    .select('*')
    .lte('devotional_date', today)
    .order('devotional_date', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data ?? []
}

export async function getDevotionalProgress(userId: string, devotionalId: string) {
  const [read, favorite] = await Promise.all([
    supabase
      .from('devotional_reads')
      .select('id, read_at')
      .eq('user_id', userId)
      .eq('devotional_id', devotionalId)
      .maybeSingle(),
    supabase
      .from('devotional_favorites')
      .select('id, created_at')
      .eq('user_id', userId)
      .eq('devotional_id', devotionalId)
      .maybeSingle(),
  ])

  if (read.error) throw read.error
  if (favorite.error) throw favorite.error

  return {
    isRead: Boolean(read.data),
    isFavorite: Boolean(favorite.data),
  }
}

export async function markDevotionalRead(input: {
  userId: string
  devotionalId: string
}) {
  const { data, error } = await supabase
    .from('devotional_reads')
    .upsert(
      {
        user_id: input.userId,
        devotional_id: input.devotionalId,
      },
      { onConflict: 'devotional_id,user_id' },
    )
    .select()
    .single()

  if (error) throw error
  return data
}

export async function toggleDevotionalFavorite(input: {
  userId: string
  devotionalId: string
  isFavorite: boolean
}) {
  if (input.isFavorite) {
    const { error } = await supabase
      .from('devotional_favorites')
      .delete()
      .eq('user_id', input.userId)
      .eq('devotional_id', input.devotionalId)

    if (error) throw error
    return null
  }

  const { data, error } = await supabase
    .from('devotional_favorites')
    .upsert(
      {
        user_id: input.userId,
        devotional_id: input.devotionalId,
      },
      { onConflict: 'devotional_id,user_id' },
    )
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getReadDevotionalsCount(userId: string) {
  const { count, error } = await supabase
    .from('devotional_reads')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (error) throw error
  return count ?? 0
}
