import { Link } from 'react-router-dom';
import { PostCard } from './PostCard';
import { MediaGrid } from './MediaGrid';
import type { ContentTab } from './ProfileTabBar';
import type { PublicPost } from './PostCard';

type ViewMode = 'list' | 'grid';

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

interface Props {
  activeTab: ContentTab;
  posts: PublicPost[];
  isSubscribed: boolean;
  viewMode?: ViewMode;
}

export function ProfileTabContent({ activeTab, posts, isSubscribed, viewMode = 'list' }: Props) {
  if (activeTab === 'feed') {
    if (posts.length === 0) return <EmptyState label="No posts yet." />;
    if (viewMode === 'grid') return <FeedGridView posts={posts} />;
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

function FeedGridView({ posts }: { posts: PublicPost[] }) {
  return (
    <div className="grid grid-cols-3 gap-[8px]">
      {posts.map((post) => (
        <Link
          key={post.id}
          to={`/post/${post.id}`}
          className="group relative aspect-square overflow-hidden rounded-[12px] bg-muted"
        >
          {post.media[0] ? (
            <img
              src={post.media[0].url}
              alt=""
              className="size-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center p-[8px]">
              <p className="line-clamp-3 text-[11px] text-muted-foreground">
                {post.text || 'Post'}
              </p>
            </div>
          )}
          {post.media[0]?.type === 'VIDEO' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full bg-black/50 p-[6px]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
