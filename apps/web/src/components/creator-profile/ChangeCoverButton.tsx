/**
 * "Change cover photo" round button shown on the cover banner.
 * Card #7 follow-up: the client found the framed-card-with-pencil too close
 * visually to the neighbouring Edit (pencil) button, so we swapped to a
 * classic "picture" glyph — frame with a sun and mountains — matching the
 * reference image they attached (image icon.png).
 */
export function ChangeCoverButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Change cover photo"
      className="flex size-[32px] items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
    >
      {/* Material-style image / photo icon — frame with sun + mountains */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
        <path d="M21 15l-5-5L5 21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
