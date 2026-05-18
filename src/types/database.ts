import type { Database, Json } from './supabase.generated'

export type { Database, Json }

export type Profile = Database['public']['Tables']['profiles']['Row']
export type PrayerRequest =
  Database['public']['Tables']['prayer_requests']['Row']
export type PrayerSupport =
  Database['public']['Tables']['prayer_supports']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type Devotional = Database['public']['Tables']['devotionals']['Row']
export type Testimony = Database['public']['Tables']['testimonies']['Row']
export type Group = Database['public']['Tables']['groups']['Row']
