import { useNavigate } from 'react-router-dom';
import type { VerifyStatus } from './VerifyIdentityFormStep';

const BTN =
  'rounded-full bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[32px] py-[12px] text-[15px] font-semibold text-white';

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

  if (status === 'APPROVED')
    return (
      <div className="flex flex-col items-center gap-[20px] text-center py-[24px]">
        <div className="flex size-[72px] items-center justify-center rounded-full bg-green-500/20">
          <span className="material-icons-outlined text-[40px] text-green-400">verified</span>
        </div>
        <h2 className="text-[22px] font-bold text-white">You're verified!</h2>
        <p className="text-[14px] text-gray-400">
          Your identity has been confirmed. You now have full access to Inscrio.
        </p>
        <button onClick={() => navigate('/feed')} className={BTN}>
          Go to Dashboard
        </button>
      </div>
    );

  if (status === 'REJECTED')
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
          <button onClick={onRetry} className={BTN}>
            Try Again
          </button>
        ) : (
          <p className="text-[13px] text-red-400">
            Maximum attempts reached. Please contact support.
          </p>
        )}
      </div>
    );

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
