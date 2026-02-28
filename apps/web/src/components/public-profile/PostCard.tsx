import { useState, useRef, useEffect } from 'react';
import { PostActions } from '../feed/PostActions';
import { PostMediaDisplay } from './PostMediaDisplay';

export interface PublicPost {
  id: string;
  text: string | null;
  visibility: string;
  likeCount: number;
  commentCount: number;
  shareCount?: number;
  isLiked?: boolean;
  createdAt: string;
  media: { id: string; url: string; type: string }[];
  author?: { displayName: string; username: string; avatar: string | null; isVerified: boolean };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return 'Just now';
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function DotsMenu({ postId }: { postId: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const copyLink = () => {
    const url = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(url).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    });
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="rounded-full p-1 hover:bg-white/5">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="3" r="1.5" fill="currentColor" />
          <circle cx="10" cy="10" r="1.5" fill="currentColor" />
          <circle cx="10" cy="17" r="1.5" fill="currentColor" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-[28px] z-30 min-w-[160px] rounded-[12px] bg-muted py-[6px] shadow-lg">
          <button
            onClick={copyLink}
            className="flex w-full items-center gap-[8px] px-[14px] py-[8px] text-[13px] text-foreground hover:bg-white/5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
            </svg>
            Copy link
          </button>
          <button
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-[8px] px-[14px] py-[8px] text-[13px] text-foreground hover:bg-white/5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zM2 16h8v-2H2v2zm19.5-4.5L23 13l-6.99 7-4.51-4.5L13 14l3.01 3 5.49-5.5z" />
            </svg>
            Report
          </button>
        </div>
      )}
    </div>
  );
}

function AuthorHeader({
  author,
  createdAt,
  postId,
}: {
  author: NonNullable<PublicPost['author']>;
  createdAt: string;
  postId: string;
}) {
  return (
    <div className="mb-[12px] flex items-center justify-between">
      <div className="flex items-center gap-[10px]">
        {author.avatar ? (
          <img src={author.avatar} alt="" className="size-[40px] rounded-full object-cover" />
        ) : (
          <div className="flex size-[40px] items-center justify-center rounded-full bg-gradient-to-br from-[#01adf1] to-[#a61651] text-[16px] font-medium text-white">
            {author.displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <div className="flex items-center gap-[4px]">
            <p className="text-[14px] font-medium text-foreground">{author.displayName}</p>
            {author.isVerified && (
              <img src="/icons/dashboard/verified.svg" alt="Verified" className="size-[14px]" />
            )}
          </div>
          <p className="text-[12px] text-muted-foreground">@{author.username}</p>
        </div>
      </div>
      <div className="flex items-center gap-[10px]">
        <span className="text-[12px] text-muted-foreground">{timeAgo(createdAt)}</span>
        <DotsMenu postId={postId} />
      </div>
    </div>
  );
}

interface PostCardProps {
  post: PublicPost;
  isSubscribed: boolean;
}

export function PostCard({ post, isSubscribed }: PostCardProps) {
  const isLocked = !isSubscribed && post.visibility !== 'PUBLIC' && post.visibility !== 'FREE';
  const images = post.media.filter((m) => m.type === 'IMAGE');

  return (
    <div className="rounded-[22px] bg-card px-[9px] py-[6px] md:px-[20px] md:py-[16px]">
      {post.author && (
        <AuthorHeader author={post.author} createdAt={post.createdAt} postId={post.id} />
      )}
      {post.text && (
        <p className="mb-[12px] whitespace-pre-wrap text-[10px] font-normal leading-normal text-foreground md:text-[14px] md:leading-[1.6]">
          {post.text}
        </p>
      )}
      <PostMediaDisplay images={images} isLocked={isLocked} />
      <PostActions
        postId={post.id}
        likeCount={post.likeCount}
        commentCount={post.commentCount}
        shareCount={post.shareCount ?? 0}
        isLiked={post.isLiked ?? false}
      />
    </div>
  );
}
