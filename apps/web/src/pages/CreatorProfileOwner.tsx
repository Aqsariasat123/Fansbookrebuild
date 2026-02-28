import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { api } from '../lib/api';
import { ProfileHeader } from '../components/creator-profile/ProfileHeader';
import { ContentTabs } from '../components/creator-profile/ContentTabs';
import type { ContentTab } from '../components/creator-profile/ContentTabs';
import { PostCard } from '../components/creator-profile/PostCard';
import type { CreatorPost } from '../components/creator-profile/PostCard';
import { ScheduleLiveModal } from '../components/creator-profile/ScheduleLiveModal';
import { MediaGrid } from '../components/public-profile/MediaGrid';

interface CreatorProfile {
  username: string;
  displayName: string;
  avatar: string | null;
  cover: string | null;
  bio: string | null;
  isVerified: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  likesCount?: number;
  hashtags?: string[];
  socialLinks?: { facebook?: string; instagram?: string; twitter?: string };
}

const DEFAULT_HASHTAGS = [
  'streaming',
  'Live',
  'Modeling',
  'Enjoy',
  'Game',
  'Adult',
  'Posting',
  'Watching',
  'Story',
];
const DEFAULT_SOCIAL = { facebook: '#', instagram: '#', twitter: '#' };

function filterPosts(posts: CreatorPost[], tab: ContentTab) {
  if (tab === 'photos') return posts.filter((p) => p.media.some((m) => m.type === 'IMAGE'));
  if (tab === 'videos') return posts.filter((p) => p.media.some((m) => m.type === 'VIDEO'));
  return posts;
}

function resolveBasic(p: CreatorProfile | null, user: Record<string, unknown> | null) {
  if (p)
    return {
      displayName: p.displayName,
      username: p.username,
      avatar: p.avatar,
      cover: p.cover,
      bio: p.bio || '',
      isVerified: p.isVerified,
    };
  if (user)
    return {
      displayName: (user.displayName as string) || 'Creator',
      username: (user.username as string) || '',
      avatar: (user.avatar as string | null) || null,
      cover: (user.cover as string | null) || null,
      bio: '',
      isVerified: false,
    };
  return {
    displayName: 'Creator',
    username: '',
    avatar: null,
    cover: null,
    bio: '',
    isVerified: false,
  };
}

function resolveStats(p: CreatorProfile | null) {
  if (!p)
    return {
      followersCount: 0,
      followingCount: 0,
      likesCount: 0,
      hashtags: DEFAULT_HASHTAGS,
      socialLinks: DEFAULT_SOCIAL,
    };
  return {
    followersCount: p.followersCount,
    followingCount: p.followingCount,
    likesCount: p.likesCount ?? p.postsCount,
    hashtags: p.hashtags || DEFAULT_HASHTAGS,
    socialLinks: p.socialLinks || DEFAULT_SOCIAL,
  };
}

function ComposeBar({
  text,
  onChange,
  onNewPost,
}: {
  text: string;
  onChange: (v: string) => void;
  onNewPost: () => void;
}) {
  return (
    <div className="flex items-center gap-[10px] rounded-[22px] bg-[#0e1012] px-[14px] py-[10px] md:gap-[14px] md:px-[20px] md:py-[14px]">
      <input
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Compose new post..."
        className="flex-1 bg-transparent text-[13px] text-[#f8f8f8] placeholder-[#5d5d5d] outline-none md:text-[15px]"
      />
      <button className="text-[#5d5d5d] hover:text-white transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
        </svg>
      </button>
      <button className="text-[#5d5d5d] hover:text-white transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
        </svg>
      </button>
      <button
        onClick={onNewPost}
        className="rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[18px] py-[8px] text-[12px] font-medium text-white transition-opacity hover:opacity-90 md:px-[24px] md:py-[10px] md:text-[14px]"
      >
        Add Post
      </button>
    </div>
  );
}

