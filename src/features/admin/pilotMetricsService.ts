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

export async function getPilotMetrics() {
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
  ])

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
  }
}

export type PilotMetrics = Awaited<ReturnType<typeof getPilotMetrics>>
