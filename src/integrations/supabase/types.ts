export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      alerts: {
        Row: {
          audio_url: string | null
          community_id: string
          created_at: string
          id: string
          location: Json
          message: string | null
          priority: number
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          sender_id: string
          type: string
        }
        Insert: {
          audio_url?: string | null
          community_id: string
          created_at?: string
          id?: string
          location: Json
          message?: string | null
          priority: number
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          sender_id: string
          type: string
        }
        Update: {
          audio_url?: string | null
          community_id?: string
          created_at?: string
          id?: string
          location?: Json
          message?: string | null
          priority?: number
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          sender_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          community_id: string
          created_at: string
          id: string
          name: string
          type: string
        }
        Insert: {
          community_id: string
          created_at?: string
          id?: string
          name: string
          type: string
        }
        Update: {
          community_id?: string
          created_at?: string
          id?: string
          name?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "channels_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      communities: {
        Row: {
          created_at: string
          emergency_contacts: Json | null
          geo_boundaries: Json | null
          id: string
          leader_id: string | null
          max_members: number | null
          name: string
          subscription_plan: string | null
          subscription_status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          emergency_contacts?: Json | null
          geo_boundaries?: Json | null
          id?: string
          leader_id?: string | null
          max_members?: number | null
          name: string
          subscription_plan?: string | null
          subscription_status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          emergency_contacts?: Json | null
          geo_boundaries?: Json | null
          id?: string
          leader_id?: string | null
          max_members?: number | null
          name?: string
          subscription_plan?: string | null
          subscription_status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "communities_leader_id_fkey"
            columns: ["leader_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          audio_url: string | null
          channel_id: string
          content: string | null
          created_at: string
          id: string
          sender_id: string
          type: string
        }
        Insert: {
          audio_url?: string | null
          channel_id: string
          content?: string | null
          created_at?: string
          id?: string
          sender_id: string
          type: string
        }
        Update: {
          audio_url?: string | null
          channel_id?: string
          content?: string | null
          created_at?: string
          id?: string
          sender_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
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
      patrol_sessions: {
        Row: {
          community_id: string
          created_at: string
          end_time: string | null
          guard_id: string
          id: string
          missed_awake_checks: number | null
          route_data: Json | null
          start_time: string
          status: string | null
          total_distance: number | null
          updated_at: string
        }
        Insert: {
          community_id: string
          created_at?: string
          end_time?: string | null
          guard_id: string
          id?: string
          missed_awake_checks?: number | null
          route_data?: Json | null
          start_time?: string
          status?: string | null
          total_distance?: number | null
          updated_at?: string
        }
        Update: {
          community_id?: string
          created_at?: string
          end_time?: string | null
          guard_id?: string
          id?: string
          missed_awake_checks?: number | null
          route_data?: Json | null
          start_time?: string
          status?: string | null
          total_distance?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patrol_sessions_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patrol_sessions_guard_id_fkey"
            columns: ["guard_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          community_id: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          last_location: Json | null
          online_status: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          community_id?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          last_location?: Json | null
          online_status?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          community_id?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          last_location?: Json | null
          online_status?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_community"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_auth_user_role: {
        Args: { user_id: string }
        Returns: string
      }
    }
    Enums: {
      user_role:
        | "super_admin"
        | "admin"
        | "community_leader"
        | "community_manager"
        | "member"
        | "security_personnel"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: [
        "super_admin",
        "admin",
        "community_leader",
        "community_manager",
        "member",
        "security_personnel",
      ],
    },
  },
} as const
