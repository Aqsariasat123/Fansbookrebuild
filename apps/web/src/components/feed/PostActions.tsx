import { useEffect, useRef, useState } from 'react';
import { api } from '../../lib/api';
import { CommentsSection } from './CommentsSection';
import { TipModal } from './TipModal';

const IMG = '/icons/dashboard';

interface PostActionsProps {
  postId: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isLiked: boolean;
  authorName?: string;
  isOwner?: boolean;
}

export function PostActions({
  postId,
  likeCount,
  commentCount,
  shareCount,
  isLiked,
  authorName = 'Creator',
  isOwner = false,
}: PostActionsProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(likeCount);
  const [comments, setComments] = useState(commentCount);
  const [shares, setShares] = useState(shareCount);
  const [showComments, setShowComments] = useState(false);
  const [showTip, setShowTip] = useState(false);

  const toggleLike = async () => {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikes((c) => c + (wasLiked ? -1 : 1));
    try {
      if (wasLiked) {
        await api.delete(`/posts/${postId}/like`);
      } else {
        await api.post(`/posts/${postId}/like`);
      }
    } catch {
      setLiked(wasLiked);
      setLikes((c) => c + (wasLiked ? 1 : -1));
    }
  };

  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showShareMenu) return;
    const handler = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) setShowShareMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showShareMenu]);

  const postUrl = `${window.location.origin}/post/${postId}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = postUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setShares((s) => s + 1);
    setCopied(true);
    setShowShareMenu(false);
    setTimeout(() => setCopied(false), 2000);
    api.post(`/posts/${postId}/share`).catch(() => {});
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[16px] md:gap-[36px]">
          <button
            onClick={toggleLike}
            className="flex items-center gap-[5px] hover:opacity-80 md:gap-[10px]"
          >
            <img
              src={`${IMG}/favorite.svg`}
              alt=""
              className="size-[12px] md:size-[20px]"
              style={
                liked
                  ? {
                      filter:
                        'brightness(0) saturate(100%) invert(22%) sepia(95%) saturate(5000%) hue-rotate(340deg)',
                    }
                  : undefined
              }
            />
            <span className="text-[10px] font-normal text-foreground md:text-[16px]">
              {likes} Likes
            </span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-[5px] text-foreground hover:opacity-80 md:gap-[10px]"
          >
            <img src={`${IMG}/mode-comment.svg`} alt="" className="size-[12px] md:size-[20px]" />
            <span className="text-[10px] font-normal md:text-[16px]">{comments} Comments</span>
          </button>
          <div ref={shareRef} className="relative">
            <button
              onClick={() => setShowShareMenu((o) => !o)}
              className="flex items-center gap-[5px] text-foreground hover:opacity-80 md:gap-[10px]"
            >
              <img src={`${IMG}/share.svg`} alt="" className="size-[12px] md:size-[20px]" />
              <span className="text-[10px] font-normal md:text-[16px]">
                {copied ? 'Copied!' : `${shares} Shares`}
              </span>
            </button>
            {showShareMenu && (
              <div className="absolute bottom-full left-0 z-50 mb-[6px] min-w-[160px] rounded-[10px] border border-border bg-card py-[4px] shadow-lg">
                <button
                  onClick={copyLink}
                  className="w-full px-[14px] py-[8px] text-left text-[13px] text-foreground hover:bg-muted"
                >
                  Copy link
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setShowShareMenu(false)}
                  className="block px-[14px] py-[8px] text-[13px] text-foreground hover:bg-muted"
                >
                  Share on X
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setShowShareMenu(false)}
                  className="block px-[14px] py-[8px] text-[13px] text-foreground hover:bg-muted"
                >
                  Share on Facebook
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(postUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setShowShareMenu(false)}
                  className="block px-[14px] py-[8px] text-[13px] text-foreground hover:bg-muted"
                >
                  Share on WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
        {!isOwner && (
          <div className="flex items-center gap-[12px] md:gap-[20px]">
            <button
              onClick={() => setShowTip(true)}
              className="flex items-center gap-[5px] text-foreground hover:opacity-80 md:gap-[10px]"
            >
              <img
                src={`${IMG}/volunteer-activism.svg`}
                alt=""
                className="size-[12px] md:size-[20px]"
              />
              <span className="text-[10px] font-normal md:text-[16px]">Tip</span>
            </button>
          </div>
        )}
      </div>
      {showComments && (
        <CommentsSection postId={postId} onCountChange={(d) => setComments((c) => c + d)} />
      )}
      {showTip && (
        <TipModal postId={postId} creatorName={authorName} onClose={() => setShowTip(false)} />
      )}
    </div>
  );
}
