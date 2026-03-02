import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { FilterDropdown } from '../components/shared/FilterDropdown';
import { Pagination } from '../components/shared/Pagination';

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

const STATUS_OPTIONS = ['All', 'ACTIVE', 'EXPIRED', 'CANCELLED', 'PAST_DUE'];
const TABLE_HEADERS = [
  'Subscription\nID',
  'Modal Name',
  'Subscription\nAmount',
  'Subscription\nStart Date',
  'Subscription End\nRenewal Date',
  'Action',
];

export default function Subscriptions() {
  const [items, setItems] = useState<Subscription[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [statusOpen, setStatusOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const limit = 10;

  async function handleCancel(subId: string) {
    if (!confirm('Cancel this subscription? You will keep access until the end date.')) return;
    setCancellingId(subId);
    try {
      await api.delete(`/subscriptions/${subId}`);
      setItems((prev) => prev.map((s) => (s.id === subId ? { ...s, status: 'CANCELLED' } : s)));
    } catch {
      alert('Failed to cancel subscription');
    } finally {
      setCancellingId(null);
    }
  }

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
    <div className="flex flex-col gap-[12px] md:gap-[20px]">
      <p className="text-[20px] text-foreground">My Subscriptions</p>

      {/* Filters */}
      <div className="flex flex-col gap-[10px] md:flex-row md:gap-[20px]">
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

      {/* Mobile Cards */}
      <div className="flex flex-col gap-[12px] md:hidden">
        {displayed.length === 0 ? (
          <div className="rounded-[22px] bg-card py-[40px] text-center text-muted-foreground">
            No data available
          </div>
        ) : (
          displayed.map((s) => (
            <div key={s.id} className="rounded-[16px] bg-card px-[16px] py-[14px]">
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-semibold text-foreground">{s.creatorName}</p>
                <span
                  className={`rounded-[4px] px-[8px] py-[2px] text-[11px] font-medium ${s.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-muted text-muted-foreground'}`}
                >
                  {s.status}
                </span>
              </div>
              <p className="mt-[4px] text-[11px] text-muted-foreground">#{s.id.slice(-7)}</p>
              <div className="mt-[10px] grid grid-cols-2 gap-y-[8px] text-[12px]">
                <div>
                  <p className="text-muted-foreground">Amount</p>
                  <p className="text-foreground">${s.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Plan</p>
                  <p className="text-foreground">{s.planName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Start</p>
                  <p className="text-foreground">{formatDate(s.startDate)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Renewal</p>
                  <p className="text-foreground">{formatDate(s.renewalDate)}</p>
                </div>
              </div>
              {s.status === 'ACTIVE' && (
                <button
                  onClick={() => handleCancel(s.id)}
                  disabled={cancellingId === s.id}
                  className="mt-[12px] w-full rounded-[8px] border border-red-500/50 py-[8px] text-[12px] text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                >
                  {cancellingId === s.id ? 'Cancelling...' : 'Cancel Subscription'}
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-[22px] md:block">
        <div className="overflow-hidden rounded-[22px] bg-card">
          <div className="grid grid-cols-6 bg-[#01adf1] px-[30px] py-[22px]">
            {TABLE_HEADERS.map((h) => (
              <p
                key={h}
                className="whitespace-pre-line text-center text-[16px] font-bold text-foreground"
              >
                {h}
              </p>
            ))}
          </div>
          {displayed.length === 0 ? (
            <p className="py-[40px] text-center text-muted-foreground">
              No data available in table
            </p>
          ) : (
            displayed.map((s, i) => (
              <div
                key={s.id}
                className={`grid grid-cols-6 px-[30px] py-[20px] ${i < displayed.length - 1 ? 'border-b border-muted' : ''}`}
              >
                <p className="text-center text-[16px] text-foreground">#{s.id.slice(-7)}</p>
                <p className="text-center text-[16px] text-foreground">{s.creatorName}</p>
                <p className="text-center text-[16px] text-foreground">${s.amount.toFixed(2)}</p>
                <p className="text-center text-[16px] text-foreground">{formatDate(s.startDate)}</p>
                <p className="text-center text-[16px] text-foreground">
                  {formatDate(s.renewalDate)}
                </p>
                <div className="flex items-center justify-center">
                  {s.status === 'ACTIVE' ? (
                    <button
                      onClick={() => handleCancel(s.id)}
                      disabled={cancellingId === s.id}
                      className="rounded-[6px] border border-red-500/50 px-[12px] py-[4px] text-[13px] text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                    >
                      {cancellingId === s.id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  ) : (
                    <span className="text-[13px] text-muted-foreground">{s.status}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Pagination page={page} total={total} limit={limit} onPage={setPage} />
    </div>
  );
}
