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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      alumni_profiles: {
        Row: {
          bio: string | null
          created_at: string
          current_company: string | null
          current_position: string | null
          degree: string | null
          email: string | null
          graduation_year: number | null
          id: string
          is_mentor: boolean | null
          linkedin_url: string | null
          major: string | null
          mentor_availability: string | null
          mentor_expertise: string[] | null
          name: string | null
          twitter_url: string | null
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          current_company?: string | null
          current_position?: string | null
          degree?: string | null
          email?: string | null
          graduation_year?: number | null
          id?: string
          is_mentor?: boolean | null
          linkedin_url?: string | null
          major?: string | null
          mentor_availability?: string | null
          mentor_expertise?: string[] | null
          name?: string | null
          twitter_url?: string | null
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          current_company?: string | null
          current_position?: string | null
          degree?: string | null
          email?: string | null
          graduation_year?: number | null
          id?: string
          is_mentor?: boolean | null
          linkedin_url?: string | null
          major?: string | null
          mentor_availability?: string | null
          mentor_expertise?: string[] | null
          name?: string | null
          twitter_url?: string | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      career_history: {
        Row: {
          company: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          is_current: boolean | null
          position: string
          start_date: string
          user_id: string
        }
        Insert: {
          company: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          position: string
          start_date: string
          user_id: string
        }
        Update: {
          company?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          position?: string
          start_date?: string
          user_id?: string
        }
        Relationships: []
      }
      case_competition_scores: {
        Row: {
          analysis_score: number | null
          competition_id: string
          created_at: string
          creativity_score: number | null
          feedback: string | null
          id: string
          judge_id: string
          overall_score: number | null
          presentation_score: number | null
          room_number: string | null
          team_name: string
          updated_at: string
        }
        Insert: {
          analysis_score?: number | null
          competition_id: string
          created_at?: string
          creativity_score?: number | null
          feedback?: string | null
          id?: string
          judge_id: string
          overall_score?: number | null
          presentation_score?: number | null
          room_number?: string | null
          team_name: string
          updated_at?: string
        }
        Update: {
          analysis_score?: number | null
          competition_id?: string
          created_at?: string
          creativity_score?: number | null
          feedback?: string | null
          id?: string
          judge_id?: string
          overall_score?: number | null
          presentation_score?: number | null
          room_number?: string | null
          team_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_competition_scores_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "case_competitions"
            referencedColumns: ["id"]
          },
        ]
      }
      case_competitions: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          end_date: string
          id: string
          max_team_size: number | null
          prize_pool: string | null
          sponsor: string | null
          start_date: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          end_date: string
          id?: string
          max_team_size?: number | null
          prize_pool?: string | null
          sponsor?: string | null
          start_date: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          end_date?: string
          id?: string
          max_team_size?: number | null
          prize_pool?: string | null
          sponsor?: string | null
          start_date?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string | null
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string | null
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string | null
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_photos: {
        Row: {
          caption: string | null
          created_at: string
          event_id: string | null
          id: string
          photo_url: string
          uploaded_by: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          photo_url: string
          uploaded_by?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          photo_url?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_photos_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          event_id: string
          id: string
          registered_at: string
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          registered_at?: string
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          registered_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          building: string | null
          capacity: number | null
          created_at: string
          description: string | null
          event_date: string
          event_type: string | null
          id: string
          location: string | null
          organizer_id: string
          room_number: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          building?: string | null
          capacity?: number | null
          created_at?: string
          description?: string | null
          event_date: string
          event_type?: string | null
          id?: string
          location?: string | null
          organizer_id: string
          room_number?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          building?: string | null
          capacity?: number | null
          created_at?: string
          description?: string | null
          event_date?: string
          event_type?: string | null
          id?: string
          location?: string | null
          organizer_id?: string
          room_number?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      faculty_communications: {
        Row: {
          created_at: string
          created_by: string
          id: string
          message: string
          message_type: string
          subject: string
          target_tier: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          message: string
          message_type: string
          subject: string
          target_tier?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          message?: string
          message_type?: string
          subject?: string
          target_tier?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      generated_emails: {
        Row: {
          batch_id: string | null
          body: string
          created_at: string | null
          created_by: string
          email_type: string
          id: string
          notes: string | null
          recipient_email: string
          recipient_name: string
          scheduled_at: string | null
          sent_at: string | null
          status: string | null
          subject: string
          updated_at: string | null
        }
        Insert: {
          batch_id?: string | null
          body: string
          created_at?: string | null
          created_by: string
          email_type: string
          id?: string
          notes?: string | null
          recipient_email: string
          recipient_name: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
        }
        Update: {
          batch_id?: string | null
          body?: string
          created_at?: string | null
          created_by?: string
          email_type?: string
          id?: string
          notes?: string | null
          recipient_email?: string
          recipient_name?: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      giving_opportunities: {
        Row: {
          category: string | null
          contact_email: string | null
          created_at: string
          description: string | null
          id: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          contact_email?: string | null
          created_at?: string
          description?: string | null
          id?: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          contact_email?: string | null
          created_at?: string
          description?: string | null
          id?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      industry_speakers: {
        Row: {
          availability: string | null
          bio: string | null
          company: string
          created_at: string
          created_by: string
          email: string | null
          expertise: string[] | null
          id: string
          name: string
          phone: string | null
          speaking_topics: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          availability?: string | null
          bio?: string | null
          company: string
          created_at?: string
          created_by: string
          email?: string | null
          expertise?: string[] | null
          id?: string
          name: string
          phone?: string | null
          speaking_topics?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          availability?: string | null
          bio?: string | null
          company?: string
          created_at?: string
          created_by?: string
          email?: string | null
          expertise?: string[] | null
          id?: string
          name?: string
          phone?: string | null
          speaking_topics?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applied_date: string | null
          company_name: string
          created_at: string
          id: string
          notes: string | null
          position: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          applied_date?: string | null
          company_name: string
          created_at?: string
          id?: string
          notes?: string | null
          position: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          applied_date?: string | null
          company_name?: string
          created_at?: string
          id?: string
          notes?: string | null
          position?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mentor_listings: {
        Row: {
          availability: string | null
          created_at: string
          description: string | null
          expertise_areas: string[] | null
          id: string
          max_mentees: number | null
          mentor_id: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          availability?: string | null
          created_at?: string
          description?: string | null
          expertise_areas?: string[] | null
          id?: string
          max_mentees?: number | null
          mentor_id: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          availability?: string | null
          created_at?: string
          description?: string | null
          expertise_areas?: string[] | null
          id?: string
          max_mentees?: number | null
          mentor_id?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      mentor_matches: {
        Row: {
          created_at: string
          id: string
          match_score: number | null
          mentor_id: string
          status: string | null
          student_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          match_score?: number | null
          mentor_id: string
          status?: string | null
          student_id: string
        }
        Update: {
          created_at?: string
          id?: string
          match_score?: number | null
          mentor_id?: string
          status?: string | null
          student_id?: string
        }
        Relationships: []
      }
      research_collaborations: {
        Row: {
          collaboration_type: string | null
          created_at: string
          description: string | null
          id: string
          lead_researcher_id: string
          requirements: string | null
          research_area: string | null
          seeking_roles: string[] | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          collaboration_type?: string | null
          created_at?: string
          description?: string | null
          id?: string
          lead_researcher_id: string
          requirements?: string | null
          research_area?: string | null
          seeking_roles?: string[] | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          collaboration_type?: string | null
          created_at?: string
          description?: string | null
          id?: string
          lead_researcher_id?: string
          requirements?: string | null
          research_area?: string | null
          seeking_roles?: string[] | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      speaker_proposals: {
        Row: {
          created_at: string
          description: string | null
          id: string
          preferred_date: string | null
          speaker_name: string
          speaker_title: string
          sponsor_id: string
          status: string | null
          topic: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          preferred_date?: string | null
          speaker_name: string
          speaker_title: string
          sponsor_id: string
          status?: string | null
          topic: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          preferred_date?: string | null
          speaker_name?: string
          speaker_title?: string
          sponsor_id?: string
          status?: string | null
          topic?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "speaker_proposals_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsor_profiles: {
        Row: {
          company_name: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          tier: string | null
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          company_name: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          tier?: string | null
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          company_name?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          tier?: string | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      student_profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          interests: string[] | null
          name: string | null
          resume_url: string | null
          skills: string[] | null
          updated_at: string
          user_id: string
          working_status: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          interests?: string[] | null
          name?: string | null
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id: string
          working_status?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          interests?: string[] | null
          name?: string | null
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id?: string
          working_status?: string | null
        }
        Relationships: []
      }
      success_stories: {
        Row: {
          category: string | null
          id: string
          is_published: boolean | null
          published_at: string | null
          story: string
          submitted_at: string
          title: string
          user_id: string
        }
        Insert: {
          category?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          story: string
          submitted_at?: string
          title: string
          user_id: string
        }
        Update: {
          category?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          story?: string
          submitted_at?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workshop_registrations: {
        Row: {
          id: string
          registered_at: string
          user_id: string
          workshop_id: string
        }
        Insert: {
          id?: string
          registered_at?: string
          user_id: string
          workshop_id: string
        }
        Update: {
          id?: string
          registered_at?: string
          user_id?: string
          workshop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workshop_registrations_workshop_id_fkey"
            columns: ["workshop_id"]
            isOneToOne: false
            referencedRelation: "workshops"
            referencedColumns: ["id"]
          },
        ]
      }
      workshops: {
        Row: {
          capacity: number | null
          created_at: string
          date: string
          description: string | null
          id: string
          location: string | null
          title: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          date: string
          description?: string | null
          id?: string
          location?: string | null
          title: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          location?: string | null
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "faculty" | "student" | "alumni" | "admin" | "sponsor"
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
      app_role: ["faculty", "student", "alumni", "admin", "sponsor"],
    },
  },
} as const
