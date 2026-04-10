import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { SdkStep, PendingStep, ResultStep } from './VerifyIdentitySteps';

type Step = 'FORM' | 'SDK' | 'PENDING' | 'RESULT';
type VerifyStatus = 'APPROVED' | 'REJECTED' | 'MANUAL_REVIEW' | 'PENDING' | 'UNVERIFIED';

const RESULT_STATUSES: VerifyStatus[] = ['APPROVED', 'REJECTED', 'MANUAL_REVIEW'];

interface FormState {
  firstName: string;
  lastName: string;
  dob: string;
}

function deriveInitialStep(
  vstatus: string | undefined | null,
  done: boolean,
): { step: Step; status: VerifyStatus } {
  if (done) return { step: 'PENDING', status: 'PENDING' };
  if (vstatus === 'APPROVED') return { step: 'RESULT', status: 'APPROVED' };
  if (vstatus === 'REJECTED') return { step: 'RESULT', status: 'REJECTED' };
  if (vstatus === 'MANUAL_REVIEW') return { step: 'RESULT', status: 'MANUAL_REVIEW' };
  if (vstatus === 'PENDING') return { step: 'PENDING', status: 'PENDING' };
  return { step: 'FORM', status: 'PENDING' };
}

function FormStep({
  onSubmit,
  loading,
  error,
}: {
  onSubmit: (form: FormState) => void;
  loading: boolean;
  error: string;
}) {
  const [form, setForm] = useState<FormState>({ firstName: '', lastName: '', dob: '' });
  const change = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="flex flex-col gap-[20px]">
      <p className="text-[14px] text-gray-400">
        To access all features on Inscrio, we need to verify your identity. This process is quick
        and secure, powered by Didit.
      </p>
      {error && (
        <div className="rounded-[8px] bg-red-500/10 border border-red-500/30 px-[14px] py-[10px] text-[13px] text-red-400">
          {error}
        </div>
      )}
      <div className="flex flex-col gap-[14px]">
        {(['firstName', 'lastName'] as const).map((field) => (
          <div key={field} className="flex flex-col gap-[6px]">
            <label className="text-[13px] font-medium text-gray-300 capitalize">
              {field === 'firstName' ? 'First Name' : 'Last Name'}
            </label>
            <input
              type="text"
              value={form[field]}
              onChange={change(field)}
              className="rounded-[10px] border border-gray-700 bg-gray-800 px-[14px] py-[10px] text-[14px] text-white outline-none focus:border-[#01adf1]"
              placeholder={field === 'firstName' ? 'John' : 'Doe'}
            />
          </div>
        ))}
        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] font-medium text-gray-300">Date of Birth</label>
          <input
            type="date"
            value={form.dob}
            onChange={change('dob')}
            className="rounded-[10px] border border-gray-700 bg-gray-800 px-[14px] py-[10px] text-[14px] text-white outline-none focus:border-[#01adf1]"
          />
        </div>
      </div>
      <button
        disabled={loading || !form.firstName || !form.lastName || !form.dob}
        onClick={() => onSubmit(form)}
        className="rounded-full bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[32px] py-[12px] text-[15px] font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Starting…' : 'Start Verification'}
      </button>
    </div>
  );
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
        } else if (s === 'PENDING') {
          setStep('PENDING');
        } else {
          setStep('FORM');
        }
      })
      .catch(() => {});
  }, [isDone]);

  // Poll while PENDING
  useEffect(() => {
    if (step !== 'PENDING') return;
    pollRef.current = setInterval(() => {
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
    }, 8000);
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
          <FormStep onSubmit={handleFormSubmit} loading={loading} error={error} />
        )}
        {step === 'SDK' && <SdkStep sdkToken={sdkToken} onDone={() => setStep('PENDING')} />}
        {step === 'PENDING' && <PendingStep />}
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
