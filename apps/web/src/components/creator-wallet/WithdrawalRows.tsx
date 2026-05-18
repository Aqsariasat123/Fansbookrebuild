export interface WithdrawalRow {
  id: string;
  amount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  processedAt: string | null;
}

const COLS = ['Withdrawal ID', 'Date & Time', 'Total Amount', 'Payment Method', 'Status'] as const;

function fmtDateTime(iso: string) {
  const d = new Date(iso);
  const date = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return `${date} ${time}`;
}

function statusLabel(s: string) {
  if (s === 'COMPLETED') return 'Paid';
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export function DesktopTable({ rows }: { rows: WithdrawalRow[] }) {
  return (
    <div className="hidden overflow-x-auto rounded-[16px] md:block">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="bg-gradient-to-r from-[#00b4d8] to-[#0096c7]">
            {COLS.map((h) => (
              <th
                key={h}
                className="px-[16px] py-[14px] text-left text-[14px] font-semibold text-white"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-card">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={COLS.length}
                className="py-[40px] text-center text-[14px] text-muted-foreground"
              >
                No withdrawals in this range
              </td>
            </tr>
          ) : (
            rows.map((w, i) => (
              <tr key={w.id} className="border-b border-muted last:border-0">
                <td className="px-[16px] py-[14px] text-[14px] text-foreground">
                  #{String(i + 1).padStart(4, '0')}
                </td>
                <td className="px-[16px] py-[14px] text-[14px] text-foreground">
                  {fmtDateTime(w.createdAt)}
                </td>
                <td className="px-[16px] py-[14px] text-[14px] text-foreground">
                  &euro;{w.amount?.toFixed(2)}
                </td>
                <td className="px-[16px] py-[14px] text-[14px] text-foreground">
                  {w.paymentMethod}
                </td>
                <td className="px-[16px] py-[14px] text-[14px] text-foreground">
                  {statusLabel(w.status)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function MobileCards({ rows }: { rows: WithdrawalRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="py-[40px] text-center text-[14px] text-muted-foreground md:hidden">
        No withdrawals in this range
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-[12px] md:hidden">
      {rows.map((w, i) => (
        <div key={w.id} className="rounded-[16px] bg-card p-[16px]">
          {[
            ['Withdrawal ID', `#${String(i + 1).padStart(4, '0')}`],
            ['Date & Time', fmtDateTime(w.createdAt)],
            ['Amount', `€${w.amount?.toFixed(2)}`],
            ['Method', w.paymentMethod],
            ['Status', statusLabel(w.status)],
          ].map(([label, value], idx, arr) => (
            <div
              key={label}
              className={`flex items-center justify-between py-[8px] ${idx < arr.length - 1 ? 'border-b border-border' : ''}`}
            >
              <span className="text-[12px] text-muted-foreground">{label}</span>
              <span className="text-[13px] text-foreground">{value}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
