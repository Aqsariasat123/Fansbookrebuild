import { useEffect, useState } from 'react';
import { api } from '../lib/api';

interface Referral {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  earnings: number;
  joinedAt: string;
}

export default function CreatorReferrals() {
  const [code, setCode] = useState('');
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const referralLink = code ? `https://fansbook.com/ref/${code}` : '';

  useEffect(() => {
    Promise.all([
      api.get('/creator/referrals/code').catch(() => null),
      api.get('/creator/referrals').catch(() => null),
    ])
      .then(([codeRes, refRes]) => {
        if (codeRes?.data?.success) setCode(codeRes.data.data.code);
        if (refRes?.data?.success) setReferrals(refRes.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalEarnings = referrals.reduce((sum, r) => sum + r.earnings, 0);

  const copyToClipboard = (text: string, type: 'code' | 'link') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'code') {
        setCodeCopied(true);
        setTimeout(() => setCodeCopied(false), 2000);
      } else {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-[60px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[20px]">
      <p className="text-[20px] text-[#f8f8f8]">Referrals</p>

      {/* Referral Code Card */}
      <div className="flex flex-col gap-[16px] rounded-[22px] bg-[#0e1012] p-[24px]">
        <p className="text-[18px] font-medium text-[#f8f8f8]">My Referral Code</p>

        <div className="flex flex-col items-start gap-[12px] sm:flex-row sm:items-center">
          <div className="flex h-[48px] min-w-[180px] items-center justify-center rounded-[12px] border border-[#5d5d5d] px-[20px]">
            <span className="text-[20px] font-semibold tracking-widest text-[#f8f8f8]">
              {code || '------'}
            </span>
          </div>
          <button
            onClick={() => copyToClipboard(code, 'code')}
            disabled={!code}
            className="rounded-[12px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[24px] py-[12px] text-[14px] font-semibold text-[#f8f8f8] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {codeCopied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>

        <div className="flex flex-col gap-[8px]">
          <p className="text-[13px] text-[#5d5d5d]">Share your referral link:</p>
          <div className="flex flex-col items-start gap-[10px] sm:flex-row sm:items-center">
            <span className="break-all text-[14px] text-[#f8f8f8]">{referralLink || '---'}</span>
            <button
              onClick={() => copyToClipboard(referralLink, 'link')}
              disabled={!referralLink}
              className="shrink-0 rounded-[12px] border border-[#5d5d5d] px-[16px] py-[8px] text-[13px] text-[#f8f8f8] transition-colors hover:border-[#01adf1] hover:text-[#01adf1] disabled:opacity-50"
            >
              {linkCopied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-2 gap-[12px] md:gap-[20px]">
        <div className="flex flex-col items-center gap-[6px] rounded-[22px] bg-[#0e1012] py-[20px]">
          <p className="text-[28px] font-semibold text-[#f8f8f8] md:text-[36px]">
            {referrals.length}
          </p>
          <p className="text-[13px] text-[#5d5d5d] md:text-[14px]">Total Referrals</p>
        </div>
        <div className="flex flex-col items-center gap-[6px] rounded-[22px] bg-[#0e1012] py-[20px]">
          <p className="text-[28px] font-semibold text-[#f8f8f8] md:text-[36px]">
            ${totalEarnings.toFixed(2)}
          </p>
          <p className="text-[13px] text-[#5d5d5d] md:text-[14px]">Total Earnings</p>
        </div>
      </div>

      {/* Referrals History Table */}
      <div className="rounded-[22px] bg-[#0e1012] p-[20px] md:p-[24px]">
        <p className="mb-[16px] text-[16px] font-medium text-[#f8f8f8] md:text-[18px]">
          Referral History
        </p>

        {referrals.length === 0 ? (
          <p className="py-[40px] text-center text-[14px] text-[#5d5d5d]">
            No referrals yet. Share your code to start earning!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead>
                <tr className="border-b border-[#5d5d5d]/30">
                  <th className="pb-[12px] text-left text-[13px] font-medium text-[#5d5d5d]">
                    User
                  </th>
                  <th className="pb-[12px] text-left text-[13px] font-medium text-[#5d5d5d]">
                    Earnings
                  </th>
                  <th className="pb-[12px] text-left text-[13px] font-medium text-[#5d5d5d]">
                    Date Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((r) => (
                  <tr key={r.id} className="border-b border-[#5d5d5d]/10 last:border-0">
                    <td className="py-[12px]">
                      <div className="flex items-center gap-[12px]">
                        <img
                          src={r.avatar || '/icons/dashboard/person.svg'}
                          alt={r.displayName}
                          className="size-[32px] shrink-0 rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                          <span className="text-[14px] leading-[normal] text-[#f8f8f8]">
                            {r.displayName}
                          </span>
                          <span className="text-[11px] leading-[normal] text-[#5d5d5d]">
                            @{r.username}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-[12px] text-[14px] text-[#f8f8f8]">
                      ${r.earnings.toFixed(2)}
                    </td>
                    <td className="py-[12px] text-[14px] text-[#5d5d5d]">
                      {new Date(r.joinedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
