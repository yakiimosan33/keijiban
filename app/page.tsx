import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PostList from '@/components/posts/PostList';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">
              バイブコーディング掲示板
            </h1>
            <p className="text-zinc-600">
              匿名でメッセージを投稿・閲覧できる掲示板です
            </p>
          </div>

          <Suspense
            fallback={<div className="text-center py-8">読み込み中...</div>}
          >
            <PostList currentPage={page} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
