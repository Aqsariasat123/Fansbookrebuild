/**
 * Dramatic PPV unlock reveal — runs for ~1.4s when content unlocks. Layers
 * (Card #5 follow-up):
 *
 *  1. A bright diagonal SHIMMER sweep — polishes across the image like a
 *     camera flash, the "wow" moment.
 *  2. A radial light FLASH + glowing CORE — keeps the original burst feel.
 *  3. Eighteen radiating RAYS for direction.
 *  4. Thirty white SPARKLES scattered across the frame.
 *  5. Twenty coloured CONFETTI particles flying outward in arcs.
 *
 * Shared by feed (PPVOverlay) and public-profile (PostLockedImage). All
 * keyframes live in index.css.
 */
const CONFETTI_COLOURS = [
  '#ffd166', // warm gold
  '#06d6a0', // mint
  '#118ab2', // azure
  '#ef476f', // pink
  '#fffbeb', // cream
  '#a78bfa', // violet
] as const;

function pick<T>(arr: readonly T[], i: number): T {
  return arr[i % arr.length] as T;
}

export function SparkleOverlay() {
  const rays = 18;
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[inherit]">
      {/* full-frame light flash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at center, rgba(255,255,255,0.95) 0%, rgba(255,190,90,0.45) 35%, rgba(1,173,241,0.18) 60%, transparent 80%)',
          animation: 'flashReveal 0.75s ease-out forwards',
        }}
      />
      {/* diagonal shimmer sweep — the "polish across" moment */}
      <div
        className="absolute -inset-y-4 left-0 w-[55%]"
        style={{
          background:
            'linear-gradient(110deg, transparent 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0) 65%, transparent 100%)',
          animation: 'shimmerSweep 1.1s ease-out 0.05s forwards',
          opacity: 0,
        }}
      />
      {/* radiating light rays */}
      {[...Array(rays)].map((_, i) => (
        <div
          key={`ray-${i}`}
          className="absolute inset-0"
          style={{ transform: `rotate(${(i * 360) / rays}deg)` }}
        >
          <div
            className="absolute top-0 h-1/2 w-[3px]"
            style={{
              left: 'calc(50% - 1.5px)',
              transformOrigin: 'bottom center',
              background:
                'linear-gradient(to top, transparent, rgba(255,170,60,0.85) 45%, rgba(255,240,210,0.95))',
              animation: 'rayBurst 0.85s cubic-bezier(0.2,0.7,0.25,1) forwards',
              opacity: 0,
            }}
          />
        </div>
      ))}
      {/* glowing core */}
      <div className="absolute left-1/2 top-1/2 size-[42%] -translate-x-1/2 -translate-y-1/2">
        <div
          className="size-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.98) 0%, rgba(255,200,110,0.9) 30%, rgba(255,140,50,0.5) 55%, transparent 75%)',
            animation: 'burstCore 0.9s ease-out forwards',
          }}
        />
      </div>
      {/* scattered white sparkles */}
      {[...Array(30)].map((_, i) => {
        const size = 4 + Math.random() * 10;
        return (
          <div
            key={`spark-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              boxShadow: '0 0 8px 2px rgba(255,255,255,0.9), 0 0 16px 4px rgba(255,180,80,0.55)',
              animation: `sparkle 0.95s ease-out ${i * 0.02}s forwards`,
              opacity: 0,
            }}
          />
        );
      })}
      {/* coloured confetti — flies outward in arcs from the centre */}
      {[...Array(20)].map((_, i) => {
        const size = 5 + Math.random() * 6;
        const angle = (i / 20) * Math.PI * 2;
        const dist = 140 + Math.random() * 80;
        const cx = Math.cos(angle) * dist;
        const cy = Math.sin(angle) * dist - 30; // slight upward bias
        const cr = -180 + Math.random() * 360;
        return (
          <div
            key={`conf-${i}`}
            className="absolute left-1/2 top-1/2"
            style={
              {
                width: `${size}px`,
                height: `${size * 1.6}px`,
                marginLeft: -size / 2,
                marginTop: -size / 2,
                background: pick(CONFETTI_COLOURS, i),
                borderRadius: '1px',
                animation: `confettiPop 1.2s cubic-bezier(0.16,0.84,0.44,1) ${0.1 + i * 0.018}s forwards`,
                opacity: 0,
                '--cx': `${cx}px`,
                '--cy': `${cy}px`,
                '--cr': `${cr}deg`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
