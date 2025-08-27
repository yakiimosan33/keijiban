export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: number;
          username: string | null;
          title: string;
          body: string;
          created_at: string;
          is_hidden: boolean;
          ip_hash: string | null;
        };
        Insert: {
          username?: string | null;
          title: string;
          body: string;
          created_at?: string;
          is_hidden?: boolean;
          ip_hash?: string | null;
        };
        Update: {
          username?: string | null;
          title?: string;
          body?: string;
          created_at?: string;
          is_hidden?: boolean;
          ip_hash?: string | null;
        };
      };
      comments: {
        Row: {
          id: number;
          post_id: number;
          username: string | null;
          body: string;
          created_at: string;
          is_hidden: boolean;
          ip_hash: string | null;
        };
        Insert: {
          post_id: number;
          username?: string | null;
          body: string;
          created_at?: string;
          is_hidden?: boolean;
          ip_hash?: string | null;
        };
        Update: {
          post_id?: number;
          username?: string | null;
          body?: string;
          created_at?: string;
          is_hidden?: boolean;
          ip_hash?: string | null;
        };
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
  };
}
