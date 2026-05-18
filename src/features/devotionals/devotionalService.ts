import { supabase } from '../../lib/supabase'

export async function getTodayDevotional() {
  const today = new Date().toISOString().slice(0, 10)
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
