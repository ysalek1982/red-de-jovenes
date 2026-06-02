import { supabase } from '../../lib/supabase'
import type { PrayerRequest } from '../../types/database'

export interface CreatePrayerRequestInput {
  userId: string
  title: string
  body: string
  category: string
  isAnonymous: boolean
  groupId?: string | null
}

export interface PrayerAuthor {
  full_name: string
  username: string | null
  city: string | null
  country: string | null
}

export interface PrayerGroup {
  id: string
  name: string
  city: string | null
  country: string | null
}

export type PrayerRequestWithAuthor = PrayerRequest & {
  profiles: PrayerAuthor | null
  groups: PrayerGroup | null
  supportsCount: number
  supportedByMe: boolean
}

function mapPrayerRequest(
  prayer: PrayerRequest & {
    groups: PrayerGroup | null
  },
  profilesById: Map<string, PrayerAuthor>,
  supportCounts: Map<string, number>,
  supportedPrayerIds: Set<string>,
  userId?: string,
): PrayerRequestWithAuthor {
  const isAnonymousForViewer = prayer.is_anonymous && prayer.user_id !== userId

  return {
    ...prayer,
    user_id: isAnonymousForViewer ? null : prayer.user_id,
    profiles: prayer.is_anonymous
      ? null
      : profilesById.get(prayer.user_id ?? '') ?? null,
    supportsCount: supportCounts.get(prayer.id) ?? 0,
    supportedByMe: supportedPrayerIds.has(prayer.id),
  }
}

export async function getPublicPrayerRequests(userId?: string) {
  const { data, error } = await supabase
    .from('prayer_requests')
    .select('*, groups:group_id(id, name, city, country)')
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) throw error

  const prayers = (data ?? []) as Array<
    PrayerRequest & {
      groups: PrayerGroup | null
    }
  >
  const prayerIds = prayers.map((prayer) => prayer.id)
  const visibleAuthorIds = Array.from(
    new Set(
      prayers
        .filter((prayer) => !prayer.is_anonymous && prayer.user_id)
        .map((prayer) => prayer.user_id as string),
    ),
  )

  const profilesById = new Map<string, PrayerAuthor>()
  if (visibleAuthorIds.length) {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, username, city, country')
      .in('id', visibleAuthorIds)

    if (profilesError) throw profilesError

    ;(profiles ?? []).forEach((profile) => {
      profilesById.set(profile.id, {
        full_name: profile.full_name || 'Joven de la Red',
        username: profile.username,
        city: profile.city,
        country: profile.country,
      })
    })
  }

  const supportCounts = new Map<string, number>()
  const supportedPrayerIds = new Set<string>()
  if (prayerIds.length) {
    const { data: supports, error: supportsError } = await supabase
      .from('prayer_supports')
      .select('prayer_request_id')
      .in('prayer_request_id', prayerIds)
      .limit(10000)

    if (supportsError) throw supportsError

    ;(supports ?? []).forEach((support) => {
      if (!support.prayer_request_id) return
      supportCounts.set(
        support.prayer_request_id,
        (supportCounts.get(support.prayer_request_id) ?? 0) + 1,
      )
    })

    if (userId) {
      const { data: ownSupports, error: ownSupportsError } = await supabase
        .from('prayer_supports')
        .select('prayer_request_id')
        .eq('user_id', userId)
        .in('prayer_request_id', prayerIds)

      if (ownSupportsError) throw ownSupportsError

      ;(ownSupports ?? []).forEach((support) => {
        if (support.prayer_request_id) supportedPrayerIds.add(support.prayer_request_id)
      })
    }
  }

  return prayers.map((prayer) =>
    mapPrayerRequest(prayer, profilesById, supportCounts, supportedPrayerIds, userId),
  )
}

export async function createPrayerRequest(input: CreatePrayerRequestInput) {
  const { data, error } = await supabase
    .from('prayer_requests')
    .insert({
      user_id: input.userId,
      title: input.title,
      body: input.body,
      visibility: 'public',
      category: input.category,
      is_anonymous: input.isAnonymous,
      group_id: input.groupId || null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function markPrayerRequestAnswered(input: {
  prayerId: string
  userId: string
  isAnswered?: boolean
  answeredTestimony?: string
}) {
  const { data, error } = await supabase
    .from('prayer_requests')
    .update({
      is_answered: input.isAnswered ?? true,
      answered_testimony: input.answeredTestimony || null,
      answered_at: input.isAnswered === false ? null : new Date().toISOString(),
    })
    .eq('id', input.prayerId)
    .eq('user_id', input.userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteOwnPrayerRequest(input: {
  prayerId: string
  userId: string
}) {
  const { data, error } = await supabase
    .from('prayer_requests')
    .delete()
    .eq('id', input.prayerId)
    .eq('user_id', input.userId)
    .select('id')

  if (error) throw error
  if (!data?.length) throw new Error('PRAYER_REQUEST_NOT_FOUND')
}

export async function supportPrayer(input: { prayerId: string; userId: string }) {
  const { data, error } = await supabase
    .from('prayer_supports')
    .upsert(
      {
        prayer_request_id: input.prayerId,
        user_id: input.userId,
      },
      { onConflict: 'prayer_request_id,user_id' },
    )
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removePrayerSupport(input: {
  prayerId: string
  userId: string
}) {
  const { error } = await supabase
    .from('prayer_supports')
    .delete()
    .eq('prayer_request_id', input.prayerId)
    .eq('user_id', input.userId)

  if (error) throw error
}
