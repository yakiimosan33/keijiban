'use client';

import { useState, useEffect } from 'react';
import PostCard from './PostCard';
import Pagination from '@/components/common/Pagination';
import { Post } from '@/lib/types';

interface PostListProps {
  currentPage: number;
}

export default function PostList({ currentPage }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // TODO: Fetch posts from Supabase
    // For now, show placeholder data
    setTimeout(() => {
      const mockPosts: Post[] = [
        {
          id: 1,
          title: 'サンプル投稿タイトル1',
          body: 'これはサンプルの投稿内容です。実際の投稿では、ユーザーが入力したテキストがここに表示されます。',
          created_at: new Date().toISOString(),
          is_hidden: false,
          ip_hash: null,
        },
        {
          id: 2,
          title: 'もう一つのサンプル投稿',
          body: '二つ目のサンプル投稿です。掲示板のレイアウトとスタイリングを確認するために使用しています。',
          created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          is_hidden: false,
          ip_hash: null,
        },
      ];
      setPosts(mockPosts);
      setTotalPages(1);
      setLoading(false);
    }, 1000);
  }, [currentPage]);

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

  if (posts.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-zinc-600">まだ投稿がありません</p>
        <p className="text-sm text-zinc-500 mt-2">
          最初の投稿をしてみませんか？
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        hasNextPage={currentPage < totalPages}
        hasPrevPage={currentPage > 1}
      />
    </div>
  );
}
