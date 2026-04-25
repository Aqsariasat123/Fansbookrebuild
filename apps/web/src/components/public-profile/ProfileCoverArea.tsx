import { useNavigate } from 'react-router-dom';
import { ProfileActions } from './ProfileActions';

interface Props {
  cover: string | null;
  liveSessionId: string | null;
  creatorName: string;
  creatorAvatar: string | null;
  isOwnProfile: boolean;
  username: string;
  isFollowing: boolean;
  isSubscribed: boolean;
  followLoading: boolean;
  onFollow: () => void;
  onSubscribe: () => void;
}

export function ProfileCoverArea({
  cover,
  liveSessionId,
  creatorName,
  creatorAvatar,
  isOwnProfile,
  username,
  isFollowing,
  isSubscribed,
  followLoading,
  onFollow,
  onSubscribe,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="relative h-[180px] w-full overflow-hidden rounded-t-[22px] md:h-[240px]">
      {cover ? (
        <img src={cover} alt="" className="absolute inset-0 size-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-[#01adf1]/40 to-[#a61651]/40" />
      )}

      {liveSessionId && (
        <div className="absolute left-[12px] top-[12px]">
          <button
            onClick={() =>
              navigate(`/live/${liveSessionId}`, {
                state: { creatorName, creatorAvatar },
              })
            }
            className="flex items-center gap-[8px] rounded-[8px] bg-red-600 px-[14px] py-[8px] text-[13px] font-semibold text-white shadow-lg"
          >
            <span className="size-[8px] animate-pulse rounded-full bg-white" />
            LIVE · Join Now
          </button>
        </div>
      )}

      {!isOwnProfile && (
        <div className="absolute right-[12px] top-[12px]">
          <ProfileActions
            username={username}
            isFollowing={isFollowing}
            isSubscribed={isSubscribed}
            followLoading={followLoading}
            onFollow={onFollow}
            onSubscribe={onSubscribe}
          />
        </div>
      )}
    </div>
  );
}
