import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { SubscriptionModal } from '../components/public-profile/SubscriptionModal';
import { ProfileTabBar } from '../components/public-profile/ProfileTabBar';
import { ProfileSidebar } from '../components/public-profile/ProfileSidebar';
import { ProfileTabContent } from '../components/public-profile/ProfileTabContent';
import type { ContentTab } from '../components/public-profile/ProfileTabBar';
import type { PublicPost } from '../components/public-profile/PostCard';

type ViewMode = 'list' | 'grid';

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
  const [viewMode, setViewMode] = useState<ViewMode>('list');

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
      <CoverBanner cover={profile.cover} />
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

function ViewModeToggle({
  viewMode,
  onChange,
}: {
  viewMode: ViewMode;
  onChange: (m: ViewMode) => void;
}) {
  return (
    <div className="flex gap-[4px] rounded-[8px] bg-muted p-[4px]">
      <button
        onClick={() => onChange('list')}
        className={`rounded-[6px] p-[6px] transition-colors ${viewMode === 'list' ? 'bg-card text-foreground' : 'text-muted-foreground'}`}
        title="List view"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
        </svg>
      </button>
      <button
        onClick={() => onChange('grid')}
        className={`rounded-[6px] p-[6px] transition-colors ${viewMode === 'grid' ? 'bg-card text-foreground' : 'text-muted-foreground'}`}
        title="Grid view"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z" />
        </svg>
      </button>
    </div>
  );
}
