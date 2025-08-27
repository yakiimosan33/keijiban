'use client';

import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '../supabase';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

type PostgresChangesPayload<T> = RealtimePostgresChangesPayload<T>;

interface UseRealtimeOptions {
  onError?: (error: Error) => void;
  maxReconnectAttempts?: number;
  reconnectInterval?: number;
}

/**
 * Custom hook for managing Supabase real-time subscriptions
 * Handles connection, reconnection, and cleanup automatically
 */
export function useRealtime<T = any>(
  channelName: string,
  config: {
    event: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
    schema: string;
    table: string;
    filter?: string;
  },
  onPayload: (payload: PostgresChangesPayload<T>) => void,
  options: UseRealtimeOptions = {}
) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  
  const {
    onError,
    maxReconnectAttempts = 5,
    reconnectInterval = 1000,
  } = options;

  const handleError = useCallback((error: Error) => {
    console.error(`Realtime error on channel ${channelName}:`, error);
    if (onError) {
      onError(error);
    }
  }, [channelName, onError]);

  const cleanup = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    
    reconnectAttemptsRef.current = 0;
  }, []);

  const setupSubscription = useCallback(() => {
    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    try {
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          config,
          (payload) => {
            try {
              onPayload(payload as PostgresChangesPayload<T>);
              // Reset reconnect attempts on successful message
              reconnectAttemptsRef.current = 0;
            } catch (error) {
              handleError(new Error(`Error processing payload: ${error}`));
            }
          }
        )
        .on('error', (error) => {
          handleError(new Error(`Channel error: ${error}`));
          
          // Attempt reconnection if under limit
          if (reconnectAttemptsRef.current < maxReconnectAttempts) {
            reconnectAttemptsRef.current += 1;
            const delay = reconnectInterval * Math.pow(2, reconnectAttemptsRef.current - 1); // Exponential backoff
            
            console.log(`Attempting to reconnect channel ${channelName} in ${delay}ms (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
            
            reconnectTimeoutRef.current = setTimeout(() => {
              setupSubscription();
            }, delay);
          } else {
            handleError(new Error(`Max reconnection attempts reached for channel ${channelName}`));
          }
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log(`Successfully subscribed to channel: ${channelName}`);
            reconnectAttemptsRef.current = 0;
          } else if (status === 'CHANNEL_ERROR') {
            handleError(new Error(`Channel subscription error for ${channelName}`));
          } else if (status === 'TIMED_OUT') {
            handleError(new Error(`Channel subscription timeout for ${channelName}`));
          } else if (status === 'CLOSED') {
            console.log(`Channel ${channelName} closed`);
          }
        });

      channelRef.current = channel;
    } catch (error) {
      handleError(new Error(`Failed to setup subscription: ${error}`));
    }
  }, [channelName, config, onPayload, handleError, maxReconnectAttempts, reconnectInterval]);

  useEffect(() => {
    setupSubscription();
    
    return cleanup;
  }, [setupSubscription, cleanup]);

  return {
    channel: channelRef.current,
    reconnectAttempts: reconnectAttemptsRef.current,
    reconnect: setupSubscription,
    disconnect: cleanup,
  };
}

/**
 * Specialized hook for posts real-time subscription
 */
export function usePostsRealtime(
  onInsert?: (post: Database['public']['Tables']['posts']['Row']) => void,
  onUpdate?: (post: Database['public']['Tables']['posts']['Row']) => void,
  onDelete?: (post: Database['public']['Tables']['posts']['Row']) => void,
  options: UseRealtimeOptions = {}
) {
  return useRealtime(
    'posts-changes',
    {
      event: '*',
      schema: 'public',
      table: 'posts',
      filter: 'is_hidden=eq.false',
    },
    (payload) => {
      const { eventType, new: newPost, old: oldPost } = payload;
      
      switch (eventType) {
        case 'INSERT':
          if (onInsert && newPost) {
            onInsert(newPost as Database['public']['Tables']['posts']['Row']);
          }
          break;
        case 'UPDATE':
          if (onUpdate && newPost) {
            onUpdate(newPost as Database['public']['Tables']['posts']['Row']);
          }
          break;
        case 'DELETE':
          if (onDelete && oldPost) {
            onDelete(oldPost as Database['public']['Tables']['posts']['Row']);
          }
          break;
      }
    },
    options
  );
}

/**
 * Specialized hook for comments real-time subscription for a specific post
 */
export function useCommentsRealtime(
  postId: number,
  onInsert?: (comment: Database['public']['Tables']['comments']['Row']) => void,
  onUpdate?: (comment: Database['public']['Tables']['comments']['Row']) => void,
  onDelete?: (comment: Database['public']['Tables']['comments']['Row']) => void,
  options: UseRealtimeOptions = {}
) {
  return useRealtime(
    `comments-post-${postId}-changes`,
    {
      event: '*',
      schema: 'public',
      table: 'comments',
      filter: `post_id=eq.${postId}`,
    },
    (payload) => {
      const { eventType, new: newComment, old: oldComment } = payload;
      
      // Only process comments for the specific post and not hidden
      const comment = newComment || oldComment;
      if (!comment || comment.post_id !== postId || comment.is_hidden) {
        return;
      }
      
      switch (eventType) {
        case 'INSERT':
          if (onInsert && newComment) {
            onInsert(newComment as Database['public']['Tables']['comments']['Row']);
          }
          break;
        case 'UPDATE':
          if (onUpdate && newComment) {
            onUpdate(newComment as Database['public']['Tables']['comments']['Row']);
          }
          break;
        case 'DELETE':
          if (onDelete && oldComment) {
            onDelete(oldComment as Database['public']['Tables']['comments']['Row']);
          }
          break;
      }
    },
    options
  );
}