import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { ImagePost, VideoPost } from '../components/feed/FeedPosts';
import { PostComposerBar } from '../components/feed/PostComposerBar';
import { StoriesRow } from '../components/feed/StoriesRow';
import { EmptyFeedState } from '../components/feed/EmptyFeedState';
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
  const [newPostsAvailable, setNewPostsAvailable] = useState(false);
  const [suggested, setSuggested] = useState<Author[]>([]);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const latestPostIdRef = useRef<string | null>(null);
  const isCreator = user?.role === 'CREATOR';

  const fetchStories = useCallback(async () => {
    try {
      setStoryGroups((await api.get('/feed/stories')).data.data || []);
    } catch {
      /* */
    }
  }, []);

  useEffect(() => {
    async function loadFeed() {
      try {
        const [feedRes, storiesRes, modelsRes] = await Promise.all([
          api.get('/feed?limit=10'),
          api.get('/feed/stories'),
          api.get('/feed/popular-models'),
        ]);
        const feedData = feedRes.data.data;
        const feedPosts = feedData.posts || feedData || [];
        setPosts(feedPosts);
        setCursor(feedData.nextCursor || null);
        setStoryGroups(storiesRes.data.data || []);
        setModels(modelsRes.data.data || []);
        if (feedPosts.length > 0) latestPostIdRef.current = feedPosts[0].id;
        if (feedPosts.length === 0) loadSuggested();
      } catch {
        /* empty */
      } finally {
        setLoading(false);
      }
    }
    async function loadSuggested() {
      try {
        setSuggested((await api.get('/creators/suggestions?limit=6')).data.data || []);
      } catch {
        /* */
      }
    }
    loadFeed();
  }, []);

  // Poll for new posts every 30s
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!latestPostIdRef.current) return;
      try {
        const res = await api.get('/feed?limit=1');
        const latest = res.data.data?.posts?.[0] || res.data.data?.[0];
        if (latest && latest.id !== latestPostIdRef.current) setNewPostsAvailable(true);
      } catch {
        /* */
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const refreshFeed = async () => {
    setNewPostsAvailable(false);
    setLoading(true);
    try {
      const res = await api.get('/feed?limit=10');
      const feedData = res.data.data;
      const feedPosts = feedData.posts || feedData || [];
      setPosts(feedPosts);
      setCursor(feedData.nextCursor || null);
      if (feedPosts.length > 0) latestPostIdRef.current = feedPosts[0].id;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      /* */
    } finally {
      setLoading(false);
    }
  };

  const loadMore = useCallback(async () => {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const data = (await api.get(`/feed?cursor=${cursor}&limit=10`)).data.data;
      setPosts((prev) => [...prev, ...(data.posts || [])]);
      setCursor(data.nextCursor || null);
    } catch {
      /* */
    } finally {
      setLoadingMore(false);
    }
  }, [cursor, loadingMore]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) loadMore();
      },
      { rootMargin: '200px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-foreground border-t-transparent" />
      </div>
    );

  return (
    <div className="flex flex-col gap-[16px] md:gap-[22px]">
      {newPostsAvailable && (
        <button
          onClick={refreshFeed}
          className="sticky top-[90px] z-20 mx-auto rounded-full bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[20px] py-[8px] text-[13px] font-medium text-white shadow-lg transition-opacity hover:opacity-90"
        >
          New posts available — tap to refresh
        </button>
      )}
      {isCreator && <PostComposerBar />}
      {(storyGroups.length > 0 || isCreator) && (
        <StoriesRow groups={storyGroups} isCreator={!!isCreator} onRefetch={fetchStories} />
      )}
      {posts.length === 0 && <EmptyFeedState suggestedCreators={suggested} />}
      {posts
        .filter((p) => !p.media.some((m) => m.type === 'VIDEO'))
        .map((post) => (
          <ImagePost key={post.id} post={post} />
        ))}
      {models.length > 0 && <PopularModels models={models} />}
      {posts
        .filter((p) => p.media.some((m) => m.type === 'VIDEO'))
        .map((post) => (
          <VideoPost key={post.id} post={post} />
        ))}
      <div ref={sentinelRef} className="h-1" />
      {loadingMore && (
        <div className="flex justify-center py-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
        </div>
      )}
    </div>
  );
}

function PopularModels({ models }: { models: Author[] }) {
  return (
    <div className="flex flex-col gap-[8px] md:gap-[17px]">
      <div className="flex items-center justify-between text-[12px] font-medium text-foreground md:text-[16px]">
        <p>Most Popular Models</p>
        <Link to="/explore" className="cursor-pointer underline decoration-solid">
          View all
        </Link>
      </div>
      <div className="flex items-center gap-[21px] overflow-x-auto scrollbar-hide md:gap-[42px]">
        {models.map((m) => (
          <Link
            key={m.id}
            to={`/u/${m.username}`}
            className="flex w-[35px] shrink-0 flex-col items-center gap-[4px] hover:opacity-80 md:w-[89px] md:gap-[10px]"
          >
            <div className="relative h-[35px] w-full md:h-[89px]">
              <img
                src={m.avatar || ''}
                alt=""
                className="absolute block size-full max-w-none rounded-full object-cover"
              />
            </div>
            <p className="w-full whitespace-pre-wrap text-center text-[10px] font-medium text-foreground md:text-[16px]">
              {m.displayName}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
