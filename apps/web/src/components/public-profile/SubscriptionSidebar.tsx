import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { TipModal } from '../shared/TipModal';
import { formatMoney } from '../../lib/currency';

interface Tier {
  id: string;
  name: string;
  price: number;
  description: string | null;
  benefits: string[];
}

interface SuggestedCreator {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  cover: string | null;
  isVerified: boolean;
  followersCount: number;
}

interface Props {
  tiers: Tier[];
  onSubscribe: (tierId: string) => void;
  creatorUsername: string;
  profileId: string;
  displayName: string;
  isSubscribed: boolean;
}

export function SubscriptionSidebar({
  tiers,
  onSubscribe,
  creatorUsername,
  profileId,
  displayName,
  isSubscribed,
}: Props) {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<SuggestedCreator[]>([]);
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    api
      .get(`/creator-profile/${creatorUsername}/suggestions`)
      .then((res) => setSuggestions(res.data.data || []))
      .catch(() => {});
  }, [creatorUsername]);

  return (
    <div className="hidden w-[260px] shrink-0 flex-col gap-[16px] lg:flex">
      {/* Subscription card */}
      <div className="rounded-[22px] bg-card p-[20px]">
        <p className="mb-[12px] text-[15px] font-semibold text-foreground">Subscription</p>

        {isSubscribed ? (
          <div className="rounded-[12px] border border-green-500 bg-green-500/10 px-[16px] py-[10px] text-center text-[13px] font-medium text-green-400">
            Subscribed ✓
          </div>
        ) : (
          <div className="flex flex-col gap-[8px]">
            {tiers.map((tier) => (
              <button
                key={tier.id}
                onClick={() => onSubscribe(tier.id)}
                className="w-full rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[10px] text-[13px] font-medium text-white transition-opacity hover:opacity-90"
              >
                Subscribe For {tier.price === 0 ? 'free' : formatMoney(tier.price)}
              </button>
            ))}
          </div>
        )}

        <div className="mt-[12px] flex flex-col gap-[8px]">
          <button
            onClick={() => navigate(`/messages?user=${creatorUsername}`)}
            className="flex w-full items-center justify-center gap-[8px] rounded-[50px] border border-border py-[10px] text-[13px] text-foreground transition-colors hover:border-foreground"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
            </svg>
            Message
          </button>
          <button
            onClick={() => setShowTip(true)}
            className="flex w-full items-center justify-center gap-[8px] rounded-[50px] border border-border py-[10px] text-[13px] text-foreground transition-colors hover:border-foreground"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            Send Tip
          </button>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="rounded-[22px] bg-card p-[20px]">
          <div className="mb-[12px] flex items-center justify-between">
            <p className="text-[15px] font-semibold text-foreground">Suggestions</p>
            <Link to="/creators" className="text-[12px] text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="flex flex-col gap-[10px]">
            {suggestions.map((creator) => (
              <Link
                key={creator.id}
                to={`/u/${creator.username}`}
                className="group relative h-[76px] overflow-hidden rounded-[12px]"
              >
                {creator.cover ? (
                  <img
                    src={creator.cover}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#01adf1]/30 to-[#a61651]/30" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-[8px] left-[8px] flex items-center gap-[6px]">
                  {creator.avatar ? (
                    <img
                      src={creator.avatar}
                      alt=""
                      className="size-[28px] rounded-full border border-border object-cover"
                    />
                  ) : (
                    <div className="flex size-[28px] items-center justify-center rounded-full bg-gradient-to-br from-[#01adf1] to-[#a61651] text-[11px] font-medium text-white">
                      {creator.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-[3px]">
                      <p className="text-[11px] font-medium text-white">{creator.displayName}</p>
                      {creator.isVerified && (
                        <img src="/icons/dashboard/verified.svg" alt="" className="size-[10px]" />
                      )}
                    </div>
                    <p className="text-[10px] text-white/70">@{creator.username}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {showTip && (
        <TipModal
          receiverId={profileId}
          receiverName={displayName}
          onClose={() => setShowTip(false)}
        />
      )}
    </div>
  );
}
