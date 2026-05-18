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
