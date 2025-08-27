'use client';

import { useState, useEffect, useCallback } from 'react';
import PostCard from './PostCard';
import Pagination from '@/components/common/Pagination';
import Toast from '@/components/common/Toast';
import { PostWithCommentCount } from '@/lib/types';
import { postsApi } from '@/lib/api';
import { usePostsRealtime } from '@/lib/hooks/useRealtime';
import { useToast } from '@/lib/hooks/useToast';

interface PostListProps {
  currentPage: number;
}

export default function PostList({ currentPage }: PostListProps) {
  const [posts, setPosts] = useState<PostWithCommentCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
    count: 0,
  });

  const { toasts, hideToast, showError, showInfo } = useToast();

  // Fetch posts function
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await postsApi.getAllWithCommentCounts(currentPage);
      setPosts(result.data);
      setPagination({
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
        count: result.count,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '投稿の取得に失敗しました';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentPage, showError]);

  // Real-time subscription handlers
  const handleNewPost = useCallback((newPost: PostWithCommentCount) => {
    // Only add to current view if on first page
    if (currentPage === 1) {
      setPosts(prevPosts => {
        // Check if post already exists
        if (prevPosts.some(p => p.id === newPost.id)) {
          return prevPosts;
        }
        
        // Add new post at the beginning
        const updatedPosts = [{ ...newPost, comment_count: 0 }, ...prevPosts];
        
        // Keep only the page size (20) posts
        return updatedPosts.slice(0, 20);
      });
      
      // Update count
      setPagination(prev => ({
        ...prev,
        count: prev.count + 1,
      }));

      showInfo('新しい投稿が追加されました');
    }
  }, [currentPage, showInfo]);

  const handlePostUpdate = useCallback((updatedPost: PostWithCommentCount) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === updatedPost.id ? { ...updatedPost, comment_count: post.comment_count } : post
      )
    );
  }, []);

  const handlePostDelete = useCallback((deletedPost: PostWithCommentCount) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== deletedPost.id));
    setPagination(prev => ({
      ...prev,
      count: Math.max(0, prev.count - 1),
    }));
  }, []);

  // Setup real-time subscription
  usePostsRealtime(
    handleNewPost,
    handlePostUpdate,
    handlePostDelete,
    {
      onError: (error) => {
        console.error('Posts real-time error:', error);
        showError('リアルタイム更新でエラーが発生しました');
      },
    }
  );

  // Initial load and page changes
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Error state
  if (error && !loading) {
    return (
      <>
        <div className="card p-8 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-zinc-700 font-medium mb-2">データの読み込みに失敗しました</p>
          <p className="text-sm text-zinc-500 mb-4">{error}</p>
          <button
            onClick={fetchPosts}
            className="btn-primary"
          >
            再試行
          </button>
        </div>

        {/* Toast notifications */}
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            isVisible={toast.isVisible}
            onClose={() => hideToast(toast.id)}
          />
        ))}
      </>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="card p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-zinc-200 rounded mb-3 w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-zinc-200 rounded w-full"></div>
                <div className="h-4 bg-zinc-200 rounded w-5/6"></div>
              </div>
              <div className="h-4 bg-zinc-200 rounded mt-4 w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (posts.length === 0 && !loading) {
    return (
      <>
        <div className="card p-8 text-center">
          <div className="text-zinc-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <p className="text-zinc-600 font-medium mb-2">まだ投稿がありません</p>
          <p className="text-sm text-zinc-500">
            最初の投稿をしてみませんか？
          </p>
        </div>

        {/* Toast notifications */}
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            isVisible={toast.isVisible}
            onClose={() => hideToast(toast.id)}
          />
        ))}
      </>
    );
  }

  // Posts display
  return (
    <>
      <div className="space-y-6">
        {/* Posts count */}
        {pagination.count > 0 && (
          <div className="text-sm text-zinc-500">
            {pagination.count}件の投稿
          </div>
        )}

        {/* Posts list */}
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            hasNextPage={pagination.hasNextPage}
            hasPrevPage={pagination.hasPrevPage}
          />
        )}
      </div>

      {/* Toast notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </>
  );
}
