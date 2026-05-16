/**
 * "Change cover photo" round button shown on the cover banner.
 * Uses the client-supplied icon (card #7 attachment "Change Cover image.svg")
 * — a framed card with a pencil — replacing the earlier generic camera icon.
 */
export function ChangeCoverButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Change cover photo"
      className="flex size-[32px] items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
    >
      <svg width="18" height="18" viewBox="0 0 186.24 183.74" fill="currentColor">
        <path d="M142,118.99v46.92c0,1.56-1.27,2.83-2.83,2.83H17.83c-1.56,0-2.83-1.27-2.83-2.83V44.58c0-1.57,1.27-2.83,2.83-2.83h45.92c3.36,0,6.08-2.72,6.08-6.08v-2.83c0-3.36-2.72-6.08-6.08-6.08H17.83C7.98,26.74,0,34.73,0,44.58v121.33c0,9.85,7.98,17.83,17.83,17.83h121.33c9.85,0,17.83-7.98,17.83-17.83v-46.92c0-3.36-2.72-6.08-6.08-6.08h-2.83c-3.36,0-6.08,2.72-6.08,6.08Z" />
        <path d="M151.97,10l24.28,24.28-101.35,101.35-30.99,6.72,6.72-30.99L151.97,10M151.97,0c-2.65,0-5.2,1.05-7.07,2.93L43.54,104.28c-1.36,1.36-2.3,3.08-2.7,4.95l-6.72,30.99c-.72,3.32.3,6.78,2.7,9.19,1.9,1.9,4.45,2.93,7.07,2.93.7,0,1.41-.07,2.12-.23l30.99-6.72c1.88-.41,3.6-1.34,4.95-2.7l101.35-101.35c1.88-1.88,2.93-4.42,2.93-7.07s-1.05-5.2-2.93-7.07l-24.28-24.28c-1.88-1.88-4.42-2.93-7.07-2.93h0Z" />
        <line
          x1="130.75"
          y1="31.21"
          x2="155.03"
          y2="55.49"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
