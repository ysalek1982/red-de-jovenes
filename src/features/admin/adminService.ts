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
  | 'post_comments'
  | 'devotionals'
  | 'content_reports'
  | 'group_suggestions'
  | 'testimonies'
  | 'events'
  | 'discipleship_tracks'
  | 'feedback_suggestions'
  | 'message_reports'
  | 'notifications'

async function getCount(table: CountableTable) {
  const { count, error } = await supabase
    .from(table)
    .select('id', { count: 'exact', head: true })

  if (error) throw error
  return count ?? 0
}

async function getFilteredCount(
  table: CountableTable,
  column: string,
  value: string | boolean,
) {
  const { count, error } = await supabase
    .from(table)
    .select('id', { count: 'exact', head: true })
    .eq(column, value)

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
  | 'id'
  | 'title'
  | 'devotional_date'
  | 'verse_reference'
  | 'verse_text'
  | 'reflection'
  | 'prayer'
  | 'is_active'
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
    comments,
    devotionals,
    reports,
    groupSuggestions,
    testimonies,
    events,
    discipleshipTracks,
    feedbackSuggestions,
    messageReports,
    notifications,
  ] = await Promise.all([
    getCount('profiles'),
    getCount('prayer_requests'),
    getCount('posts'),
    getCount('post_comments'),
    getCount('devotionals'),
    getFilteredCount('content_reports', 'status', 'pending'),
    getFilteredCount('group_suggestions', 'status', 'pending'),
    getCount('testimonies'),
    getCount('events'),
    getCount('discipleship_tracks'),
    getFilteredCount('feedback_suggestions', 'status', 'pending'),
    getFilteredCount('message_reports', 'status', 'pending'),
    getCount('notifications'),
  ])

  return {
    profiles,
    prayers,
    posts,
    comments,
    devotionals,
    reports,
    groupSuggestions,
    testimonies,
    events,
    discipleshipTracks,
    feedbackSuggestions,
    messageReports,
    notifications,
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
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('group_suggestions')
        .select('*')
        .eq('status', 'pending')
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
        .select(
          'id, title, devotional_date, verse_reference, verse_text, reflection, prayer, is_active',
        )
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
  userId: string
  title: string
  verseReference: string
  verseText: string
  reflection: string
  prayer?: string
  devotionalDate: string
  isActive: boolean
}) {
  const { data, error } = await supabase
    .from('devotionals')
    .insert({
      title: input.title,
      verse_reference: input.verseReference,
      verse_text: input.verseText,
      reflection: input.reflection,
      prayer: input.prayer || null,
      devotional_date: input.devotionalDate,
      is_active: input.isActive,
      created_by: input.userId,
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
  prayer?: string
  devotionalDate: string
  isActive: boolean
}) {
  const { data, error } = await supabase
    .from('devotionals')
    .update({
      title: input.title,
      verse_reference: input.verseReference,
      verse_text: input.verseText,
      reflection: input.reflection,
      prayer: input.prayer || null,
      devotional_date: input.devotionalDate,
      is_active: input.isActive,
    })
    .eq('id', input.devotionalId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateReportStatus(
  reportId: string,
  status: 'pending' | 'reviewed' | 'dismissed' | 'action_taken',
  internalNote?: string,
) {
  const { data, error } = await supabase
    .from('content_reports')
    .update({ status, internal_note: internalNote || null })
    .eq('id', reportId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateGroupSuggestionStatus(
  suggestionId: string,
  status: 'pending' | 'approved' | 'rejected',
  internalNote?: string,
) {
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) throw userError

  const { data: suggestion, error: readError } = await supabase
    .from('group_suggestions')
    .select('*')
    .eq('id', suggestionId)
    .single()

  if (readError) throw readError

  const { data, error } = await supabase
    .from('group_suggestions')
    .update({
      status,
      internal_note: internalNote || null,
      reviewed_by: userData.user?.id ?? null,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', suggestionId)
    .select()
    .single()

  if (error) throw error

  if (status === 'approved') {
    const { data: existingGroups, error: existingError } = await supabase
      .from('groups')
      .select('id, name, country, city')
      .eq('name', suggestion.name)
      .eq('country', suggestion.country)
      .limit(10)

    if (existingError) throw existingError

    const normalizedCity = (suggestion.city ?? '').trim().toLowerCase()
    const duplicatedGroup = (existingGroups ?? []).find(
      (group) => (group.city ?? '').trim().toLowerCase() === normalizedCity,
    )

    const groupPayload = {
      name: suggestion.name,
      country: suggestion.country,
      city: suggestion.city,
      church_name: suggestion.church_name,
      contact_url: suggestion.contact_url,
      meeting_info: suggestion.meeting_info || 'Comunidad sugerida y aprobada.',
      description:
        suggestion.description ||
        'Comunidad aprobada desde sugerencias del piloto.',
      modality: suggestion.modality,
      created_from_suggestion_id: suggestion.id,
      is_active: true,
    }

    const { error: groupError } = duplicatedGroup
      ? await supabase
          .from('groups')
          .update(groupPayload)
          .eq('id', duplicatedGroup.id)
      : await supabase.from('groups').insert(groupPayload)

    if (groupError) throw groupError
  }

  return data
}
