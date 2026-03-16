import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PostActions } from './PostActions';
import { MediaViewer } from './MediaViewer';
import { MultiImageGrid } from './MultiImageGrid';
import { PPVOverlay } from './PPVOverlay';
import { ImageWatermark } from '../shared/ImageWatermark';

const IMG = '/icons/dashboard';

interface Author {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  isVerified?: boolean;
}
interface Media {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  order: number;
  thumbnail?: string | null;
}
export { VideoPost } from './VideoPost';

export interface FeedPost {
  id: string;
  text: string | null;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  createdAt: string;
  author: Author;
  media: Media[];
  isLiked?: boolean;
  ppvPrice?: number | null;
  isPpvUnlocked?: boolean;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function PostHeader({ post }: { post: FeedPost }) {
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
          <div className="flex items-center gap-[2px]">
            <div className="whitespace-pre-wrap text-[0px] font-normal text-foreground">
              <p className="mb-0 text-[12px] md:text-[16px]">{post.author.displayName}</p>
              <p className="text-[8px] text-muted-foreground md:text-[12px]">
                @{post.author.username}
              </p>
            </div>
            {post.author.isVerified && (
              <img
                src={`${IMG}/verified.svg`}
                alt="Verified"
                className="size-[12px] md:size-[16px]"
              />
            )}
          </div>
        </Link>
        <p className="whitespace-pre-wrap text-[10px] font-normal leading-normal text-foreground md:text-[16px]">
          {post.text}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-[8px] md:gap-[18px]">
        <span className="text-[8px] font-normal text-muted-foreground md:text-[16px]">
          {timeAgo(post.createdAt)}
        </span>
        <div className="flex size-[11px] items-center justify-center md:size-[24px]">
          <img src={`${IMG}/pending.svg`} alt="" className="size-full rotate-90" />
        </div>
      </div>
    </div>
  );
}

export function ImagePost({ post, onRefresh }: { post: FeedPost; onRefresh?: () => void }) {
  const images = post.media.filter((m) => m.type === 'IMAGE');
  const [viewerIdx, setViewerIdx] = useState<number | null>(null);
  const isPpv = !!post.ppvPrice && !post.isPpvUnlocked;

  return (
    <div className="rounded-[11px] bg-card px-[9px] py-[6px] md:rounded-[22px] md:px-[20px] md:py-[13px]">
      <div className="flex w-full flex-col gap-[11px] md:gap-[25px]">
        <PostHeader post={post} />
        <div className="flex w-full flex-col gap-[11px] md:gap-[20px]">
          {isPpv ? (
            <PPVOverlay
              postId={post.id}
              price={post.ppvPrice!}
              thumbnailUrl={images[0]?.url}
              onUnlocked={() => onRefresh?.()}
            />
          ) : (
            <>
              {images.length === 1 && (
                <div
                  className="relative aspect-[3/4] w-[55%] max-w-[320px] cursor-pointer overflow-hidden rounded-[12px] md:w-[45%] md:max-w-[380px] md:rounded-[22px]"
                  onClick={() => setViewerIdx(0)}
                >
                  <img
                    src={images[0]?.url}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <ImageWatermark username={post.author.username} />
                </div>
              )}
              {images.length > 1 && (
                <MultiImageGrid
                  images={images}
                  onClickImage={setViewerIdx}
                  username={post.author.username}
                />
              )}
            </>
          )}
          <PostActions
            postId={post.id}
            likeCount={post.likeCount}
            commentCount={post.commentCount}
            shareCount={post.shareCount}
            isLiked={post.isLiked ?? false}
            authorName={post.author.displayName}
          />
        </div>
      </div>
      {viewerIdx !== null && (
        <MediaViewer media={images} initialIndex={viewerIdx} onClose={() => setViewerIdx(null)} />
      )}
    </div>
  );
}
