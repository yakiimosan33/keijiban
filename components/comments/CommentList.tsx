'use client';

import { useState, useEffect, useCallback } from 'react';
import CommentItem from './CommentItem';
import Toast from '@/components/common/Toast';
import { Comment } from '@/lib/types';
import { commentsApi } from '@/lib/api';
import { useCommentsRealtime } from '@/lib/hooks/useRealtime';
import { useToast } from '@/lib/hooks/useToast';

interface CommentListProps {
  postId: number;
}

export default function CommentList({ postId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toasts, hideToast, showError, showInfo } = useToast();

  // Fetch comments function
  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await commentsApi.getByPostId(postId);
      setComments(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'コメントの取得に失敗しました';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [postId, showError]);

  // Real-time subscription handlers
  const handleNewComment = useCallback((newComment: Comment) => {
    setComments(prevComments => {
      // Check if comment already exists
      if (prevComments.some(c => c.id === newComment.id)) {
        return prevComments;
      }
      
      // Add new comment at the end (chronological order)
      return [...prevComments, newComment];
    });

    // Show notification but only if it's not the user's own comment
    // (We can't determine ownership in anonymous system, but we can check if it's very recent)
    const isVeryRecent = Date.now() - new Date(newComment.created_at).getTime() < 2000; // 2 seconds
    if (!isVeryRecent) {
      showInfo('新しいコメントが追加されました');
    }
  }, [showInfo]);

  const handleCommentUpdate = useCallback((updatedComment: Comment) => {
    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === updatedComment.id ? updatedComment : comment
      )
    );
  }, []);

  const handleCommentDelete = useCallback((deletedComment: Comment) => {
    setComments(prevComments => 
      prevComments.filter(comment => comment.id !== deletedComment.id)
    );
  }, []);

  // Setup real-time subscription
  useCommentsRealtime(
    postId,
    handleNewComment,
    handleCommentUpdate,
    handleCommentDelete,
    {
      onError: (error) => {
        console.error('Comments real-time error:', error);
        showError('リアルタイム更新でエラーが発生しました');
      },
    }
  );

  // Initial load
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Error state
  if (error && !loading) {
    return (
      <>
        <div className="card p-6 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-zinc-700 font-medium mb-2">コメントの読み込みに失敗しました</p>
          <p className="text-sm text-zinc-500 mb-4">{error}</p>
          <button
            onClick={fetchComments}
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
        {[...Array(2)].map((_, index) => (
          <div key={index} className="card p-4">
            <div className="animate-pulse">
              <div className="space-y-2">
                <div className="h-4 bg-zinc-200 rounded w-full"></div>
                <div className="h-4 bg-zinc-200 rounded w-4/5"></div>
              </div>
              <div className="h-3 bg-zinc-200 rounded mt-3 w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (comments.length === 0 && !loading) {
    return (
      <>
        <div className="card p-6 text-center">
          <div className="text-zinc-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-zinc-600 font-medium mb-2">まだコメントがありません</p>
          <p className="text-sm text-zinc-500">
            最初のコメントを投稿してみませんか？
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

  // Comments display
  return (
    <>
      <div className="space-y-4">
        <div className="text-sm text-zinc-600 mb-4">
          {comments.length}件のコメント
        </div>

        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
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
