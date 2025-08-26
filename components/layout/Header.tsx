'use client';

import { useState } from 'react';
import Link from 'next/link';
import PostForm from '@/components/posts/PostForm';
import Modal from '@/components/common/Modal';

export default function Header() {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const handleOpenPostModal = () => {
    setIsPostModalOpen(true);
  };

  const handleClosePostModal = () => {
    setIsPostModalOpen(false);
  };

  const handlePostSubmitted = () => {
    setIsPostModalOpen(false);
  };

  return (
    <>
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="text-xl font-bold text-zinc-900 hover:text-primary-600 transition-colors"
            >
              バイブコーディング掲示板
            </Link>

            {/* Desktop: Show button */}
            <div className="hidden md:block">
              <button
                onClick={handleOpenPostModal}
                className="btn-primary"
                type="button"
              >
                投稿する
              </button>
            </div>

            {/* Mobile: Show button */}
            <div className="md:hidden">
              <button
                onClick={handleOpenPostModal}
                className="btn-primary text-sm px-3 py-2"
                type="button"
              >
                投稿
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Post Modal */}
      <Modal
        isOpen={isPostModalOpen}
        onClose={handleClosePostModal}
        title="新規投稿"
      >
        <PostForm
          onSubmitted={handlePostSubmitted}
          onCancel={handleClosePostModal}
        />
      </Modal>
    </>
  );
}
