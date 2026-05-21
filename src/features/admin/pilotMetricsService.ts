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

interface PilotFeedbackMetricRow {
  id: string
  module: string | null
  title: string
  device: string | null
  status: string
  user_id: string | null
}

interface PilotIncidentMetricRow {
  id: string
  module: string | null
  title: string
  status: string
  severity: string
}

function isQaPilotFeedback(row: PilotFeedbackMetricRow) {
  return (
    row.module?.trim().toUpperCase() === 'QA' ||
    row.device?.trim().toUpperCase() === 'QA' ||
    row.title.trim().toUpperCase().startsWith('QA ')
  )
}

function isQaPilotIncident(row: PilotIncidentMetricRow) {
  return (
    row.module?.trim().toUpperCase() === 'QA' ||
    row.title.trim().toUpperCase().startsWith('QA ')
  )
}

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

async function getUserIds(table: PilotMetricTable, column: string) {
  const { data, error } = await supabase
    .from(table)
    .select(column)
    .limit(10000)

  if (error) throw error
  return (data ?? [])
    .map((row) => (row as unknown as Record<string, string | null>)[column])
    .filter(Boolean) as string[]
}

async function getPilotFeedbackMetricRows(since?: string) {
  const query = supabase
    .from('pilot_feedback')
    .select('id, module, title, device, status, user_id')
    .limit(5000)
  const { data, error } = since ? await query.gte('created_at', since) : await query

  if (error) throw error
  return (data ?? []) as PilotFeedbackMetricRow[]
}

async function getPilotIncidentMetricRows() {
  const { data, error } = await supabase
    .from('pilot_incidents')
    .select('id, module, title, status, severity')
    .limit(5000)

  if (error) throw error
  return (data ?? []) as PilotIncidentMetricRow[]
}

async function countRealPilotFeedbackRows() {
  const rows = await getPilotFeedbackMetricRows()
  return rows.filter((row) => !isQaPilotFeedback(row)).length
}

async function countRealPilotFeedbackFiltered(column: 'status', value: string) {
  const rows = await getPilotFeedbackMetricRows()
  return rows.filter((row) => !isQaPilotFeedback(row) && row[column] === value).length
}

async function countRealPilotIncidentFiltered(
  column: 'status' | 'severity',
  value: string,
) {
  const rows = await getPilotIncidentMetricRows()
  return rows.filter((row) => !isQaPilotIncident(row) && row[column] === value).length
}

async function getRealPilotFeedbackUserIdsSince(since: string) {
  const rows = await getPilotFeedbackMetricRows(since)
  return rows
    .filter((row) => !isQaPilotFeedback(row))
    .map((row) => row.user_id)
    .filter(Boolean) as string[]
}

async function countRealPilotFeedbackUsers() {
  const rows = await getPilotFeedbackMetricRows()
  return new Set(
    rows
      .filter((row) => !isQaPilotFeedback(row))
      .map((row) => row.user_id)
      .filter(Boolean) as string[],
  ).size
}

async function countUsersWithAnyActivity(
  sources: Array<{ table: PilotMetricTable; column: string }>,
) {
  const ids = (
    await Promise.all(
      sources.map((source) => getUserIds(source.table, source.column)),
    )
  ).flat()

  return new Set(ids).size
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

async function countCompleteActivationProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, city, country, church_name, bio, avatar_url')
    .limit(5000)

  if (error) throw error

  return (data ?? []).filter(
    (profile) =>
      profile.full_name?.trim() &&
      profile.city?.trim() &&
      profile.country?.trim() &&
      profile.church_name?.trim() &&
      profile.bio?.trim() &&
      profile.avatar_url?.trim(),
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
    activatedProfiles,
    activatedSavedVerse,
    activatedPrayer,
    activatedForum,
    activatedGame,
    activatedCommunity,
    activatedFeedback,
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
    countRealPilotFeedbackFiltered('status', 'new'),
    countRealPilotFeedbackRows(),
    countRealPilotIncidentFiltered('status', 'open'),
    countRealPilotIncidentFiltered('severity', 'critical'),
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
    countCompleteActivationProfiles(),
    countUsersWithAnyActivity([
      { table: 'bible_saved_verses', column: 'user_id' },
    ]),
    countUsersWithAnyActivity([
      { table: 'prayer_requests', column: 'user_id' },
      { table: 'prayer_supports', column: 'user_id' },
    ]),
    countUsersWithAnyActivity([
      { table: 'posts', column: 'user_id' },
      { table: 'post_comments', column: 'user_id' },
    ]),
    countUsersWithAnyActivity([
      { table: 'game_scores', column: 'user_id' },
    ]),
    countUsersWithAnyActivity([
      { table: 'group_members', column: 'user_id' },
    ]),
    countRealPilotFeedbackUsers(),
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
        getRealPilotFeedbackUserIdsSince(todayIso),
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
    activation: {
      profileCompleteUsers: activatedProfiles,
      firstSavedVerseUsers: activatedSavedVerse,
      firstPrayerUsers: activatedPrayer,
      firstForumUsers: activatedForum,
      firstGameUsers: activatedGame,
      communityJoinedUsers: activatedCommunity,
      feedbackSentUsers: activatedFeedback,
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
