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
      ai_action_logs: {
        Row: {
          action_type: string
          created_at: string
          error_message: string | null
          id: string
          input_ref_id: string | null
          input_ref_type: string | null
          model: string | null
          output_summary: string | null
          prompt_summary: string | null
          provider: string
          status: string
          tokens_estimated: number | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          error_message?: string | null
          id?: string
          input_ref_id?: string | null
          input_ref_type?: string | null
          model?: string | null
          output_summary?: string | null
          prompt_summary?: string | null
          provider?: string
          status?: string
          tokens_estimated?: number | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          error_message?: string | null
          id?: string
          input_ref_id?: string | null
          input_ref_type?: string | null
          model?: string | null
          output_summary?: string | null
          prompt_summary?: string | null
          provider?: string
          status?: string
          tokens_estimated?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_action_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_action_queue: {
        Row: {
          action_type: string
          approved_at: string | null
          approved_by: string | null
          created_at: string
          error_message: string | null
          executed_at: string | null
          id: string
          prompt: string
          proposed_result: Json | null
          requested_by: string | null
          requires_approval: boolean
          status: string
          target_id: string | null
          target_type: string | null
        }
        Insert: {
          action_type: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          error_message?: string | null
          executed_at?: string | null
          id?: string
          prompt: string
          proposed_result?: Json | null
          requested_by?: string | null
          requires_approval?: boolean
          status?: string
          target_id?: string | null
          target_type?: string | null
        }
        Update: {
          action_type?: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          error_message?: string | null
          executed_at?: string | null
          id?: string
          prompt?: string
          proposed_result?: Json | null
          requested_by?: string | null
          requires_approval?: boolean
          status?: string
          target_id?: string | null
          target_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_action_queue_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_action_queue_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_cost_events: {
        Row: {
          action_type: string
          created_at: string
          id: string
          input_chars: number
          model: string | null
          output_chars: number
          provider: string
          status: string
          tokens_estimated: number
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          input_chars?: number
          model?: string | null
          output_chars?: number
          provider?: string
          status?: string
          tokens_estimated?: number
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          input_chars?: number
          model?: string | null
          output_chars?: number
          provider?: string
          status?: string
          tokens_estimated?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_cost_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_prompt_templates: {
        Row: {
          action_type: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          safety_notes: string | null
          system_prompt: string
          title: string
          updated_at: string
          user_prompt_template: string
          version: number
        }
        Insert: {
          action_type: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          safety_notes?: string | null
          system_prompt: string
          title: string
          updated_at?: string
          user_prompt_template: string
          version?: number
        }
        Update: {
          action_type?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          safety_notes?: string | null
          system_prompt?: string
          title?: string
          updated_at?: string
          user_prompt_template?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "ai_prompt_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_provider_settings: {
        Row: {
          configured_at: string | null
          configured_by: string | null
          created_at: string
          encrypted_api_key: string | null
          id: string
          is_enabled: boolean
          key_last4: string | null
          last_test_status: string | null
          last_tested_at: string | null
          model: string
          provider: string
          updated_at: string
        }
        Insert: {
          configured_at?: string | null
          configured_by?: string | null
          created_at?: string
          encrypted_api_key?: string | null
          id?: string
          is_enabled?: boolean
          key_last4?: string | null
          last_test_status?: string | null
          last_tested_at?: string | null
          model?: string
          provider?: string
          updated_at?: string
        }
        Update: {
          configured_at?: string | null
          configured_by?: string | null
          created_at?: string
          encrypted_api_key?: string | null
          id?: string
          is_enabled?: boolean
          key_last4?: string | null
          last_test_status?: string | null
          last_tested_at?: string | null
          model?: string
          provider?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_provider_settings_configured_by_fkey"
            columns: ["configured_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_usage_daily: {
        Row: {
          action_type: string
          created_at: string
          id: string
          requests_count: number
          tokens_estimated: number
          updated_at: string
          usage_date: string
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          requests_count?: number
          tokens_estimated?: number
          updated_at?: string
          usage_date?: string
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          requests_count?: number
          tokens_estimated?: number
          updated_at?: string
          usage_date?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_usage_daily_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_usage_limits: {
        Row: {
          action_type: string
          created_at: string
          daily_request_limit: number
          daily_token_limit: number
          id: string
          is_enabled: boolean
          role: string | null
          scope: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          daily_request_limit?: number
          daily_token_limit?: number
          id?: string
          is_enabled?: boolean
          role?: string | null
          scope: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          daily_request_limit?: number
          daily_token_limit?: number
          id?: string
          is_enabled?: boolean
          role?: string | null
          scope?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_usage_limits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
      bible_books: {
        Row: {
          book_order: number
          chapters_count: number
          code: string
          created_at: string
          id: string
          name: string
          testament: string
        }
        Insert: {
          book_order: number
          chapters_count?: number
          code: string
          created_at?: string
          id?: string
          name: string
          testament: string
        }
        Update: {
          book_order?: number
          chapters_count?: number
          code?: string
          created_at?: string
          id?: string
          name?: string
          testament?: string
        }
        Relationships: []
      }
      bible_daily_verses: {
        Row: {
          active_date: string | null
          book_code: string | null
          chapter: number
          created_at: string
          devotional_hint: string | null
          id: string
          translation_code: string | null
          verse: number
        }
        Insert: {
          active_date?: string | null
          book_code?: string | null
          chapter: number
          created_at?: string
          devotional_hint?: string | null
          id?: string
          translation_code?: string | null
          verse: number
        }
        Update: {
          active_date?: string | null
          book_code?: string | null
          chapter?: number
          created_at?: string
          devotional_hint?: string | null
          id?: string
          translation_code?: string | null
          verse?: number
        }
        Relationships: [
          {
            foreignKeyName: "bible_daily_verses_book_code_fkey"
            columns: ["book_code"]
            isOneToOne: false
            referencedRelation: "bible_books"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "bible_daily_verses_book_code_fkey"
            columns: ["book_code"]
            isOneToOne: false
            referencedRelation: "bible_missing_chapters_report"
            referencedColumns: ["book_code"]
          },
          {
            foreignKeyName: "bible_daily_verses_translation_code_fkey"
            columns: ["translation_code"]
            isOneToOne: false
            referencedRelation: "bible_missing_chapters_report"
            referencedColumns: ["translation_code"]
          },
          {
            foreignKeyName: "bible_daily_verses_translation_code_fkey"
            columns: ["translation_code"]
            isOneToOne: false
            referencedRelation: "bible_translation_stats"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "bible_daily_verses_translation_code_fkey"
            columns: ["translation_code"]
            isOneToOne: false
            referencedRelation: "bible_translations"
            referencedColumns: ["code"]
          },
        ]
      }
      bible_highlights: {
        Row: {
          color: string
          created_at: string
          highlight_text: string
          id: string
          note: string | null
          reference: string
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string
          highlight_text: string
          id?: string
          note?: string | null
          reference: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          highlight_text?: string
          id?: string
          note?: string | null
          reference?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bible_highlights_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_plan_progress: {
        Row: {
          completed_at: string | null
          day_id: string | null
          id: string
          note: string | null
          plan_id: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          day_id?: string | null
          id?: string
          note?: string | null
          plan_id?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          day_id?: string | null
          id?: string
          note?: string | null
          plan_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bible_plan_progress_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "bible_reading_plan_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bible_plan_progress_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "bible_reading_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bible_plan_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_reading_plan_days: {
        Row: {
          book_code: string | null
          created_at: string | null
          day_number: number
          description: string | null
          end_chapter: number | null
          end_verse: number | null
          id: string
          plan_id: string | null
          reading_reference: string
          reflection_prompt: string | null
          start_chapter: number | null
          start_verse: number | null
          title: string
        }
        Insert: {
          book_code?: string | null
          created_at?: string | null
          day_number: number
          description?: string | null
          end_chapter?: number | null
          end_verse?: number | null
          id?: string
          plan_id?: string | null
          reading_reference: string
          reflection_prompt?: string | null
          start_chapter?: number | null
          start_verse?: number | null
          title: string
        }
        Update: {
          book_code?: string | null
          created_at?: string | null
          day_number?: number
          description?: string | null
          end_chapter?: number | null
          end_verse?: number | null
          id?: string
          plan_id?: string | null
          reading_reference?: string
          reflection_prompt?: string | null
          start_chapter?: number | null
          start_verse?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "bible_reading_plan_days_book_code_fkey"
            columns: ["book_code"]
            isOneToOne: false
            referencedRelation: "bible_books"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "bible_reading_plan_days_book_code_fkey"
            columns: ["book_code"]
            isOneToOne: false
            referencedRelation: "bible_missing_chapters_report"
            referencedColumns: ["book_code"]
          },
          {
            foreignKeyName: "bible_reading_plan_days_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "bible_reading_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_reading_plans: {
        Row: {
          created_at: string | null
          description: string | null
          duration_days: number
          id: string
          is_active: boolean | null
          plan_key: string
          theme: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_days: number
          id?: string
          is_active?: boolean | null
          plan_key: string
          theme?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_days?: number
          id?: string
          is_active?: boolean | null
          plan_key?: string
          theme?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      bible_reading_progress: {
        Row: {
          completed_at: string
          day_number: number
          id: string
          plan_key: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          day_number: number
          id?: string
          plan_key: string
          user_id: string
        }
        Update: {
          completed_at?: string
          day_number?: number
          id?: string
          plan_key?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bible_reading_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_saved_verses: {
        Row: {
          created_at: string
          id: string
          note: string | null
          reference: string
          user_id: string
          verse_text: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          reference: string
          user_id: string
          verse_text: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          reference?: string
          user_id?: string
          verse_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "bible_saved_verses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_translations: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          is_public_domain: boolean
          language: string
          license: string | null
          name: string
          source_name: string | null
          source_url: string | null
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_public_domain?: boolean
          language?: string
          license?: string | null
          name: string
          source_name?: string | null
          source_url?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_public_domain?: boolean
          language?: string
          license?: string | null
          name?: string
          source_name?: string | null
          source_url?: string | null
        }
        Relationships: []
      }
      bible_verses: {
        Row: {
          book_code: string
          chapter: number
          created_at: string
          id: string
          normalized_text: string | null
          translation_code: string
          verse: number
          verse_text: string
        }
        Insert: {
          book_code: string
          chapter: number
          created_at?: string
          id?: string
          normalized_text?: string | null
          translation_code: string
          verse: number
          verse_text: string
        }
        Update: {
          book_code?: string
          chapter?: number
          created_at?: string
          id?: string
          normalized_text?: string | null
          translation_code?: string
          verse?: number
          verse_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "bible_verses_book_code_fkey"
            columns: ["book_code"]
            isOneToOne: false
            referencedRelation: "bible_books"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "bible_verses_book_code_fkey"
            columns: ["book_code"]
            isOneToOne: false
            referencedRelation: "bible_missing_chapters_report"
            referencedColumns: ["book_code"]
          },
          {
            foreignKeyName: "bible_verses_translation_code_fkey"
            columns: ["translation_code"]
            isOneToOne: false
            referencedRelation: "bible_missing_chapters_report"
            referencedColumns: ["translation_code"]
          },
          {
            foreignKeyName: "bible_verses_translation_code_fkey"
            columns: ["translation_code"]
            isOneToOne: false
            referencedRelation: "bible_translation_stats"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "bible_verses_translation_code_fkey"
            columns: ["translation_code"]
            isOneToOne: false
            referencedRelation: "bible_translations"
            referencedColumns: ["code"]
          },
        ]
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
      content_reports: {
        Row: {
          created_at: string
          details: string | null
          id: string
          internal_note: string | null
          reason: string
          reporter_id: string | null
          status: string
          target_id: string
          target_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          details?: string | null
          id?: string
          internal_note?: string | null
          reason: string
          reporter_id?: string | null
          status?: string
          target_id: string
          target_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          details?: string | null
          id?: string
          internal_note?: string | null
          reason?: string
          reporter_id?: string | null
          status?: string
          target_id?: string
          target_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_members: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_members_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          conversation_type: string
          created_at: string
          created_by: string | null
          group_id: string | null
          id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          conversation_type?: string
          created_at?: string
          created_by?: string | null
          group_id?: string | null
          id?: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          conversation_type?: string
          created_at?: string
          created_by?: string | null
          group_id?: string | null
          id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
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
      devotional_favorites: {
        Row: {
          created_at: string | null
          devotional_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          devotional_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          devotional_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "devotional_favorites_devotional_id_fkey"
            columns: ["devotional_id"]
            isOneToOne: false
            referencedRelation: "devotionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devotional_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      devotional_reads: {
        Row: {
          devotional_id: string
          id: string
          read_at: string | null
          user_id: string
        }
        Insert: {
          devotional_id: string
          id?: string
          read_at?: string | null
          user_id: string
        }
        Update: {
          devotional_id?: string
          id?: string
          read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "devotional_reads_devotional_id_fkey"
            columns: ["devotional_id"]
            isOneToOne: false
            referencedRelation: "devotionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devotional_reads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      devotionals: {
        Row: {
          created_at: string | null
          created_by: string | null
          devotional_date: string
          id: string
          is_active: boolean
          prayer: string | null
          reflection: string
          title: string
          updated_at: string
          verse_reference: string
          verse_text: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          devotional_date: string
          id?: string
          is_active?: boolean
          prayer?: string | null
          reflection: string
          title: string
          updated_at?: string
          verse_reference: string
          verse_text: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          devotional_date?: string
          id?: string
          is_active?: boolean
          prayer?: string | null
          reflection?: string
          title?: string
          updated_at?: string
          verse_reference?: string
          verse_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "devotionals_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      discipleship_progress: {
        Row: {
          completed_at: string
          id: string
          step_id: string
          track_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          step_id: string
          track_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          step_id?: string
          track_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discipleship_progress_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "discipleship_steps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discipleship_progress_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "discipleship_tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discipleship_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      discipleship_steps: {
        Row: {
          action_step: string | null
          content: string
          day_number: number
          id: string
          sort_order: number
          title: string
          track_id: string
          verse_reference: string | null
        }
        Insert: {
          action_step?: string | null
          content: string
          day_number: number
          id?: string
          sort_order?: number
          title: string
          track_id: string
          verse_reference?: string | null
        }
        Update: {
          action_step?: string | null
          content?: string
          day_number?: number
          id?: string
          sort_order?: number
          title?: string
          track_id?: string
          verse_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discipleship_steps_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "discipleship_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      discipleship_tracks: {
        Row: {
          created_at: string
          description: string | null
          duration_days: number
          id: string
          is_active: boolean
          level: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_days?: number
          id?: string
          is_active?: boolean
          level?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_days?: number
          id?: string
          is_active?: boolean
          level?: string
          title?: string
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
      event_rsvps: {
        Row: {
          created_at: string
          event_id: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_rsvps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          created_by: string | null
          description: string | null
          ends_at: string | null
          event_type: string
          group_id: string | null
          id: string
          is_active: boolean
          location_text: string | null
          meeting_link: string | null
          modality: string
          starts_at: string
          title: string
          updated_at: string
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          event_type?: string
          group_id?: string | null
          id?: string
          is_active?: boolean
          location_text?: string | null
          meeting_link?: string | null
          modality?: string
          starts_at: string
          title: string
          updated_at?: string
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          event_type?: string
          group_id?: string | null
          id?: string
          is_active?: boolean
          location_text?: string | null
          meeting_link?: string | null
          modality?: string
          starts_at?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_suggestions: {
        Row: {
          admin_note: string | null
          category: string
          created_at: string
          detail: string | null
          id: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          category: string
          created_at?: string
          detail?: string | null
          id?: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_note?: string | null
          category?: string
          created_at?: string
          detail?: string | null
          id?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_suggestions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      game_scores: {
        Row: {
          created_at: string
          game_key: string
          id: string
          score: number
          total: number
          user_id: string
        }
        Insert: {
          created_at?: string
          game_key: string
          id?: string
          score: number
          total: number
          user_id: string
        }
        Update: {
          created_at?: string
          game_key?: string
          id?: string
          score?: number
          total?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          role: string
          status: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          role?: string
          status?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          role?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_suggestions: {
        Row: {
          church_name: string | null
          city: string | null
          contact_url: string | null
          country: string
          created_at: string
          description: string | null
          id: string
          internal_note: string | null
          meeting_info: string | null
          modality: string
          moderator_note: string | null
          name: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          church_name?: string | null
          city?: string | null
          contact_url?: string | null
          country: string
          created_at?: string
          description?: string | null
          id?: string
          internal_note?: string | null
          meeting_info?: string | null
          modality?: string
          moderator_note?: string | null
          name: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          church_name?: string | null
          city?: string | null
          contact_url?: string | null
          country?: string
          created_at?: string
          description?: string | null
          id?: string
          internal_note?: string | null
          meeting_info?: string | null
          modality?: string
          moderator_note?: string | null
          name?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_suggestions_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_suggestions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          church_name: string | null
          city: string | null
          contact_url: string | null
          country: string | null
          created_at: string | null
          created_from_suggestion_id: string | null
          description: string | null
          id: string
          is_active: boolean
          latitude: number | null
          longitude: number | null
          meeting_info: string | null
          modality: string
          name: string
        }
        Insert: {
          church_name?: string | null
          city?: string | null
          contact_url?: string | null
          country?: string | null
          created_at?: string | null
          created_from_suggestion_id?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          meeting_info?: string | null
          modality?: string
          name: string
        }
        Update: {
          church_name?: string | null
          city?: string | null
          contact_url?: string | null
          country?: string | null
          created_at?: string | null
          created_from_suggestion_id?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          meeting_info?: string | null
          modality?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "groups_created_from_suggestion_id_fkey"
            columns: ["created_from_suggestion_id"]
            isOneToOne: false
            referencedRelation: "group_suggestions"
            referencedColumns: ["id"]
          },
        ]
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
      message_reports: {
        Row: {
          created_at: string
          detail: string | null
          id: string
          message_id: string
          reason: string
          reporter_id: string
          status: string
        }
        Insert: {
          created_at?: string
          detail?: string | null
          id?: string
          message_id: string
          reason: string
          reporter_id: string
          status?: string
        }
        Update: {
          created_at?: string
          detail?: string | null
          id?: string
          message_id?: string
          reason?: string
          reporter_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reports_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          conversation_id: string
          created_at: string
          deleted_at: string | null
          edited_at: string | null
          id: string
          sender_id: string
        }
        Insert: {
          body: string
          conversation_id: string
          created_at?: string
          deleted_at?: string | null
          edited_at?: string | null
          id?: string
          sender_id: string
        }
        Update: {
          body?: string
          conversation_id?: string
          created_at?: string
          deleted_at?: string | null
          edited_at?: string | null
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          community_updates: boolean
          created_at: string
          daily_devotional: boolean
          id: string
          prayer_updates: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          community_updates?: boolean
          created_at?: string
          daily_devotional?: boolean
          id?: string
          prayer_updates?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          community_updates?: boolean
          created_at?: string
          daily_devotional?: boolean
          id?: string
          prayer_updates?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link_path: string | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link_path?: string | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link_path?: string | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pilot_feedback: {
        Row: {
          admin_note: string | null
          browser: string | null
          category: string
          created_at: string | null
          detail: string | null
          device: string | null
          id: string
          module: string | null
          rating: number | null
          status: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_note?: string | null
          browser?: string | null
          category: string
          created_at?: string | null
          detail?: string | null
          device?: string | null
          id?: string
          module?: string | null
          rating?: number | null
          status?: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_note?: string | null
          browser?: string | null
          category?: string
          created_at?: string | null
          detail?: string | null
          device?: string | null
          id?: string
          module?: string | null
          rating?: number | null
          status?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pilot_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pilot_incidents: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          module: string | null
          reported_by: string | null
          resolution: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          module?: string | null
          reported_by?: string | null
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          module?: string | null
          reported_by?: string | null
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pilot_incidents_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pilot_incidents_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      post_comments: {
        Row: {
          body: string
          created_at: string | null
          id: string
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reactions: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          reaction: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          reaction?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          reaction?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          body: string
          created_at: string | null
          group_id: string | null
          id: string
          updated_at: string | null
          user_id: string | null
          verse_reference: string | null
          verse_text: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          group_id?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
          verse_reference?: string | null
          verse_text?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          group_id?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
          verse_reference?: string | null
          verse_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
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
          answered_at: string | null
          answered_testimony: string | null
          body: string
          category: string
          created_at: string | null
          group_id: string | null
          id: string
          is_anonymous: boolean
          is_answered: boolean | null
          title: string
          updated_at: string | null
          user_id: string | null
          visibility: string | null
        }
        Insert: {
          answered_at?: string | null
          answered_testimony?: string | null
          body: string
          category?: string
          created_at?: string | null
          group_id?: string | null
          id?: string
          is_anonymous?: boolean
          is_answered?: boolean | null
          title: string
          updated_at?: string | null
          user_id?: string | null
          visibility?: string | null
        }
        Update: {
          answered_at?: string | null
          answered_testimony?: string | null
          body?: string
          category?: string
          created_at?: string | null
          group_id?: string | null
          id?: string
          is_anonymous?: boolean
          is_answered?: boolean | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prayer_requests_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
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
      user_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      admin_ai_provider_status: {
        Row: {
          configured_at: string | null
          is_enabled: boolean | null
          key_last4: string | null
          last_test_status: string | null
          last_tested_at: string | null
          model: string | null
          provider: string | null
        }
        Insert: {
          configured_at?: string | null
          is_enabled?: boolean | null
          key_last4?: string | null
          last_test_status?: string | null
          last_tested_at?: string | null
          model?: string | null
          provider?: string | null
        }
        Update: {
          configured_at?: string | null
          is_enabled?: boolean | null
          key_last4?: string | null
          last_test_status?: string | null
          last_tested_at?: string | null
          model?: string | null
          provider?: string | null
        }
        Relationships: []
      }
      bible_missing_chapters_report: {
        Row: {
          book_code: string | null
          book_name: string | null
          chapter: number | null
          translation_code: string | null
        }
        Relationships: []
      }
      bible_translation_stats: {
        Row: {
          books_with_verses: number | null
          chapters_with_verses: number | null
          code: string | null
          estimated_completion_percent: number | null
          is_active: boolean | null
          is_public_domain: boolean | null
          language: string | null
          license: string | null
          name: string | null
          source_name: string | null
          source_url: string | null
          verses_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_bible_chapter: {
        Args: {
          p_book_code: string
          p_chapter: number
          p_translation_code: string
        }
        Returns: {
          book_code: string
          book_name: string
          chapter: number
          reference: string
          translation_code: string
          verse: number
          verse_text: string
        }[]
      }
      get_daily_bible_verse: {
        Args: { p_date?: string; p_translation_code?: string }
        Returns: {
          book_code: string
          book_name: string
          chapter: number
          devotional_hint: string
          reference: string
          translation_code: string
          verse: number
          verse_text: string
        }[]
      }
      get_group_member_counts: {
        Args: never
        Returns: {
          group_id: string
          members_count: number
        }[]
      }
      get_random_bible_verse: {
        Args: {
          p_book_code?: string
          p_testament?: string
          p_translation_code?: string
        }
        Returns: {
          book_code: string
          book_name: string
          chapter: number
          reference: string
          translation_code: string
          verse: number
          verse_text: string
        }[]
      }
      has_role: { Args: { required_role: string }; Returns: boolean }
      is_conversation_creator: {
        Args: { target_conversation_id: string }
        Returns: boolean
      }
      is_conversation_member: {
        Args: { target_conversation_id: string }
        Returns: boolean
      }
      search_bible_verses: {
        Args: {
          p_book_code?: string
          p_limit?: number
          p_query: string
          p_translation_code?: string
        }
        Returns: {
          book_code: string
          book_name: string
          chapter: number
          rank: number
          reference: string
          translation_code: string
          verse: number
          verse_text: string
        }[]
      }
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
