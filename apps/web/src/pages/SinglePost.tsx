import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { PostActions } from '../components/feed/PostActions';
import { SinglePostMedia } from '../components/feed/SinglePostMedia';
import { PPVOverlay } from '../components/feed/PPVOverlay';
import { CommentsSection } from '../components/feed/CommentsSection';
import { SinglePostHeader } from '../components/feed/SinglePostHeader';
import { RelatedPosts } from '../components/feed/RelatedPosts';

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
  author: {
    id: string;
    username: string;
    displayName: string;
    avatar: string | null;
    isVerified?: boolean;
  };
  media: Media[];
  isLiked: boolean;
  isBookmarked: boolean;
  ppvPrice?: number | null;
  isPpvUnlocked?: boolean;
}

export default function SinglePost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentCount, setCommentCount] = useState(0);
  const [relatedPosts, setRelatedPosts] = useState<
    { id: string; text: string | null; media: Media[] }[]
  >([]);

  const fetchPost = useCallback(() => {
    if (!id) return;
    api
      .get(`/posts/${id}`)
      .then((res) => {
        const data = res.data.data;
        setPost(data);
        setCommentCount(data.commentCount);
        if (data.author?.username) {
          api
            .get(`/creator-profile/${data.author.username}/posts?limit=4`)
            .then((r) => {
              const items = (r.data.data || []).filter((p: { id: string }) => p.id !== id);
              setRelatedPosts(items.slice(0, 3));
            })
            .catch(() => {});
        }
      })
      .catch(() => setError('Post not found'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-foreground border-t-transparent" />
      </div>
    );
  if (error || !post)
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p className="text-[16px] text-foreground">{error || 'Post not found'}</p>
        <Link to="/feed" className="text-primary hover:underline">
          Back to Feed
        </Link>
      </div>
    );

  const isPpvLocked = !!post.ppvPrice && !post.isPpvUnlocked;

  return (
    <div className="mx-auto max-w-[700px]">
      <Link
        to="/feed"
        className="mb-4 inline-block text-[14px] text-muted-foreground hover:text-foreground"
      >
        &larr; Back to Feed
      </Link>
      <div className="rounded-[22px] bg-card px-[20px] py-[13px]">
        <SinglePostHeader author={post.author} createdAt={post.createdAt} />
        {post.text && (
          <p className="mt-[14px] whitespace-pre-wrap text-[14px] text-foreground md:text-[16px]">
            {post.text}
          </p>
        )}
        {isPpvLocked ? (
          <div className="mt-[14px]">
            <PPVOverlay
              postId={post.id}
              price={post.ppvPrice!}
              thumbnailUrl={post.media[0]?.url}
              onUnlocked={fetchPost}
            />
          </div>
        ) : (
          <SinglePostMedia media={post.media} />
        )}
        <div className="mt-[20px]">
          <PostActions
            postId={post.id}
            likeCount={post.likeCount}
            commentCount={commentCount}
            shareCount={0}
            isLiked={post.isLiked}
            isBookmarked={post.isBookmarked}
          />
        </div>
        <div className="mt-[16px]">
          <CommentsSection postId={post.id} onCountChange={(d) => setCommentCount((p) => p + d)} />
        </div>
      </div>
      <RelatedPosts posts={relatedPosts} authorName={post.author.displayName} />
    </div>
  );
}
