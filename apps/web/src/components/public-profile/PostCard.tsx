export interface PublicPost {
  id: string;
  text: string | null;
  visibility: string;
  likeCount: number;
  commentCount: number;
  shareCount?: number;
  createdAt: string;
  media: { id: string; url: string; type: string }[];
  author?: { displayName: string; username: string; avatar: string | null; isVerified: boolean };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return 'Just now';
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function AuthorHeader({
  author,
  createdAt,
}: {
  author: NonNullable<PublicPost['author']>;
  createdAt: string;
}) {
  return (
    <div className="mb-[12px] flex items-center justify-between">
      <div className="flex items-center gap-[10px]">
        <img
          src={author.avatar || '/icons/dashboard/person.svg'}
          alt=""
          className="size-[40px] rounded-full object-cover"
        />
        <div>
          <div className="flex items-center gap-[4px]">
            <p className="text-[14px] font-medium text-[#f8f8f8]">{author.displayName}</p>
            {author.isVerified && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#01adf1">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            )}
          </div>
          <p className="text-[12px] text-[#5d5d5d]">@{author.username}</p>
        </div>
      </div>
      <div className="flex items-center gap-[10px]">
        <span className="text-[12px] text-[#5d5d5d]">{timeAgo(createdAt)}</span>
        <button>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="3" r="1.5" fill="#5d5d5d" />
            <circle cx="10" cy="10" r="1.5" fill="#5d5d5d" />
            <circle cx="10" cy="17" r="1.5" fill="#5d5d5d" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function ActionBar({ post }: { post: PublicPost }) {
  return (
    <div className="flex items-center gap-[24px]">
      <button className="flex items-center gap-[6px] text-[#f8f8f8]">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f8f8f8"
          strokeWidth="2"
        >
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
        <span className="text-[13px]">{post.likeCount} Likes</span>
      </button>
      <button className="flex items-center gap-[6px] text-[#f8f8f8]">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f8f8f8"
          strokeWidth="2"
        >
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
        <span className="text-[13px]">{post.commentCount} Comments</span>
      </button>
      <button className="flex items-center gap-[6px] text-[#f8f8f8]">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f8f8f8"
          strokeWidth="2"
        >
          <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
        </svg>
        <span className="text-[13px]">{post.shareCount ?? 0} Share</span>
      </button>
      <button className="flex items-center gap-[6px] text-[#f8f8f8]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#f8f8f8">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
        <span className="text-[13px]">Tip</span>
      </button>
    </div>
  );
}

function LockedOverlay() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="white" className="opacity-80">
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z" />
      </svg>
      <p className="mt-[8px] rounded-[4px] bg-black/60 px-[12px] py-[4px] text-[13px] text-white">
        Subscribe to see user&apos;s photo
      </p>
    </div>
  );
}

interface PostCardProps {
  post: PublicPost;
  isSubscribed: boolean;
}

export function PostCard({ post, isSubscribed }: PostCardProps) {
  const isLocked = !isSubscribed && post.visibility !== 'PUBLIC' && post.visibility !== 'FREE';
  const thumb = post.media[0]?.url;

  return (
    <div className="rounded-[22px] bg-[#0e1012] px-[20px] py-[16px]">
      {post.author && <AuthorHeader author={post.author} createdAt={post.createdAt} />}
      {post.text && (
        <p className="mb-[12px] text-[14px] leading-[1.6] text-[#f8f8f8]">{post.text}</p>
      )}
      {thumb && (
        <div className="relative mb-[14px] overflow-hidden rounded-[16px]">
          <img
            src={thumb}
            alt=""
            className={`w-full object-cover ${isLocked ? 'blur-xl' : ''}`}
            style={{ maxHeight: 400 }}
          />
          {isLocked && <LockedOverlay />}
        </div>
      )}
      <ActionBar post={post} />
    </div>
  );
}
