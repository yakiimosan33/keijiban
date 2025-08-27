'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
}: PaginationProps) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    const url = page === 1 ? '/' : `/?page=${page}`;
    router.push(url);
  };

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);

      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push('...');
        }
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages();

  return (
    <nav
      className="flex items-center justify-center gap-2 py-6 overflow-x-auto px-4 sm:px-0"
      role="navigation"
      aria-label="ページネーション"
    >
      {/* Previous button */}
      {hasPrevPage ? (
        <Link
          href={currentPage === 2 ? '/' : `/?page=${currentPage - 1}`}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-card border border-zinc-300 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors whitespace-nowrap"
          style={{ minHeight: '44px' }}
          aria-label="前のページ"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="hidden xs:inline sm:inline">前へ</span>
        </Link>
      ) : (
        <span className="flex items-center gap-2 px-3 py-2 rounded-card border border-zinc-200 text-sm font-medium text-zinc-400 cursor-not-allowed" style={{ minHeight: '44px' }}>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          前へ
        </span>
      )}

      {/* Page numbers */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-sm text-zinc-500"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isCurrentPage = pageNum === currentPage;

          return isCurrentPage ? (
            <span
              key={pageNum}
              className="px-3 py-2 rounded-card bg-primary-600 text-white text-sm font-medium"
              style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}
              aria-current="page"
            >
              {pageNum}
            </span>
          ) : (
            <Link
              key={pageNum}
              href={pageNum === 1 ? '/' : `/?page=${pageNum}`}
              className="px-3 py-2 rounded-card border border-zinc-300 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors flex items-center"
              style={{ minHeight: '44px' }}
              aria-label={`ページ ${pageNum}`}
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      {/* Next button */}
      {hasNextPage ? (
        <Link
          href={`/?page=${currentPage + 1}`}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-card border border-zinc-300 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors whitespace-nowrap"
          style={{ minHeight: '44px' }}
          aria-label="次のページ"
        >
          <span className="hidden xs:inline sm:inline">次へ</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      ) : (
        <span className="flex items-center gap-2 px-3 py-2 rounded-card border border-zinc-200 text-sm font-medium text-zinc-400 cursor-not-allowed" style={{ minHeight: '44px' }}>
          次へ
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      )}
    </nav>
  );
}
