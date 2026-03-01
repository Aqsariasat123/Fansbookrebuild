import { Link } from 'react-router-dom';
import FollowButton from './FollowButton';

interface Props {
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string | null;
    bio?: string | null;
    isVerified?: boolean;
  };
  showFollow?: boolean;
  isFollowing?: boolean;
  onFollowToggle?: (following: boolean) => void;
}

export default function UserCard({ user, showFollow = true, isFollowing, onFollowToggle }: Props) {
  return (
    <div className="flex items-center gap-[12px] rounded-[12px] bg-card p-[12px]">
      <Link to={`/u/${user.username}`} className="shrink-0">
        <div className="size-[48px] overflow-hidden rounded-full bg-muted">
          {user.avatar ? (
            <img src={user.avatar} alt="" className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center text-[18px] font-medium text-muted-foreground">
              {user.displayName[0]?.toUpperCase()}
            </div>
          )}
        </div>
      </Link>

      <div className="min-w-0 flex-1">
        <Link to={`/u/${user.username}`} className="flex items-center gap-[4px]">
          <span className="truncate text-[14px] font-medium text-foreground">
            {user.displayName}
          </span>
          {user.isVerified && (
            <img src="/icons/dashboard/verified.svg" alt="" className="h-[14px] w-[14px]" />
          )}
        </Link>
        <p className="text-[12px] text-muted-foreground">@{user.username}</p>
        {user.bio && (
          <p className="mt-[2px] truncate text-[12px] text-muted-foreground">{user.bio}</p>
        )}
      </div>

      {showFollow && (
        <FollowButton
          userId={user.id}
          initialFollowing={isFollowing}
          size="sm"
          onToggle={onFollowToggle}
        />
      )}
    </div>
  );
}
