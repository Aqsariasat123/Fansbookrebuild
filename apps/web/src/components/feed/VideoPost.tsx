import { useState } from 'react';
import { MediaViewer } from './MediaViewer';
import { VideoThumbnail } from './VideoThumbnail';
import { PPVOverlay } from './PPVOverlay';
import { PostActions } from './PostActions';
import { PostHeader } from './FeedPosts';
import type { FeedPost } from './FeedPosts';

interface Media {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  order: number;
  thumbnail?: string | null;
}

function VideoMediaPlayer({ video, onClick }: { video: Media; onClick: () => void }) {
  return (
    <div
      className="relative aspect-[3/4] w-[55%] max-w-[320px] cursor-pointer overflow-hidden rounded-[10px] md:w-[45%] md:max-w-[380px] md:rounded-[22px]"
      onClick={onClick}
    >
      <VideoThumbnail
        src={video.url}
        fallback={video.thumbnail || undefined}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 rounded-[10px] bg-[rgba(21,25,28,0.55)] md:rounded-[22px]" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <button className="flex items-center justify-center gap-[5px] rounded-[56px] bg-muted py-px pl-px pr-[15px] md:gap-[10px] md:rounded-[124px] md:pr-[34px]">
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-[22px] md:size-[48px]">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span className="text-[9px] font-normal text-foreground md:text-[20px]">Play</span>
        </button>
      </div>
    </div>
  );
}

function VideoContent({
  post,
  video,
  onPlay,
  onRefresh,
}: {
  post: FeedPost;
  video: Media | undefined;
  onPlay: () => void;
  onRefresh?: () => void;
}) {
  const isPpv = !!post.ppvPrice && !post.isPpvUnlocked;
  if (isPpv) {
    return (
      <PPVOverlay
        postId={post.id}
        price={post.ppvPrice!}
        thumbnailUrl={video?.thumbnail || video?.url}
        onUnlocked={() => onRefresh?.()}
      />
    );
  }
  return video ? <VideoMediaPlayer video={video} onClick={onPlay} /> : null;
}

export function VideoPost({ post, onRefresh }: { post: FeedPost; onRefresh?: () => void }) {
  const video = post.media.find((m) => m.type === 'VIDEO');
  const [showViewer, setShowViewer] = useState(false);

  return (
    <div className="relative rounded-[11px] bg-card md:rounded-[22px]">
      <div className="flex items-start justify-between gap-[10px] px-[9px] pt-[6px] md:gap-[25px] md:px-[20px] md:pt-[13px]">
        <PostHeader post={post} />
      </div>
      <div className="mx-[9px] mt-[11px] md:mx-[20px] md:mt-[25px]">
        <VideoContent
          post={post}
          video={video}
          onPlay={() => setShowViewer(true)}
          onRefresh={onRefresh}
        />
      </div>
      <div className="px-[9px] py-[11px] md:px-[20px] md:py-[20px]">
        <PostActions
          postId={post.id}
          likeCount={post.likeCount}
          commentCount={post.commentCount}
          shareCount={post.shareCount}
          isLiked={post.isLiked ?? false}
          isBookmarked={post.isBookmarked ?? false}
          authorName={post.author.displayName}
        />
      </div>
      {showViewer && video && (
        <MediaViewer media={[video]} initialIndex={0} onClose={() => setShowViewer(false)} />
      )}
    </div>
  );
}
