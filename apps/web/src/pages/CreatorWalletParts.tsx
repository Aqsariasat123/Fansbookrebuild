import { useState } from 'react';

export interface BalanceData {
  balance: number;
  pendingBalance: number;
  eurEquivalent: number;
}
export interface Withdrawal {
  id: string;
  amount: number;
  coins: number;
  commission: number;
  transactionId: string;
  status: string;
  method: string;
  createdAt: string;
}

export function BalanceCards({ balance }: { balance: BalanceData | null }) {
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
          <p className="text-[28px] font-bold text-[#f8f8f8] md:text-[40px]">
            {balance?.balance ?? 0}
          </p>
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
          <p className="text-[28px] font-bold text-[#f8f8f8] md:text-[40px]">
            &euro;{balance?.eurEquivalent ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
}

export function HistoryRow({ w, index }: { w: Withdrawal; index: number }) {
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

export function FormRow({ w, index }: { w: Withdrawal; index: number }) {
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

export function WithdrawModal({
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

export function Pagination({ total, perPage }: { total: number; perPage: number }) {
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

function MobileCard({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div className="rounded-[16px] bg-[#0e1012] p-[16px]">
      {rows.map((r, i) => (
        <div
          key={r.label}
          className={`flex items-center justify-between py-[8px] ${i < rows.length - 1 ? 'border-b border-[#1a1d20]' : ''}`}
        >
          <span className="text-[12px] text-[#5d5d5d]">{r.label}</span>
          <span className="text-[13px] text-[#f8f8f8]">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

export function MobileHistoryCard({ w, index }: { w: Withdrawal; index: number }) {
  return (
    <MobileCard
      rows={[
        { label: 'Withdrawal ID', value: `#${String(index + 1).padStart(4, '0')}` },
        { label: 'Coins', value: String(w.coins || 500) },
        { label: 'Amount', value: `€${w.amount?.toFixed(2)}` },
        { label: 'Commission', value: `€${w.commission?.toFixed(2) || '5.00'}` },
        { label: 'Transaction ID', value: w.transactionId || 'TX12345' },
        { label: 'Status', value: w.status || 'Paid' },
      ]}
    />
  );
}

export function MobileFormCard({ w, index }: { w: Withdrawal; index: number }) {
  return (
    <MobileCard
      rows={[
        { label: 'Sr. No', value: `#${String(index + 1).padStart(4, '0')}` },
        { label: 'Coins', value: String(w.coins || 500) },
        { label: 'Amount', value: `€${w.amount?.toFixed(2)}` },
        { label: 'Commission', value: `€${w.commission?.toFixed(2) || '5.00'}` },
        { label: 'Transaction ID', value: w.transactionId || 'TX12345' },
      ]}
    />
  );
}

export const HISTORY_COLS = [
  'Withdrawal ID',
  'No Of Coins',
  'Total Amount',
  'Admin Commission',
  'Transaction ID',
  'Payout Payment Status',
];
export const FORM_COLS = ['Sr. No', 'Model Form Type', 'Status', 'Created AT', 'Action'];
