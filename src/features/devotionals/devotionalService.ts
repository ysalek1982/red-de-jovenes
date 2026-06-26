import { supabase } from '../../lib/supabase'

function getTodayDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const DEFAULT_OFFLINE_DEVOTIONAL = {
  id: 'offline-default-devotional',
  title: 'Caminar con propósito',
  verse_reference: 'Proverbios 16:9',
  verse_text: 'El corazón del hombre piensa su camino; mas Jehová endereza sus pasos.',
  reflection: 'En el día a día, es fácil llenarnos de planes y metas. Sin embargo, la verdadera paz proviene de entregarle el timón de nuestra vida a Dios. Cuando permitimos que Él guíe nuestros pasos, incluso en la incertidumbre, podemos confiar en que nos llevará a un buen puerto. Hoy, haz una pausa y pregúntate: ¿Estoy confiando en mis propias fuerzas o permitiendo que Dios enderece mis pasos?',
  action_step: 'Haz una lista de tus tres mayores preocupaciones para esta semana y ora entregándoselas a Dios.',
  devotional_date: getTodayDate(),
  is_active: true,
  created_at: new Date().toISOString(),
  created_by: null,
  prayer: 'Señor, guíanos en cada paso y ayúdanos a confiar en tu voluntad.',
  updated_at: new Date().toISOString()
}

export async function getTodayDevotional() {
  try {
    const today = getTodayDate()
    const { data, error } = await supabase
      .from('devotionals')
      .select('*')
      .eq('devotional_date', today)
      .eq('is_active', true)
      .maybeSingle()

    if (error) throw error
    return data ?? getLatestDevotionalFallback()
  } catch (err) {
    console.warn('Error en getTodayDevotional (usando fallback offline):', err)
    return DEFAULT_OFFLINE_DEVOTIONAL
  }
}

export async function getLatestDevotionalFallback() {
  try {
    const today = getTodayDate()
    const { data, error } = await supabase
      .from('devotionals')
      .select('*')
      .lte('devotional_date', today)
      .eq('is_active', true)
      .order('devotional_date', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) throw error
    return data ?? DEFAULT_OFFLINE_DEVOTIONAL
  } catch (err) {
    console.warn('Error en getLatestDevotionalFallback (usando fallback offline):', err)
    return DEFAULT_OFFLINE_DEVOTIONAL
  }
}

export async function getRecentDevotionals(limit = 5) {
  const today = getTodayDate()
  const { data, error } = await supabase
    .from('devotionals')
    .select('*')
    .lte('devotional_date', today)
    .eq('is_active', true)
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

export async function getFavoriteDevotionals(userId: string, limit = 5) {
  const { data: favorites, error: favoriteError } = await supabase
    .from('devotional_favorites')
    .select('devotional_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (favoriteError) throw favoriteError

  const ids = (favorites ?? []).map((favorite) => favorite.devotional_id)
  if (!ids.length) return []

  const { data, error } = await supabase
    .from('devotionals')
    .select('*')
    .in('id', ids)
    .eq('is_active', true)

  if (error) throw error

  const devotionalsById = new Map((data ?? []).map((item) => [item.id, item]))
  return ids.flatMap((id) => {
    const devotional = devotionalsById.get(id)
    return devotional ? [devotional] : []
  })
}

export async function getFavoriteDevotionalsCount(userId: string) {
  const { count, error } = await supabase
    .from('devotional_favorites')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (error) throw error
  return count ?? 0
}
