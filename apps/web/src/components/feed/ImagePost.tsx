import { useState } from 'react';
import { PostActions } from './PostActions';
import { MediaViewer } from './MediaViewer';
import { MultiImageGrid } from './MultiImageGrid';
import { PPVOverlay } from './PPVOverlay';
import { SubscriberOverlay } from './SubscriberOverlay';
import { ImageWatermark } from '../shared/ImageWatermark';
import { PostHeader } from './PostHeader';
import { useAuthStore } from '../../stores/authStore';
import type { FeedPost, Media } from './feedTypes';

function ImagePostMedia({
  post,
  images,
  isPpv,
  isSubscriberLocked,
  onRefresh,
  onOpen,
}: {
  post: FeedPost;
  images: Media[];
  isPpv: boolean;
  isSubscriberLocked: boolean;
  onRefresh?: () => void;
  onOpen: (i: number) => void;
}) {
  if (isPpv)
    return (
      <PPVOverlay
        postId={post.id}
        price={post.ppvPrice!}
        thumbnailUrl={images[0]?.url}
        onUnlocked={() => onRefresh?.()}
      />
    );
  if (isSubscriberLocked)
    return <SubscriberOverlay username={post.author.username} thumbnailUrl={images[0]?.url} />;
  return (
    <>
      {images.length === 1 && (
        <div
          className="relative aspect-[3/4] w-[55%] max-w-[320px] cursor-pointer overflow-hidden rounded-[12px] md:w-[45%] md:max-w-[380px] md:rounded-[22px]"
          onClick={() => onOpen(0)}
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
        <MultiImageGrid images={images} onClickImage={onOpen} username={post.author.username} />
      )}
    </>
  );
}

export function ImagePost({
  post,
  onRefresh,
  onDelete,
}: {
  post: FeedPost;
  onRefresh?: () => void;
  onDelete?: (id: string) => void;
}) {
  const userId = useAuthStore((s) => s.user?.id);
  const isOwner = userId === post.author.id;
  const images = post.media.filter((m) => m.type === 'IMAGE');
  const [viewerIdx, setViewerIdx] = useState<number | null>(null);
  const isPpv = !!post.ppvPrice && !post.isPpvUnlocked;
  const isSubscriberLocked = post.visibility === 'TIER_SPECIFIC' && !post.isSubscribed && !isOwner;

  return (
    <div className="rounded-[11px] bg-card px-[9px] py-[6px] md:rounded-[22px] md:px-[20px] md:py-[13px]">
      <div className="flex w-full flex-col gap-[11px] md:gap-[25px]">
        <PostHeader
          post={post}
          isOwner={isOwner}
          onDelete={onDelete ? () => onDelete(post.id) : undefined}
        />
        <div className="flex w-full flex-col gap-[11px] md:gap-[20px]">
          <ImagePostMedia
            post={post}
            images={images}
            isPpv={isPpv}
            isSubscriberLocked={isSubscriberLocked}
            onRefresh={onRefresh}
            onOpen={setViewerIdx}
          />
          <PostActions
            postId={post.id}
            likeCount={post.likeCount}
            commentCount={post.commentCount}
            shareCount={post.shareCount}
            isLiked={post.isLiked ?? false}
            authorName={post.author.displayName}
            isOwner={isOwner}
          />
        </div>
      </div>
      {viewerIdx !== null && (
        <MediaViewer
          media={images}
          initialIndex={viewerIdx}
          onClose={() => setViewerIdx(null)}
          username={post.author.username}
        />
      )}
    </div>
  );
}
