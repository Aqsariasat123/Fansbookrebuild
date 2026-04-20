import { VideoThumbnail } from '../feed/VideoThumbnail';
import { ImageWatermark } from '../shared/ImageWatermark';
import { ImageGrid } from './ImageGrid';
import { PostMenu } from './PostMenu';
import type { PostMedia, PostAuthor, CreatorPost } from './PostCard';

const IMG = '/icons/dashboard';

export function PostCardHeader({
  post,
  menuOpen,
  onMenuToggle,
  onMenuClose,
  onAction,
}: {
  post: CreatorPost;
  menuOpen: boolean;
  onMenuToggle: () => void;
  onMenuClose: () => void;
  onAction: (action: string) => void;
}) {
  const { author, isPinned, createdAt } = post;
  if (!author) return null;
  return (
    <div className="mb-[10px] flex items-start justify-between md:mb-[14px]">
      <div className="flex items-center gap-[10px]">
        <div className="size-[36px] overflow-hidden rounded-full bg-primary/30 md:size-[42px]">
          <AuthorAvatar author={author} />
        </div>
        <div>
          <div className="flex items-center gap-[4px]">
            <span className="text-[14px] font-medium text-foreground md:text-[16px]">
              {author.displayName}
            </span>
            {author.isVerified && (
              <img src={`${IMG}/verified.svg`} alt="" className="size-[14px] md:size-[16px]" />
            )}
          </div>
          <span className="text-[11px] text-muted-foreground md:text-[13px]">
            @{author.username}
          </span>
        </div>
      </div>
      <div className="relative flex items-center gap-[8px]">
        <PinIndicator isPinned={isPinned} />
        <span className="text-[11px] text-muted-foreground md:text-[13px]">
          {timeAgo(createdAt)}
        </span>
        <button
          type="button"
          onClick={onMenuToggle}
          className="flex size-[26px] items-center justify-center rounded-full hover:bg-muted"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>
        <PostMenu open={menuOpen} onClose={onMenuClose} onAction={onAction} isPinned={isPinned} />
      </div>
    </div>
  );
}

const VIS_LABELS: Record<string, string> = {
  PUBLIC: 'Public',
  SUBSCRIBERS: 'Followers',
  TIER_SPECIFIC: 'Subscribers',
};

function visLabel(post: CreatorPost): string {
  if (post.ppvPrice && post.ppvPrice > 0) return 'Pay Per View';
  return VIS_LABELS[post.visibility ?? 'PUBLIC'] ?? 'Public';
}

export function PostOwnerBadges({ post }: { post: CreatorPost }) {
  const isPpv = !!(post.ppvPrice && post.ppvPrice > 0);
  return (
    <div className="mb-[10px] flex flex-wrap items-center gap-[8px] md:mb-[12px]">
      <span className="rounded-full border border-border px-[10px] py-[3px] text-[11px] text-muted-foreground md:text-[12px]">
        {visLabel(post)}
      </span>
      {isPpv && (
        <>
          <span className="rounded-full bg-muted px-[10px] py-[3px] text-[11px] text-muted-foreground md:text-[12px]">
            ${post.ppvPrice!.toFixed(2)} / unlock
          </span>
          <span className="rounded-full bg-muted px-[10px] py-[3px] text-[11px] text-muted-foreground md:text-[12px]">
            {post.ppvSoldCount ?? 0} sold
          </span>
          <span className="rounded-full bg-muted px-[10px] py-[3px] text-[11px] text-muted-foreground md:text-[12px]">
            ${(post.ppvRevenue ?? 0).toFixed(2)} earned
          </span>
        </>
      )}
    </div>
  );
}

export function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function PinIndicator({ isPinned }: { isPinned?: boolean }) {
  if (!isPinned) return null;
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="rotate-45 text-muted-foreground md:size-[20px]"
    >
      <path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97l.03 7 1 1 1-1 .03-7H19v-2c-1.66 0-3-1.34-3-3z" />
    </svg>
  );
}

export function AuthorAvatar({ author }: { author: PostAuthor }) {
  if (author.avatar) {
    return <img src={author.avatar} alt="" className="h-full w-full object-cover" />;
  }
  return (
    <div className="flex h-full w-full items-center justify-center text-[14px] text-primary">
      {author.displayName[0]}
    </div>
  );
}

export function VideoCard({
  media,
  onClick,
  username,
}: {
  media: PostMedia;
  onClick: () => void;
  username?: string;
}) {
  return (
    <div
      className="relative aspect-[3/4] w-[55%] max-w-[320px] cursor-pointer overflow-hidden rounded-[12px] md:w-[45%] md:max-w-[380px] md:rounded-[16px]"
      onClick={onClick}
    >
      <VideoThumbnail
        src={media.url}
        fallback={media.thumbnail || undefined}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-[rgba(21,25,28,0.55)]">
        <div className="flex items-center gap-[8px] rounded-[50px] bg-muted/90 py-[6px] pl-[6px] pr-[16px]">
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-[28px] md:size-[36px]">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span className="text-[14px] text-foreground md:text-[16px]">Play</span>
        </div>
      </div>
      {username && <ImageWatermark username={username} />}
    </div>
  );
}

export function PostCardMedia({
  post,
  authorUsername,
  onImageClick,
}: {
  post: CreatorPost;
  authorUsername: string;
  onImageClick: (index: number) => void;
}) {
  const images = post.media.filter((m) => m.type === 'IMAGE');
  const video = post.media.find((m) => m.type === 'VIDEO');
  const hasImages = images.length > 0;
  const hasVideoOnly = !!video && !hasImages;

  return (
    <div className="mb-[14px] md:mb-[18px]">
      {hasImages && (
        <ImageGrid media={post.media} onImageClick={onImageClick} username={authorUsername} />
      )}
      {hasVideoOnly && (
        <VideoCard media={video} onClick={() => onImageClick(0)} username={authorUsername} />
      )}
    </div>
  );
}
