import { Link } from 'react-router-dom';

interface Author {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  isVerified?: boolean;
}

interface Props {
  author: Author;
  createdAt: string;
}

export function SinglePostHeader({ author, createdAt }: Props) {
  const diff = Date.now() - new Date(createdAt).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const timeAgo =
    hours < 1 ? 'Just now' : hours < 24 ? `${hours}h ago` : `${Math.floor(hours / 24)}d ago`;

  return (
    <div className="flex items-center justify-between">
      <Link to={`/u/${author.username}`} className="flex items-center gap-[8px] hover:opacity-80">
        <div className="size-[44px] shrink-0 overflow-hidden rounded-full">
          {author.avatar ? (
            <img src={author.avatar} alt="" className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center bg-gradient-to-br from-[#01adf1] to-[#a61651] text-[16px] font-medium text-white">
              {author.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-[4px]">
            <span className="text-[16px] text-foreground">{author.displayName}</span>
            {author.isVerified && (
              <img src="/icons/dashboard/verified.svg" alt="" className="size-[16px]" />
            )}
          </div>
          <p className="text-[12px] text-muted-foreground">@{author.username}</p>
        </div>
      </Link>
      <span className="text-[14px] text-muted-foreground">{timeAgo}</span>
    </div>
  );
}
