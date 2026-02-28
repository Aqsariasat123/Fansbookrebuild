import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

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

interface SubscriptionSidebarProps {
  tiers: Tier[];
  onSubscribe: (tierId: string) => void;
  creatorUsername: string;
}

export function SubscriptionSidebar({
  tiers,
  onSubscribe,
  creatorUsername,
}: SubscriptionSidebarProps) {
  const freeTier = tiers.find((t) => t.price === 0);
  const firstTierId = freeTier?.id || tiers[0]?.id || '';
  const [suggestions, setSuggestions] = useState<SuggestedCreator[]>([]);

  useEffect(() => {
    api
      .get(`/creator-profile/${creatorUsername}/suggestions`)
      .then((res) => setSuggestions(res.data.data || []))
      .catch(() => {});
  }, [creatorUsername]);

  return (
    <div className="hidden w-[260px] shrink-0 flex-col gap-[20px] lg:flex">
      {/* Subscription Card */}
      <div className="rounded-[22px] bg-card p-[20px]">
        <p className="mb-[16px] text-[16px] font-semibold text-foreground">Subscription</p>
        <button
          onClick={() => onSubscribe(firstTierId)}
          className="flex w-full items-center justify-center gap-[10px] rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#0096c7] py-[12px] text-[14px] font-medium text-white transition-opacity hover:opacity-90"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          Subscribe
          <span className="rounded-[12px] bg-white/20 px-[8px] py-[2px] text-[11px]">For free</span>
        </button>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="rounded-[22px] bg-card p-[20px]">
          <div className="mb-[16px] flex items-center justify-between">
            <p className="text-[16px] font-semibold text-foreground">Suggestions</p>
            <Link to="/creators" className="text-[12px] text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="flex flex-col gap-[12px]">
            {suggestions.map((creator) => (
              <Link
                key={creator.id}
                to={`/u/${creator.username}`}
                className="group relative h-[80px] overflow-hidden rounded-[12px]"
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
                <div className="absolute bottom-[8px] left-[8px] flex items-center gap-[8px]">
                  {creator.avatar ? (
                    <img
                      src={creator.avatar}
                      alt=""
                      className="size-[30px] rounded-full border border-white/20 object-cover"
                    />
                  ) : (
                    <div className="flex size-[30px] items-center justify-center rounded-full bg-gradient-to-br from-[#01adf1] to-[#a61651] text-[12px] font-medium text-white">
                      {creator.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-[4px]">
                      <p className="text-[12px] font-medium text-white">{creator.displayName}</p>
                      {creator.isVerified && (
                        <img src="/icons/dashboard/verified.svg" alt="" className="size-[10px]" />
                      )}
                    </div>
                    <p className="text-[10px] text-white/60">@{creator.username}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
