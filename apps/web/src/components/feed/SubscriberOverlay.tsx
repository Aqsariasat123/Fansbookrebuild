import { Link } from 'react-router-dom';

interface SubscriberOverlayProps {
  username: string;
  thumbnailUrl?: string;
}

export function SubscriberOverlay({ username, thumbnailUrl }: SubscriberOverlayProps) {
  return (
    <div className="relative flex aspect-[3/4] w-[55%] max-w-[320px] items-center justify-center overflow-hidden rounded-[12px] md:w-[45%] md:max-w-[380px] md:rounded-[22px]">
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt=""
          className="absolute inset-0 size-full object-cover blur-[20px] brightness-50"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-muted to-card" />
      )}
      <div className="relative z-10 flex flex-col items-center gap-[12px] px-[16px] text-center">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-white/80">
          <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
          <path
            d="M7 11V7a5 5 0 0110 0v4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <p className="text-[14px] font-medium text-white md:text-[18px]">Subscribers Only</p>
        <p className="text-[12px] text-white/70 md:text-[14px]">Subscribe to unlock this content</p>
        <Link
          to={`/u/${username}`}
          className="mt-[4px] rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[24px] py-[8px] text-[13px] font-medium text-white md:px-[32px] md:py-[10px] md:text-[15px]"
        >
          Subscribe
        </Link>
      </div>
    </div>
  );
}
