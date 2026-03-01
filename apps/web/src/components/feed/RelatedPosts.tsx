import { Link } from 'react-router-dom';

interface Media {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  thumbnail?: string | null;
}

interface RelatedPost {
  id: string;
  text: string | null;
  media: Media[];
}

interface Props {
  posts: RelatedPost[];
  authorName: string;
}

export function RelatedPosts({ posts, authorName }: Props) {
  if (posts.length === 0) return null;

  return (
    <div className="mt-[24px]">
      <p className="mb-[12px] text-[16px] font-medium text-foreground">More from {authorName}</p>
      <div className="grid grid-cols-3 gap-[8px]">
        {posts.map((rp) => (
          <Link
            key={rp.id}
            to={`/post/${rp.id}`}
            className="group relative aspect-square overflow-hidden rounded-[12px] bg-muted"
          >
            {rp.media[0] ? (
              <img
                src={rp.media[0].thumbnail || rp.media[0].url}
                alt=""
                className="size-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex size-full items-center justify-center p-[8px]">
                <p className="line-clamp-3 text-[11px] text-muted-foreground">
                  {rp.text || 'Post'}
                </p>
              </div>
            )}
            {rp.media[0]?.type === 'VIDEO' && (
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
    </div>
  );
}
