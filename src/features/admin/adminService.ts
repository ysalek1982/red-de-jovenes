import { supabase } from '../../lib/supabase'
import type {
  ContentReport,
  Devotional,
  GroupSuggestion,
  Post,
  PrayerRequest,
  Profile,
} from '../../types/database'

type CountableTable =
  | 'profiles'
  | 'prayer_requests'
  | 'posts'
  | 'devotionals'
  | 'content_reports'
  | 'group_suggestions'
  | 'testimonies'

async function getCount(table: CountableTable) {
  const { count, error } = await supabase
    .from(table)
    .select('id', { count: 'exact', head: true })

  if (error) throw error
  return count ?? 0
}

export type AdminProfilePreview = Pick<
  Profile,
  'id' | 'full_name' | 'username' | 'city' | 'country' | 'created_at'
>

export type AdminReportPreview = ContentReport
export type AdminSuggestionPreview = GroupSuggestion
export type AdminDevotionalPreview = Pick<
  Devotional,
  'id' | 'title' | 'devotional_date' | 'verse_reference'
>

export type AdminPostPreview = Pick<
  Post,
  'id' | 'body' | 'verse_reference' | 'created_at'
> & {
  profiles: { full_name: string | null } | null
}

export type AdminPrayerPreview = Pick<
  PrayerRequest,
  'id' | 'title' | 'is_answered' | 'created_at'
> & {
  profiles: { full_name: string | null } | null
}

export async function getAdminOverview() {
  const [
    profiles,
    prayers,
    posts,
    devotionals,
    reports,
    groupSuggestions,
    testimonies,
  ] = await Promise.all([
    getCount('profiles'),
    getCount('prayer_requests'),
    getCount('posts'),
    getCount('devotionals'),
    getCount('content_reports'),
    getCount('group_suggestions'),
    getCount('testimonies'),
  ])

  return {
    profiles,
    prayers,
    posts,
    devotionals,
    reports,
    groupSuggestions,
    testimonies,
  }
}

export async function getAdminLatestItems() {
  const [profiles, reports, suggestions, posts, prayers, devotionals] =
    await Promise.all([
      supabase
        .from('profiles')
        .select('id, full_name, username, city, country, created_at')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('content_reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('group_suggestions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('posts')
        .select('id, body, verse_reference, created_at, profiles:user_id(full_name)')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('prayer_requests')
        .select('id, title, is_answered, created_at, profiles:user_id(full_name)')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('devotionals')
        .select('id, title, devotional_date, verse_reference')
        .order('devotional_date', { ascending: false })
        .limit(5),
    ])

  for (const result of [profiles, reports, suggestions, posts, prayers, devotionals]) {
    if (result.error) throw result.error
  }

  return {
    profiles: (profiles.data ?? []) as AdminProfilePreview[],
    reports: (reports.data ?? []) as AdminReportPreview[],
    suggestions: (suggestions.data ?? []) as AdminSuggestionPreview[],
    posts: (posts.data ?? []) as AdminPostPreview[],
    prayers: (prayers.data ?? []) as AdminPrayerPreview[],
    devotionals: (devotionals.data ?? []) as AdminDevotionalPreview[],
  }
}

export async function createDevotional(input: {
  title: string
  verseReference: string
  verseText: string
  reflection: string
  devotionalDate: string
}) {
  const { data, error } = await supabase
    .from('devotionals')
    .insert({
      title: input.title,
      verse_reference: input.verseReference,
      verse_text: input.verseText,
      reflection: input.reflection,
      devotional_date: input.devotionalDate,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateDevotional(input: {
  devotionalId: string
  title: string
  verseReference: string
  verseText: string
  reflection: string
  devotionalDate: string
}) {
  const { data, error } = await supabase
    .from('devotionals')
    .update({
      title: input.title,
      verse_reference: input.verseReference,
      verse_text: input.verseText,
      reflection: input.reflection,
      devotional_date: input.devotionalDate,
    })
    .eq('id', input.devotionalId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateReportStatus(
  reportId: string,
  status: 'pending' | 'reviewed' | 'dismissed',
) {
  const { data, error } = await supabase
    .from('content_reports')
    .update({ status })
    .eq('id', reportId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateGroupSuggestionStatus(
  suggestionId: string,
  status: 'pending' | 'approved' | 'rejected',
) {
  const { data, error } = await supabase
    .from('group_suggestions')
    .update({ status })
    .eq('id', suggestionId)
    .select()
    .single()

  if (error) throw error
  return data
}
