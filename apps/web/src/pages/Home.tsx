import { useCallback, useEffect, useState } from 'react';
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
          api.get('/feed'),
          api.get('/feed/stories'),
          api.get('/feed/popular-models'),
        ]);
        setPosts(feedRes.data.data || []);
        setStoryGroups(storiesRes.data.data || []);
        setModels(modelsRes.data.data || []);
      } catch {
        /* will show empty state */
      } finally {
        setLoading(false);
      }
    }
    load();
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
          <div className="flex items-center justify-between text-[12px] font-medium text-[#f8f8f8] md:text-[16px]">
            <p>Most Popular Models</p>
            <p className="cursor-pointer underline decoration-solid">View all</p>
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
                <p className="w-full whitespace-pre-wrap text-center text-[10px] font-medium text-[#f8f8f8] md:text-[16px]">
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
    </div>
  );
}
