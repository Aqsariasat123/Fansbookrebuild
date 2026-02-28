import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';

type Status = 'loading' | 'success' | 'error';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }
    api
      .post('/auth/verify-email', { token })
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#15191c] px-4 font-outfit">
      <div className="w-full max-w-[420px] rounded-[22px] bg-[#0e1012] px-8 py-10 flex flex-col items-center">
        <img src="/icons/dashboard/fansbook-logo.webp" alt="Fansbook" className="h-10 mb-8" />

        {status === 'loading' && (
          <>
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
            <p className="mt-4 text-[16px] text-[#5d5d5d]">Verifying your email...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <svg
                className="h-8 w-8 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mt-4 text-[24px] font-medium text-[#f8f8f8]">
              Email Verified Successfully!
            </h1>
            <p className="mt-2 text-[14px] text-[#5d5d5d]">Your email has been confirmed.</p>
            <Link
              to="/login"
              className="mt-6 flex h-[49px] w-full items-center justify-center rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] text-[16px] font-medium text-[#f8f8f8] hover:opacity-90"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
              <svg
                className="h-8 w-8 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="mt-4 text-[24px] font-medium text-[#f8f8f8]">Verification Failed</h1>
            <p className="mt-2 text-center text-[14px] text-[#5d5d5d]">
              Invalid or expired verification link.
            </p>
            <Link
              to="/login"
              className="mt-6 flex h-[49px] w-full items-center justify-center rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] text-[16px] font-medium text-[#f8f8f8] hover:opacity-90"
            >
              Go to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
