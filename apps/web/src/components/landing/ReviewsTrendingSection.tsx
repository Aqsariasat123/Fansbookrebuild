import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const WHITE = 'brightness(0) invert(1)';

const reviews = [
  {
    name: 'Kayla',
    role: 'Creator',
    img: 1,
    text: 'Fansbook completely changed the way I connect with my audience. The tipping system and video calls make every interaction feel personal. I doubled my earnings in the first month!',
  },
  {
    name: 'Alex zin',
    role: 'Fan',
    img: 2,
    text: 'As a fan, I love how easy it is to support my favorite creators directly. The platform feels safe, the content is exclusive, and the chat features are next level.',
  },
  {
    name: 'Sipama',
    role: 'Creator',
    img: 3,
    text: 'The 90% payout rate is unbeatable. Weekly deposits, amazing support team, and the tools to grow my brand — Fansbook truly puts creators first. Highly recommend!',
  },
];

const trendingCreators = [
  { name: 'Jassica', followers: '21.05k', idx: 1 },
  { name: 'Jassica', followers: '21.05k', idx: 2 },
  { name: 'Jassica', followers: '21.05k', idx: 3 },
  { name: 'Jassica', followers: '21.05k', idx: 1 },
  { name: 'Jassica', followers: '21.05k', idx: 2 },
  { name: 'Jassica', followers: '21.05k', idx: 3 },
];

export function ReviewsSection() {
  return (
    <section className="bg-card px-[20px] py-[40px] md:px-[76px] md:py-[60px]">
      <div className="flex flex-col items-center">
        <div className="mb-[12px] h-[1px] w-[80px] bg-foreground md:w-[117px]" />
        <h2 className="text-[32px] font-semibold text-foreground md:text-[48px]">Reviews</h2>
      </div>
      <div className="mx-auto mt-[24px] grid max-w-[1128px] grid-cols-1 gap-[20px] sm:grid-cols-2 md:mt-[40px] md:gap-[30px] lg:grid-cols-3">
        {reviews.map((r) => (
          <div
            key={r.name}
            className="rounded-[22px] border border-border bg-card p-[20px] shadow-[0px_0px_17.8px_1px_rgba(0,0,0,0.25)] md:p-[24px]"
          >
            <div className="flex gap-[8px] md:gap-[10px]">
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  className="material-icons-outlined text-[24px] text-[#ffc107] md:text-[30px]"
                >
                  star
                </span>
              ))}
            </div>
            <p className="mt-[12px] text-[14px] font-normal leading-[1.5] text-foreground md:mt-[16px] md:text-[16px]">
              {r.text}
            </p>
            <div className="mt-[16px] flex items-center gap-[12px] md:mt-[20px]">
              <div className="h-[44px] w-[44px] overflow-hidden rounded-full bg-muted md:h-[52px] md:w-[52px]">
                <img
                  src={`/images/landing/reviewer-${r.img}.webp`}
                  alt={r.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-foreground md:text-[16px]">{r.name}</p>
                <p className="text-[11px] font-normal text-muted-foreground md:text-[12px]">
                  {r.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function TrendingSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  function scroll(dir: 'left' | 'right') {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  }

  return (
    <section className="bg-muted py-[40px] md:py-[66px]">
      <div className="flex flex-col items-center px-[20px]">
        <div className="mb-[12px] h-[1px] w-[80px] bg-foreground md:w-[117px]" />
        <h2 className="text-center text-[28px] font-semibold text-foreground sm:text-[36px] md:text-[48px]">
          Top Trending Creators
        </h2>
        <p className="mt-[8px] text-[14px] font-normal text-foreground md:text-[16px]">
          Discover the Rising Stars of this week
        </p>
      </div>

      <div className="relative mx-auto mt-[30px] max-w-[1280px] px-[12px] md:mt-[50px] md:px-[20px]">
        <button
          onClick={() => scroll('left')}
          className="absolute left-[4px] top-1/2 z-10 flex h-[36px] w-[36px] -translate-y-1/2 items-center justify-center rounded-full border border-foreground/30 bg-muted/80 hover:bg-muted md:left-[20px] md:h-[40px] md:w-[40px]"
        >
          <img
            src="/icons/landing/arrow_back_ios.svg"
            alt=""
            className="h-[16px] w-[16px] pl-[3px] md:h-[20px] md:w-[20px] md:pl-[4px]"
            style={{ filter: WHITE }}
          />
        </button>

        <div
          ref={scrollRef}
          className="mx-[40px] flex gap-[16px] overflow-x-auto scroll-smooth scrollbar-hide md:mx-[50px] md:gap-[20px]"
        >
          {trendingCreators.map((c, i) => (
            <div
              key={i}
              className="w-[280px] min-w-[280px] rounded-[22px] bg-card p-[12px] md:w-[370px] md:min-w-[370px] md:p-[15px]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[10px] md:gap-[12px]">
                  <div className="h-[65px] w-[60px] flex-none overflow-hidden rounded-[16px] bg-muted md:h-[95px] md:w-[89px] md:rounded-[22px]">
                    <img
                      src={`/images/landing/trending-profile-${c.idx}.webp`}
                      alt={c.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-[16px] font-medium text-foreground md:text-[20px]">
                      {c.name}
                    </p>
                    <p className="text-[13px] font-normal text-muted-foreground md:text-[16px]">
                      {c.followers} followers
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/register')}
                  className="flex-none rounded-[16px] border border-foreground px-[16px] py-[10px] text-[13px] font-normal text-foreground md:rounded-[22px] md:px-[30px] md:py-[15px] md:text-[16px]"
                >
                  Follow
                </button>
              </div>

              <div className="mt-[8px] flex gap-[8px] md:mt-[10px] md:gap-[10px]">
                <div className="h-[180px] flex-[1.25] overflow-hidden rounded-[16px] bg-muted md:h-[264px] md:rounded-[22px]">
                  <img
                    src={`/images/landing/trending-gallery-${c.idx}a.webp`}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-[8px] md:gap-[10px]">
                  <div className="h-[86px] overflow-hidden rounded-[16px] bg-muted md:h-[127px] md:rounded-[22px]">
                    <img
                      src={`/images/landing/trending-gallery-${c.idx}b.webp`}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="h-[86px] overflow-hidden rounded-[16px] bg-muted md:h-[127px] md:rounded-[22px]">
                    <img
                      src={`/images/landing/trending-gallery-${c.idx}c.webp`}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <Link
                to="/register"
                className="mt-[10px] flex w-full items-center justify-center gap-[8px] rounded-[16px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[12px] text-[14px] font-normal text-foreground transition-opacity hover:opacity-90 md:mt-[12px] md:rounded-[22px] md:py-[17px] md:text-[16px]"
              >
                View Profile
                <img
                  src="/icons/landing/arrow_forward.svg"
                  alt=""
                  className="h-[18px] w-[18px] md:h-[20px] md:w-[20px]"
                  style={{ filter: WHITE }}
                />
              </Link>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-[4px] top-1/2 z-10 flex h-[36px] w-[36px] -translate-y-1/2 items-center justify-center rounded-full border border-foreground/30 bg-muted/80 hover:bg-muted md:right-[20px] md:h-[40px] md:w-[40px]"
        >
          <img
            src="/icons/landing/arrow_forward_ios.svg"
            alt=""
            className="h-[16px] w-[16px] md:h-[20px] md:w-[20px]"
            style={{ filter: WHITE }}
          />
        </button>
      </div>
    </section>
  );
}
