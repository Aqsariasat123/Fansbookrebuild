import type { CreatorPost } from '../components/creator-profile/PostCard';
import type { ContentTab } from '../components/creator-profile/ContentTabs';

export interface CreatorProfile {
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

export const DEFAULT_HASHTAGS = [
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
export const DEFAULT_SOCIAL = { facebook: '#', instagram: '#', twitter: '#' };

export function filterPosts(posts: CreatorPost[], tab: ContentTab) {
  if (tab === 'photos') return posts.filter((p) => p.media.some((m) => m.type === 'IMAGE'));
  if (tab === 'videos') return posts.filter((p) => p.media.some((m) => m.type === 'VIDEO'));
  return posts;
}

export function resolveBasic(p: CreatorProfile | null, user: Record<string, unknown> | null) {
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

export function resolveStats(p: CreatorProfile | null) {
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

export function ComposeBar({
  text,
  onChange,
  onNewPost,
}: {
  text: string;
  onChange: (v: string) => void;
  onNewPost: () => void;
}) {
  return (
    <div className="flex items-center gap-[10px] rounded-[22px] bg-card px-[14px] py-[10px] md:gap-[14px] md:px-[20px] md:py-[14px]">
      <input
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Compose new post..."
        className="flex-1 bg-transparent text-[13px] text-foreground placeholder-muted-foreground outline-none md:text-[15px]"
      />
      <button className="text-muted-foreground hover:text-white transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
        </svg>
      </button>
      <button className="text-muted-foreground hover:text-white transition-colors">
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
