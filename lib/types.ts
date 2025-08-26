import type { Database } from './types/supabase';

// Extract row types from Supabase types
export type Post = Database['public']['Tables']['posts']['Row'];
export type Comment = Database['public']['Tables']['comments']['Row'];

// Insert types (for creating new records)
export type PostInsert = Database['public']['Tables']['posts']['Insert'];
export type CommentInsert = Database['public']['Tables']['comments']['Insert'];

// Update types (for updating records)
export type PostUpdate = Database['public']['Tables']['posts']['Update'];
export type CommentUpdate = Database['public']['Tables']['comments']['Update'];

// Extended types for UI components
export interface PostWithCommentCount extends Post {
  comment_count?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPages: number;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState {
  isValid: boolean;
  errors: ValidationError[];
  isSubmitting: boolean;
}
