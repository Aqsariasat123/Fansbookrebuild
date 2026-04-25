import { useState } from 'react';
import { TipModal } from '../shared/TipModal';

interface ActionProfile {
  id: string;
  displayName: string;
  isFollowing: boolean;
  isSubscribed: boolean;
}

interface Props {
  profile: ActionProfile;
  followLoading: boolean;
  onFollow: () => void;
  onSubscribe: () => void;
}

export function ProfileActionButtons({ profile, followLoading, onFollow, onSubscribe }: Props) {
  const [showTip, setShowTip] = useState(false);

  return (
    <>
      <div className="mt-[12px] flex flex-wrap gap-[8px]">
        <button
          onClick={onFollow}
          disabled={followLoading}
          className={`rounded-full px-[18px] py-[7px] text-[13px] font-semibold transition-colors disabled:opacity-50 ${
            profile.isFollowing
              ? 'border border-border bg-transparent text-foreground hover:bg-muted'
              : 'bg-foreground text-background hover:opacity-90'
          }`}
        >
          {profile.isFollowing ? 'Following' : 'Follow'}
        </button>

        <button
          onClick={onSubscribe}
          className={`rounded-full px-[18px] py-[7px] text-[13px] font-semibold transition-opacity hover:opacity-90 ${
            profile.isSubscribed
              ? 'border border-[#01adf1] bg-transparent text-[#01adf1]'
              : 'bg-gradient-to-r from-[#01adf1] to-[#a61651] text-white'
          }`}
        >
          {profile.isSubscribed ? 'Subscribed' : 'Subscribe'}
        </button>

        <button
          onClick={() => setShowTip(true)}
          className="flex items-center gap-[6px] rounded-full border border-border px-[18px] py-[7px] text-[13px] font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 17h2v-1h1c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1h-3v-1h4V9h-2V8h-2v1h-1c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h3v1H9v1h2v1zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
          Tip Creator
        </button>
      </div>

      {showTip && (
        <TipModal
          receiverId={profile.id}
          receiverName={profile.displayName}
          onClose={() => setShowTip(false)}
        />
      )}
    </>
  );
}
