import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { DesktopTable, MobileCards, type WithdrawalRow } from './WithdrawalRows';

function FiltersBar({
  startDate,
  endDate,
  onStart,
  onEnd,
  onClear,
}: {
  startDate: string;
  endDate: string;
  onStart: (v: string) => void;
  onEnd: (v: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col gap-[10px] rounded-[16px] bg-card p-[16px] md:flex-row md:items-center md:gap-[16px]">
      <span className="text-[13px] text-muted-foreground md:text-[14px]">Search by date:</span>
      <div className="grid grid-cols-2 gap-[8px] md:flex md:items-center md:gap-[12px]">
        <div className="flex items-center gap-[6px]">
          <span className="text-[12px] text-muted-foreground md:text-[13px]">From:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStart(e.target.value)}
            className="w-full rounded-[6px] border border-border bg-transparent px-[8px] py-[6px] text-[12px] text-foreground outline-none md:w-auto md:px-[10px] md:text-[13px]"
          />
        </div>
        <div className="flex items-center gap-[6px]">
          <span className="text-[12px] text-muted-foreground md:text-[13px]">To:</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEnd(e.target.value)}
            className="w-full rounded-[6px] border border-border bg-transparent px-[8px] py-[6px] text-[12px] text-foreground outline-none md:w-auto md:px-[10px] md:text-[13px]"
          />
        </div>
      </div>
      {(startDate || endDate) && (
        <button
          onClick={onClear}
          className="rounded-[50px] bg-[#01adf1] px-[14px] py-[6px] text-[13px] text-white"
        >
          Clear
        </button>
      )}
    </div>
  );
}

export default function WithdrawalHistorySection() {
  const [items, setItems] = useState<WithdrawalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    api
      .get('/creator/wallet/withdrawals', { params })
      .then(({ data: r }) => {
        const wData = r.data;
        setItems(Array.isArray(wData) ? wData : (wData?.items ?? []));
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [startDate, endDate]);

  return (
    <div className="flex flex-col gap-[16px]">
      <FiltersBar
        startDate={startDate}
        endDate={endDate}
        onStart={setStartDate}
        onEnd={setEndDate}
        onClear={() => {
          setStartDate('');
          setEndDate('');
        }}
      />
      {loading ? (
        <div className="flex justify-center py-[40px]">
          <div className="size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
        </div>
      ) : (
        <>
          <MobileCards rows={items} />
          <DesktopTable rows={items} />
        </>
      )}
    </div>
  );
}
