import type { Database, Json } from './supabase.generated'

export type { Database, Json }

export type Profile = Database['public']['Tables']['profiles']['Row']
export type PrayerRequest =
  Database['public']['Tables']['prayer_requests']['Row']
export type PrayerSupport =
  Database['public']['Tables']['prayer_supports']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type PostComment =
  Database['public']['Tables']['post_comments']['Row']
export type PostReaction =
  Database['public']['Tables']['post_reactions']['Row']
export type Devotional = Database['public']['Tables']['devotionals']['Row']
export type DevotionalRead =
  Database['public']['Tables']['devotional_reads']['Row']
export type DevotionalFavorite =
  Database['public']['Tables']['devotional_favorites']['Row']
export type Testimony = Database['public']['Tables']['testimonies']['Row']
export type Group = Database['public']['Tables']['groups']['Row']
export type GroupSuggestion =
  Database['public']['Tables']['group_suggestions']['Row']
export type GroupMember = Database['public']['Tables']['group_members']['Row']
export type BibleSavedVerse =
  Database['public']['Tables']['bible_saved_verses']['Row']
export type BibleReadingProgress =
  Database['public']['Tables']['bible_reading_progress']['Row']
export type BibleHighlight =
  Database['public']['Tables']['bible_highlights']['Row']
export type BibleTranslation =
  Database['public']['Tables']['bible_translations']['Row']
export type BibleBook = Database['public']['Tables']['bible_books']['Row']
export type BibleVerse = Database['public']['Tables']['bible_verses']['Row']
export type BibleDailyVerse =
  Database['public']['Tables']['bible_daily_verses']['Row']
export type Event = Database['public']['Tables']['events']['Row']
export type EventRsvp = Database['public']['Tables']['event_rsvps']['Row']
export type DiscipleshipTrack =
  Database['public']['Tables']['discipleship_tracks']['Row']
export type DiscipleshipStep =
  Database['public']['Tables']['discipleship_steps']['Row']
export type DiscipleshipProgress =
  Database['public']['Tables']['discipleship_progress']['Row']
export type Conversation = Database['public']['Tables']['conversations']['Row']
export type ConversationMember =
  Database['public']['Tables']['conversation_members']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type MessageReport =
  Database['public']['Tables']['message_reports']['Row']
export type UserFollow = Database['public']['Tables']['user_follows']['Row']
export type FeedbackSuggestion =
  Database['public']['Tables']['feedback_suggestions']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type AiProviderSetting =
  Database['public']['Tables']['ai_provider_settings']['Row']
export type AiActionLog = Database['public']['Tables']['ai_action_logs']['Row']
export type AiActionQueue =
  Database['public']['Tables']['ai_action_queue']['Row']
export type AiUsageDaily =
  Database['public']['Tables']['ai_usage_daily']['Row']
export type AiUsageLimit =
  Database['public']['Tables']['ai_usage_limits']['Row']
export type AiCostEvent =
  Database['public']['Tables']['ai_cost_events']['Row']
export type AiPromptTemplate =
  Database['public']['Tables']['ai_prompt_templates']['Row']
export type ContentReport =
  Database['public']['Tables']['content_reports']['Row']
export type NotificationPreference =
  Database['public']['Tables']['notification_preferences']['Row']
export type GameScore = Database['public']['Tables']['game_scores']['Row']
