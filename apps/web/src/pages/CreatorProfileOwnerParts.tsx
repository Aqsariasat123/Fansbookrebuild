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

export function ActionButtons({
  onAddPost,
  onGoLive,
  onSchedule,
}: {
  onAddPost: () => void;
  onGoLive: () => void;
  onSchedule: () => void;
}) {
  return (
    <div className="flex gap-[10px] rounded-[22px] bg-card px-[14px] py-[14px] md:gap-[12px] md:px-[20px] md:py-[16px]">
      <button
        onClick={onAddPost}
        className="flex-1 rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[10px] text-[13px] font-medium text-white transition-opacity hover:opacity-90 md:py-[12px] md:text-[14px]"
      >
        Add Post
      </button>
      <button
        onClick={onGoLive}
        className="flex-1 rounded-[50px] border border-border py-[10px] text-[13px] font-medium text-foreground transition-colors hover:border-foreground md:py-[12px] md:text-[14px]"
      >
        Go Live
      </button>
      <button
        onClick={onSchedule}
        className="flex-1 rounded-[50px] border border-border py-[10px] text-[13px] font-medium text-foreground transition-colors hover:border-foreground md:py-[12px] md:text-[14px]"
      >
        Schedule Live
      </button>
    </div>
  );
}
