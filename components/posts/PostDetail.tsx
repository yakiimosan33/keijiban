'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/lib/types';
import { formatRelativeTime } from '@/lib/utils';

interface PostDetailProps {
  postId: number;
}

export default function PostDetail({ postId }: PostDetailProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Fetch post from Supabase
    // For now, show placeholder data
    setTimeout(() => {
      if (postId === 1) {
        const mockPost: Post = {
          id: 1,
          title: 'サンプル投稿タイトル1',
          body: 'これはサンプルの投稿内容です。実際の投稿では、ユーザーが入力したテキストがここに表示されます。\n\n改行も正しく表示されます。長いテキストの場合は、このように複数の段落に分かれることもあります。',
          created_at: new Date().toISOString(),
          is_hidden: false,
          ip_hash: null,
        };
        setPost(mockPost);
      } else {
        setError('投稿が見つかりません');
      }
      setLoading(false);
    }, 1000);
  }, [postId]);

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

  if (error || !post) {
    return (
      <div className="card p-6 text-center">
        <p className="text-red-600 mb-2">{error || '投稿が見つかりません'}</p>
        <p className="text-sm text-zinc-500">
          投稿が削除されているか、URLが間違っている可能性があります。
        </p>
      </div>
    );
  }

  const relativeTime = formatRelativeTime(new Date(post.created_at));

  return (
    <article className="card p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 leading-tight mb-3">
          {post.title}
        </h1>
        <div className="flex items-center text-sm text-zinc-500">
          <time dateTime={post.created_at}>{relativeTime}</time>
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
