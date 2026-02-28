import { useState } from 'react';

export interface CommentAuthor {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  isVerified?: boolean;
}

export interface Comment {
  id: string;
  text: string;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  author: CommentAuthor;
  children?: Comment[];
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return `${Math.floor(days / 7)}w`;
}

export function CommentItem({
  comment,
  onReply,
  onToggleLike,
  isReply = false,
}: {
  comment: Comment;
  onReply: () => void;
  onToggleLike: () => void;
  isReply?: boolean;
}) {
  const timeAgo = getTimeAgo(comment.createdAt);
  const avatarSize = isReply ? 'size-[24px]' : 'size-[28px] md:size-[32px]';

  return (
    <div className="group flex gap-[8px]">
      <img
        src={comment.author.avatar || '/icons/dashboard/person.svg'}
        alt=""
        className={`${avatarSize} shrink-0 rounded-full object-cover`}
      />
      <div className="flex flex-1 flex-col gap-[2px]">
        <div className="flex items-center gap-[6px]">
          <span className="text-[12px] font-semibold text-[#f8f8f8] md:text-[13px]">
            {comment.author.displayName}
          </span>
          {comment.author.isVerified && (
            <img src="/icons/dashboard/verified.svg" alt="" className="size-[12px]" />
          )}
          <span className="text-[10px] text-[#5d5d5d]">{timeAgo}</span>
        </div>
        <p className="text-[12px] leading-[1.5] text-[#c0c0c0] md:text-[13px]">{comment.text}</p>
        <div className="mt-[2px] flex items-center gap-[14px]">
          <button
            onClick={onToggleLike}
            className="flex items-center gap-[4px] text-[10px] transition-colors hover:text-[#f8f8f8] md:text-[11px]"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill={comment.isLiked ? '#e74c3c' : 'none'}
              stroke={comment.isLiked ? '#e74c3c' : '#5d5d5d'}
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className={comment.isLiked ? 'text-[#e74c3c]' : 'text-[#5d5d5d]'}>
              {comment.likeCount > 0 ? comment.likeCount : ''}
            </span>
          </button>
          <button
            onClick={onReply}
            className="text-[10px] font-medium text-[#5d5d5d] transition-colors hover:text-[#f8f8f8] md:text-[11px]"
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}

export function CommentThread({
  comment,
  onReply,
  onToggleLike,
}: {
  comment: Comment;
  onReply: (id: string, name: string) => void;
  onToggleLike: (id: string, isChild: boolean, parentId?: string) => void;
}) {
  const [showReplies, setShowReplies] = useState(false);
  const replies = comment.children || [];

  return (
    <div className="flex flex-col">
      <CommentItem
        comment={comment}
        onReply={() => onReply(comment.id, comment.author.displayName)}
        onToggleLike={() => onToggleLike(comment.id, false)}
      />

      {replies.length > 0 && (
        <button
          onClick={() => setShowReplies(!showReplies)}
          className="ml-[36px] mt-[4px] flex items-center gap-[6px] text-[11px] font-medium text-[#01adf1] hover:text-[#01adf1]/80"
        >
          <span className="h-[1px] w-[16px] bg-[#5d5d5d]" />
          {showReplies
            ? 'Hide replies'
            : `View ${replies.length} ${replies.length === 1 ? 'reply' : 'replies'}`}
        </button>
      )}

      {showReplies && replies.length > 0 && (
        <div className="ml-[36px] mt-[8px] flex flex-col gap-[10px] border-l border-[#1a1d20] pl-[12px]">
          {replies.map((r) => (
            <CommentItem
              key={r.id}
              comment={r}
              onReply={() => onReply(comment.id, r.author.displayName)}
              onToggleLike={() => onToggleLike(r.id, true, comment.id)}
              isReply
            />
          ))}
        </div>
      )}
    </div>
  );
}
