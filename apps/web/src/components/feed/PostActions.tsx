import { useState } from 'react';
import { api } from '../../lib/api';
import { CommentsSection } from './CommentsSection';

const IMG = '/icons/dashboard';

interface PostActionsProps {
  postId: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isLiked: boolean;
  isBookmarked?: boolean;
}

export function PostActions({
  postId,
  likeCount,
  commentCount,
  shareCount,
  isLiked,
  isBookmarked = false,
}: PostActionsProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(likeCount);
  const [comments, setComments] = useState(commentCount);
  const [showComments, setShowComments] = useState(false);
  const [bookmarked, setBookmarked] = useState(isBookmarked);

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

  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/post/${postId}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Check this post', url });
      } catch {
        /* user cancelled */
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
            <span
              className={`text-[10px] font-normal md:text-[16px] ${liked ? 'text-red-500' : 'text-[#f8f8f8]'}`}
            >
              {likes} Likes
            </span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-[5px] text-[#f8f8f8] hover:opacity-80 md:gap-[10px]"
          >
            <img src={`${IMG}/mode-comment.svg`} alt="" className="size-[12px] md:size-[20px]" />
            <span className="text-[10px] font-normal md:text-[16px]">{comments} Comments</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-[5px] text-[#f8f8f8] hover:opacity-80 md:gap-[10px]"
          >
            <img src={`${IMG}/share.svg`} alt="" className="size-[12px] md:size-[20px]" />
            <span className="text-[10px] font-normal md:text-[16px]">
              {copied ? 'Copied!' : `${shareCount} Share`}
            </span>
          </button>
        </div>
        <div className="flex items-center gap-[12px] md:gap-[20px]">
          <button
            onClick={async () => {
              const was = bookmarked;
              setBookmarked(!was);
              try {
                if (was) await api.delete(`/posts/${postId}/bookmark`);
                else await api.post(`/posts/${postId}/bookmark`);
              } catch {
                setBookmarked(was);
              }
            }}
            className="flex items-center gap-[5px] hover:opacity-80 md:gap-[10px]"
          >
            <svg
              className={`size-[12px] md:size-[20px] ${bookmarked ? 'text-[#01adf1]' : 'text-[#f8f8f8]'}`}
              fill={bookmarked ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>
          <button className="flex items-center gap-[5px] text-[#f8f8f8] hover:opacity-80 md:gap-[10px]">
            <img
              src={`${IMG}/volunteer-activism.svg`}
              alt=""
              className="size-[12px] md:size-[20px]"
            />
            <span className="text-[10px] font-normal md:text-[16px]">Tip</span>
          </button>
        </div>
      </div>
      {showComments && (
        <CommentsSection postId={postId} onCountChange={(d) => setComments((c) => c + d)} />
      )}
    </div>
  );
}
