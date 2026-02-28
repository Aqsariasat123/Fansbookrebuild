import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { SubscriptionModal } from '../components/public-profile/SubscriptionModal';
import { PostCard } from '../components/public-profile/PostCard';
import { MediaGrid } from '../components/public-profile/MediaGrid';
import { ProfileTabBar } from '../components/public-profile/ProfileTabBar';
import { ProfileSidebar } from '../components/public-profile/ProfileSidebar';
import type { ContentTab } from '../components/public-profile/ProfileTabBar';
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

function extractMedia(posts: PublicPost[], isSubscribed: boolean, type: 'IMAGE' | 'VIDEO') {
  return posts.flatMap((p) =>
    p.media
      .filter((m) => m.type === type)
      .map((m) => ({
        ...m,
        postId: p.id,
        isLocked: !isSubscribed && p.visibility !== 'PUBLIC' && p.visibility !== 'FREE',
      })),
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-[22px] bg-card p-[40px] text-center">
      <p className="text-[14px] text-muted-foreground">{label}</p>
    </div>
  );
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

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    Promise.all([
      api.get(`/creator-profile/${username}`),
      api.get(`/creator-profile/${username}/posts?tab=feed`),
    ])
      .then(([pRes, postsRes]) => {
        if (pRes.data.success) setProfile(pRes.data.data);
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
      /* silent */
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

  const isOwnProfile = currentUser?.username === profile.username;

  return (
    <div>
      <CoverBanner cover={profile.cover} />

      <div className="flex flex-col gap-[24px] md:flex-row md:gap-[30px]">
        <div className="w-full shrink-0 md:w-[300px] lg:w-[380px]">
          <ProfileSidebar
            profile={profile}
            isOwnProfile={isOwnProfile}
            followLoading={followLoading}
            onFollow={handleFollow}
            onSubscribe={() => setShowSubscribeModal(true)}
          />
        </div>

        <div className="min-w-0 flex-1">
          <ProfileTabBar activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="mt-[20px]">
            <TabContent activeTab={activeTab} posts={posts} isSubscribed={profile.isSubscribed} />
          </div>
        </div>
      </div>

      {showSubscribeModal && (
        <SubscriptionModal
          tiers={profile.tiers}
          onClose={() => setShowSubscribeModal(false)}
          onSubscribe={(tierId) => {
            void tierId;
            setShowSubscribeModal(false);
          }}
        />
      )}
    </div>
  );
}

function CoverBanner({ cover }: { cover: string | null }) {
  return (
    <div className="relative h-[180px] w-full overflow-hidden md:h-[240px]">
      {cover ? (
        <img src={cover} alt="" className="absolute inset-0 size-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-muted" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
    </div>
  );
}

function TabContent({
  activeTab,
  posts,
  isSubscribed,
}: {
  activeTab: ContentTab;
  posts: PublicPost[];
  isSubscribed: boolean;
}) {
  if (activeTab === 'feed') {
    if (posts.length === 0) return <EmptyState label="No posts yet." />;
    return (
      <div className="flex flex-col gap-[20px]">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} isSubscribed={isSubscribed} />
        ))}
      </div>
    );
  }

  const mediaType = activeTab === 'photos' ? ('IMAGE' as const) : ('VIDEO' as const);
  const media = extractMedia(posts, isSubscribed, mediaType);
  const emptyLabel = activeTab === 'photos' ? 'No photos yet.' : 'No videos yet.';

  if (media.length === 0) return <EmptyState label={emptyLabel} />;
  return <MediaGrid media={media} />;
}
