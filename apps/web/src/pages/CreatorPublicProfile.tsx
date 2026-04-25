import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useCreatorLiveSync } from '../hooks/useLive';
import { useAuthStore } from '../stores/authStore';
import { SubscriptionModal } from '../components/public-profile/SubscriptionModal';
import { ProfileTabBar } from '../components/public-profile/ProfileTabBar';
import { ProfileSidebar } from '../components/public-profile/ProfileSidebar';
import { ProfileTabContent } from '../components/public-profile/ProfileTabContent';
import { ProfileCoverArea } from '../components/public-profile/ProfileCoverArea';
import { SubscriptionSidebar } from '../components/public-profile/SubscriptionSidebar';
import type { ContentTab } from '../components/public-profile/ProfileTabBar';
import type { PublicPost } from '../components/public-profile/PostCard';
import type { ProfileData } from '../components/public-profile/types';

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
  const [amazonLink, setAmazonLink] = useState<string | null>(null);
  const [liveSessionId, setLiveSessionId] = useState<string | null>(null);

  useCreatorLiveSync(profile, setLiveSessionId);

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
          api
            .get(`/subscriptions/check/${pd.id}`)
            .then(({ data: r }) => {
              if (r.success)
                setProfile((p) => (p ? { ...p, isSubscribed: r.data.isSubscribed } : p));
            })
            .catch(() => {});
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
  }, [username]);

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
      alert(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Failed to subscribe',
      );
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
      <ProfileCoverArea
        cover={profile.cover}
        liveSessionId={liveSessionId}
        creatorName={profile.displayName}
        creatorAvatar={profile.avatar}
        isOwnProfile={isOwnProfile}
        username={profile.username}
        isFollowing={profile.isFollowing}
        isSubscribed={profile.isSubscribed}
        followLoading={followLoading}
        onFollow={handleFollow}
        onSubscribe={() => setShowSubscribeModal(true)}
      />
      <div className="-mt-[40px] md:-mt-[52px]">
        <ProfileSidebar
          profile={profile}
          amazonLink={amazonLink}
          isOwnProfile={isOwnProfile}
          followLoading={followLoading}
          onFollow={handleFollow}
          onSubscribe={() => setShowSubscribeModal(true)}
        />
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
