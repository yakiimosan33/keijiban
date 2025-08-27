import { supabase } from './supabase';
import type {
  Post,
  Comment,
  PostInsert,
  CommentInsert,
  PostWithCommentCount,
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
   * Get posts with comment counts (for list view)
   */
  async getAllWithCommentCounts(page: number = 1): Promise<PaginatedResponse<PostWithCommentCount>> {
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

    // Get posts with comment counts - using a simpler approach
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('is_hidden', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch posts: ${error.message}`);
    }

    // Get comment counts separately for each post
    const postsWithCounts: PostWithCommentCount[] = [];
    
    for (const post of data || []) {
      const commentCount = await commentsApi.getCountByPostId(post.id);
      postsWithCounts.push({
        ...post,
        comment_count: commentCount,
      });
    }

    const transformedData = postsWithCounts;

    return {
      data: transformedData,
      count,
      hasNextPage,
      hasPrevPage,
      totalPages,
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

};

// Rate limiting types
interface RateLimitInfo {
  isAllowed: boolean;
  remaining: number;
  resetTime: number; // timestamp when limit resets
  timeUntilReset: number; // seconds until reset
  message?: string;
}

// Rate limiting helpers
export const rateLimiting = {
  /**
   * Check rate limit for posts with detailed information
   */
  checkPostRateLimit(): RateLimitInfo {
    const key = 'post-rate-limit';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const limit = 3; // 3 posts per minute

    const stored = localStorage.getItem(key);
    let attempts: number[] = stored ? JSON.parse(stored) : [];

    // Remove old attempts
    attempts = attempts.filter(
      (timestamp: number) => now - timestamp < windowMs,
    );

    const remaining = Math.max(0, limit - attempts.length);
    const oldestAttempt = attempts.length > 0 ? Math.min(...attempts) : now;
    const resetTime = oldestAttempt + windowMs;
    const timeUntilReset = Math.max(0, Math.ceil((resetTime - now) / 1000));

    if (attempts.length >= limit) {
      return {
        isAllowed: false,
        remaining: 0,
        resetTime,
        timeUntilReset,
        message: `投稿制限に達しました。${timeUntilReset}秒後に再度お試しください。`
      };
    }

    // Add current attempt when checking for submission
    attempts.push(now);
    localStorage.setItem(key, JSON.stringify(attempts));

    return {
      isAllowed: true,
      remaining: remaining - 1, // Account for current attempt
      resetTime,
      timeUntilReset,
    };
  },

  /**
   * Get current post rate limit status without adding attempt
   */
  getPostRateLimitStatus(): RateLimitInfo {
    const key = 'post-rate-limit';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const limit = 3; // 3 posts per minute

    const stored = localStorage.getItem(key);
    let attempts: number[] = stored ? JSON.parse(stored) : [];

    // Remove old attempts
    attempts = attempts.filter(
      (timestamp: number) => now - timestamp < windowMs,
    );

    const remaining = Math.max(0, limit - attempts.length);
    const oldestAttempt = attempts.length > 0 ? Math.min(...attempts) : now;
    const resetTime = oldestAttempt + windowMs;
    const timeUntilReset = Math.max(0, Math.ceil((resetTime - now) / 1000));

    if (attempts.length >= limit) {
      return {
        isAllowed: false,
        remaining: 0,
        resetTime,
        timeUntilReset,
        message: `投稿制限中です。${timeUntilReset}秒後に再度お試しください。`
      };
    }

    return {
      isAllowed: true,
      remaining,
      resetTime,
      timeUntilReset,
    };
  },

  /**
   * Check rate limit for comments with detailed information
   */
  checkCommentRateLimit(): RateLimitInfo {
    const key = 'comment-rate-limit';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const limit = 10; // 10 comments per minute

    const stored = localStorage.getItem(key);
    let attempts: number[] = stored ? JSON.parse(stored) : [];

    // Remove old attempts
    attempts = attempts.filter(
      (timestamp: number) => now - timestamp < windowMs,
    );

    const remaining = Math.max(0, limit - attempts.length);
    const oldestAttempt = attempts.length > 0 ? Math.min(...attempts) : now;
    const resetTime = oldestAttempt + windowMs;
    const timeUntilReset = Math.max(0, Math.ceil((resetTime - now) / 1000));

    if (attempts.length >= limit) {
      return {
        isAllowed: false,
        remaining: 0,
        resetTime,
        timeUntilReset,
        message: `コメント制限に達しました。${timeUntilReset}秒後に再度お試しください。`
      };
    }

    // Add current attempt when checking for submission
    attempts.push(now);
    localStorage.setItem(key, JSON.stringify(attempts));

    return {
      isAllowed: true,
      remaining: remaining - 1, // Account for current attempt
      resetTime,
      timeUntilReset,
    };
  },

  /**
   * Get current comment rate limit status without adding attempt
   */
  getCommentRateLimitStatus(): RateLimitInfo {
    const key = 'comment-rate-limit';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const limit = 10; // 10 comments per minute

    const stored = localStorage.getItem(key);
    let attempts: number[] = stored ? JSON.parse(stored) : [];

    // Remove old attempts
    attempts = attempts.filter(
      (timestamp: number) => now - timestamp < windowMs,
    );

    const remaining = Math.max(0, limit - attempts.length);
    const oldestAttempt = attempts.length > 0 ? Math.min(...attempts) : now;
    const resetTime = oldestAttempt + windowMs;
    const timeUntilReset = Math.max(0, Math.ceil((resetTime - now) / 1000));

    if (attempts.length >= limit) {
      return {
        isAllowed: false,
        remaining: 0,
        resetTime,
        timeUntilReset,
        message: `コメント制限中です。${timeUntilReset}秒後に再度お試しください。`
      };
    }

    return {
      isAllowed: true,
      remaining,
      resetTime,
      timeUntilReset,
    };
  },
};
