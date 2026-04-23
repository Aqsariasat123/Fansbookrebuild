import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { VerifyStatus } from './VerifyIdentityFormStep';

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

// ── Pending Step ──────────────────────────────────────────
export function PendingStep({ onRestart }: { onRestart?: () => void }) {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 120000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center gap-[20px] text-center py-[24px]">
      <div className="size-[56px] animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
      <h2 className="text-[20px] font-bold text-white">Verifying your identity</h2>
      <p className="text-[14px] text-gray-400 max-w-[340px]">
        Waiting for confirmation from Didit. This page will update automatically once your
        verification is complete.
      </p>
      {timedOut ? (
        <p className="text-[13px] text-gray-500 max-w-[300px]">
          This is taking longer than expected. You can close this page — we'll email you when your
          verification is complete.
        </p>
      ) : null}
      {onRestart && (
        <button onClick={onRestart} className="text-[12px] text-gray-600 underline mt-[4px]">
          Restart verification
        </button>
      )}
    </div>
  );
}

// ── Result Step ───────────────────────────────────────────
export function ResultStep({
  status,
  retryCount,
  onRetry,
}: {
  status: VerifyStatus;
  retryCount: number;
  onRetry: () => void;
}) {
  const navigate = useNavigate();
  const canRetry = retryCount < 3;

  if (status === 'APPROVED') {
    return (
      <div className="flex flex-col items-center gap-[20px] text-center py-[24px]">
        <div className="flex size-[72px] items-center justify-center rounded-full bg-green-500/20">
          <span className="material-icons-outlined text-[40px] text-green-400">verified</span>
        </div>
        <h2 className="text-[22px] font-bold text-white">You're verified!</h2>
        <p className="text-[14px] text-gray-400">
          Your identity has been confirmed. You now have full access to Inscrio.
        </p>
        <button
          onClick={() => navigate('/feed')}
          className="rounded-full bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[32px] py-[12px] text-[15px] font-semibold text-white"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  if (status === 'REJECTED') {
    return (
      <div className="flex flex-col items-center gap-[20px] text-center py-[24px]">
        <div className="flex size-[72px] items-center justify-center rounded-full bg-red-500/20">
          <span className="material-icons-outlined text-[40px] text-red-400">cancel</span>
        </div>
        <h2 className="text-[22px] font-bold text-white">Unable to verify</h2>
        <p className="text-[14px] text-gray-400 max-w-[340px]">
          We could not verify your identity. Please try again with a clear, well-lit photo of your
          ID document.
        </p>
        {canRetry ? (
          <button
            onClick={onRetry}
            className="rounded-full bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[32px] py-[12px] text-[15px] font-semibold text-white"
          >
            Try Again
          </button>
        ) : (
          <p className="text-[13px] text-red-400">
            Maximum attempts reached. Please contact support.
          </p>
        )}
      </div>
    );
  }

  // MANUAL_REVIEW
  return (
    <div className="flex flex-col items-center gap-[20px] text-center py-[24px]">
      <div className="flex size-[72px] items-center justify-center rounded-full bg-yellow-500/20">
        <span className="material-icons-outlined text-[40px] text-yellow-400">schedule</span>
      </div>
      <h2 className="text-[22px] font-bold text-white">Under Review</h2>
      <p className="text-[14px] text-gray-400 max-w-[340px]">
        Your documents are being reviewed by our team. We will email you within 24 hours.
      </p>
      {canRetry && (
        <button onClick={onRetry} className="mt-[4px] text-[13px] text-gray-400 underline">
          Resubmit with different documents
        </button>
      )}
    </div>
  );
}
