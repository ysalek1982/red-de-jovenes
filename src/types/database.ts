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
