import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { ImagePost, VideoPost } from '../components/feed/FeedPosts';
import { PostComposerBar } from '../components/feed/PostComposerBar';
import { StoriesRow } from '../components/feed/StoriesRow';
import type { StoryGroup } from '../components/feed/StoryViewer';
import type { FeedPost } from '../components/feed/FeedPosts';

interface Author {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  isVerified?: boolean;
}

export default function Home() {
  const user = useAuthStore((s) => s.user);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([]);
  const [models, setModels] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isCreator = user?.role === 'CREATOR';

  const fetchStories = useCallback(async () => {
    try {
      const res = await api.get('/feed/stories');
      setStoryGroups(res.data.data || []);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const [feedRes, storiesRes, modelsRes] = await Promise.all([
          api.get('/feed?limit=10'),
          api.get('/feed/stories'),
          api.get('/feed/popular-models'),
        ]);
        const feedData = feedRes.data.data;
        setPosts(feedData.posts || feedData || []);
        setCursor(feedData.nextCursor || null);
        setStoryGroups(storiesRes.data.data || []);
        setModels(modelsRes.data.data || []);
      } catch {
        /* empty state */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const loadMore = useCallback(async () => {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await api.get(`/feed?cursor=${cursor}&limit=10`);
      const data = res.data.data;
      setPosts((prev) => [...prev, ...(data.posts || [])]);
      setCursor(data.nextCursor || null);
    } catch {
      /* ignore */
    } finally {
      setLoadingMore(false);
    }
  }, [cursor, loadingMore]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: '200px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-foreground border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[16px] md:gap-[22px]">
      {isCreator && <PostComposerBar />}

      {(storyGroups.length > 0 || isCreator) && (
        <StoriesRow groups={storyGroups} isCreator={!!isCreator} onRefetch={fetchStories} />
      )}

      {posts
        .filter((p) => !p.media.some((m) => m.type === 'VIDEO'))
        .map((post) => (
          <ImagePost key={post.id} post={post} />
        ))}

      {models.length > 0 && (
        <div className="flex flex-col gap-[8px] md:gap-[17px]">
          <div className="flex items-center justify-between text-[12px] font-medium text-foreground md:text-[16px]">
            <p>Most Popular Models</p>
            <Link to="/explore" className="cursor-pointer underline decoration-solid">
              View all
            </Link>
          </div>
          <div className="flex items-center gap-[21px] overflow-x-auto scrollbar-hide md:gap-[42px]">
            {models.map((model) => (
              <Link
                key={model.id}
                to={`/u/${model.username}`}
                className="flex w-[35px] shrink-0 flex-col items-center gap-[4px] hover:opacity-80 md:w-[89px] md:gap-[10px]"
              >
                <div className="relative h-[35px] w-full md:h-[89px]">
                  <img
                    src={model.avatar || ''}
                    alt=""
                    className="absolute block size-full max-w-none rounded-full object-cover"
                  />
                </div>
                <p className="w-full whitespace-pre-wrap text-center text-[10px] font-medium text-foreground md:text-[16px]">
                  {model.displayName}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {posts
        .filter((p) => p.media.some((m) => m.type === 'VIDEO'))
        .map((post) => (
          <VideoPost key={post.id} post={post} />
        ))}

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-1" />
      {loadingMore && (
        <div className="flex justify-center py-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
        </div>
      )}
    </div>
  );
}
