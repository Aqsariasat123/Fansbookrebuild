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
}

type ContentTab = 'feed' | 'photos' | 'videos';

export default function CreatorPublicProfile() {
  const { username } = useParams<{ username: string }>();
  const currentUser = useAuthStore((s) => s.user);

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<PublicPost[]>([]);
  const [activeTab, setActiveTab] = useState<ContentTab>('feed');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    setNotFound(false);

    async function load() {
      try {
        const [profileRes, postsRes] = await Promise.all([
          api.get(`/creator-profile/${username}`),
          api.get(`/creator-profile/${username}/posts?tab=feed`),
        ]);
        if (profileRes.data.success) setProfile(profileRes.data.data);
        if (postsRes.data.success) setPosts(postsRes.data.data?.items || postsRes.data.data || []);
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 404) setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [username]);

  useEffect(() => {
    if (!username || !activeTab) return;

    async function loadPosts() {
      try {
        const res = await api.get(`/creator-profile/${username}/posts?tab=${activeTab}`);
        if (res.data.success) setPosts(res.data.data?.items || res.data.data || []);
      } catch {
        /* keep current posts */
      }
    }
    loadPosts();
  }, [username, activeTab]);

  async function handleFollow() {
    if (!profile) return;
    setFollowLoading(true);
    try {
      if (profile.isFollowing) {
        await api.delete(`/creator-profile/${username}/follow`);
        setProfile((prev) =>
          prev ? { ...prev, isFollowing: false, followersCount: prev.followersCount - 1 } : prev,
        );
      } else {
        await api.post(`/creator-profile/${username}/follow`);
        setProfile((prev) =>
          prev ? { ...prev, isFollowing: true, followersCount: prev.followersCount + 1 } : prev,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#5d5d5d"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
        <p className="mt-[12px] text-[18px] font-medium text-[#f8f8f8]">Creator not found</p>
        <p className="mt-[4px] text-[14px] text-[#5d5d5d]">
          The profile you are looking for does not exist.
        </p>
      </div>
    );
  }

  const isOwnProfile = currentUser?.username === profile.username;
  const tabs: { key: ContentTab; label: string }[] = [
    { key: 'feed', label: 'Feed' },
    { key: 'photos', label: 'Photos' },
    { key: 'videos', label: 'Videos' },
  ];

  const filteredPosts = posts.filter((p) => {
    if (activeTab === 'photos') return p.media.some((m) => m.type === 'IMAGE');
    if (activeTab === 'videos') return p.media.some((m) => m.type === 'VIDEO');
    return true;
  });

  return (
    <div className="flex flex-col gap-[12px] md:gap-[20px]">
      <PublicProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        followLoading={followLoading}
        onFollow={handleFollow}
        onSubscribe={() => handleSubscribe()}
      />

      <div className="flex gap-[20px]">
        {/* Main Content */}
        <div className="min-w-0 flex-1">
          <div className="rounded-t-[11px] bg-[#0e1012] md:rounded-t-[22px]">
            <div className="flex border-b border-[#2a2d30]">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`flex-1 py-[12px] text-center text-[13px] font-medium transition-colors md:py-[16px] md:text-[16px] ${
                    activeTab === t.key
                      ? 'border-b-2 border-purple-500 text-purple-400'
                      : 'text-[#5d5d5d] hover:text-[#a0a0a0]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-[12px] pt-[12px] md:gap-[20px] md:pt-[20px]">
            {filteredPosts.length === 0 ? (
              <div className="rounded-[11px] bg-[#0e1012] p-[40px] text-center md:rounded-[22px]">
                <p className="text-[14px] text-[#5d5d5d] md:text-[16px]">
                  {activeTab === 'feed' ? 'No posts yet.' : `No ${activeTab} yet.`}
                </p>
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
