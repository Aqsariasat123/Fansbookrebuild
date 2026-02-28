export interface EarningItem {
  id: string;
  date: string;
  username: string;
  totalCoins: number;
  receivedVia: string;
  status: string;
}

export function EarningsMobileCards({ items }: { items: EarningItem[] }) {
  return (
    <>
      {items.map((item) => (
        <div key={item.id} className="rounded-[16px] bg-[#0e1012] p-[16px]">
          {[
            { label: 'Date', value: new Date(item.date).toLocaleDateString('en-GB') },
            { label: 'Username', value: item.username || 'John Doe' },
            { label: 'Total Coins', value: String(item.totalCoins || 100) },
            { label: 'Received Via', value: item.receivedVia || 'PayPal' },
            { label: 'Status', value: item.status || 'Paid' },
          ].map((r, i, arr) => (
            <div
              key={r.label}
              className={`flex items-center justify-between py-[8px] ${i < arr.length - 1 ? 'border-b border-[#1a1d20]' : ''}`}
            >
              <span className="text-[12px] text-[#5d5d5d]">{r.label}</span>
              <span className="text-[13px] text-[#f8f8f8]">{r.value}</span>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

const COLS = ['Date & Time', 'Username', 'Total Coins', 'Coins Received Via', 'Payment Status'];

export function EarningsTable({ items, loading }: { items: EarningItem[]; loading: boolean }) {
  return (
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
      <tbody className="bg-[#0e1012]">
        {loading ? (
          <tr>
            <td colSpan={5} className="py-[40px] text-center">
              <div className="mx-auto size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
            </td>
          </tr>
        ) : items.length === 0 ? (
          <tr>
            <td colSpan={5} className="py-[40px] text-center text-[14px] text-[#5d5d5d]">
              No earnings yet
            </td>
          </tr>
        ) : (
          items.map((item) => (
            <tr key={item.id} className="border-b border-[#15191c] last:border-0">
              <td className="px-[16px] py-[14px] text-[14px] text-[#f8f8f8]">
                {new Date(item.date).toLocaleDateString('en-GB')}
                <br />
                <span className="text-[12px] text-[#5d5d5d]">
                  {new Date(item.date).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </td>
              <td className="px-[16px] py-[14px] text-[14px] text-[#f8f8f8]">
                {item.username || 'John Doe'}
              </td>
              <td className="px-[16px] py-[14px] text-[14px] text-[#f8f8f8]">
                {item.totalCoins || 100}
              </td>
              <td className="px-[16px] py-[14px] text-[14px] text-[#f8f8f8]">
                {item.receivedVia || 'PayPal'}
              </td>
              <td className="px-[16px] py-[14px] text-[14px] text-[#f8f8f8]">
                {item.status || 'Paid'}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
