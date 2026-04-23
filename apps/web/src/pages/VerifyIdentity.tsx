import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { FormStep } from './VerifyIdentityFormStep';
import type { VerifyStatus, FormState } from './VerifyIdentityFormStep';
import { SdkStep, PendingStep, ResultStep } from './VerifyIdentitySteps';

type Step = 'FORM' | 'SDK' | 'PENDING' | 'RESULT';

const RESULT_STATUSES: VerifyStatus[] = ['APPROVED', 'REJECTED', 'MANUAL_REVIEW'];

function deriveInitialStep(
  vstatus: string | undefined | null,
  done: boolean,
): { step: Step; status: VerifyStatus } {
  if (done) return { step: 'PENDING', status: 'PENDING' };
  if (vstatus === 'APPROVED') return { step: 'RESULT', status: 'APPROVED' };
  if (vstatus === 'REJECTED') return { step: 'RESULT', status: 'REJECTED' };
  if (vstatus === 'MANUAL_REVIEW') return { step: 'RESULT', status: 'MANUAL_REVIEW' };
  if (vstatus === 'PENDING') return { step: 'FORM', status: 'PENDING' };
  return { step: 'FORM', status: 'PENDING' };
}

export default function VerifyIdentity() {
  const [searchParams] = useSearchParams();
  const authUser = useAuthStore((s) => s.user);
  const setAuthUser = useAuthStore((s) => s.setUser);

  const isDone = searchParams.get('done') === '1';
  const derived = deriveInitialStep(authUser?.verificationStatus, isDone);

  const [step, setStep] = useState<Step>(derived.step);
  const [status, setStatus] = useState<VerifyStatus>(derived.status);
  const [sdkToken, setSdkToken] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync authStore retryCount if showing result
  useEffect(() => {
    if (derived.step !== 'RESULT') return;
    api
      .get('/verification/status')
      .then(({ data: r }) => {
        if (r.success) setRetryCount(r.data.retryCount ?? 0);
      })
      .catch(() => {});
  }, [derived.step]);

  // Always fetch real status from API on mount to correct stale authStore
  useEffect(() => {
    if (isDone) return;
    api
      .get('/verification/status')
      .then(({ data: r }) => {
        if (!r.success) return;
        const s = r.data.status as VerifyStatus;
        if (RESULT_STATUSES.includes(s)) {
          setStatus(s);
          setRetryCount(r.data.retryCount ?? 0);
          setStep('RESULT');
        } else {
          // PENDING or UNVERIFIED: always show form (PENDING shows info banner)
          if (s === 'PENDING') setStatus('PENDING');
          setStep('FORM');
        }
      })
      .catch(() => {});
  }, [isDone]);

  // Poll while PENDING or SDK (handles webhook-based completion on both steps)
  useEffect(() => {
    if (step !== 'PENDING' && step !== 'SDK') return;
    pollRef.current = setInterval(
      () => {
        api
          .get('/verification/status')
          .then(({ data: r }) => {
            if (!r.success || r.data.status === 'PENDING') return;
            clearInterval(pollRef.current!);
            const s = r.data.status as VerifyStatus;
            setStatus(s);
            setRetryCount(r.data.retryCount ?? 0);
            // Update authStore so sidebar badge refreshes
            if (authUser) {
              setAuthUser({
                ...authUser,
                verificationStatus: s === 'MANUAL_REVIEW' ? 'PENDING' : s,
              });
            }
            setStep(s === 'UNVERIFIED' ? 'FORM' : 'RESULT');
          })
          .catch(() => {});
      },
      step === 'SDK' ? 3000 : 8000,
    );
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [step, authUser, setAuthUser]);

  async function handleFormSubmit(form: FormState) {
    setLoading(true);
    setError('');
    try {
      const { data: r } = await api.post('/verification/start', form);
      if (!r.success) {
        setError(r.message ?? 'Failed to start verification');
        return;
      }
      setSdkToken(r.data.sdkToken);
      setStep(r.data.sdkToken === 'PLACEHOLDER_TOKEN' ? 'PENDING' : 'SDK');
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center py-[32px] px-[16px]">
      <div className="w-full max-w-[520px] rounded-[16px] border border-gray-800 bg-card p-[32px] shadow-xl">
        <div className="mb-[28px] text-center">
          <div className="mx-auto mb-[12px] h-[4px] w-[60px] rounded-full bg-gradient-to-r from-[#01adf1] to-[#a61651]" />
          <h1 className="text-[22px] font-bold text-white">Identity Verification</h1>
          <p className="mt-[4px] text-[13px] text-gray-500">Powered by Didit — Inscrio</p>
        </div>
        {step === 'FORM' && (
          <FormStep
            onSubmit={handleFormSubmit}
            loading={loading}
            error={error}
            pendingReview={status === 'PENDING'}
          />
        )}
        {step === 'SDK' && <SdkStep sdkToken={sdkToken} onDone={() => setStep('PENDING')} />}
        {step === 'PENDING' && (
          <PendingStep
            onRestart={() => {
              setStep('FORM');
              setError('');
            }}
          />
        )}
        {step === 'RESULT' && (
          <ResultStep
            status={status}
            retryCount={retryCount}
            onRetry={() => {
              setStep('FORM');
              setError('');
            }}
          />
        )}
      </div>
    </div>
  );
}
