import { useState } from 'react';
import { PostActions } from '../feed/PostActions';
import { MediaViewer } from '../feed/MediaViewer';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { PostCardHeader, PostCardMedia, PostOwnerBadges } from './PostCardParts';

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
  visibility?: string;
  ppvPrice?: number | null;
  ppvSoldCount?: number;
  ppvRevenue?: number;
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
  isOwner?: boolean;
  onMenuAction?: (postId: string, action: string) => void;
}

function resolveViewerMedia(media: PostMedia[]): PostMedia[] {
  const imgs = media.filter((m) => m.type === 'IMAGE');
  const vid = media.find((m) => m.type === 'VIDEO');
  if (vid && imgs.length === 0) return [vid];
  return imgs;
}

export function PostCard({ post, isOwner = false, onMenuAction }: PostCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const authorUsername = post.author?.username ?? '';

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
      <PostCardHeader
        post={post}
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen(!menuOpen)}
        onMenuClose={() => setMenuOpen(false)}
        onAction={handleMenuAction}
      />

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

      {isOwner && <PostOwnerBadges post={post} />}
      <PostActions
        postId={post.id}
        likeCount={post.likeCount}
        commentCount={post.commentCount}
        shareCount={post.shareCount}
        isLiked={post.isLiked}
        isOwner={isOwner}
      />

      {viewerOpen && (
        <MediaViewer
          media={resolveViewerMedia(post.media)}
          initialIndex={viewerIndex}
          onClose={() => setViewerOpen(false)}
          username={authorUsername}
        />
      )}
    </div>
  );
}
