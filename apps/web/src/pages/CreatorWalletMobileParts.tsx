import type { Withdrawal } from './CreatorWalletParts';

export const HISTORY_COLS = [
  'Withdrawal ID',
  'No Of Coins',
  'Total Amount',
  'Admin Commission',
  'Transaction ID',
  'Payout Payment Status',
];
export const FORM_COLS = ['Sr. No', 'Model Form Type', 'Status', 'Created AT', 'Action'];

function MobileCard({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div className="rounded-[16px] bg-card p-[16px]">
      {rows.map((r, i) => (
        <div
          key={r.label}
          className={`flex items-center justify-between py-[8px] ${i < rows.length - 1 ? 'border-b border-border' : ''}`}
        >
          <span className="text-[12px] text-muted-foreground">{r.label}</span>
          <span className="text-[13px] text-foreground">{r.value}</span>
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
