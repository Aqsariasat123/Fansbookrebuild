import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { ImagePost, VideoPost } from '../components/feed/FeedPosts';
import type { FeedPost } from '../components/feed/FeedPosts';

export default function Bookmarks() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/posts/bookmarks/list')
      .then((res) => setPosts(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[16px] md:gap-[22px]">
      <div className="flex items-center justify-between">
        <p className="text-[20px] font-medium text-foreground">Bookmarks</p>
        <Link to="/feed" className="text-[14px] text-muted-foreground hover:text-foreground">
          Back to Feed
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-[22px] bg-card py-16">
          <svg
            className="size-12 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          <p className="text-[16px] text-muted-foreground">No bookmarked posts yet</p>
          <Link to="/feed" className="text-[14px] text-primary hover:underline">
            Explore Feed
          </Link>
        </div>
      ) : (
        posts.map((post) =>
          post.media.some((m) => m.type === 'VIDEO') ? (
            <VideoPost key={post.id} post={post} />
          ) : (
            <ImagePost key={post.id} post={post} />
          ),
        )
      )}
    </div>
  );
}
