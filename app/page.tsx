'use client';

import { Suspense, useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PostList from '@/components/posts/PostList';
import PostForm from '@/components/posts/PostForm';

interface HomePageProps {
  searchParams: Promise<{ page?: string }>;
}

export default function HomePage({ searchParams }: HomePageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileForm, setShowMobileForm] = useState(false);
  const [postListKey, setPostListKey] = useState(0);

  // Handle searchParams asynchronously
  useEffect(() => {
    searchParams.then((params) => {
      setCurrentPage(Number(params.page) || 1);
    });
  }, [searchParams]);

  const handleMobilePostSubmitted = () => {
    setShowMobileForm(false);
    // Refresh posts list by updating the key if not on first page
    if (currentPage !== 1) {
      setPostListKey(prev => prev + 1);
    }
  };

  const handleMobilePostCancel = () => {
    setShowMobileForm(false);
  };

  const toggleMobileForm = () => {
    setShowMobileForm(!showMobileForm);
  };

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

          {/* Mobile Post Form - Inline */}
          <div className="md:hidden">
            {!showMobileForm ? (
              <button
                onClick={toggleMobileForm}
                className="w-full card p-4 text-left hover:shadow-md transition-shadow duration-200 border-2 border-dashed border-zinc-300 hover:border-primary-400"
                style={{ minHeight: '44px' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <span className="text-zinc-600 font-medium">
                    新しい投稿を作成...
                  </span>
                </div>
              </button>
            ) : (
              <div className="card p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-zinc-900">新規投稿</h2>
                  <button
                    onClick={handleMobilePostCancel}
                    className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                    style={{ minHeight: '44px', minWidth: '44px' }}
                    aria-label="閉じる"
                  >
                    <svg
                      className="w-5 h-5 text-zinc-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <PostForm
                  onSubmitted={handleMobilePostSubmitted}
                  onCancel={handleMobilePostCancel}
                />
              </div>
            )}
          </div>

          <Suspense
            fallback={<div className="text-center py-8">読み込み中...</div>}
          >
            <PostList key={postListKey} currentPage={currentPage} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
