export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      AiSetting: {
        Row: {
          apiKey: string
          id: string
          model: string
          promptTemplate: string
          provider: Database["public"]["Enums"]["AIProvider"]
          publishTime: string
          requiresApproval: boolean
          updatedAt: string
        }
        Insert: {
          apiKey: string
          id: string
          model: string
          promptTemplate: string
          provider?: Database["public"]["Enums"]["AIProvider"]
          publishTime: string
          requiresApproval?: boolean
          updatedAt: string
        }
        Update: {
          apiKey?: string
          id?: string
          model?: string
          promptTemplate?: string
          provider?: Database["public"]["Enums"]["AIProvider"]
          publishTime?: string
          requiresApproval?: boolean
          updatedAt?: string
        }
        Relationships: []
      }
      Comment: {
        Row: {
          authorId: string
          content: string
          createdAt: string
          id: string
          postId: string
          updatedAt: string
        }
        Insert: {
          authorId: string
          content: string
          createdAt?: string
          id: string
          postId: string
          updatedAt: string
        }
        Update: {
          authorId?: string
          content?: string
          createdAt?: string
          id?: string
          postId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Comment_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Comment_postId_fkey"
            columns: ["postId"]
            isOneToOne: false
            referencedRelation: "Post"
            referencedColumns: ["id"]
          },
        ]
      }
      DailyVerse: {
        Row: {
          approvedAt: string | null
          createdAt: string
          id: string
          provider: Database["public"]["Enums"]["AIProvider"]
          publishedAt: string | null
          reference: string
          reflection: string
          status: Database["public"]["Enums"]["VerseStatus"]
          targetDate: string
          text: string
          updatedAt: string
        }
        Insert: {
          approvedAt?: string | null
          createdAt?: string
          id: string
          provider?: Database["public"]["Enums"]["AIProvider"]
          publishedAt?: string | null
          reference: string
          reflection: string
          status?: Database["public"]["Enums"]["VerseStatus"]
          targetDate: string
          text: string
          updatedAt: string
        }
        Update: {
          approvedAt?: string | null
          createdAt?: string
          id?: string
          provider?: Database["public"]["Enums"]["AIProvider"]
          publishedAt?: string | null
          reference?: string
          reflection?: string
          status?: Database["public"]["Enums"]["VerseStatus"]
          targetDate?: string
          text?: string
          updatedAt?: string
        }
        Relationships: []
      }
      devotionals: {
        Row: {
          created_at: string | null
          devotional_date: string
          id: string
          reflection: string
          title: string
          verse_reference: string
          verse_text: string
        }
        Insert: {
          created_at?: string | null
          devotional_date: string
          id?: string
          reflection: string
          title: string
          verse_reference: string
          verse_text: string
        }
        Update: {
          created_at?: string | null
          devotional_date?: string
          id?: string
          reflection?: string
          title?: string
          verse_reference?: string
          verse_text?: string
        }
        Relationships: []
      }
      Event: {
        Row: {
          capacity: number | null
          createdAt: string
          id: string
          mode: string
          place: string
          startsAt: string
          summary: string
          title: string
          updatedAt: string
        }
        Insert: {
          capacity?: number | null
          createdAt?: string
          id: string
          mode: string
          place: string
          startsAt: string
          summary: string
          title: string
          updatedAt: string
        }
        Update: {
          capacity?: number | null
          createdAt?: string
          id?: string
          mode?: string
          place?: string
          startsAt?: string
          summary?: string
          title?: string
          updatedAt?: string
        }
        Relationships: []
      }
      groups: {
        Row: {
          church_name: string | null
          city: string | null
          country: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          church_name?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          church_name?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      HomepageContent: {
        Row: {
          communityBody: string
          heroBody: string
          heroHeadline: string
          id: string
          libraryBody: string
          socialBody: string
          socialTitle: string
          updatedAt: string
        }
        Insert: {
          communityBody: string
          heroBody: string
          heroHeadline: string
          id: string
          libraryBody: string
          socialBody: string
          socialTitle: string
          updatedAt: string
        }
        Update: {
          communityBody?: string
          heroBody?: string
          heroHeadline?: string
          id?: string
          libraryBody?: string
          socialBody?: string
          socialTitle?: string
          updatedAt?: string
        }
        Relationships: []
      }
      Post: {
        Row: {
          authorId: string
          content: string
          createdAt: string
          featured: boolean
          id: string
          status: Database["public"]["Enums"]["ModerationStatus"]
          type: Database["public"]["Enums"]["PostType"]
          updatedAt: string
        }
        Insert: {
          authorId: string
          content: string
          createdAt?: string
          featured?: boolean
          id: string
          status?: Database["public"]["Enums"]["ModerationStatus"]
          type: Database["public"]["Enums"]["PostType"]
          updatedAt: string
        }
        Update: {
          authorId?: string
          content?: string
          createdAt?: string
          featured?: boolean
          id?: string
          status?: Database["public"]["Enums"]["ModerationStatus"]
          type?: Database["public"]["Enums"]["PostType"]
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Post_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          body: string
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string | null
          verse_reference: string | null
          verse_text: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
          verse_reference?: string | null
          verse_text?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
          verse_reference?: string | null
          verse_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_requests: {
        Row: {
          body: string
          created_at: string | null
          id: string
          is_answered: boolean | null
          title: string
          updated_at: string | null
          user_id: string | null
          visibility: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          is_answered?: boolean | null
          title: string
          updated_at?: string | null
          user_id?: string | null
          visibility?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          is_answered?: boolean | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prayer_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_supports: {
        Row: {
          created_at: string | null
          id: string
          prayer_request_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          prayer_request_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          prayer_request_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prayer_supports_prayer_request_id_fkey"
            columns: ["prayer_request_id"]
            isOneToOne: false
            referencedRelation: "prayer_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prayer_supports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      Profile: {
        Row: {
          approvalStatus: Database["public"]["Enums"]["ApprovalStatus"]
          avatar: string
          bio: string
          campus: string | null
          createdAt: string
          email: string
          id: string
          name: string
          passwordHash: string | null
          provider: Database["public"]["Enums"]["AuthProvider"]
          role: Database["public"]["Enums"]["UserRole"]
          updatedAt: string
        }
        Insert: {
          approvalStatus?: Database["public"]["Enums"]["ApprovalStatus"]
          avatar: string
          bio: string
          campus?: string | null
          createdAt?: string
          email: string
          id: string
          name: string
          passwordHash?: string | null
          provider?: Database["public"]["Enums"]["AuthProvider"]
          role?: Database["public"]["Enums"]["UserRole"]
          updatedAt: string
        }
        Update: {
          approvalStatus?: Database["public"]["Enums"]["ApprovalStatus"]
          avatar?: string
          bio?: string
          campus?: string | null
          createdAt?: string
          email?: string
          id?: string
          name?: string
          passwordHash?: string | null
          provider?: Database["public"]["Enums"]["AuthProvider"]
          role?: Database["public"]["Enums"]["UserRole"]
          updatedAt?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age_range: string | null
          avatar_url: string | null
          bio: string | null
          church_name: string | null
          city: string | null
          community_guidelines_accepted_at: string | null
          country: string | null
          created_at: string | null
          full_name: string
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          age_range?: string | null
          avatar_url?: string | null
          bio?: string | null
          church_name?: string | null
          city?: string | null
          community_guidelines_accepted_at?: string | null
          country?: string | null
          created_at?: string | null
          full_name: string
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          age_range?: string | null
          avatar_url?: string | null
          bio?: string | null
          church_name?: string | null
          city?: string | null
          community_guidelines_accepted_at?: string | null
          country?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      Reaction: {
        Row: {
          createdAt: string
          id: string
          postId: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id: string
          postId: string
          userId: string
        }
        Update: {
          createdAt?: string
          id?: string
          postId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Reaction_postId_fkey"
            columns: ["postId"]
            isOneToOne: false
            referencedRelation: "Post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Reaction_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          },
        ]
      }
      Report: {
        Row: {
          createdAt: string
          id: string
          postId: string
          reason: string
          reporterId: string
          status: Database["public"]["Enums"]["ReportStatus"]
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id: string
          postId: string
          reason: string
          reporterId: string
          status?: Database["public"]["Enums"]["ReportStatus"]
          updatedAt: string
        }
        Update: {
          createdAt?: string
          id?: string
          postId?: string
          reason?: string
          reporterId?: string
          status?: Database["public"]["Enums"]["ReportStatus"]
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Report_postId_fkey"
            columns: ["postId"]
            isOneToOne: false
            referencedRelation: "Post"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Report_reporterId_fkey"
            columns: ["reporterId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          },
        ]
      }
      RSVP: {
        Row: {
          createdAt: string
          eventId: string
          id: string
          status: Database["public"]["Enums"]["RSVPStatus"]
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          eventId: string
          id: string
          status: Database["public"]["Enums"]["RSVPStatus"]
          updatedAt: string
          userId: string
        }
        Update: {
          createdAt?: string
          eventId?: string
          id?: string
          status?: Database["public"]["Enums"]["RSVPStatus"]
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "RSVP_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "RSVP_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          },
        ]
      }
      Sermon: {
        Row: {
          createdAt: string
          date: string
          id: string
          origin: Database["public"]["Enums"]["SermonOrigin"]
          series: string
          status: Database["public"]["Enums"]["SermonStatus"]
          summary: string
          thumbnail: string | null
          title: string
          updatedAt: string
          youtubeId: string
        }
        Insert: {
          createdAt?: string
          date: string
          id: string
          origin?: Database["public"]["Enums"]["SermonOrigin"]
          series: string
          status?: Database["public"]["Enums"]["SermonStatus"]
          summary: string
          thumbnail?: string | null
          title: string
          updatedAt: string
          youtubeId: string
        }
        Update: {
          createdAt?: string
          date?: string
          id?: string
          origin?: Database["public"]["Enums"]["SermonOrigin"]
          series?: string
          status?: Database["public"]["Enums"]["SermonStatus"]
          summary?: string
          thumbnail?: string | null
          title?: string
          updatedAt?: string
          youtubeId?: string
        }
        Relationships: []
      }
      testimonies: {
        Row: {
          body: string
          created_at: string | null
          id: string
          is_approved: boolean | null
          title: string
          user_id: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          title: string
          user_id?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "testimonies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      TriviaScore: {
        Row: {
          answered: number
          createdAt: string
          id: string
          playerName: string
          score: number
        }
        Insert: {
          answered: number
          createdAt?: string
          id: string
          playerName: string
          score: number
        }
        Update: {
          answered?: number
          createdAt?: string
          id?: string
          playerName?: string
          score?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      WeeklyChallenge: {
        Row: {
          action: string
          createdAt: string
          id: string
          prayer: string
          status: Database["public"]["Enums"]["WeeklyChallengeStatus"]
          summary: string
          title: string
          updatedAt: string
          verseReference: string
          weekStart: string
        }
        Insert: {
          action: string
          createdAt?: string
          id: string
          prayer: string
          status?: Database["public"]["Enums"]["WeeklyChallengeStatus"]
          summary: string
          title: string
          updatedAt: string
          verseReference: string
          weekStart: string
        }
        Update: {
          action?: string
          createdAt?: string
          id?: string
          prayer?: string
          status?: Database["public"]["Enums"]["WeeklyChallengeStatus"]
          summary?: string
          title?: string
          updatedAt?: string
          verseReference?: string
          weekStart?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: { Args: { required_role: string }; Returns: boolean }
    }
    Enums: {
      AIProvider: "openai" | "gemini"
      ApprovalStatus: "pending" | "approved"
      AuthProvider: "email" | "google"
      ModerationStatus: "visible" | "hidden"
      PostType: "general" | "testimony" | "prayer"
      ReportStatus: "open" | "resolved" | "dismissed"
      RSVPStatus: "going" | "interested" | "cant_go"
      SermonOrigin: "seed" | "youtube_sync" | "manual"
      SermonStatus: "live" | "archive"
      UserRole: "admin" | "leader" | "member"
      VerseStatus: "draft" | "approved" | "published"
      WeeklyChallengeStatus: "active" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      AIProvider: ["openai", "gemini"],
      ApprovalStatus: ["pending", "approved"],
      AuthProvider: ["email", "google"],
      ModerationStatus: ["visible", "hidden"],
      PostType: ["general", "testimony", "prayer"],
      ReportStatus: ["open", "resolved", "dismissed"],
      RSVPStatus: ["going", "interested", "cant_go"],
      SermonOrigin: ["seed", "youtube_sync", "manual"],
      SermonStatus: ["live", "archive"],
      UserRole: ["admin", "leader", "member"],
      VerseStatus: ["draft", "approved", "published"],
      WeeklyChallengeStatus: ["active", "archived"],
    },
  },
} as const
