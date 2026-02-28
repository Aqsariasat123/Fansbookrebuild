import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { PostActions } from '../components/feed/PostActions';
import { SinglePostMedia } from '../components/feed/SinglePostMedia';

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

interface PostData {
  id: string;
  text: string | null;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  author: Author;
  media: Media[];
  isLiked: boolean;
  isBookmarked: boolean;
}

export default function SinglePost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api
      .get(`/posts/${id}`)
      .then((res) => setPost(res.data.data))
      .catch(() => setError('Post not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p className="text-[16px] text-[#f8f8f8]">{error || 'Post not found'}</p>
        <Link to="/feed" className="text-[#01adf1] hover:underline">
          Back to Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[700px]">
      <Link
        to="/feed"
        className="mb-4 inline-block text-[14px] text-[#5d5d5d] hover:text-[#f8f8f8]"
      >
        &larr; Back to Feed
      </Link>
      <div className="rounded-[22px] bg-[#0e1012] px-[20px] py-[13px]">
        <SinglePostHeader author={post.author} createdAt={post.createdAt} />
        {post.text && (
          <p className="mt-[14px] whitespace-pre-wrap text-[14px] text-[#f8f8f8] md:text-[16px]">
            {post.text}
          </p>
        )}
        <SinglePostMedia media={post.media} />
        <div className="mt-[20px]">
          <PostActions
            postId={post.id}
            likeCount={post.likeCount}
            commentCount={post.commentCount}
            shareCount={0}
            isLiked={post.isLiked}
            isBookmarked={post.isBookmarked}
          />
        </div>
      </div>
    </div>
  );
}

function SinglePostHeader({ author, createdAt }: { author: Author; createdAt: string }) {
  const diff = Date.now() - new Date(createdAt).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const timeAgo =
    hours < 1 ? 'Just now' : hours < 24 ? `${hours}h ago` : `${Math.floor(hours / 24)}d ago`;

  return (
    <div className="flex items-center justify-between">
      <Link to={`/u/${author.username}`} className="flex items-center gap-[8px] hover:opacity-80">
        <div className="size-[44px] shrink-0 overflow-hidden rounded-full">
          {author.avatar ? (
            <img src={author.avatar} alt="" className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center bg-gradient-to-br from-[#01adf1] to-[#a61651] text-[16px] font-medium text-white">
              {author.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-[4px]">
            <span className="text-[16px] text-[#f8f8f8]">{author.displayName}</span>
            {author.isVerified && (
              <img src="/icons/dashboard/verified.svg" alt="" className="size-[16px]" />
            )}
          </div>
          <p className="text-[12px] text-[#5d5d5d]">@{author.username}</p>
        </div>
      </Link>
      <span className="text-[14px] text-[#5d5d5d]">{timeAgo}</span>
    </div>
  );
}
