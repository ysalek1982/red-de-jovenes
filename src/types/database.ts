export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          username: string | null
          city: string | null
          country: string | null
          church_name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          username?: string | null
          city?: string | null
          country?: string | null
          church_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          full_name?: string
          username?: string | null
          city?: string | null
          country?: string | null
          church_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      prayer_requests: {
        Row: {
          id: string
          user_id: string
          title: string
          body: string
          is_answered: boolean
          visibility: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          body: string
          is_answered?: boolean
          visibility?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          body?: string
          is_answered?: boolean
          visibility?: string
          updated_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          id: string
          user_id: string
          body: string
          verse_reference: string | null
          verse_text: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          body: string
          verse_reference?: string | null
          verse_text?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          body?: string
          verse_reference?: string | null
          verse_text?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      devotionals: {
        Row: {
          id: string
          title: string
          verse_reference: string
          verse_text: string
          reflection: string
          devotional_date: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          verse_reference: string
          verse_text: string
          reflection: string
          devotional_date: string
          created_at?: string
        }
        Update: {
          title?: string
          verse_reference?: string
          verse_text?: string
          reflection?: string
          devotional_date?: string
        }
        Relationships: []
      }
      testimonies: {
        Row: {
          id: string
          user_id: string | null
          title: string
          body: string
          is_approved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          body: string
          is_approved?: boolean
          created_at?: string
        }
        Update: {
          title?: string
          body?: string
        }
        Relationships: []
      }
      groups: {
        Row: {
          id: string
          name: string
          city: string | null
          country: string | null
          church_name: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          city?: string | null
          country?: string | null
          church_name?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          name?: string
          city?: string | null
          country?: string | null
          church_name?: string | null
          description?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type PrayerRequest = Database['public']['Tables']['prayer_requests']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type Devotional = Database['public']['Tables']['devotionals']['Row']
export type Testimony = Database['public']['Tables']['testimonies']['Row']
export type Group = Database['public']['Tables']['groups']['Row']
