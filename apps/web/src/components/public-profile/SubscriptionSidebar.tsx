interface Tier {
  id: string;
  name: string;
  price: number;
  description: string | null;
  benefits: string[];
}

interface TierCardProps {
  tier: Tier;
  onSubscribe: (tierId: string) => void;
}

function TierCard({ tier, onSubscribe }: TierCardProps) {
  return (
    <div className="rounded-[12px] border border-[#2a2d30] p-[16px]">
      <div className="mb-[8px] flex items-center justify-between">
        <p className="text-[15px] font-semibold text-[#f8f8f8]">{tier.name}</p>
        <p className="text-[15px] font-semibold text-[#f8f8f8]">
          ${tier.price}
          <span className="text-[12px] font-normal text-[#5d5d5d]">/mo</span>
        </p>
      </div>
      {tier.description && (
        <p className="mb-[8px] text-[13px] text-[#a0a0a0]">{tier.description}</p>
      )}
      {tier.benefits.length > 0 && (
        <ul className="mb-[12px] flex flex-col gap-[4px]">
          {tier.benefits.map((b, i) => (
            <li key={i} className="flex items-center gap-[6px] text-[12px] text-[#a0a0a0]">
              <span className="text-green-400">&#10003;</span>
              {b}
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => onSubscribe(tier.id)}
        className="w-full rounded-[10px] bg-gradient-to-r from-purple-600 to-pink-500 py-[8px] text-[13px] font-medium text-[#f8f8f8] transition-opacity hover:opacity-90"
      >
        Subscribe
      </button>
    </div>
  );
}

function SimilarCreators() {
  const placeholders = [
    { name: 'Luna Star', handle: '@luna_star' },
    { name: 'Mia Rose', handle: '@mia_rose' },
    { name: 'Zara Belle', handle: '@zara_belle' },
  ];

  return (
    <div className="rounded-[22px] bg-[#0e1012] p-[20px]">
      <p className="mb-[16px] text-[16px] font-semibold text-[#f8f8f8]">Similar Creators</p>
      <div className="flex flex-col gap-[12px]">
        {placeholders.map((c) => (
          <div key={c.handle} className="flex items-center gap-[10px]">
            <div className="flex size-[40px] items-center justify-center rounded-full bg-[#2e4882]">
              <span className="text-[16px] font-medium text-[#f8f8f8]">{c.name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-medium text-[#f8f8f8]">{c.name}</p>
              <p className="text-[12px] text-[#5d5d5d]">{c.handle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface SubscriptionSidebarProps {
  tiers: Tier[];
  onSubscribe: (tierId: string) => void;
}

export function SubscriptionSidebar({ tiers, onSubscribe }: SubscriptionSidebarProps) {
  return (
    <div className="hidden w-[300px] shrink-0 flex-col gap-[20px] lg:flex">
      <div className="rounded-[22px] bg-[#0e1012] p-[20px]">
        <p className="mb-[16px] text-[16px] font-semibold text-[#f8f8f8]">Subscription Plans</p>
        {tiers.length === 0 ? (
          <p className="text-[13px] text-[#5d5d5d]">No subscription plans available.</p>
        ) : (
          <div className="flex flex-col gap-[12px]">
            {tiers.map((tier) => (
              <TierCard key={tier.id} tier={tier} onSubscribe={onSubscribe} />
            ))}
          </div>
        )}
      </div>
      <SimilarCreators />
    </div>
  );
}
