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

interface ScheduledSession {
  id: string;
  title: string;
  scheduledAt: string;
}

export function GoLiveSidebar({
  onGoLive,
  onSchedule,
  scheduled,
  onDeleteScheduled,
}: {
  onGoLive: () => void;
  onSchedule: () => void;
  scheduled: ScheduledSession[];
  onDeleteScheduled: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-[12px]">
      <button
        onClick={onGoLive}
        className="w-full rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[12px] text-[15px] font-medium text-white"
      >
        Go Live
      </button>
      <button
        onClick={onSchedule}
        className="w-full rounded-[8px] border border-border py-[12px] text-[15px] font-medium text-foreground hover:border-foreground transition-colors"
      >
        Schedule Live
      </button>
      {scheduled.length > 0 && (
        <div className="mt-[4px] flex flex-col gap-[8px]">
          <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">
            Scheduled Lives
          </p>
          {scheduled.map((s) => (
            <div
              key={s.id}
              className="flex items-start justify-between rounded-[10px] border border-border bg-card px-[12px] py-[10px]"
            >
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-foreground">{s.title}</p>
                <p className="text-[11px] text-muted-foreground">
                  {new Date(s.scheduledAt).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <button
                onClick={() => onDeleteScheduled(s.id)}
                className="ml-[8px] shrink-0 rounded-[6px] border border-red-500/40 px-[8px] py-[4px] text-[11px] text-red-500 hover:bg-red-500/10"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
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
      <button className="text-muted-foreground hover:text-foreground transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
        </svg>
      </button>
      <button className="text-muted-foreground hover:text-foreground transition-colors">
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
