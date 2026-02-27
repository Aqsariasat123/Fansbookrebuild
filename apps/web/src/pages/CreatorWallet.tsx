import { useEffect, useState } from 'react';
import { api } from '../lib/api';

interface BalanceData {
  balance: number;
  pendingBalance: number;
  eurEquivalent: number;
}
interface Withdrawal {
  id: string;
  amount: number;
  coins: number;
  commission: number;
  transactionId: string;
  status: string;
  method: string;
  createdAt: string;
}

type Tab = 'history' | 'form';

function BalanceCards({ balance }: { balance: BalanceData | null }) {
  return (
    <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2">
      <div className="flex items-center gap-[20px] rounded-[16px] bg-[#0e1012] p-[24px]">
        <div className="flex size-[50px] items-center justify-center rounded-[12px] bg-gradient-to-br from-[#01adf1] to-[#0177a3]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
          </svg>
        </div>
        <div>
          <p className="text-[16px] text-[#a0a0a0]">Coins Balance</p>
          <p className="text-[40px] font-bold text-[#f8f8f8]">{balance?.balance ?? 0}</p>
        </div>
      </div>
      <div className="flex items-center gap-[20px] rounded-[16px] bg-[#0e1012] p-[24px]">
        <div className="flex size-[50px] items-center justify-center rounded-[12px] bg-gradient-to-br from-[#a61651] to-[#7a1040]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
          </svg>
        </div>
        <div>
          <p className="text-[16px] text-[#a0a0a0]">Total Equivalent Amount</p>
          <p className="text-[40px] font-bold text-[#f8f8f8]">
            &euro;{balance?.eurEquivalent ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
}

function HistoryRow({ w, index }: { w: Withdrawal; index: number }) {
  return (
    <tr className="border-b border-[#15191c] last:border-0">
      <td className="px-[16px] py-[14px] text-[14px] text-[#f8f8f8]">
        #{String(index + 1).padStart(4, '0')}
      </td>
      <td className="px-[16px] py-[14px] text-[14px] text-[#f8f8f8]">{w.coins || 500}</td>
      <td className="px-[16px] py-[14px] text-[14px] text-[#f8f8f8]">
        &euro;{w.amount?.toFixed(2)}
      </td>
      <td className="px-[16px] py-[14px] text-[14px] text-[#f8f8f8]">
        &euro;{w.commission?.toFixed(2) || '5.00'}
      </td>
      <td className="px-[16px] py-[14px] text-[14px] text-[#f8f8f8]">
        {w.transactionId || 'TX12345'}
      </td>
      <td className="px-[16px] py-[14px] text-[14px] text-[#f8f8f8]">{w.status || 'Paid'}</td>
    </tr>
  );
}

function FormRow({ w, index }: { w: Withdrawal; index: number }) {
  return (
    <tr className="border-b border-[#15191c] last:border-0">
      <td className="px-[16px] py-[14px] text-[14px] text-[#f8f8f8]">
        #{String(index + 1).padStart(4, '0')}
      </td>
      <td className="px-[16px] py-[14px] text-[14px] text-[#f8f8f8]">{w.coins || 500}</td>
      <td className="px-[16px] py-[14px] text-[14px] text-[#f8f8f8]">
        &euro;{w.amount?.toFixed(2)}
      </td>
      <td className="px-[16px] py-[14px] text-[14px] text-[#f8f8f8]">
        &euro;{w.commission?.toFixed(2) || '5.00'}
      </td>
      <td className="px-[16px] py-[14px] text-[14px] text-[#f8f8f8]">
        {w.transactionId || 'TX12345'}
      </td>
    </tr>
  );
}

function WithdrawModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (amount: string, method: string) => void;
}) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank');
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[400px] rounded-[16px] bg-white p-[24px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-[16px] text-[20px] font-semibold text-[#1a1a1a]">Withdraw</h3>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="mb-[12px] w-full rounded-[8px] border border-[#d0d0d0] px-[14px] py-[10px] text-[14px] outline-none"
        />
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="mb-[16px] w-full rounded-[8px] border border-[#d0d0d0] px-[14px] py-[10px] text-[14px] outline-none"
        >
          <option value="bank">Bank Transfer</option>
          <option value="paypal">PayPal</option>
          <option value="crypto">Crypto</option>
        </select>
        <button
          onClick={() => onSubmit(amount, method)}
          className="w-full rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[12px] text-[15px] font-medium text-white"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

const HISTORY_COLS = [
  'Withdrawal ID',
  'No Of Coins',
  'Total Amount',
  'Admin Commission',
  'Transaction ID',
  'Payout Payment Status',
];
const FORM_COLS = ['Sr. No', 'Model Form Type', 'Status', 'Created AT', 'Action'];

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
        setWithdrawals(w.data.data ?? []);
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
    setWithdrawals(w.data.data ?? []);
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

      {/* Table */}
      <div className="overflow-x-auto rounded-[16px]">
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

function Pagination({ total, perPage }: { total: number; perPage: number }) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-[6px]">
      {Array.from({ length: Math.min(pages, 6) }, (_, i) => (
        <button
          key={i}
          className={`flex size-[32px] items-center justify-center rounded-[4px] text-[13px] ${i === 0 ? 'bg-[#01adf1] text-white' : 'bg-[#0e1012] text-[#5d5d5d] hover:text-white'}`}
        >
          {i + 1}
        </button>
      ))}
      {pages > 6 && <span className="text-[13px] text-[#5d5d5d]">...</span>}
      <button className="rounded-[4px] bg-[#0e1012] px-[12px] py-[6px] text-[13px] text-[#5d5d5d] hover:text-white">
        Next
      </button>
    </div>
  );
}
