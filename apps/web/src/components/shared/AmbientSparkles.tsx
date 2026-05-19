/**
 * Subtle drifting sparkles, always on, used on locked PPV images so they
 * constantly attract attention. Each sparkle has a randomised position,
 * size and animation delay so the field looks alive rather than periodic.
 *
 * Compare with SparkleOverlay, which is the louder one-shot burst that
 * plays for ~1s when the content is unlocked.
 */

// Pre-roll a fixed set of sparkles per mount so the layout stays stable
// across re-renders.
function makeSparkles(count: number) {
  return [...Array(count)].map((_, i) => ({
    key: i,
    size: 3 + Math.random() * 5,
    left: 5 + Math.random() * 90,
    top: 5 + Math.random() * 90,
    delay: Math.random() * 3.5,
    duration: 2.8 + Math.random() * 2,
  }));
}

// Card #5 follow-up: the client asked for "maybe you could double the amount
// of them". Field doubled from 14 → 28 so the lock state feels properly alive.
export function AmbientSparkles({ count = 28 }: { count?: number }) {
  const sparkles = makeSparkles(count);
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden rounded-[inherit]">
      {sparkles.map((s) => (
        <div
          key={s.key}
          className="absolute rounded-full bg-white"
          style={{
            width: `${s.size}px`,
            height: `${s.size}px`,
            left: `${s.left}%`,
            top: `${s.top}%`,
            boxShadow: '0 0 6px 1px rgba(255,255,255,0.85), 0 0 12px 3px rgba(255,200,90,0.35)',
            animation: `ambientTwinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}
