import { useEffect, useState } from 'react';
import { api } from '../lib/api';

const IMG = '/icons/dashboard';

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

interface FeedPost {
  id: string;
  text: string | null;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  createdAt: string;
  author: Author;
  media: Media[];
}

interface StoryItem {
  id: string;
  mediaUrl: string;
  author: Author;
}

function PostActions({ post }: { post: FeedPost }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-[36px]">
        <button className="flex items-center gap-[10px] text-[#f8f8f8] hover:opacity-80">
          <img src={`${IMG}/favorite.svg`} alt="" className="size-[20px]" />
          <span className="text-[16px] font-normal">{post.likeCount} Likes</span>
        </button>
        <button className="flex items-center gap-[10px] text-[#f8f8f8] hover:opacity-80">
          <img src={`${IMG}/mode-comment.svg`} alt="" className="size-[20px]" />
          <span className="text-[16px] font-normal">{post.commentCount} Comments</span>
        </button>
        <button className="flex items-center gap-[10px] text-[#f8f8f8] hover:opacity-80">
          <img src={`${IMG}/share.svg`} alt="" className="size-[20px]" />
          <span className="text-[16px] font-normal">{post.shareCount} Share</span>
        </button>
      </div>
      <button className="flex items-center gap-[10px] text-[#f8f8f8] hover:opacity-80">
        <img src={`${IMG}/volunteer-activism.svg`} alt="" className="size-[20px]" />
        <span className="text-[16px] font-normal">Tip</span>
      </button>
    </div>
  );
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function ImagePost({ post }: { post: FeedPost }) {
  const images = post.media.filter((m) => m.type === 'IMAGE');
  return (
    <div className="rounded-[22px] bg-[#0e1012] px-[20px] py-[13px]">
      <div className="flex flex-col gap-[25px] w-full">
        {/* Header */}
        <div className="flex gap-[25px] items-start justify-between w-full">
          <div className="flex flex-col gap-[14px] flex-1">
            <div className="flex gap-[6px] items-center">
              <div className="size-[44px] shrink-0 rounded-full overflow-hidden">
                <img src={post.author.avatar || ''} alt="" className="size-full object-cover" />
              </div>
              <div className="flex gap-[2px] items-center">
                <div className="text-[0px] font-normal text-[#f8f8f8] whitespace-pre-wrap">
                  <p className="mb-0 text-[16px]">{post.author.displayName}</p>
                  <p className="text-[#5d5d5d] text-[12px]">@{post.author.username}</p>
                </div>
                {post.author.isVerified && (
                  <img src={`${IMG}/verified.svg`} alt="Verified" className="size-[16px]" />
                )}
              </div>
            </div>
            <p className="text-[16px] font-normal text-[#f8f8f8] leading-normal whitespace-pre-wrap">
              {post.text}
            </p>
          </div>
          <div className="flex gap-[18px] items-center shrink-0">
            <span className="text-[16px] font-normal text-[#5d5d5d]">{timeAgo(post.createdAt)}</span>
            <div className="size-[24px] flex items-center justify-center">
              <img src={`${IMG}/pending.svg`} alt="" className="size-[24px] rotate-90" />
            </div>
          </div>
        </div>

        {/* Image grid + actions */}
        <div className="flex flex-col gap-[20px] w-full">
          {images.length > 0 && (
            <div className="flex gap-[20px] w-full">
              {/* Large left */}
              <div className="h-[356px] w-[518px] shrink-0 rounded-[22px] overflow-hidden relative">
                <img src={images[0]?.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
              </div>
              {/* Right column */}
              {images.length > 1 && (
                <div className="flex flex-col gap-[20px] flex-1">
                  <div className="h-[168px] rounded-[22px] overflow-hidden relative">
                    <img src={images[1]?.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                  {images.length > 2 && (
                    <div className="relative h-[168px] rounded-[22px] overflow-hidden">
                      <div
                        className="absolute inset-0 blur-[30.3px] rounded-[22px]"
                        style={{
                          maskImage: `url('${IMG}/post-image-mask.webp')`,
                          WebkitMaskImage: `url('${IMG}/post-image-mask.webp')`,
                          maskSize: 'cover', WebkitMaskSize: 'cover',
                          maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat',
                        }}
                      >
                        <img src={images[2]?.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-[20px] font-normal text-[#f8f8f8] text-center">+08<br />More</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <PostActions post={post} />
        </div>
      </div>
    </div>
  );
}

function VideoPost({ post }: { post: FeedPost }) {
  const video = post.media.find((m) => m.type === 'VIDEO');
  return (
    <div className="rounded-[22px] bg-[#0e1012] relative">
      {/* Header */}
      <div className="flex gap-[25px] items-start justify-between px-[20px] pt-[13px]">
        <div className="flex flex-col gap-[14px] pl-[20px] pr-[40px] flex-1">
          <div className="flex gap-[6px] items-center">
            <div className="size-[44px] shrink-0 rounded-full overflow-hidden">
              <img src={post.author.avatar || ''} alt="" className="size-full object-cover" />
            </div>
            <div className="text-[0px] font-normal text-[#f8f8f8] whitespace-pre-wrap">
              <p className="mb-0 text-[16px]">{post.author.displayName}</p>
              <p className="text-[#5d5d5d] text-[12px]">@{post.author.username}</p>
            </div>
          </div>
          <p className="text-[16px] font-normal text-[#f8f8f8] leading-normal whitespace-pre-wrap">
            {post.text}
          </p>
        </div>
        <div className="flex gap-[18px] items-center shrink-0">
          <span className="text-[16px] font-normal text-[#5d5d5d]">{timeAgo(post.createdAt)}</span>
          <div className="size-[24px] flex items-center justify-center">
            <img src={`${IMG}/pending.svg`} alt="" className="size-[24px] rotate-90" />
          </div>
        </div>
      </div>

      {/* Video thumbnail */}
      {video && (
        <div className="relative h-[356px] mx-[20px] mt-[25px] rounded-[22px] overflow-hidden">
          <div className="absolute inset-0 overflow-hidden rounded-[22px]">
            <img src={video.thumbnail || video.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-[rgba(21,25,28,0.55)] rounded-[22px]" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <button className="flex gap-[10px] items-center justify-center rounded-[124px] bg-[#15191c] pl-px pr-[34px] py-px pb-[2px]">
              <img src={`${IMG}/play-button.webp`} alt="" className="size-[48px] object-contain" />
              <span className="text-[20px] font-normal text-[#f8f8f8]">Play</span>
            </button>
          </div>
          <div className="absolute h-[24px] left-[15px] bottom-[34px] w-[calc(100%-30px)]">
            <img src={`${IMG}/video-progress.svg`} alt="" className="absolute block max-w-none size-full" />
          </div>
          <p className="absolute left-[43px] bottom-[11px] text-[16px] font-normal text-[#f8f8f8]">00:00 / 03:15</p>
          <div className="absolute h-[29px] right-[270px] bottom-[17px] w-[31px]">
            <img src={`${IMG}/fansbook-watermark.webp`} alt="" className="absolute inset-0 max-w-none object-cover opacity-25 size-full" />
          </div>
          <p className="absolute right-[30px] bottom-[23px] text-[12px] font-normal text-[rgba(248,248,248,0.4)]">
            http://Fansbook.com/{post.author.username}
          </p>
        </div>
      )}

      <div className="px-[20px] py-[20px]">
        <PostActions post={post} />
      </div>
    </div>
  );
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
    <div className="flex flex-col gap-[22px]">
      {/* ── Stories Row ── */}
      {stories.length > 0 && (
        <div className="flex gap-[20px] overflow-x-auto scrollbar-hide">
          {stories.map((story) => (
            <div
              key={story.id}
              className="relative flex h-[186px] w-[133px] shrink-0 flex-col items-center justify-end rounded-[16px] px-[21px] py-[14px] overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 overflow-hidden rounded-[16px]">
                <img src={story.mediaUrl} alt="" className="absolute inset-0 h-full w-full max-w-none object-cover" />
              </div>
              <div className="absolute inset-0 rounded-[16px] bg-gradient-to-b from-[rgba(14,16,18,0)] from-[44%] to-[rgba(14,16,18,0.88)] to-[80%]" />
              <div className="relative flex flex-col items-center gap-[6px] w-[91px]">
                <div className="relative size-[42px]">
                  <div className="absolute inset-[-4.76%]">
                    <img src={story.author.avatar || ''} alt="" className="size-full max-w-none rounded-full object-cover" />
                  </div>
                </div>
                <p className="min-w-full text-center text-[16px] font-normal text-[#f8f8f8] whitespace-pre-wrap">
                  {story.author.displayName}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Image Posts (Figma: before Popular Models) ── */}
      {posts
        .filter((p) => !p.media.some((m) => m.type === 'VIDEO'))
        .map((post) => (
          <ImagePost key={post.id} post={post} />
        ))}

      {/* ── Most Popular Models (Figma: between image and video posts) ── */}
      {models.length > 0 && (
        <div className="flex flex-col gap-[17px]">
          <div className="flex items-center justify-between text-[16px] font-medium text-[#f8f8f8]">
            <p>Most Popular Models</p>
            <p className="underline decoration-solid cursor-pointer">View all</p>
          </div>
          <div className="flex gap-[42px] items-center overflow-x-auto scrollbar-hide">
            {models.map((model) => (
              <div key={model.id} className="flex flex-col gap-[10px] items-center w-[89px] shrink-0">
                <div className="h-[89px] w-full relative">
                  <img src={model.avatar || ''} alt="" className="absolute block max-w-none size-full rounded-full object-cover" />
                </div>
                <p className="text-[16px] font-medium text-[#f8f8f8] text-center w-full whitespace-pre-wrap">
                  {model.displayName}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Video Posts (Figma: after Popular Models) ── */}
      {posts
        .filter((p) => p.media.some((m) => m.type === 'VIDEO'))
        .map((post) => (
          <VideoPost key={post.id} post={post} />
        ))}
    </div>
  );
}
