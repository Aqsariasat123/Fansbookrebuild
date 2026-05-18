import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { BalanceCards, WithdrawModal } from './CreatorWalletParts';
import type { BalanceData } from './CreatorWalletParts';
import IncomeSection from '../components/creator-wallet/IncomeSection';
import WithdrawalHistorySection from '../components/creator-wallet/WithdrawalHistorySection';

type Tab = 'income' | 'withdrawals';

/**
 * Creator wallet. Two tabs (per client spec):
 * - Income — tips, subscriptions, PPV; integrates the "My Earnings" surface.
 * - Withdrawal History — adds Date & Time column + date-range search.
 */
export default function CreatorWallet() {
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('income');
  const [showWithdraw, setShowWithdraw] = useState(false);

  useEffect(() => {
    api
      .get('/creator/wallet/balance')
      .then((b) => setBalance(b.data.data ?? b.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleWithdraw(amount: string, method: string) {
    await api.post('/creator/wallet/withdraw', { amount: Number(amount), method });
    setShowWithdraw(false);
    const b = await api.get('/creator/wallet/balance');
    setBalance(b.data.data ?? b.data);
    setActiveTab('withdrawals');
  }

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-foreground border-t-transparent" />
      </div>
    );

  return (
    <div className="flex flex-col gap-[20px]">
      <p className="text-[24px] font-semibold text-foreground">My Wallet</p>

      <BalanceCards balance={balance} />

      {/* Action Buttons */}
      <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2">
        <button
          onClick={() => setShowWithdraw(true)}
          className="rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[14px] text-[16px] font-medium text-white hover:opacity-90 transition-opacity"
        >
          Withdraw
        </button>
        <button className="rounded-[50px] border border-border py-[14px] text-[16px] text-foreground hover:border-foreground transition-colors">
          Withdraw Tax Form
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-[16px] border-b border-border/30 md:gap-[24px]">
        <button
          onClick={() => setActiveTab('income')}
          className={`pb-[10px] text-[13px] font-medium transition-colors md:text-[16px] ${activeTab === 'income' ? 'border-b-2 border-[#01adf1] text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Income
        </button>
        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`pb-[10px] text-[13px] font-medium transition-colors md:text-[16px] ${activeTab === 'withdrawals' ? 'border-b-2 border-[#01adf1] text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Withdrawal History
        </button>
      </div>

      {activeTab === 'income' ? <IncomeSection /> : <WithdrawalHistorySection />}

      {showWithdraw && (
        <WithdrawModal onClose={() => setShowWithdraw(false)} onSubmit={handleWithdraw} />
      )}
    </div>
  );
}
