import Link from 'next/link';
import { PostWithCommentCount } from '@/lib/types';
import { formatRelativeTime, truncateText } from '@/lib/utils';

interface PostCardProps {
  post: PostWithCommentCount;
}

export default function PostCard({ post }: PostCardProps) {
  const truncatedBody = truncateText(post.body, 120);
  const relativeTime = formatRelativeTime(new Date(post.created_at));

  return (
    <Link href={`/post/${post.id}`} className="block group">
      <article className="card p-4 sm:p-6 hover:shadow-md transition-shadow duration-200" style={{ minHeight: '44px' }}>
        <header className="mb-3">
          <h2 className="text-lg font-semibold text-zinc-900 group-hover:text-primary-600 transition-colors line-clamp-2">
            {post.title}
          </h2>
        </header>

        <div className="mb-4">
          <p className="text-zinc-700 text-sm leading-relaxed line-clamp-3">
            {truncatedBody}
          </p>
          {post.body.length > 120 && (
            <span className="text-primary-600 text-sm font-medium mt-2 inline-block">
              続きを読む
            </span>
          )}
        </div>

        <footer className="flex items-center justify-between text-xs text-zinc-500">
          <time dateTime={post.created_at}>{relativeTime}</time>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>{post.comment_count || 0}</span>
            </div>
          </div>
        </footer>
      </article>
    </Link>
  );
}
