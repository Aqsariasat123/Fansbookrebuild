export function isGoLiveReady(
  agreed: boolean,
  live: boolean,
  busy: boolean,
  pvt: boolean,
  pvtTokens: string,
  ext: boolean,
  extTokens: string,
): boolean {
  if (!agreed || !live || busy) return false;
  if (pvt && !pvtTokens.trim()) return false;
  if (ext && !extTokens.trim()) return false;
  return true;
}

export function GoLiveCheckbox({ checked, disabled }: { checked: boolean; disabled?: boolean }) {
  return (
    <div className={`pointer-events-none shrink-0 ${disabled ? 'opacity-40' : ''}`}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        {checked ? (
          <>
            <rect x="3" y="3" width="18" height="18" rx="2" fill="#01adf1" />
            <path
              d="M9 12l2 2 4-4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        ) : (
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
        )}
      </svg>
    </div>
  );
}

export const PRICE_INPUT_CLASS =
  'w-full rounded-[8px] border border-foreground bg-transparent px-[12px] py-[8px] text-[14px] text-foreground placeholder-muted-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none';

export function CameraPreview({
  previewing,
  videoRef,
  onStart,
  policyAgreed,
  onPolicyToggle,
}: {
  previewing: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onStart: () => void;
  policyAgreed: boolean;
  onPolicyToggle: () => void;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-[16px] rounded-[22px] bg-card px-[20px] ${previewing ? 'py-[16px]' : 'py-[32px]'}`}
    >
      {!previewing ? (
        <>
          <p className="text-[20px] font-semibold text-foreground">Start Your Broadcasting Now</p>
          <p className="max-w-[800px] text-center text-[14px] leading-[1.8] text-muted-foreground">
            Go live directly from your browser — no extra software needed. Your camera and
            microphone will be used to stream in real-time to your fans with sub-second latency.
          </p>
          <button
            onClick={onStart}
            className="rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[32px] py-[12px] text-[14px] font-medium text-white"
          >
            Enable Camera Preview
          </button>
        </>
      ) : (
        <>
          <p className="text-[20px] font-semibold text-foreground">Camera Preview</p>
          <div className="relative w-full max-w-[640px] overflow-hidden rounded-[12px] bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="max-h-[38vh] w-full -scale-x-100 object-cover"
            />
            <div className="absolute left-[12px] top-[12px] rounded-[4px] bg-black/60 px-[10px] py-[4px] text-[12px] text-white">
              Preview
            </div>
          </div>
        </>
      )}
      <div className="flex cursor-pointer items-center gap-[10px]" onClick={onPolicyToggle}>
        <GoLiveCheckbox checked={policyAgreed} />
        <span className="text-[14px] text-foreground">
          I have accepted the &quot;
          <span className="font-bold underline">Live Broadcast Policy</span>&quot;.
        </span>
      </div>
    </div>
  );
}
