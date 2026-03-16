export { FeaturesSection } from './CreatorsSectionParts';

export function CreatorsSection() {
  return (
    <section className="w-full overflow-hidden bg-muted">
      <div className="relative w-full">
        {/* Desktop: 8 creator avatars — vw-scaled so overlaps stay consistent */}
        <div className="hidden lg:block">
          <img
            src="/images/landing/pos-1.webp"
            alt=""
            className="absolute rounded-[12px] object-cover"
            style={{ left: '-6.56vw', top: 120, width: '15.625vw', height: '15.78vw', zIndex: 7 }}
          />
          <img
            src="/images/landing/pos-2.webp"
            alt=""
            className="absolute rounded-[12px] object-cover"
            style={{ left: '8.125vw', top: 135, width: '13.28vw', height: '13.44vw', zIndex: 5 }}
          />
          <img
            src="/images/landing/pos-3.webp"
            alt=""
            className="absolute rounded-[12px] object-cover"
            style={{ left: '20.47vw', top: 146, width: '11.56vw', height: '11.72vw', zIndex: 3 }}
          />
          <img
            src="/images/landing/pos-4.webp"
            alt=""
            className="absolute rounded-[12px] object-cover"
            style={{ left: '31.09vw', top: 159, width: '9.53vw', height: '9.69vw', zIndex: 1 }}
          />
          <img
            src="/images/landing/pos-5.webp"
            alt=""
            className="absolute rounded-[12px] object-cover"
            style={{ left: '59.30vw', top: 159, width: '9.53vw', height: '9.69vw', zIndex: 2 }}
          />
          <img
            src="/images/landing/pos-6.webp"
            alt=""
            className="absolute rounded-[12px] object-cover"
            style={{
              left: '67.89vw',
              top: 146,
              width: '11.56vw',
              height: '11.72vw',
              zIndex: 4,
              transform: 'scaleX(-1)',
            }}
          />
          <img
            src="/images/landing/pos-7.webp"
            alt=""
            className="absolute rounded-[12px] object-cover"
            style={{ left: '78.52vw', top: 135, width: '13.28vw', height: '13.44vw', zIndex: 6 }}
          />
          <img
            src="/images/landing/pos-8.webp"
            alt=""
            className="absolute rounded-[12px] object-cover"
            style={{
              left: '90.86vw',
              top: 120,
              width: '15.625vw',
              height: '15.78vw',
              zIndex: 8,
              transform: 'scaleX(-1)',
            }}
          />
        </div>

        {/* Mobile: cascade images arc + text below */}
        <div className="lg:hidden">
          {/* Images arc strip — no text overlap */}
          <div className="relative h-[148px] overflow-hidden">
            <img
              src="/images/landing/pos-1.webp"
              alt=""
              className="absolute rounded-[5px] object-cover"
              style={{ left: '-25vw', top: 55, width: 91, height: 92 }}
            />
            <img
              src="/images/landing/pos-2.webp"
              alt=""
              className="absolute rounded-[5px] object-cover"
              style={{ left: '-5.5vw', top: 61, width: 77, height: 78 }}
            />
            <img
              src="/images/landing/pos-3.webp"
              alt=""
              className="absolute rounded-[5px] object-cover"
              style={{ left: '10.9vw', top: 66, width: 67, height: 68 }}
            />
            <img
              src="/images/landing/pos-4.webp"
              alt=""
              className="absolute rounded-[5px] object-cover"
              style={{ left: '25vw', top: 72, width: 55, height: 56 }}
            />
            <img
              src="/images/landing/pos-5.webp"
              alt=""
              className="absolute rounded-[5px] object-cover"
              style={{ right: '25vw', top: 72, width: 55, height: 56 }}
            />
            <img
              src="/images/landing/pos-6.webp"
              alt=""
              className="absolute rounded-[5px] object-cover"
              style={{ right: '10.9vw', top: 66, width: 67, height: 68, transform: 'scaleX(-1)' }}
            />
            <img
              src="/images/landing/pos-7.webp"
              alt=""
              className="absolute rounded-[5px] object-cover"
              style={{ right: '-5.5vw', top: 61, width: 77, height: 78 }}
            />
            <img
              src="/images/landing/pos-8.webp"
              alt=""
              className="absolute rounded-[5px] object-cover"
              style={{ right: '-25vw', top: 55, width: 91, height: 92, transform: 'scaleX(-1)' }}
            />
          </div>

          {/* Text — below images, no overlap */}
          <div className="flex flex-col items-center px-[16px] pb-[28px] pt-[16px]">
            <h2 className="text-center text-[20px] font-medium leading-[1.26] text-foreground">
              Open to all creators
            </h2>
            <p className="mt-[10px] text-center text-[10px] font-normal leading-[1.26] text-foreground">
              enjoying the freedom to express their creativity and earn more
            </p>
          </div>
        </div>

        {/* Desktop: center content */}
        <div className="relative z-[10] hidden flex-col items-center lg:flex lg:h-[466px]">
          <div className="flex h-full flex-col items-center pt-[66px]">
            <h2 className="w-[232px] text-center text-[48px] font-medium leading-[1.26] text-foreground">
              Open to all creators
            </h2>
            <p className="mt-[17px] w-[151px] text-center text-[16px] font-normal leading-[1.26] text-foreground">
              enjoying the freedom to express their creativity and earn more
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
