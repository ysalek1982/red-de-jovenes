import { supabase } from '../../lib/supabase'

export interface SearchResult {
  id: string
  type: string
  title: string
  subtitle: string
  to: string
}

function matches(value: string | null | undefined, query: string) {
  return (value ?? '').toLowerCase().includes(query.toLowerCase())
}

export async function globalSearch(query: string, userId?: string) {
  const trimmed = query.trim()
  if (trimmed.length < 2) return []
  const pattern = `%${trimmed}%`

  const [posts, groups, events, devotionals, profiles, verses, tracks] =
    await Promise.all([
      supabase
        .from('posts')
        .select('id, body, verse_reference')
        .ilike('body', pattern)
        .limit(6),
      supabase
        .from('groups')
        .select('id, name, city, country, church_name')
        .eq('is_active', true)
        .limit(20),
      supabase
        .from('events')
        .select('id, title, city, country, starts_at')
        .eq('is_active', true)
        .limit(20),
      supabase
        .from('devotionals')
        .select('id, title, verse_reference')
        .eq('is_active', true)
        .limit(8),
      supabase
        .from('profiles')
        .select('id, full_name, username, city, country')
        .limit(20),
      userId
        ? supabase
            .from('bible_saved_verses')
            .select('id, reference, verse_text')
            .eq('user_id', userId)
            .limit(8)
        : Promise.resolve({ data: [], error: null }),
      supabase
        .from('discipleship_tracks')
        .select('id, title, description')
        .eq('is_active', true)
        .limit(8),
    ])

  for (const result of [posts, groups, events, devotionals, profiles, verses, tracks]) {
    if (result.error) throw result.error
  }

  const results: SearchResult[] = []

  for (const post of posts.data ?? []) {
    results.push({
      id: post.id,
      type: 'Foros',
      title: post.verse_reference || 'Publicacion',
      subtitle: post.body,
      to: '/app/foros',
    })
  }

  for (const group of groups.data ?? []) {
    if (
      [group.name, group.city, group.country, group.church_name].some((value) =>
        matches(value, trimmed),
      )
    ) {
      results.push({
        id: group.id,
        type: 'Comunidad',
        title: group.name,
        subtitle: `${group.city ?? 'Sin ciudad'}, ${group.country ?? 'Sin pais'}`,
        to: '/app/mapa',
      })
    }
  }

  for (const event of events.data ?? []) {
    if ([event.title, event.city, event.country].some((value) => matches(value, trimmed))) {
      results.push({
        id: event.id,
        type: 'Eventos',
        title: event.title,
        subtitle: event.city || event.country || 'Evento de la Red',
        to: '/app/eventos',
      })
    }
  }

  for (const devotional of devotionals.data ?? []) {
    if ([devotional.title, devotional.verse_reference].some((value) => matches(value, trimmed))) {
      results.push({
        id: devotional.id,
        type: 'Devocional',
        title: devotional.title,
        subtitle: devotional.verse_reference ?? 'Devocional diario',
        to: '/app/devocional',
      })
    }
  }

  for (const profile of profiles.data ?? []) {
    if ([profile.full_name, profile.username, profile.city, profile.country].some((value) => matches(value, trimmed))) {
      results.push({
        id: profile.id,
        type: 'Jovenes',
        title: profile.full_name || profile.username || 'Joven de la Red',
        subtitle: profile.city || profile.country || 'Perfil de la Red',
        to: '/app/perfil',
      })
    }
  }

  for (const verse of verses.data ?? []) {
    if ([verse.reference, verse.verse_text].some((value) => matches(value, trimmed))) {
      results.push({
        id: verse.id,
        type: 'Biblia',
        title: verse.reference,
        subtitle: verse.verse_text,
        to: '/app/biblia',
      })
    }
  }

  for (const track of tracks.data ?? []) {
    if ([track.title, track.description].some((value) => matches(value, trimmed))) {
      results.push({
        id: track.id,
        type: 'Discipulado',
        title: track.title,
        subtitle: track.description ?? 'Camino de crecimiento',
        to: '/app/discipulado',
      })
    }
  }

  return results.slice(0, 18)
}
