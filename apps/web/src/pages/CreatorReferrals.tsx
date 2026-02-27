import { useEffect, useState } from 'react';
import { api } from '../lib/api';

interface Referral {
  id: string;
  code: string;
  username: string;
  registeredAt: string;
  subscriptionCompleted: string;
  coins: number;
}

export default function CreatorReferrals() {
  const [code, setCode] = useState('');
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/creator/referrals/code').catch(() => null),
      api.get('/creator/referrals').catch(() => null),
    ])
      .then(([codeRes, refRes]) => {
        if (codeRes?.data?.success) setCode(codeRes.data.data?.referralCode ?? '');
        if (refRes?.data?.success) setReferrals(refRes.data.data ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  function copyCode() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
      </div>
    );

  return (
    <div className="flex flex-col gap-[20px]">
      <p className="text-[24px] font-semibold text-[#f8f8f8]">My Referrals</p>

      {/* Referral Code Card */}
      <div className="rounded-[16px] bg-[#0e1012] p-[24px]">
        <p className="mb-[16px] text-[18px] font-semibold text-[#f8f8f8]">Your Referral Code</p>
        <div className="flex flex-col items-start gap-[16px] md:flex-row md:items-center">
          <div className="flex h-[50px] min-w-[300px] items-center justify-center rounded-[8px] bg-[#15191c] px-[24px]">
            <span className="text-[18px] tracking-wider text-[#f8f8f8]">{code || '------'}</span>
          </div>
          <button
            onClick={copyCode}
            disabled={!code}
            className="rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[28px] py-[12px] text-[16px] font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
      </div>

      {/* Referral Code History */}
      <p className="text-[20px] font-semibold text-[#f8f8f8]">Referral Code History</p>
      <div className="overflow-x-auto rounded-[16px]">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-gradient-to-r from-[#00b4d8] to-[#0096c7]">
              {[
                'Referral Code',
                'Modal Name',
                'Date of Registration',
                'Subscription Completed',
                'Amount of Coins',
              ].map((h) => (
                <th
                  key={h}
                  className="px-[16px] py-[14px] text-left text-[14px] font-semibold text-white"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-[#0e1012]">
            {referrals.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-[40px] text-center text-[14px] text-[#5d5d5d]">
                  No referrals yet. Share your code to start earning!
                </td>
              </tr>
            ) : (
              referrals.map((r) => (
                <tr key={r.id} className="border-b border-[#15191c] last:border-0">
                  <td className="px-[16px] py-[14px] text-[14px] text-[#f8f8f8]">
                    {r.code || code}
                  </td>
                  <td className="px-[16px] py-[14px] text-[14px] text-[#f8f8f8]">
                    {r.username || 'John Doe'}
                  </td>
                  <td className="px-[16px] py-[14px] text-[14px] text-[#f8f8f8]">
                    {r.registeredAt
                      ? new Date(r.registeredAt).toLocaleDateString('en-GB')
                      : '24-06-2025'}
                  </td>
                  <td className="px-[16px] py-[14px] text-[14px] text-[#f8f8f8]">
                    {r.subscriptionCompleted || 'Lorem Ipsum'}
                  </td>
                  <td className="px-[16px] py-[14px] text-[14px] text-[#f8f8f8]">
                    {r.coins || 100}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
