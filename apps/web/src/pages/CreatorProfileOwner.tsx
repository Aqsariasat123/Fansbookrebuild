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
import { filterPosts, resolveBasic, resolveStats, ComposeBar } from './CreatorProfileOwnerParts';
import type { CreatorProfile } from './CreatorProfileOwnerParts';

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
          const mapped: CreatorPost[] = items.map((p: CreatorPost) => ({
            ...p,
            author: {
              displayName: pRes.data.data.displayName,
              username: pRes.data.data.username,
              avatar: pRes.data.data.avatar,
              isVerified: pRes.data.data.isVerified,
            },
          }));
          setPosts([...mapped].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)));
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

  const handleMenuAction = useCallback(async (postId: string, action: string) => {
    try {
      if (action === 'remove') {
        await api.delete(`/posts/${postId}`);
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      } else if (action === 'pin') {
        await api.patch(`/posts/${postId}/pin`, { isPinned: true });
        setPosts((prev) => {
          const updated = prev.map((p) => ({ ...p, isPinned: p.id === postId }));
          return [...updated].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
        });
      } else if (action === 'unpin') {
        await api.patch(`/posts/${postId}/pin`, { isPinned: false });
        setPosts((prev) => {
          const updated = prev.map((p) => (p.id === postId ? { ...p, isPinned: false } : p));
          return [...updated].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
        });
      }
    } catch {
      /* ignore */
    }
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-foreground border-t-transparent" />
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
      />

      {/* 2-column layout: left sidebar (already rendered by ProfileHeader) + right content */}
      <div className="mt-[20px] flex flex-col gap-[20px] md:flex-row md:gap-[30px]">
        {/* LEFT spacer to align with sidebar width */}
        <div className="hidden w-[300px] shrink-0 md:block lg:w-[380px]" />

        {/* RIGHT - compose + tabs + posts */}
        <div className="min-w-0 flex-1">
          {/* Go Live buttons */}
          <div className="mb-[16px] flex gap-[16px]">
            <button
              onClick={() => navigate('/creator/go-live')}
              className="flex-1 rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[14px] text-[16px] font-medium text-white"
            >
              Go Live
            </button>
            <button
              onClick={() => setShowSchedule(true)}
              className="flex-1 rounded-[8px] border border-foreground py-[14px] text-[16px] font-medium text-foreground"
            >
              Schedule Live
            </button>
          </div>

          <ComposeBar
            text={composeText}
            onChange={setComposeText}
            onNewPost={() => navigate('/creator/post/new')}
          />

          <div className="mt-[20px]">
            <div className="rounded-[22px] bg-card">
              <ContentTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                postCount={posts.length}
                mediaCount={mediaCount}
              />
              {isMediaTab ? (
                <div className="p-[12px] md:p-[20px]">
                  {allMedia.length === 0 ? (
                    <p className="py-[40px] text-center text-[14px] text-muted-foreground">
                      No media yet.
                    </p>
                  ) : (
                    <MediaGrid media={allMedia} />
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-[12px] p-[12px] md:gap-[20px] md:p-[20px]">
                  {filtered.length === 0 ? (
                    <p className="py-[40px] text-center text-[14px] text-muted-foreground">
                      {emptyMsg}
                    </p>
                  ) : (
                    filtered.map((post) => (
                      <PostCard key={post.id} post={post} onMenuAction={handleMenuAction} />
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
