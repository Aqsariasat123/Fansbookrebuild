import { useState } from 'react';
import { PostActions } from '../feed/PostActions';
import { MediaViewer } from '../feed/MediaViewer';
import { PostMenu } from './PostMenu';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { timeAgo, PinIndicator, AuthorAvatar, PostCardMedia } from './PostCardParts';

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
  isPinned?: boolean;
  createdAt: string;
  media: PostMedia[];
  author?: PostAuthor;
}

interface PostCardProps {
  post: CreatorPost;
  onMenuAction?: (postId: string, action: string) => void;
}

export function PostCard({ post, onMenuAction }: PostCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { author } = post;
  const authorUsername = author ? author.username : '';
  const images = post.media.filter((m) => m.type === 'IMAGE');
  const video = post.media.find((m) => m.type === 'VIDEO');
  const hasVideoOnly = !!video && images.length === 0;

  const handleMenuAction = (action: string) => {
    if (action === 'remove') setConfirmDelete(true);
    else onMenuAction?.(post.id, action);
  };

  return (
    <div className="rounded-[11px] bg-card p-[12px] md:rounded-[22px] md:p-[20px]">
      {confirmDelete && (
        <ConfirmDeleteModal
          onConfirm={() => {
            setConfirmDelete(false);
            onMenuAction?.(post.id, 'remove');
          }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
      {author && (
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
            <PinIndicator isPinned={post.isPinned} />
            <span className="text-[11px] text-muted-foreground md:text-[13px]">
              {timeAgo(post.createdAt)}
            </span>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex size-[26px] items-center justify-center rounded-full hover:bg-muted"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </button>
            <PostMenu
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              onAction={handleMenuAction}
              isPinned={post.isPinned}
            />
          </div>
        </div>
      )}

      {post.text && (
        <p className="mb-[12px] whitespace-pre-wrap text-[13px] leading-[1.6] text-foreground md:mb-[16px] md:text-[15px]">
          {post.text}
        </p>
      )}

      <PostCardMedia
        post={post}
        authorUsername={authorUsername}
        onImageClick={(i) => {
          setViewerIndex(i);
          setViewerOpen(true);
        }}
      />

      <PostActions
        postId={post.id}
        likeCount={post.likeCount}
        commentCount={post.commentCount}
        shareCount={post.shareCount}
        isLiked={post.isLiked}
      />

      {viewerOpen && (
        <MediaViewer
          media={hasVideoOnly && video ? [video] : images}
          initialIndex={viewerIndex}
          onClose={() => setViewerOpen(false)}
          username={authorUsername}
        />
      )}
    </div>
  );
}
