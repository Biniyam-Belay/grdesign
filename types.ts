export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      blogs: {
        Row: {
          content: string | null;
          cover: string;
          created_at: string | null;
          date: string;
          excerpt: string;
          id: string;
          slug: string;
          tags: string[] | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          content?: string | null;
          cover: string;
          created_at?: string | null;
          date: string;
          excerpt: string;
          id?: string;
          slug: string;
          tags?: string[] | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          content?: string | null;
          cover?: string;
          created_at?: string | null;
          date?: string;
          excerpt?: string;
          id?: string;
          slug?: string;
          tags?: string[] | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          alt: string | null;
          approach: string | null;
          client: string | null;
          created_at: string | null;
          credits: string | null;
          deliverables: string[] | null;
          excerpt: string;
          featured: boolean | null;
          featured_alt: string | null;
          featured_aspect: string | null;
          featured_src: string | null;
          gallery: Json | null;
          highlights: string[] | null;
          id: string;
          mobile_hero_src: string | null;
          outcome: string | null;
          problem: string | null;
          process: Json | null;
          roles: string[];
          slug: string;
          solution: string | null;
          thumb: string;
          title: string;
          tools: string[] | null;
          type: string | null;
          updated_at: string | null;
          video: string | null;
          year: string | null;
        };
        Insert: {
          alt?: string | null;
          approach?: string | null;
          client?: string | null;
          created_at?: string | null;
          credits?: string | null;
          deliverables?: string[] | null;
          excerpt: string;
          featured?: boolean | null;
          featured_alt?: string | null;
          featured_aspect?: string | null;
          featured_src?: string | null;
          gallery?: Json | null;
          highlights?: string[] | null;
          id?: string;
          mobile_hero_src?: string | null;
          outcome?: string | null;
          problem?: string | null;
          process?: Json | null;
          roles: string[];
          slug: string;
          solution?: string | null;
          thumb: string;
          title: string;
          tools?: string[] | null;
          type?: string | null;
          updated_at?: string | null;
          video?: string | null;
          year?: string | null;
        };
        Update: {
          alt?: string | null;
          approach?: string | null;
          client?: string | null;
          created_at?: string | null;
          credits?: string | null;
          deliverables?: string[] | null;
          excerpt?: string;
          featured?: boolean | null;
          featured_alt?: string | null;
          featured_aspect?: string | null;
          featured_src?: string | null;
          gallery?: Json | null;
          highlights?: string[] | null;
          id?: string;
          mobile_hero_src?: string | null;
          outcome?: string | null;
          problem?: string | null;
          process?: Json | null;
          roles?: string[];
          slug?: string;
          solution?: string | null;
          thumb?: string;
          title?: string;
          tools?: string[] | null;
          type?: string | null;
          updated_at?: string | null;
          video?: string | null;
          year?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
