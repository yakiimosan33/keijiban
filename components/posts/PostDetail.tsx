'use client';

import { useState, useEffect, useCallback } from 'react';
import { Post } from '@/lib/types';
import { postsApi } from '@/lib/api';
import { formatRelativeTime } from '@/lib/utils';

interface PostDetailProps {
  postId: number;
}

export default function PostDetail({ postId }: PostDetailProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await postsApi.getById(postId);
      
      if (!result) {
        setError('投稿が見つかりません');
        return;
      }

      setPost(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '投稿の取得に失敗しました';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  if (loading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-zinc-200 rounded mb-4 w-3/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-zinc-200 rounded w-full"></div>
            <div className="h-4 bg-zinc-200 rounded w-full"></div>
            <div className="h-4 bg-zinc-200 rounded w-5/6"></div>
          </div>
          <div className="h-4 bg-zinc-200 rounded mt-6 w-1/4"></div>
        </div>
      </div>
    );
  }

  if (error || (!post && !loading)) {
    return (
      <div className="card p-6 text-center">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-zinc-700 font-medium mb-2">{error || '投稿が見つかりません'}</p>
        <p className="text-sm text-zinc-500 mb-4">
          投稿が削除されているか、URLが間違っている可能性があります。
        </p>
        <button
          onClick={fetchPost}
          className="btn-primary"
        >
          再試行
        </button>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const relativeTime = formatRelativeTime(new Date(post.created_at));

  return (
    <article className="card p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 leading-tight mb-3">
          {post.title}
        </h1>
        <div className="flex items-center justify-between text-sm text-zinc-500">
          <time dateTime={post.created_at}>{relativeTime}</time>
          <div className="font-medium">
            投稿者: {post.username || '名無しさん'}
          </div>
        </div>
      </header>

      <div className="prose max-w-none">
        <div className="text-zinc-800 leading-relaxed whitespace-pre-wrap">
          {post.body}
        </div>
      </div>
    </article>
  );
}
