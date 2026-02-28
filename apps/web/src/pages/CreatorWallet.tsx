import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import {
  BalanceCards,
  HistoryRow,
  FormRow,
  MobileHistoryCard,
  MobileFormCard,
  WithdrawModal,
  Pagination,
  HISTORY_COLS,
  FORM_COLS,
} from './CreatorWalletParts';
import type { BalanceData, Withdrawal } from './CreatorWalletParts';

type Tab = 'history' | 'form';

export default function CreatorWallet() {
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('history');
  const [showWithdraw, setShowWithdraw] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/creator/wallet/balance'), api.get('/creator/wallet/withdrawals')])
      .then(([b, w]) => {
        setBalance(b.data.data ?? b.data);
        const wData = w.data.data;
        setWithdrawals(Array.isArray(wData) ? wData : (wData?.items ?? []));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleWithdraw(amount: string, method: string) {
    await api.post('/creator/wallet/withdraw', { amount: Number(amount), method });
    setShowWithdraw(false);
    const [b, w] = await Promise.all([
      api.get('/creator/wallet/balance'),
      api.get('/creator/wallet/withdrawals'),
    ]);
    setBalance(b.data.data ?? b.data);
    const wData2 = w.data.data;
    setWithdrawals(Array.isArray(wData2) ? wData2 : (wData2?.items ?? []));
  }

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
      </div>
    );

  const columns = activeTab === 'history' ? HISTORY_COLS : FORM_COLS;

  return (
    <div className="flex flex-col gap-[20px]">
      <p className="text-[24px] font-semibold text-[#f8f8f8]">My Wallet</p>

      <BalanceCards balance={balance} />

      {/* Action Buttons */}
      <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2">
        <button
          onClick={() => setShowWithdraw(true)}
          className="rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[14px] text-[16px] font-medium text-white hover:opacity-90 transition-opacity"
        >
          Withdraw
        </button>
        <button className="rounded-[50px] border border-[#5d5d5d] py-[14px] text-[16px] text-white hover:border-white transition-colors">
          Withdraw Tax Form
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-[24px] border-b border-[#5d5d5d]/30">
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-[10px] text-[16px] font-medium transition-colors ${activeTab === 'history' ? 'border-b-2 border-[#01adf1] text-[#01adf1]' : 'text-[#5d5d5d] hover:text-white'}`}
        >
          Withdrawal History
        </button>
        <button
          onClick={() => setActiveTab('form')}
          className={`pb-[10px] text-[16px] font-medium transition-colors ${activeTab === 'form' ? 'border-b-2 border-[#01adf1] text-[#01adf1]' : 'text-[#5d5d5d] hover:text-white'}`}
        >
          Withdrawal Form History
        </button>
      </div>

      {/* Mobile Cards */}
      <div className="flex flex-col gap-[12px] md:hidden">
        {withdrawals.length === 0 ? (
          <p className="py-[40px] text-center text-[14px] text-[#5d5d5d]">No records yet</p>
        ) : (
          withdrawals.map((w, i) =>
            activeTab === 'history' ? (
              <MobileHistoryCard key={w.id} w={w} index={i} />
            ) : (
              <MobileFormCard key={w.id} w={w} index={i} />
            ),
          )
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto rounded-[16px] md:block">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-gradient-to-r from-[#00b4d8] to-[#0096c7]">
              {columns.map((h) => (
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
            {withdrawals.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-[40px] text-center text-[14px] text-[#5d5d5d]">
                  No records yet
                </td>
              </tr>
            ) : (
              withdrawals.map((w, i) =>
                activeTab === 'history' ? (
                  <HistoryRow key={w.id} w={w} index={i} />
                ) : (
                  <FormRow key={w.id} w={w} index={i} />
                ),
              )
            )}
          </tbody>
        </table>
      </div>

      <Pagination total={withdrawals.length} perPage={10} />

      {showWithdraw && (
        <WithdrawModal onClose={() => setShowWithdraw(false)} onSubmit={handleWithdraw} />
      )}
    </div>
  );
}
