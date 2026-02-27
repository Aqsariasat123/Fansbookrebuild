import { useState, useEffect } from 'react';
import { api } from '../lib/api';

interface Subscription {
  id: string;
  creatorName: string;
  creatorAvatar: string | null;
  amount: number;
  planName: string;
  startDate: string;
  endDate: string;
  renewalDate: string;
  status: string;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
}

function Pagination({
  page,
  total,
  limit,
  onPage,
}: {
  page: number;
  total: number;
  limit: number;
  onPage: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: Math.min(6, totalPages) }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-[6px] py-[24px]">
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          className={`h-[28px] w-[28px] rounded-[2px] border border-[#5d5d5d] flex items-center justify-center text-[10px] text-[#f8f8f8] ${p === page ? 'bg-[#5d5d5d]' : ''}`}
        >
          {p}
        </button>
      ))}
      {totalPages > 6 && (
        <span className="h-[28px] w-[28px] rounded-[2px] border border-[#5d5d5d] flex items-center justify-center text-[10px] text-[#f8f8f8]">
          ...
        </span>
      )}
      {page < totalPages && (
        <button
          onClick={() => onPage(page + 1)}
          className="h-[38px] px-[10px] rounded-[4px] border border-[#5d5d5d] flex items-center justify-center text-[10px] text-[#f8f8f8]"
        >
          Next
        </button>
      )}
    </div>
  );
}

const STATUS_OPTIONS = ['All', 'ACTIVE', 'EXPIRED', 'CANCELLED', 'PAST_DUE'];

export default function Subscriptions() {
  const [items, setItems] = useState<Subscription[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [statusOpen, setStatusOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentFilter, setPaymentFilter] = useState('All');
  const limit = 10;

  useEffect(() => {
    const params: Record<string, string | number> = { page, limit };
    if (statusFilter !== 'All') params.status = statusFilter;
    api
      .get('/subscriptions', { params })
      .then(({ data: r }) => {
        if (r.success) {
          setItems(r.data.items);
          setTotal(r.data.total);
        }
      })
      .catch(() => {});
  }, [page, statusFilter]);

  const displayed =
    paymentFilter === 'All' ? items : items.filter((s) => s.status === paymentFilter);

  return (
    <div className="flex flex-col gap-[20px]">
      <p className="text-[20px] text-[#f8f8f8]">My Subscriptions</p>

      {/* Filters */}
      <div className="flex gap-[20px]">
        <FilterDropdown
          label="Subscription Status"
          value={statusFilter}
          options={STATUS_OPTIONS}
          open={statusOpen}
          onToggle={() => {
            setStatusOpen(!statusOpen);
            setPaymentOpen(false);
          }}
          onSelect={(v) => {
            setStatusFilter(v);
            setStatusOpen(false);
            setPage(1);
          }}
        />
        <FilterDropdown
          label="Payment Status"
          value={paymentFilter}
          options={STATUS_OPTIONS}
          open={paymentOpen}
          onToggle={() => {
            setPaymentOpen(!paymentOpen);
            setStatusOpen(false);
          }}
          onSelect={(v) => {
            setPaymentFilter(v);
            setPaymentOpen(false);
          }}
        />
      </div>

      {/* Table */}
      <div className="bg-[#0e1012] rounded-[22px] overflow-hidden">
        <div className="bg-[#01adf1] grid grid-cols-7 px-[30px] py-[22px]">
          {[
            'Subscription\nID',
            'Modal Name',
            'Subscription\nAmount',
            'Subscription\nStart Date',
            'Subscription\nEnd/Renewal Date',
            'Plan Name',
            'Subscription\nStatus',
          ].map((h) => (
            <p
              key={h}
              className="text-[16px] font-bold text-[#f8f8f8] text-center whitespace-pre-line"
            >
              {h}
            </p>
          ))}
        </div>
        {displayed.length === 0 ? (
          <p className="text-center text-[#5d5d5d] py-[40px]">No subscriptions found</p>
        ) : (
          displayed.map((s, i) => (
            <div
              key={s.id}
              className={`grid grid-cols-7 px-[30px] py-[20px] ${i < displayed.length - 1 ? 'border-b border-[#15191c]' : ''}`}
            >
              <p className="text-[16px] text-white text-center">#{s.id.slice(-7)}</p>
              <p className="text-[16px] text-[#f8f8f8] text-center">{s.creatorName}</p>
              <p className="text-[16px] text-[#f8f8f8] text-center">${s.amount.toFixed(2)}</p>
              <p className="text-[16px] text-[#f8f8f8] text-center">{formatDate(s.startDate)}</p>
              <p className="text-[16px] text-[#f8f8f8] text-center">{formatDate(s.renewalDate)}</p>
              <p className="text-[16px] text-[#f8f8f8] text-center">{s.planName}</p>
              <p className="text-[16px] text-[#f8f8f8] text-center">
                {s.status === 'PAST_DUE' ? 'Pending' : s.status === 'ACTIVE' ? 'Active' : s.status}
              </p>
            </div>
          ))
        )}
      </div>
      <Pagination page={page} total={total} limit={limit} onPage={setPage} />
    </div>
  );
}

function FilterDropdown({
  label,
  value,
  options,
  open,
  onToggle,
  onSelect,
}: {
  label: string;
  value: string;
  options: string[];
  open: boolean;
  onToggle: () => void;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="relative flex-1">
      <button
        onClick={onToggle}
        className="w-full border border-[#5d5d5d] rounded-[6px] px-[30px] py-[10px] flex items-center justify-between"
      >
        <span className="text-[16px] text-[#5d5d5d]">
          {value === 'All' ? label : value.replace('_', ' ')}
        </span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M7 10l5 5 5-5"
            stroke="#5d5d5d"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute z-10 top-full left-0 w-full mt-[4px] bg-[#0e1012] border border-[#5d5d5d] rounded-[6px] overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              className={`w-full text-left px-[30px] py-[10px] text-[14px] hover:bg-[#15191c] transition-colors ${opt === value ? 'text-[#01adf1]' : 'text-[#f8f8f8]'}`}
            >
              {opt === 'All' ? `All ${label}` : opt.replace('_', ' ')}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
