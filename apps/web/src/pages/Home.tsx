import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { ImagePost, VideoPost } from '../components/feed/FeedPosts';
import type { FeedPost } from '../components/feed/FeedPosts';

const IMG = '/icons/dashboard';

interface Author {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  isVerified?: boolean;
}

interface StoryItem {
  id: string;
  mediaUrl: string;
  author: Author;
}

export default function Home() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [models, setModels] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [feedRes, storiesRes, modelsRes] = await Promise.all([
          api.get('/feed'),
          api.get('/feed/stories'),
          api.get('/feed/popular-models'),
        ]);
        setPosts(feedRes.data.data || []);
        setStories(storiesRes.data.data || []);
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
      {/* Mobile search bar */}
      <div className="flex items-center gap-[10px] rounded-[68px] bg-[#0e1012] px-[15px] py-[9px] lg:hidden">
        <img src={`${IMG}/search.svg`} alt="" className="size-[15px]" />
        <input
          type="text"
          placeholder="Search..."
          className="flex-1 bg-transparent text-[12px] text-[#f8f8f8] placeholder-[#5d5d5d] outline-none"
        />
      </div>

      {/* Compose post bar (mobile) */}
      <div className="flex h-[37px] items-center justify-between rounded-[46px] bg-[#0e1012] px-[16px] py-[8px] md:hidden">
        <p className="text-[8px] text-[#5d5d5d]">Compose new post...</p>
        <button className="rounded-[36px] bg-gradient-to-l from-[#a61651] to-[#01adf1] px-[11px] py-[6px] text-[12px] font-medium text-[#f8f8f8] shadow-sm">
          Add Post
        </button>
      </div>

      {/* Stories Row */}
      {stories.length > 0 && (
        <div className="flex gap-[16px] overflow-x-auto scrollbar-hide md:gap-[20px]">
          {stories.map((story) => (
            <div
              key={story.id}
              className="flex shrink-0 cursor-pointer flex-col items-center gap-[6px]"
            >
              <div className="relative size-[52px] overflow-hidden rounded-full md:h-[186px] md:w-[133px] md:rounded-[16px]">
                <img
                  src={story.mediaUrl}
                  alt=""
                  className="absolute inset-0 h-full w-full max-w-none object-cover"
                />
                <div className="absolute inset-0 hidden rounded-[16px] bg-gradient-to-b from-[rgba(14,16,18,0)] from-[44%] to-[rgba(14,16,18,0.88)] to-[80%] md:block" />
                <div className="absolute bottom-[30px] left-1/2 hidden -translate-x-1/2 md:block">
                  <img
                    src={story.author.avatar || ''}
                    alt=""
                    className="size-[42px] rounded-full object-cover"
                  />
                </div>
              </div>
              <p className="w-[52px] truncate text-center text-[12px] font-normal text-[#f8f8f8] md:w-[91px] md:text-[16px]">
                {story.author.displayName}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Image Posts */}
      {posts
        .filter((p) => !p.media.some((m) => m.type === 'VIDEO'))
        .map((post) => (
          <ImagePost key={post.id} post={post} />
        ))}

      {/* Most Popular Models */}
      {models.length > 0 && (
        <div className="flex flex-col gap-[8px] md:gap-[17px]">
          <div className="flex items-center justify-between text-[12px] font-medium text-[#f8f8f8] md:text-[16px]">
            <p>Most Popular Models</p>
            <p className="cursor-pointer underline decoration-solid">View all</p>
          </div>
          <div className="flex items-center gap-[21px] overflow-x-auto scrollbar-hide md:gap-[42px]">
            {models.map((model) => (
              <div
                key={model.id}
                className="flex w-[35px] shrink-0 flex-col items-center gap-[4px] md:w-[89px] md:gap-[10px]"
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
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Posts */}
      {posts
        .filter((p) => p.media.some((m) => m.type === 'VIDEO'))
        .map((post) => (
          <VideoPost key={post.id} post={post} />
        ))}
    </div>
  );
}
