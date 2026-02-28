import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

interface SuggestedCreator {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  cover: string | null;
  isVerified: boolean;
  followersCount: number;
}

interface SuggestionsSidebarProps {
  creatorUsername: string;
}

export function SuggestionsSidebar({ creatorUsername }: SuggestionsSidebarProps) {
  const [suggestions, setSuggestions] = useState<SuggestedCreator[]>([]);

  useEffect(() => {
    if (!creatorUsername) return;
    api
      .get(`/creator-profile/${creatorUsername}/suggestions`)
      .then((res) => setSuggestions(res.data.data || []))
      .catch(() => {});
  }, [creatorUsername]);

  if (suggestions.length === 0) return null;

  return (
    <div className="hidden w-[260px] shrink-0 flex-col gap-[20px] lg:flex">
      <div className="rounded-[22px] bg-[#0e1012] p-[20px]">
        <div className="mb-[16px] flex items-center justify-between">
          <p className="text-[16px] font-semibold text-[#f8f8f8]">Suggestions</p>
          <Link to="/creators" className="text-[12px] text-[#01adf1] hover:underline">
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
    </div>
  );
}
