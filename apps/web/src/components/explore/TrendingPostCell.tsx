import { Link } from 'react-router-dom';

interface TrendingPost {
  id: string;
  text: string | null;
  likeCount: number;
  commentCount: number;
  media: { id: string; url: string; type: string; thumbnail?: string | null }[];
}

export function TrendingPostCell({ post }: { post: TrendingPost }) {
  return (
    <Link
      to={`/post/${post.id}`}
      className="group relative aspect-square overflow-hidden rounded-[12px] bg-card"
    >
      {post.media?.[0] ? (
        <img
          src={post.media[0].thumbnail || post.media[0].url}
          alt=""
          className="size-full object-cover transition-transform group-hover:scale-105"
        />
      ) : (
        <div className="flex size-full items-center justify-center p-[12px]">
          <p className="line-clamp-4 text-[13px] text-muted-foreground">{post.text || ''}</p>
        </div>
      )}
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex w-full items-center gap-[16px] p-[12px]">
          <span className="flex items-center gap-[4px] text-[12px] text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {post.likeCount}
          </span>
          <span className="flex items-center gap-[4px] text-[12px] text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z" />
            </svg>
            {post.commentCount}
          </span>
        </div>
      </div>
      {post.media[0]?.type === 'VIDEO' && (
        <div className="absolute right-[8px] top-[8px]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="drop-shadow">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}
    </Link>
  );
}
