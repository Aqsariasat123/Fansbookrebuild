import { Link } from 'react-router-dom';
import { FeedPostMenu } from './FeedPostMenu';
import type { FeedPost } from './feedTypes';

const IMG = '/icons/dashboard';

export function renderWithHashtags(text: string) {
  return text.split(/(#\w+)/g).map((part, i) => {
    if (part.startsWith('#')) {
      const tag = part.slice(1);
      return (
        <Link
          key={i}
          to={`/hashtag/${tag}`}
          className="text-[#01adf1] hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </Link>
      );
    }
    return part;
  });
}

export function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function PostHeader({
  post,
  isOwner = false,
  onDelete,
}: {
  post: FeedPost;
  isOwner?: boolean;
  onDelete?: () => void;
}) {
  return (
    <div className="flex w-full items-start justify-between gap-[10px] md:gap-[25px]">
      <div className="flex flex-1 flex-col gap-[6px] md:gap-[14px]">
        <Link
          to={`/u/${post.author.username}`}
          className="flex items-center gap-[6px] hover:opacity-80"
        >
          <div className="size-[24px] shrink-0 overflow-hidden rounded-full md:size-[44px]">
            {post.author.avatar ? (
              <img src={post.author.avatar} alt="" className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center bg-gradient-to-br from-[#01adf1] to-[#a61651] text-[10px] font-medium text-white md:text-[16px]">
                {post.author.displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-[3px]">
              <p className="text-[12px] font-normal text-foreground md:text-[16px]">
                {post.author.displayName}
              </p>
              {post.author.isVerified && (
                <img
                  src={`${IMG}/verified.svg`}
                  alt="Verified"
                  className="size-[12px] md:size-[16px]"
                />
              )}
            </div>
            <p className="text-[8px] text-muted-foreground md:text-[12px]">
              @{post.author.username}
            </p>
          </div>
        </Link>
        <p className="whitespace-pre-wrap text-[10px] font-normal leading-normal text-foreground md:text-[16px]">
          {post.text ? renderWithHashtags(post.text) : null}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-[8px] md:gap-[18px]">
        <span className="text-[8px] font-normal text-muted-foreground md:text-[16px]">
          {timeAgo(post.createdAt)}
        </span>
        <FeedPostMenu postId={post.id} isOwner={isOwner} onDelete={onDelete} />
      </div>
    </div>
  );
}
