import { Comment } from '@/lib/types';
import { formatRelativeTime } from '@/lib/utils';

interface CommentItemProps {
  comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
  const relativeTime = formatRelativeTime(new Date(comment.created_at));

  return (
    <article className="card p-4">
      <div className="mb-3">
        <div className="text-zinc-800 text-sm leading-relaxed whitespace-pre-wrap">
          {comment.body}
        </div>
      </div>

      <footer className="text-xs text-zinc-500">
        <time dateTime={comment.created_at}>{relativeTime}</time>
      </footer>
    </article>
  );
}
