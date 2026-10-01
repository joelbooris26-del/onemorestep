/**
 * Tipos de la base de datos (reflejan supabase/migrations).
 *
 * Cuando cambie el esquema, regénéralos con:
 *   npx supabase gen types typescript --project-id <id> > src/types/database.ts
 * y vuelve a añadir los alias de dominio del final si se pierden.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Visibility = "public" | "limited" | "private";
export type Occupation =
  | "student"
  | "employed"
  | "entrepreneur"
  | "work_and_study"
  | "job_seeking"
  | "building_project"
  | "other";
export type GoalKind = "main" | "secondary" | "step";
export type GoalStatus = "active" | "completed" | "paused" | "abandoned";
export type GoalVisibility = "inherit" | "public" | "private";
export type MemberRole = "member" | "moderator" | "owner";

type Timestamps = { created_at: string; updated_at: string };

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string | null;
          role: "user" | "admin";
          onboarding_completed_at: string | null;
          last_seen_at: string | null;
        } & Timestamps;
        Insert: never;
        Update: never;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          avatar_url: string | null;
          bio: string | null;
          age: number | null;
          occupation: Occupation | null;
          occupation_other: string | null;
          focus_areas: string[];
          visibility: Visibility;
        } & Timestamps;
        Insert: never;
        Update: {
          display_name?: string;
          bio?: string | null;
          age?: number | null;
          occupation?: Occupation | null;
          occupation_other?: string | null;
          focus_areas?: string[];
          visibility?: Visibility;
        };
        Relationships: [];
      };
      onboarding_responses: {
        Row: {
          user_id: string;
          version: number;
          name: string;
          age: number;
          occupation: string;
          occupation_other: string | null;
          life_goals: string[];
          life_goals_other: string | null;
          main_goal: string;
          stage: string;
          motivation: string | null;
          daily_time: string;
          social_preferences: string[];
          privacy_level: Visibility;
          first_step: string;
          completed_at: string;
        } & Timestamps;
        Insert: never;
        Update: never;
        Relationships: [];
      };
      communities: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string;
          icon: string;
          color: string;
          cover_url: string | null;
          is_official: boolean;
          member_count: number;
          sort_order: number;
          created_by: string | null;
          archived_at: string | null;
        } & Timestamps;
        Insert: {
          slug: string;
          name: string;
          description?: string;
          icon?: string;
          color?: string;
          cover_url?: string | null;
          is_official?: boolean;
          sort_order?: number;
          created_by?: string | null;
        };
        Update: {
          slug?: string;
          name?: string;
          description?: string;
          icon?: string;
          color?: string;
          cover_url?: string | null;
          is_official?: boolean;
          sort_order?: number;
          archived_at?: string | null;
        };
        Relationships: [];
      };
      community_members: {
        Row: {
          community_id: string;
          user_id: string;
          role: MemberRole;
          joined_at: string;
        };
        Insert: { community_id: string; user_id: string };
        Update: never;
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey";
            columns: ["community_id"];
            isOneToOne: false;
            referencedRelation: "communities";
            referencedColumns: ["id"];
          },
        ];
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          parent_id: string | null;
          community_id: string | null;
          kind: GoalKind;
          title: string;
          description: string | null;
          status: GoalStatus;
          visibility: GoalVisibility;
          progress: number;
          target_date: string | null;
          completed_at: string | null;
          sort_order: number;
        } & Timestamps;
        Insert: {
          user_id: string;
          kind: GoalKind;
          title: string;
          parent_id?: string | null;
          community_id?: string | null;
          description?: string | null;
          visibility?: GoalVisibility;
          target_date?: string | null;
          sort_order?: number;
        };
        Update: {
          title?: string;
          description?: string | null;
          status?: GoalStatus;
          visibility?: GoalVisibility;
          progress?: number;
          target_date?: string | null;
          completed_at?: string | null;
          sort_order?: number;
          community_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      public_profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          avatar_url: string | null;
          visibility: Visibility;
          joined_at: string;
          bio: string | null;
          age: number | null;
          occupation: Occupation | null;
          occupation_other: string | null;
          focus_areas: string[];
          main_goal: string | null;
          steps_completed: number;
          communities: Json;
        };
        Relationships: [];
      };
    };
    Functions: {
      complete_onboarding: { Args: { payload: Json }; Returns: undefined };
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

type PublicSchema = Database["public"];
export type Tables<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Row"];
export type Views<T extends keyof PublicSchema["Views"]> = PublicSchema["Views"][T]["Row"];
