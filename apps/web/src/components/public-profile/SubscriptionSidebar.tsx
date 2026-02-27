interface Tier {
  id: string;
  name: string;
  price: number;
  description: string | null;
  benefits: string[];
}

interface SubscriptionSidebarProps {
  tiers: Tier[];
  onSubscribe: (tierId: string) => void;
}

export function SubscriptionSidebar({ tiers, onSubscribe }: SubscriptionSidebarProps) {
  const freeTier = tiers.find((t) => t.price === 0);
  const firstTierId = freeTier?.id || tiers[0]?.id || '';

  return (
    <div className="hidden w-[260px] shrink-0 flex-col gap-[20px] lg:flex">
      {/* Subscription Card */}
      <div className="rounded-[22px] bg-[#0e1012] p-[20px]">
        <p className="mb-[16px] text-[16px] font-semibold text-[#f8f8f8]">Subscription</p>
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
      <div className="rounded-[22px] bg-[#0e1012] p-[20px]">
        <div className="mb-[16px] flex items-center justify-between">
          <p className="text-[16px] font-semibold text-[#f8f8f8]">Suggestions</p>
          <button className="text-[12px] text-[#01adf1] hover:underline">View All</button>
        </div>
        <div className="flex flex-col gap-[12px]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative h-[80px] overflow-hidden rounded-[12px]">
              <div className="absolute inset-0 bg-gradient-to-r from-[#1a3a2a] to-[#2a4a3a]" />
              <div className="absolute bottom-[8px] left-[8px] flex items-center gap-[6px]">
                <div className="size-[28px] rounded-full bg-[#5d5d5d]" />
                <p className="text-[12px] text-white">@Gemni</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
