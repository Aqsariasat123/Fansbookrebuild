import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { ImagePost, VideoPost } from '../components/feed/FeedPosts';
import type { FeedPost } from '../components/feed/FeedPosts';

export default function HashtagFeed() {
  const { tag } = useParams<{ tag: string }>();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPosts = useCallback(
    (p: number, append = false) => {
      if (!tag) return;
      const setLoad = p === 1 ? setLoading : setLoadingMore;
      setLoad(true);
      api
        .get(`/hashtags/${encodeURIComponent(tag)}/posts?page=${p}&limit=10`)
        .then(({ data: r }) => {
          if (append) setPosts((prev) => [...prev, ...r.data.items]);
          else setPosts(r.data.items);
          setTotal(r.data.total);
        })
        .catch(() => {})
        .finally(() => setLoad(false));
    },
    [tag],
  );

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, true);
  };

  const hasMore = posts.length < total;

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="rounded-[22px] bg-card p-[16px] md:p-[22px]">
        <Link to="/search" className="text-[14px] text-muted-foreground hover:text-foreground">
          &larr; Back to Search
        </Link>
        <div className="mt-[12px] flex items-center gap-[12px]">
          <h1 className="text-[24px] font-semibold text-[#01adf1]">#{tag}</h1>
          <span className="text-[14px] text-muted-foreground">{total} posts</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-[60px]">
          <div className="size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
        </div>
      ) : posts.length === 0 ? (
        <p className="py-[40px] text-center text-[16px] text-muted-foreground">
          No posts with #{tag}
        </p>
      ) : (
        <div className="flex flex-col gap-[20px]">
          {posts.map((post) => {
            const hasVideo = post.media.some((m) => m.type === 'VIDEO');
            return hasVideo ? (
              <VideoPost key={post.id} post={post} onRefresh={() => fetchPosts(1)} />
            ) : (
              <ImagePost key={post.id} post={post} onRefresh={() => fetchPosts(1)} />
            );
          })}
          {hasMore && (
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="mx-auto rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[32px] py-[10px] text-[14px] font-medium text-white disabled:opacity-50"
            >
              {loadingMore ? 'Loading...' : 'Load More'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
