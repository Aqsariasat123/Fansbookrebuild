import { useState } from 'react';
import { PostActions } from '../feed/PostActions';
import { MediaViewer } from '../feed/MediaViewer';
import { VideoThumbnail } from '../feed/VideoThumbnail';
import { ImageGrid } from './ImageGrid';
import { PostMenu } from './PostMenu';

const IMG = '/icons/dashboard';

export interface PostMedia {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  order: number;
  thumbnail?: string | null;
}

export interface PostAuthor {
  displayName: string;
  username: string;
  avatar: string | null;
  isVerified: boolean;
}

export interface CreatorPost {
  id: string;
  text: string | null;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isLiked: boolean;
  createdAt: string;
  media: PostMedia[];
  author?: PostAuthor;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function AuthorAvatar({ author }: { author: PostAuthor }) {
  if (author.avatar) {
    return <img src={author.avatar} alt="" className="h-full w-full object-cover" />;
  }
  return (
    <div className="flex h-full w-full items-center justify-center text-[14px] text-white">
      {author.displayName[0]}
    </div>
  );
}

function VideoCard({ media, onClick }: { media: PostMedia; onClick: () => void }) {
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
        <div className="flex items-center gap-[8px] rounded-[50px] bg-[#15191c]/90 py-[6px] pl-[6px] pr-[16px]">
          <img src={`${IMG}/play-button.webp`} alt="" className="size-[28px] md:size-[36px]" />
          <span className="text-[14px] text-white md:text-[16px]">Play</span>
        </div>
      </div>
    </div>
  );
}

interface PostCardProps {
  post: CreatorPost;
  onMenuAction?: (postId: string, action: string) => void;
}

export function PostCard({ post, onMenuAction }: PostCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const { author } = post;
  const images = post.media.filter((m) => m.type === 'IMAGE');
  const video = post.media.find((m) => m.type === 'VIDEO');
  const hasImages = images.length > 0;
  const hasVideoOnly = !!video && !hasImages;

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  return (
    <div className="rounded-[11px] bg-[#0e1012] p-[12px] md:rounded-[22px] md:p-[20px]">
      {author && (
        <div className="mb-[10px] flex items-start justify-between md:mb-[14px]">
          <div className="flex items-center gap-[10px]">
            <div className="size-[36px] overflow-hidden rounded-full bg-[#2e4882] md:size-[42px]">
              <AuthorAvatar author={author} />
            </div>
            <div>
              <div className="flex items-center gap-[4px]">
                <span className="text-[14px] font-medium text-[#f8f8f8] md:text-[16px]">
                  {author.displayName}
                </span>
                {author.isVerified && (
                  <img src={`${IMG}/verified.svg`} alt="" className="size-[14px] md:size-[16px]" />
                )}
              </div>
              <span className="text-[11px] text-[#5d5d5d] md:text-[13px]">@{author.username}</span>
            </div>
          </div>
          <div className="relative flex items-center gap-[8px]">
            <span className="text-[11px] text-[#5d5d5d] md:text-[13px]">
              {timeAgo(post.createdAt)}
            </span>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex size-[26px] items-center justify-center rounded-full hover:bg-[#15191c]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#5d5d5d">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </button>
            <PostMenu
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              onAction={(a) => onMenuAction?.(post.id, a)}
            />
          </div>
        </div>
      )}

      {post.text && (
        <p className="mb-[12px] whitespace-pre-wrap text-[13px] leading-[1.6] text-[#f8f8f8] md:mb-[16px] md:text-[15px]">
          {post.text}
        </p>
      )}

      {hasImages && (
        <div className="mb-[14px] md:mb-[18px]">
          <ImageGrid media={post.media} onImageClick={openViewer} />
        </div>
      )}

      {hasVideoOnly && (
        <div className="mb-[14px] md:mb-[18px]">
          <VideoCard media={video} onClick={() => openViewer(0)} />
        </div>
      )}

      <PostActions
        postId={post.id}
        likeCount={post.likeCount}
        commentCount={post.commentCount}
        shareCount={post.shareCount}
        isLiked={post.isLiked}
      />

      {viewerOpen && (
        <MediaViewer
          media={hasVideoOnly ? [video] : images}
          initialIndex={viewerIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </div>
  );
}
