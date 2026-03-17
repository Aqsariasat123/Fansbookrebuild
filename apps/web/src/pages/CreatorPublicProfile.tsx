import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { SubscriptionModal } from '../components/public-profile/SubscriptionModal';
import { ProfileTabBar } from '../components/public-profile/ProfileTabBar';
import { ProfileSidebar } from '../components/public-profile/ProfileSidebar';
import { ProfileTabContent } from '../components/public-profile/ProfileTabContent';
import { ProfileActions } from '../components/public-profile/ProfileActions';
import { SubscriptionSidebar } from '../components/public-profile/SubscriptionSidebar';
import type { ContentTab } from '../components/public-profile/ProfileTabBar';
import type { PublicPost } from '../components/public-profile/PostCard';
import type { ProfileData } from '../components/public-profile/types';

export default function CreatorPublicProfile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<PublicPost[]>([]);
  const [activeTab, setActiveTab] = useState<ContentTab>('feed');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [amazonLink, setAmazonLink] = useState<string | null>(null);
  const [liveSessionId, setLiveSessionId] = useState<string | null>(null);

  const checkSubscription = useCallback(async (creatorId: string) => {
    try {
      const { data: r } = await api.get(`/subscriptions/check/${creatorId}`);
      if (r.success) setProfile((p) => (p ? { ...p, isSubscribed: r.data.isSubscribed } : p));
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
      api.get('/live').catch(() => ({ data: { success: false, data: [] } })),
    ])
      .then(([pRes, postsRes, liveRes]) => {
        if (pRes.data.success) {
          const pd = pRes.data.data;
          setProfile(pd);
          checkSubscription(pd.id);
          const liveSess = (liveRes.data.data ?? []).find(
            (s: { creatorId: string }) => s.creatorId === pd.id,
          );
          if (liveSess) setLiveSessionId((liveSess as { id: string }).id);
          const links = pd.socialLinks;
          if (Array.isArray(links)) {
            const amz = (links as { platform: string; url: string }[]).find(
              (l) => l.platform === 'Amazon',
            );
            if (amz) setAmazonLink(amz.url);
          }
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

  async function handleSubscribe(tierId: string) {
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

  const isOwnProfile = currentUser?.username === profile.username;
  const mediaCount = posts.reduce((acc, p) => acc + p.media.length, 0);

  return (
    <div>
      {/* Cover image */}
      <div className="relative h-[180px] w-full overflow-hidden rounded-t-[22px] md:h-[240px]">
        {profile.cover ? (
          <img src={profile.cover} alt="" className="absolute inset-0 size-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-[#01adf1]/40 to-[#a61651]/40" />
        )}
        {liveSessionId && (
          <div className="absolute left-[12px] top-[12px]">
            <button
              onClick={() =>
                navigate(`/live/${liveSessionId}`, {
                  state: { creatorName: profile.displayName, creatorAvatar: profile.avatar },
                })
              }
              className="flex items-center gap-[8px] rounded-[8px] bg-red-600 px-[14px] py-[8px] text-[13px] font-semibold text-white shadow-lg"
            >
              <span className="size-[8px] animate-pulse rounded-full bg-white" />
              LIVE · Join Now
            </button>
          </div>
        )}
        {!isOwnProfile && (
          <div className="absolute right-[12px] top-[12px]">
            <ProfileActions
              username={profile.username}
              isFollowing={profile.isFollowing}
              isSubscribed={profile.isSubscribed}
              followLoading={followLoading}
              onFollow={handleFollow}
              onSubscribe={() => setShowSubscribeModal(true)}
            />
          </div>
        )}
      </div>

      {/* Profile info card — avatar overlaps the cover */}
      <div className="-mt-[40px] md:-mt-[52px]">
        <ProfileSidebar profile={profile} amazonLink={amazonLink} />
      </div>

      {/* Tabs + Content + Sidebar */}
      <div className="mt-[20px] flex gap-[24px]">
        <div className="min-w-0 flex-1">
          <ProfileTabBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            postsCount={profile.postsCount}
            mediaCount={mediaCount}
          />
          <div className="mt-[20px]">
            <ProfileTabContent
              activeTab={activeTab}
              posts={posts}
              isSubscribed={profile.isSubscribed}
            />
          </div>
        </div>

        {!isOwnProfile && (
          <SubscriptionSidebar
            tiers={profile.tiers}
            onSubscribe={handleSubscribe}
            creatorUsername={profile.username}
            profileId={profile.id}
            displayName={profile.displayName}
            isSubscribed={profile.isSubscribed}
          />
        )}
      </div>

      {showSubscribeModal && (
        <SubscriptionModal
          tiers={profile.tiers}
          loading={subscribeLoading}
          onClose={() => setShowSubscribeModal(false)}
          onSubscribe={handleSubscribe}
        />
      )}
    </div>
  );
}
