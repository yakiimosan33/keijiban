export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: number;
          title: string;
          body: string;
          created_at: string;
          is_hidden: boolean;
          ip_hash: string | null;
        };
        Insert: {
          title: string;
          body: string;
          created_at?: string;
          is_hidden?: boolean;
          ip_hash?: string | null;
        };
        Update: {
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
          body: string;
          created_at: string;
          is_hidden: boolean;
          ip_hash: string | null;
        };
        Insert: {
          post_id: number;
          body: string;
          created_at?: string;
          is_hidden?: boolean;
          ip_hash?: string | null;
        };
        Update: {
          post_id?: number;
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
