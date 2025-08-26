import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PostDetail from '@/components/posts/PostDetail';
import CommentList from '@/components/comments/CommentList';
import CommentForm from '@/components/comments/CommentForm';

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const postId = parseInt(id, 10);

  if (isNaN(postId) || postId <= 0) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          <Suspense
            fallback={<div className="card p-6 text-center">読み込み中...</div>}
          >
            <PostDetail postId={postId} />
          </Suspense>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">コメント</h2>

            <CommentForm postId={postId} />

            <Suspense
              fallback={
                <div className="text-center py-4">コメントを読み込み中...</div>
              }
            >
              <CommentList postId={postId} />
            </Suspense>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
