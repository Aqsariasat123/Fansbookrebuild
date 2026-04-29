import { useState, useEffect } from 'react';
export { ResultStep } from './VerifyIdentityResult';

function isDiditDoneEvent(event: MessageEvent): boolean {
  if (!event.origin.includes('didit')) return false;
  const data = event.data as Record<string, unknown> | null;
  if (!data) return false;
  const type = ((data.type as string) ?? '').toLowerCase();
  const status = ((data.status as string) ?? '').toLowerCase();
  const typeMatch = type.includes('complete') || type.includes('done') || type.includes('finish');
  const statusMatch = status === 'success' || status === 'approved';
  return typeMatch || statusMatch;
}

// ── SDK Step ──────────────────────────────────────────────
export function SdkStep({ sdkToken, onDone }: { sdkToken: string; onDone: () => void }) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Detect when Didit redirects the iframe back to our callback URL (same-origin, readable)
  const handleIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    setIframeLoaded(true);
    try {
      const url = (e.target as HTMLIFrameElement).contentWindow?.location?.href ?? '';
      if (url.includes('/verify-identity') && url.includes('done=1')) {
        onDone();
      }
    } catch {
      // Cross-origin access blocked — normal while on didit.me domain
    }
  };

  // Didit SDK sends a postMessage to the parent window when verification completes
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (isDiditDoneEvent(event)) onDone();
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onDone]);

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="rounded-[10px] border border-gray-700 bg-gray-900/50 p-[16px]">
        <p className="text-[13px] font-semibold text-white mb-[10px]">
          How to complete verification:
        </p>
        <ol className="flex flex-col gap-[8px]">
          {[
            'A QR code will appear in the frame below',
            'Open your mobile phone camera and scan the QR code',
            'Complete the identity verification steps on your mobile phone',
            'This page will update automatically once you are verified',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-[10px]">
              <span className="flex size-[20px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#01adf1] to-[#a61651] text-[11px] font-bold text-white">
                {i + 1}
              </span>
              <span className="text-[12px] text-gray-400 leading-[20px]">{step}</span>
            </li>
          ))}
        </ol>
      </div>
      <div
        className="relative overflow-hidden rounded-[12px] border border-gray-700 bg-gray-900"
        style={{ height: '720px' }}
      >
        {!iframeLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-[12px]">
            <div className="size-[40px] animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
            <p className="text-[13px] text-gray-400">Loading verification…</p>
          </div>
        )}
        <iframe
          src={sdkToken}
          allow="camera; microphone; accelerometer; gyroscope"
          onLoad={handleIframeLoad}
          scrolling="no"
          className="h-full w-full border-0"
          style={{ overflow: 'hidden' }}
          title="Didit Identity Verification"
        />
      </div>
    </div>
  );
}

export function PendingStep({
  onRestart,
  onManualCheck,
}: {
  onRestart?: () => void;
  onManualCheck?: () => Promise<void>;
}) {
  const [showCheck, setShowCheck] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [checking, setChecking] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setShowCheck(true), 30000);
    const t2 = setTimeout(() => setTimedOut(true), 120000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);
  async function handleCheck() {
    if (!onManualCheck) return;
    setChecking(true);
    try {
      await onManualCheck();
    } finally {
      setChecking(false);
    }
  }
  return (
    <div className="flex flex-col items-center gap-[20px] text-center py-[24px]">
      <div className="size-[56px] animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
      <h2 className="text-[20px] font-bold text-white">Verifying your identity</h2>
      <p className="text-[14px] text-gray-400 max-w-[340px]">
        Waiting for confirmation from Didit. This page will update automatically once your
        verification is complete.
      </p>
      {showCheck && onManualCheck && (
        <button
          onClick={handleCheck}
          disabled={checking}
          className="rounded-full border border-[#01adf1] px-[24px] py-[10px] text-[14px] font-medium text-[#01adf1] hover:bg-[#01adf1]/10 transition-colors disabled:opacity-50"
        >
          {checking ? 'Checking…' : 'Check status'}
        </button>
      )}
      {timedOut && (
        <p className="text-[13px] text-gray-500 max-w-[300px]">
          This is taking longer than expected. You can close this page — we'll email you when your
          verification is complete.
        </p>
      )}
      {onRestart && (
        <button onClick={onRestart} className="text-[12px] text-gray-600 underline mt-[4px]">
          Restart verification
        </button>
      )}
    </div>
  );
}
