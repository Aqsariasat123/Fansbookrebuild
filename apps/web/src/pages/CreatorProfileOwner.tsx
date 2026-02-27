import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';
import { api } from '../lib/api';
import { ProfileHeader } from '../components/creator-profile/ProfileHeader';
import { ContentTabs } from '../components/creator-profile/ContentTabs';
import type { ContentTab } from '../components/creator-profile/ContentTabs';
import { PostCard } from '../components/creator-profile/PostCard';
import type { CreatorPost } from '../components/creator-profile/PostCard';

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
}

function filterPosts(posts: CreatorPost[], tab: ContentTab) {
  if (tab === 'photos') return posts.filter((p) => p.media.some((m) => m.type === 'IMAGE'));
  if (tab === 'videos') return posts.filter((p) => p.media.some((m) => m.type === 'VIDEO'));
  return posts;
}

function getEmptyMessage(tab: ContentTab) {
  return tab === 'feed' ? 'No posts yet. Create your first post!' : `No ${tab} yet.`;
}

const HEADER_DEFAULTS = {
  displayName: 'Creator',
  username: '',
  avatar: null as string | null,
  cover: null as string | null,
  bio: '',
  isVerified: false,
  followersCount: 0,
  followingCount: 0,
  postsCount: 0,
};

type HeaderProps = typeof HEADER_DEFAULTS;

function mergeProfile(p: CreatorProfile | null): Partial<HeaderProps> {
  if (!p) return {};
  return {
    displayName: p.displayName,
    username: p.username,
    avatar: p.avatar,
    cover: p.cover,
    bio: p.bio ?? '',
    isVerified: p.isVerified,
    followersCount: p.followersCount,
    followingCount: p.followingCount,
    postsCount: p.postsCount,
  };
}

function mergeUser(
  u: {
    displayName?: string;
    username?: string;
    avatar?: string | null;
    cover?: string | null;
  } | null,
): Partial<HeaderProps> {
  if (!u) return {};
  return { displayName: u.displayName, username: u.username, avatar: u.avatar, cover: u.cover };
}

function resolveHeaderProps(
  p: CreatorProfile | null,
  u: typeof HEADER_DEFAULTS extends HeaderProps ? Parameters<typeof mergeUser>[0] : never,
): HeaderProps {
  return { ...HEADER_DEFAULTS, ...mergeUser(u), ...mergeProfile(p) };
}

export default function CreatorProfileOwner() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [posts, setPosts] = useState<CreatorPost[]>([]);
  const [activeTab, setActiveTab] = useState<ContentTab>('feed');
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  useEffect(() => {
    if (!user?.username) return;
    const u = user.username;
    Promise.all([api.get(`/creator-profile/${u}`), api.get(`/creator-profile/${u}/posts`)])
      .then(([pRes, postsRes]) => {
        if (pRes.data.success) setProfile(pRes.data.data);
        if (postsRes.data.success) setPosts(postsRes.data.data?.items ?? postsRes.data.data ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.username]);

  const handleAvatarUpload = useCallback(
    async (file: File) => {
      setUploadingAvatar(true);
      try {
        const fd = new FormData();
        fd.append('avatar', file);
        const { data: res } = await api.post('/profile/avatar', fd);
        if (res.success) {
          setUser({ ...user!, ...res.data });
          setProfile((p) => (p ? { ...p, avatar: res.data.avatar } : p));
        }
      } finally {
        setUploadingAvatar(false);
      }
    },
    [user, setUser],
  );

  const handleCoverUpload = useCallback(
    async (file: File) => {
      setUploadingCover(true);
      try {
        const fd = new FormData();
        fd.append('cover', file);
        const { data: res } = await api.post('/profile/cover', fd);
        if (res.success) {
          setUser({ ...user!, ...res.data });
          setProfile((p) => (p ? { ...p, cover: res.data.cover } : p));
        }
      } finally {
        setUploadingCover(false);
      }
    },
    [user, setUser],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
      </div>
    );
  }

  const header = resolveHeaderProps(profile, user);
  const filtered = filterPosts(posts, activeTab);

  return (
    <div className="flex flex-col gap-[12px] md:gap-[20px]">
      <ProfileHeader
        {...header}
        hashtags={[]}
        uploadingAvatar={uploadingAvatar}
        uploadingCover={uploadingCover}
        onAvatarUpload={handleAvatarUpload}
        onCoverUpload={handleCoverUpload}
      />
      <div className="rounded-[11px] bg-[#0e1012] md:rounded-[22px]">
        <ContentTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex flex-col gap-[12px] p-[12px] md:gap-[20px] md:p-[20px]">
          {filtered.length === 0 ? (
            <p className="py-[40px] text-center text-[14px] text-[#5d5d5d]">
              {getEmptyMessage(activeTab)}
            </p>
          ) : (
            filtered.map((post) => <PostCard key={post.id} post={post} onMenuClick={() => {}} />)
          )}
        </div>
      </div>
    </div>
  );
}