export default function CreatorProfileOwner() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [posts, setPosts] = useState<CreatorPost[]>([]);
  const [activeTab, setActiveTab] = useState<ContentTab>('feed');
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [composeText, setComposeText] = useState('');

  useEffect(() => {
    if (!user?.username) return;
    const u = user.username;
    Promise.all([api.get(`/creator-profile/${u}`), api.get(`/creator-profile/${u}/posts`)])
      .then(([pRes, postsRes]) => {
        if (pRes.data.success) setProfile(pRes.data.data);
        if (postsRes.data.success) {
          const items = postsRes.data.data?.items ?? postsRes.data.data ?? [];
          setPosts(
            items.map((p: CreatorPost) => ({
              ...p,
              author: {
                displayName: pRes.data.data.displayName,
                username: pRes.data.data.username,
                avatar: pRes.data.data.avatar,
                isVerified: pRes.data.data.isVerified,
              },
            })),
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.username]);

  const handleUpload = useCallback(
    async (type: 'avatar' | 'cover', file: File) => {
      const setter = type === 'avatar' ? setUploadingAvatar : setUploadingCover;
      setter(true);
      try {
        const fd = new FormData();
        fd.append(type, file);
        const { data: res } = await api.post(`/profile/${type}`, fd);
        if (res.success) {
          setUser({ ...user!, ...res.data });
          setProfile((p) => (p ? { ...p, [type]: res.data[type] } : p));
        }
      } finally {
        setter(false);
      }
    },
    [user, setUser],
  );

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
      </div>
    );

  const basic = resolveBasic(profile, user as unknown as Record<string, unknown>);
  const stats = resolveStats(profile);
  const allMedia = posts.flatMap((p) =>
    p.media.map((m) => ({ ...m, type: m.type as string, postId: p.id, isLocked: false })),
  );
  const mediaCount = allMedia.length;
  const isMediaTab = activeTab === 'photos' || activeTab === 'videos';
  const filtered = filterPosts(posts, activeTab);
  const emptyMsg =
    activeTab === 'feed' ? 'No posts yet. Create your first post!' : `No ${activeTab} yet.`;

  return (
    <div>
      {/* ProfileHeader renders cover + left sidebar content */}
      <ProfileHeader
        {...basic}
        {...stats}
        uploadingAvatar={uploadingAvatar}
        uploadingCover={uploadingCover}
        onAvatarUpload={(f) => handleUpload('avatar', f)}
        onCoverUpload={(f) => handleUpload('cover', f)}
        onScheduleLive={() => setShowSchedule(true)}
      />

      {/* 2-column layout: left sidebar (already rendered by ProfileHeader) + right content */}
      <div className="mt-[20px] flex flex-col gap-[20px] md:flex-row md:gap-[30px]">
        {/* LEFT spacer to align with sidebar width */}
        <div className="hidden w-[300px] shrink-0 md:block lg:w-[380px]" />

        {/* RIGHT - compose + tabs + posts */}
        <div className="min-w-0 flex-1">
          <ComposeBar
            text={composeText}
            onChange={setComposeText}
            onNewPost={() => navigate('/creator/post/new')}
          />

          <div className="mt-[20px]">
            <div className="rounded-[22px] bg-[#0e1012]">
              <ContentTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                postCount={posts.length}
                mediaCount={mediaCount}
              />
              {isMediaTab ? (
                <div className="p-[12px] md:p-[20px]">
                  {allMedia.length === 0 ? (
                    <p className="py-[40px] text-center text-[14px] text-[#5d5d5d]">
                      No media yet.
                    </p>
                  ) : (
                    <MediaGrid media={allMedia} />
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-[12px] p-[12px] md:gap-[20px] md:p-[20px]">
                  {filtered.length === 0 ? (
                    <p className="py-[40px] text-center text-[14px] text-[#5d5d5d]">{emptyMsg}</p>
                  ) : (
                    filtered.map((post) => (
                      <PostCard key={post.id} post={post} onMenuAction={() => {}} />
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showSchedule && <ScheduleLiveModal onClose={() => setShowSchedule(false)} />}
    </div>
  );
}
