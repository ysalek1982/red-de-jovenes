import { supabase } from '../../lib/supabase'

type PilotMetricTable =
  | 'profiles'
  | 'posts'
  | 'post_comments'
  | 'post_reactions'
  | 'prayer_requests'
  | 'prayer_supports'
  | 'group_suggestions'
  | 'groups'
  | 'group_members'
  | 'bible_saved_verses'
  | 'bible_reading_progress'
  | 'game_scores'
  | 'events'
  | 'event_rsvps'
  | 'conversations'
  | 'messages'
  | 'message_reports'
  | 'ai_action_logs'
  | 'ai_cost_events'
  | 'content_reports'
  | 'pilot_feedback'
  | 'pilot_incidents'

async function countRows(table: PilotMetricTable) {
  const { count, error } = await supabase
    .from(table)
    .select('id', { count: 'exact', head: true })

  if (error) throw error
  return count ?? 0
}

async function countFiltered(
  table: PilotMetricTable,
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

async function countRowsSince(table: PilotMetricTable, since: string) {
  const { count, error } = await supabase
    .from(table)
    .select('id', { count: 'exact', head: true })
    .gte('created_at', since)

  if (error) throw error
  return count ?? 0
}

async function countFilteredSince(
  table: PilotMetricTable,
  column: string,
  value: string | boolean,
  since: string,
) {
  const { count, error } = await supabase
    .from(table)
    .select('id', { count: 'exact', head: true })
    .eq(column, value)
    .gte('created_at', since)

  if (error) throw error
  return count ?? 0
}

async function getUserIdsSince(
  table: PilotMetricTable,
  column: string,
  since: string,
) {
  const { data, error } = await supabase
    .from(table)
    .select(column)
    .gte('created_at', since)
    .limit(1000)

  if (error) throw error
  return (data ?? [])
    .map((row) => (row as unknown as Record<string, string | null>)[column])
    .filter(Boolean) as string[]
}

async function countIncompleteProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, username, city, country, church_name, bio')
    .limit(1000)

  if (error) throw error

  return (data ?? []).filter(
    (profile) =>
      !profile.full_name?.trim() ||
      !profile.username?.trim() ||
      !profile.city?.trim() ||
      !profile.country?.trim() ||
      !profile.church_name?.trim() ||
      !profile.bio?.trim(),
  ).length
}

export async function getPilotMetrics() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayIso = today.toISOString()

  const [
    users,
    posts,
    comments,
    reactions,
    prayers,
    prayerSupports,
    groupSuggestions,
    approvedGroups,
    groupMembers,
    savedVerses,
    bibleReads,
    gameScores,
    events,
    rsvps,
    conversations,
    messages,
    messageReports,
    aiActions,
    aiCostEvents,
    reportsPending,
    reportsResolved,
    feedbackNew,
    feedbackTotal,
    incidentsOpen,
    incidentsCritical,
    newRegistrations,
    incompleteProfiles,
    postsToday,
    commentsToday,
    prayersToday,
    prayerSupportsToday,
    gamesToday,
    messagesToday,
    eventsRsvpsToday,
    groupMembersToday,
    aiUsageToday,
    aiErrorsToday,
    aiLimitReachedToday,
  ] = await Promise.all([
    countRows('profiles'),
    countRows('posts'),
    countRows('post_comments'),
    countRows('post_reactions'),
    countRows('prayer_requests'),
    countRows('prayer_supports'),
    countRows('group_suggestions'),
    countFiltered('groups', 'is_active', true),
    countRows('group_members'),
    countRows('bible_saved_verses'),
    countRows('bible_reading_progress'),
    countRows('game_scores'),
    countFiltered('events', 'is_active', true),
    countRows('event_rsvps'),
    countRows('conversations'),
    countRows('messages'),
    countFiltered('message_reports', 'status', 'pending'),
    countRows('ai_action_logs'),
    countRows('ai_cost_events'),
    countFiltered('content_reports', 'status', 'pending'),
    countFiltered('content_reports', 'status', 'reviewed'),
    countFiltered('pilot_feedback', 'status', 'new'),
    countRows('pilot_feedback'),
    countFiltered('pilot_incidents', 'status', 'open'),
    countFiltered('pilot_incidents', 'severity', 'critical'),
    countRowsSince('profiles', todayIso),
    countIncompleteProfiles(),
    countRowsSince('posts', todayIso),
    countRowsSince('post_comments', todayIso),
    countRowsSince('prayer_requests', todayIso),
    countRowsSince('prayer_supports', todayIso),
    countRowsSince('game_scores', todayIso),
    countRowsSince('messages', todayIso),
    countRowsSince('event_rsvps', todayIso),
    countRowsSince('group_members', todayIso),
    countRowsSince('ai_action_logs', todayIso),
    countFilteredSince('ai_action_logs', 'status', 'error', todayIso),
    countFilteredSince('ai_action_logs', 'status', 'limit_reached', todayIso),
  ])

  const activeUserIds = new Set(
    (
      await Promise.all([
        getUserIdsSince('posts', 'user_id', todayIso),
        getUserIdsSince('post_comments', 'user_id', todayIso),
        getUserIdsSince('prayer_requests', 'user_id', todayIso),
        getUserIdsSince('prayer_supports', 'user_id', todayIso),
        getUserIdsSince('game_scores', 'user_id', todayIso),
        getUserIdsSince('messages', 'sender_id', todayIso),
        getUserIdsSince('event_rsvps', 'user_id', todayIso),
        getUserIdsSince('group_members', 'user_id', todayIso),
        getUserIdsSince('pilot_feedback', 'user_id', todayIso),
      ])
    ).flat(),
  )

  return {
    adoption: {
      users,
      profileCompletionBase: users,
    },
    community: {
      posts,
      comments,
      reactions,
      prayers,
      prayerSupports,
      groupSuggestions,
      approvedGroups,
      groupMembers,
    },
    bible: {
      savedVerses,
      bibleReads,
    },
    games: {
      gameScores,
    },
    events: {
      events,
      rsvps,
    },
    messages: {
      conversations,
      messages,
      messageReports,
    },
    ai: {
      aiActions,
      aiCostEvents,
    },
    moderation: {
      reportsPending,
      reportsResolved,
    },
    pilot: {
      feedbackNew,
      feedbackTotal,
      incidentsOpen,
      incidentsCritical,
    },
    daily: {
      activeUsersToday: activeUserIds.size,
      newRegistrations,
      incompleteProfiles,
      postsToday,
      commentsToday,
      prayersToday,
      prayerSupportsToday,
      gamesToday,
      messagesToday,
      eventsRsvpsToday,
      groupMembersToday,
      feedbackNew,
      incidentsOpen,
      reportsPending,
      aiUsageToday,
      aiErrorsToday,
      aiLimitReachedToday,
    },
  }
}

export type PilotMetrics = Awaited<ReturnType<typeof getPilotMetrics>>
