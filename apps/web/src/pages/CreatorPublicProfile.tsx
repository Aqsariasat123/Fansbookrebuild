import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { PublicProfileHeader } from '../components/public-profile/PublicProfileHeader';
import { SubscriptionSidebar } from '../components/public-profile/SubscriptionSidebar';
import { PostCard } from '../components/public-profile/PostCard';
import type { PublicPost } from '../components/public-profile/PostCard';

interface Tier {
  id: string;
  name: string;
  price: number;
  description: string | null;
  benefits: string[];
}

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
  tiers: Tier[];
  likesCount?: number;
  socialLinks?: Record<string, string>;
  hashtags?: string[];
}

type ContentTab = 'posts' | 'media';

function TabBar({
  activeTab,
  onTabChange,
  postCount,
  mediaCount,
}: {
  activeTab: ContentTab;
  onTabChange: (t: ContentTab) => void;
  postCount: number;
  mediaCount: number;
}) {
  const tabs: { key: ContentTab; label: string; count: number; icon: string }[] = [
    {
      key: 'posts',
      count: postCount,
      label: 'Posts',
      icon: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z',
    },
    {
      key: 'media',
      count: mediaCount,
      label: 'Media',
      icon: 'M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z',
    },
  ];
  return (
    <div className="flex rounded-t-[22px] bg-[#0e1012]">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`flex flex-1 items-center justify-center gap-[8px] py-[14px] text-[14px] font-medium transition-colors ${activeTab === tab.key ? 'border-b-2 border-[#e91e8c] text-[#f8f8f8]' : 'text-[#5d5d5d]'}`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={activeTab === tab.key ? '#f8f8f8' : '#5d5d5d'}
          >
            <path d={tab.icon} />
          </svg>
          {tab.count} {tab.label}
        </button>
      ))}
    </div>
  );
}

export default function CreatorPublicProfile() {
  const { username } = useParams<{ username: string }>();
  const currentUser = useAuthStore((s) => s.user);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<PublicPost[]>([]);
  const [activeTab, setActiveTab] = useState<ContentTab>('posts');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    Promise.all([
      api.get(`/creator-profile/${username}`),
      api.get(`/creator-profile/${username}/posts?tab=feed`),
    ])
      .then(([pRes, postsRes]) => {
        if (pRes.data.success) setProfile(pRes.data.data);
        if (postsRes.data.success) setPosts(postsRes.data.data?.items || postsRes.data.data || []);
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
        await api.delete(`/creator-profile/${username}/follow`);
        setProfile((p) =>
          p ? { ...p, isFollowing: false, followersCount: p.followersCount - 1 } : p,
        );
      } else {
        await api.post(`/creator-profile/${username}/follow`);
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

  function handleSubscribe(tierId?: string) {
    void tierId;
  }

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
      </div>
    );
  if (notFound || !profile)
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-[18px] font-medium text-[#f8f8f8]">Creator not found</p>
        <p className="mt-[4px] text-[14px] text-[#5d5d5d]">
          The profile you are looking for does not exist.
        </p>
      </div>
    );

  const isOwnProfile = currentUser?.username === profile.username;
  const filteredPosts = activeTab === 'media' ? posts.filter((p) => p.media.length > 0) : posts;
  const postCount = profile.postsCount || posts.length;
  const mediaCount = posts.filter((p) => p.media.length > 0).length;

  return (
    <div className="flex flex-col gap-[20px]">
      <PublicProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        followLoading={followLoading}
        onFollow={handleFollow}
        onSubscribe={() => handleSubscribe()}
      />

      <div className="flex gap-[20px]">
        <div className="min-w-0 flex-1">
          <TabBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            postCount={postCount}
            mediaCount={mediaCount}
          />
          <div className="flex flex-col gap-[20px] pt-[20px]">
            {filteredPosts.length === 0 ? (
              <div className="rounded-[22px] bg-[#0e1012] p-[40px] text-center">
                <p className="text-[14px] text-[#5d5d5d]">No {activeTab} yet.</p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} isSubscribed={profile.isSubscribed} />
              ))
            )}
          </div>
        </div>

        <SubscriptionSidebar tiers={profile.tiers} onSubscribe={handleSubscribe} />
      </div>
    </div>
  );
}
