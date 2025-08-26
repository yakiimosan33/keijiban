'use client';

import { useState, useEffect } from 'react';
import CommentItem from './CommentItem';
import { Comment } from '@/lib/types';

interface CommentListProps {
  postId: number;
}

export default function CommentList({ postId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch comments from Supabase
    // For now, show placeholder data
    setTimeout(() => {
      const mockComments: Comment[] = [
        {
          id: 1,
          post_id: postId,
          body: 'これは最初のコメントです。投稿に対する返信として表示されます。',
          created_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
          is_hidden: false,
          ip_hash: null,
        },
        {
          id: 2,
          post_id: postId,
          body: '二つ目のコメントです。コメントは投稿日時の古い順に表示されます。',
          created_at: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
          is_hidden: false,
          ip_hash: null,
        },
      ];
      setComments(mockComments);
      setLoading(false);
    }, 800);
  }, [postId]);

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

  if (comments.length === 0) {
    return (
      <div className="card p-6 text-center">
        <p className="text-zinc-600">まだコメントがありません</p>
        <p className="text-sm text-zinc-500 mt-2">
          最初のコメントを投稿してみませんか？
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-zinc-600 mb-4">
        {comments.length}件のコメント
      </div>

      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
