import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { SubscriptionModal } from '../components/public-profile/SubscriptionModal';
import { ProfileTabBar } from '../components/public-profile/ProfileTabBar';
import { ProfileSidebar } from '../components/public-profile/ProfileSidebar';
import { ProfileTabContent } from '../components/public-profile/ProfileTabContent';
import type { ContentTab } from '../components/public-profile/ProfileTabBar';
import { ViewModeToggle } from '../components/public-profile/ViewModeToggle';
import type { PublicPost } from '../components/public-profile/PostCard';

interface ProfileData {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  cover: string | null;
  bio: string | null;
  isVerified: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing: boolean;
  isSubscribed: boolean;
  tiers: {
    id: string;
    name: string;
    price: number;
    description: string | null;
    benefits: string[];
  }[];
  likesCount?: number;
  socialLinks?: Record<string, string>;
  hashtags?: string[];
}

export default function CreatorPublicProfile() {
  const { username } = useParams<{ username: string }>();
  const currentUser = useAuthStore((s) => s.user);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<PublicPost[]>([]);
  const [activeTab, setActiveTab] = useState<ContentTab>('feed');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const checkSubscription = useCallback(async (creatorId: string) => {
    try {
      const { data: r } = await api.get(`/subscriptions/check/${creatorId}`);
      if (r.success) {
        setProfile((p) => (p ? { ...p, isSubscribed: r.data.isSubscribed } : p));
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    Promise.all([
      api.get(`/creator-profile/${username}`),
      api.get(`/creator-profile/${username}/posts?tab=feed`),
    ])
      .then(([pRes, postsRes]) => {
        if (pRes.data.success) {
          setProfile(pRes.data.data);
          checkSubscription(pRes.data.data.id);
        }
        if (postsRes.data.success) setPosts(postsRes.data.data?.items ?? postsRes.data.data ?? []);
      })
      .catch((err: unknown) => {
        if ((err as { response?: { status?: number } })?.response?.status === 404)
          setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [username, checkSubscription]);

  async function handleFollow() {
    if (!profile) return;
    setFollowLoading(true);
    try {
      if (profile.isFollowing) {
        await api.delete(`/followers/${profile.id}`);
        setProfile((p) =>
          p ? { ...p, isFollowing: false, followersCount: p.followersCount - 1 } : p,
        );
      } else {
        await api.post(`/followers/${profile.id}`);
        setProfile((p) =>
          p ? { ...p, isFollowing: true, followersCount: p.followersCount + 1 } : p,
        );
      }
    } catch {
      /* */
    } finally {
      setFollowLoading(false);
    }
  }

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-foreground border-t-transparent" />
      </div>
    );
  if (notFound || !profile)
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-[18px] font-medium text-foreground">Creator not found</p>
        <p className="mt-[4px] text-[14px] text-muted-foreground">
          The profile you are looking for does not exist.
        </p>
      </div>
    );

  return (
    <div>
      <div className="relative h-[180px] w-full overflow-hidden md:h-[240px]">
        {profile.cover ? (
          <img src={profile.cover} alt="" className="absolute inset-0 size-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>
      <div className="flex flex-col gap-[24px] md:flex-row md:gap-[30px]">
        <div className="w-full shrink-0 md:w-[300px] lg:w-[380px]">
          <ProfileSidebar
            profile={profile}
            isOwnProfile={currentUser?.username === profile.username}
            followLoading={followLoading}
            onFollow={handleFollow}
            onSubscribe={() => setShowSubscribeModal(true)}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-[8px]">
            <div className="flex-1">
              <ProfileTabBar activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            {activeTab === 'feed' && <ViewModeToggle viewMode={viewMode} onChange={setViewMode} />}
          </div>
          <div className="mt-[20px]">
            <ProfileTabContent
              activeTab={activeTab}
              posts={posts}
              isSubscribed={profile.isSubscribed}
              viewMode={viewMode}
            />
          </div>
        </div>
      </div>
      {showSubscribeModal && (
        <SubscriptionModal
          tiers={profile.tiers}
          loading={subscribeLoading}
          onClose={() => setShowSubscribeModal(false)}
          onSubscribe={async (tierId) => {
            setSubscribeLoading(true);
            try {
              await api.post('/subscriptions', { tierId });
              setProfile((p) => (p ? { ...p, isSubscribed: true } : p));
              setShowSubscribeModal(false);
            } catch (err) {
              const msg =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Failed to subscribe';
              alert(msg);
            } finally {
              setSubscribeLoading(false);
            }
          }}
        />
      )}
    </div>
  );
}
