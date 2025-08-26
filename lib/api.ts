import { supabase } from './supabase';
import type {
  Post,
  Comment,
  PostInsert,
  CommentInsert,
  PaginatedResponse,
} from './types';
import { calculatePagination } from './utils';

/**
 * API functions for interacting with Supabase
 */

// Posts API
export const postsApi = {
  /**
   * Get posts with pagination
   */
  async getAll(page: number = 1): Promise<PaginatedResponse<Post>> {
    const { offset, limit } = calculatePagination(page, 0);

    // Get total count
    const { count } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('is_hidden', false);

    if (!count) {
      return {
        data: [],
        count: 0,
        hasNextPage: false,
        hasPrevPage: false,
        totalPages: 0,
      };
    }

    const { totalPages, hasNextPage, hasPrevPage } = calculatePagination(
      page,
      count,
    );

    // Get posts
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('is_hidden', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch posts: ${error.message}`);
    }

    return {
      data: data || [],
      count,
      hasNextPage,
      hasPrevPage,
      totalPages,
    };
  },

  /**
   * Get a single post by ID
   */
  async getById(id: number): Promise<Post | null> {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .eq('is_hidden', false)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      throw new Error(`Failed to fetch post: ${error.message}`);
    }

    return data;
  },

  /**
   * Create a new post
   */
  async create(post: PostInsert): Promise<Post> {
    const { data, error } = await supabase
      .from('posts')
      .insert(post as any)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create post: ${error.message}`);
    }

    return data;
  },

  /**
   * Subscribe to real-time changes for posts
   */
  subscribeToChanges(callback: (payload: any) => void) {
    const channel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
          filter: 'is_hidden=eq.false',
        },
        callback,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};

// Comments API
export const commentsApi = {
  /**
   * Get comments for a post
   */
  async getByPostId(postId: number): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .eq('is_hidden', false)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch comments: ${error.message}`);
    }

    return data || [];
  },

  /**
   * Get comment count for a post
   */
  async getCountByPostId(postId: number): Promise<number> {
    const { count, error } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)
      .eq('is_hidden', false);

    if (error) {
      throw new Error(`Failed to fetch comment count: ${error.message}`);
    }

    return count || 0;
  },

  /**
   * Create a new comment
   */
  async create(comment: CommentInsert): Promise<Comment> {
    const { data, error } = await supabase
      .from('comments')
      .insert(comment as any)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create comment: ${error.message}`);
    }

    return data;
  },

  /**
   * Subscribe to real-time changes for comments on a specific post
   */
  subscribeToPostChanges(postId: number, callback: (payload: any) => void) {
    const channel = supabase
      .channel(`comments-post-${postId}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId} and is_hidden=eq.false`,
        },
        callback,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};

// Rate limiting helpers
export const rateLimiting = {
  /**
   * Check if rate limit is exceeded for posts
   * This is a client-side check - real enforcement should be done server-side
   */
  checkPostRateLimit(): boolean {
    const key = 'post-rate-limit';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const limit = 3; // 3 posts per minute

    const stored = localStorage.getItem(key);
    let attempts = stored ? JSON.parse(stored) : [];

    // Remove old attempts
    attempts = attempts.filter(
      (timestamp: number) => now - timestamp < windowMs,
    );

    if (attempts.length >= limit) {
      return false; // Rate limit exceeded
    }

    // Add current attempt
    attempts.push(now);
    localStorage.setItem(key, JSON.stringify(attempts));

    return true; // Rate limit OK
  },

  /**
   * Check if rate limit is exceeded for comments
   */
  checkCommentRateLimit(): boolean {
    const key = 'comment-rate-limit';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const limit = 10; // 10 comments per minute

    const stored = localStorage.getItem(key);
    let attempts = stored ? JSON.parse(stored) : [];

    // Remove old attempts
    attempts = attempts.filter(
      (timestamp: number) => now - timestamp < windowMs,
    );

    if (attempts.length >= limit) {
      return false; // Rate limit exceeded
    }

    // Add current attempt
    attempts.push(now);
    localStorage.setItem(key, JSON.stringify(attempts));

    return true; // Rate limit OK
  },
};
