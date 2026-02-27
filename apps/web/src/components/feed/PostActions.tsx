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
}

export function PostActions({
  postId,
  likeCount,
  commentCount,
  shareCount,
  isLiked,
}: PostActionsProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(likeCount);
  const [comments, setComments] = useState(commentCount);
  const [showComments, setShowComments] = useState(false);

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

  const handleShare = async () => {
    const url = `${window.location.origin}/post/${postId}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* ignore */
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
            <span className="text-[10px] font-normal md:text-[16px]">{shareCount} Share</span>
          </button>
        </div>
        <button className="flex items-center gap-[5px] text-[#f8f8f8] hover:opacity-80 md:gap-[10px]">
          <img
            src={`${IMG}/volunteer-activism.svg`}
            alt=""
            className="size-[12px] md:size-[20px]"
          />
          <span className="text-[10px] font-normal md:text-[16px]">Tip</span>
        </button>
      </div>
      {showComments && (
        <CommentsSection postId={postId} onCountChange={(d) => setComments((c) => c + d)} />
      )}
    </div>
  );
}
