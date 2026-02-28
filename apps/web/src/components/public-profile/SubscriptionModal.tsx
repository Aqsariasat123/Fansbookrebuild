import { useEffect } from 'react';

interface Tier {
  id: string;
  name: string;
  price: number;
  description: string | null;
  benefits: string[];
}

interface Props {
  tiers: Tier[];
  onClose: () => void;
  onSubscribe: (tierId: string) => void;
}

export function SubscriptionModal({ tiers, onClose, onSubscribe }: Props) {
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[8px]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative mx-[16px] max-h-[90vh] w-full max-w-[730px] overflow-y-auto rounded-[22px] bg-[#f8f8f8] px-[40px] py-[36px]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-[20px] top-[20px] flex size-[40px] items-center justify-center rounded-full border border-[#d0d0d0] bg-white transition-colors hover:bg-[#eee]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#333">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>

        {/* Title */}
        <h2 className="mb-[28px] text-center text-[28px] font-semibold text-[#15191c]">
          Choose Your Subscription Plan
        </h2>

        {/* Tier cards */}
        <div className="flex flex-col gap-[16px]">
          {tiers.length === 0 && (
            <p className="py-[20px] text-center text-[14px] text-[#5d5d5d]">
              No subscription plans available yet.
            </p>
          )}
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className="flex flex-col gap-[12px] rounded-[22px] bg-[#15191c] p-[24px] sm:flex-row sm:items-start sm:justify-between sm:gap-[20px]"
            >
              {/* Left: name + benefits + description */}
              <div className="flex-1">
                <h3 className="text-[18px] font-semibold text-[#f8f8f8]">{tier.name}</h3>

                {tier.benefits.length > 0 && (
                  <ul className="mt-[14px] flex flex-col gap-[10px]">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-[10px]">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          className="mt-[1px] shrink-0"
                        >
                          <path
                            d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                            fill="url(#checkGrad)"
                          />
                          <defs>
                            <linearGradient id="checkGrad" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="#01adf1" />
                              <stop offset="100%" stopColor="#a61651" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <span className="text-[14px] text-[#f8f8f8]">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {tier.description && (
                  <p className="mt-[14px] text-[12px] leading-[1.5] text-[#5d5d5d]">
                    {tier.description}
                  </p>
                )}
              </div>

              {/* Right: price + subscribe button */}
              <div className="flex shrink-0 flex-col items-center gap-[12px] sm:items-end">
                <div className="text-center sm:text-right">
                  <p className="text-[20px] font-bold text-[#f8f8f8]">
                    {tier.price === 0 ? 'Free' : `$${tier.price.toFixed(2)} / month`}
                  </p>
                  {tier.price > 0 && <p className="text-[12px] text-[#5d5d5d]">(excl. VAT)</p>}
                </div>
                <button
                  onClick={() => onSubscribe(tier.id)}
                  className="rounded-[80px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[32px] py-[10px] text-[14px] font-medium text-white transition-opacity hover:opacity-90"
                >
                  Subscribe Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
