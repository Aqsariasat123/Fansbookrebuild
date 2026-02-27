export interface Withdrawal {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: 'COMPLETED' | 'PENDING' | 'PROCESSING' | 'REJECTED';
  processedAt: string | null;
}

function formatAmount(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '\u2014';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const STATUS_STYLES: Record<Withdrawal['status'], string> = {
  COMPLETED: 'bg-green-500/20 text-green-400',
  PENDING: 'bg-yellow-500/20 text-yellow-400',
  PROCESSING: 'bg-blue-500/20 text-blue-400',
  REJECTED: 'bg-red-500/20 text-red-400',
};

interface WithdrawalHistoryProps {
  withdrawals: Withdrawal[];
}

export function WithdrawalHistory({ withdrawals }: WithdrawalHistoryProps) {
  if (withdrawals.length === 0) {
    return (
      <div className="overflow-x-auto rounded-[22px] bg-[#0e1012] p-[24px]">
        <p className="py-[20px] text-center text-[14px] text-[#5d5d5d]">
          No withdrawal history yet.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[22px] bg-[#0e1012] p-[24px]">
      <table className="w-full text-left text-[14px]">
        <thead>
          <tr className="border-b border-[#5d5d5d]/30 text-[#5d5d5d]">
            <th className="pb-[12px] pr-[16px] font-medium">Date</th>
            <th className="pb-[12px] pr-[16px] font-medium">Amount</th>
            <th className="pb-[12px] pr-[16px] font-medium">Method</th>
            <th className="pb-[12px] pr-[16px] font-medium">Status</th>
            <th className="pb-[12px] font-medium">Processed</th>
          </tr>
        </thead>
        <tbody>
          {withdrawals.map((w) => (
            <tr key={w.id} className="border-b border-[#5d5d5d]/10 text-[#f8f8f8]">
              <td className="py-[12px] pr-[16px]">{formatDate(w.date)}</td>
              <td className="py-[12px] pr-[16px]">{formatAmount(w.amount)}</td>
              <td className="py-[12px] pr-[16px]">{w.method}</td>
              <td className="py-[12px] pr-[16px]">
                <span
                  className={`inline-block rounded-full px-[10px] py-[3px] text-[12px] font-medium ${STATUS_STYLES[w.status]}`}
                >
                  {w.status}
                </span>
              </td>
              <td className="py-[12px]">{formatDate(w.processedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
