export function LockIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="white" className="opacity-90">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z" />
    </svg>
  );
}

export function SparkleOverlay() {
  // 24 sparkles, varied sizes, scattered across the frame, ripple stagger
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[16px]">
      <div
        className="absolute inset-0 rounded-[16px]"
        style={{
          background:
            'radial-gradient(circle at center, rgba(255,255,255,0.95) 0%, rgba(1,173,241,0.4) 35%, rgba(166,22,81,0.2) 60%, transparent 80%)',
          animation: 'flashReveal 0.7s ease-out forwards',
        }}
      />
      {[...Array(24)].map((_, i) => {
        const size = 4 + Math.random() * 10;
        return (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              boxShadow: '0 0 8px 2px rgba(255,255,255,0.9), 0 0 16px 4px rgba(1,173,241,0.5)',
              animation: `sparkle 0.9s ease-out ${i * 0.025}s forwards`,
              opacity: 0,
            }}
          />
        );
      })}
    </div>
  );
}
