import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { BalanceCard } from '../components/creator-wallet/BalanceCard';
import { WithdrawModal } from '../components/creator-wallet/WithdrawModal';
import { WithdrawalHistory } from '../components/creator-wallet/WithdrawalHistory';
import type { Withdrawal } from '../components/creator-wallet/WithdrawalHistory';

interface BalanceData {
  balance: number;
  pendingBalance: number;
  eurEquivalent: number;
}

type Tab = 'withdrawals' | 'form';

function tabClass(active: Tab, current: Tab) {
  const base = 'pb-[10px] text-[14px] font-medium transition-colors';
  return active === current
    ? `${base} border-b-2 border-[#f8f8f8] text-[#f8f8f8]`
    : `${base} text-[#5d5d5d] hover:text-[#f8f8f8]`;
}

async function fetchWalletData() {
  const [bRes, wRes] = await Promise.all([
    api.get('/creator/wallet/balance'),
    api.get('/creator/wallet/withdrawals'),
  ]);
  return {
    balance: (bRes.data.data ?? bRes.data) as BalanceData,
    withdrawals: (wRes.data.data ?? []) as Withdrawal[],
  };
}

export default function CreatorWallet() {
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('withdrawals');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchWalletData()
      .then(({ balance, withdrawals: w }) => {
        setBalanceData(balance);
        setWithdrawals(w);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleWithdraw(amount: number, method: string) {
    await api.post('/creator/wallet/withdraw', { amount, method });
    setShowModal(false);
    const data = await fetchWalletData();
    setBalanceData(data.balance);
    setWithdrawals(data.withdrawals);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
      </div>
    );
  }

  const b = balanceData;
  const balance = b ? b.balance : 0;
  const pending = b ? b.pendingBalance : 0;
  const eurEquiv = b ? b.eurEquivalent : 0;

  return (
    <div className="flex flex-col gap-[22px]">
      <BalanceCard
        balance={balance}
        pending={pending}
        eurEquivalent={eurEquiv}
        onWithdraw={() => setShowModal(true)}
      />

      <div className="flex gap-[24px] border-b border-[#5d5d5d]/30">
        <button
          onClick={() => setActiveTab('withdrawals')}
          className={tabClass(activeTab, 'withdrawals')}
        >
          Withdrawal History
        </button>
        <button onClick={() => setActiveTab('form')} className={tabClass(activeTab, 'form')}>
          Form History
        </button>
      </div>

      {activeTab === 'withdrawals' && <WithdrawalHistory withdrawals={withdrawals} />}
      {activeTab === 'form' && (
        <div className="rounded-[22px] bg-[#0e1012] p-[24px]">
          <p className="py-[20px] text-center text-[14px] text-[#5d5d5d]">No form history yet.</p>
        </div>
      )}

      {showModal && (
        <WithdrawModal onClose={() => setShowModal(false)} onWithdraw={handleWithdraw} />
      )}
    </div>
  );
}
