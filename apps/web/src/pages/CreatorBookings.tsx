import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

interface Booking {
  id: string;
  fanUsername: string;
  date: string;
  timeSlot: string;
  status: string;
}

const STATUSES = ['All', 'Accepted', 'Pending', 'Rejected', 'Completed', 'No Show'];

export default function CreatorBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (statusFilter !== 'All') params.status = statusFilter.toUpperCase().replace(' ', '_');
      if (search) params.search = search;
      const { data: res } = await api.get('/creator/bookings', { params });
      const d = res.data;
      setBookings(Array.isArray(d) ? d : (d?.items ?? []));
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return (
    <div className="flex flex-col gap-[20px]">
      <p className="text-[24px] font-semibold text-foreground">My Bookings</p>

      {/* Search + Filter */}
      <div className="flex flex-col gap-[12px] md:flex-row md:items-center md:gap-[16px]">
        <div className="flex flex-1 items-center gap-[10px] rounded-[8px] bg-card px-[16px] py-[10px]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="flex-1 bg-transparent text-[14px] text-foreground placeholder-muted-foreground outline-none"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex w-full items-center justify-between gap-[8px] rounded-[8px] bg-card px-[16px] py-[10px] text-[14px] text-foreground md:min-w-[160px]"
          >
            {statusFilter}{' '}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </button>
          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 top-[42px] z-20 min-w-[160px] rounded-[8px] bg-card py-[4px] shadow-lg">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setStatusFilter(s);
                      setDropdownOpen(false);
                    }}
                    className="flex w-full px-[14px] py-[8px] text-[14px] text-foreground hover:bg-muted"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="flex flex-col gap-[12px] md:hidden">
        {loading ? (
          <div className="flex justify-center py-[40px]">
            <div className="size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
          </div>
        ) : bookings.length === 0 ? (
          <p className="py-[40px] text-center text-[14px] text-muted-foreground">No bookings yet</p>
        ) : (
          bookings.map((b) => (
            <div key={b.id} className="rounded-[16px] bg-card p-[16px]">
              {[
                { label: 'Username', value: b.fanUsername || 'John Doe' },
                {
                  label: 'Date',
                  value: b.date ? new Date(b.date).toLocaleDateString('en-GB') : '21-08-2025',
                },
                { label: 'Slot', value: b.timeSlot || 'Lorem Ipsum' },
                { label: 'Status', value: b.status || 'Accepted' },
              ].map((r) => (
                <div
                  key={r.label}
                  className="flex items-center justify-between border-b border-border py-[8px]"
                >
                  <span className="text-[12px] text-muted-foreground">{r.label}</span>
                  <span className="text-[13px] text-foreground">{r.value}</span>
                </div>
              ))}
              {b.status === 'PENDING' ? (
                <div className="flex gap-[8px] pt-[12px]">
                  <button className="flex-1 rounded-[8px] bg-green-600 py-[8px] text-[13px] text-white">
                    Accept
                  </button>
                  <button className="flex-1 rounded-[8px] bg-red-600 py-[8px] text-[13px] text-white">
                    Reject
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between py-[8px]">
                  <span className="text-[12px] text-muted-foreground">Actions</span>
                  <span className="text-[13px] text-foreground">Lorem Ipsum</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto rounded-[16px] md:block">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-gradient-to-r from-[#00b4d8] to-[#0096c7]">
              {['Username', 'Bookings Date', 'Slot (Show From-To Time)', 'Status', 'Actions'].map(
                (h) => (
                  <th
                    key={h}
                    className="px-[16px] py-[14px] text-left text-[14px] font-semibold text-white"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="bg-card">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-[40px] text-center">
                  <div className="mx-auto size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-[40px] text-center text-[14px] text-muted-foreground">
                  No bookings yet
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className="border-b border-muted last:border-0">
                  <td className="px-[16px] py-[14px] text-[14px] text-foreground">
                    {b.fanUsername || 'John Doe'}
                  </td>
                  <td className="px-[16px] py-[14px] text-[14px] text-foreground">
                    {b.date ? new Date(b.date).toLocaleDateString('en-GB') : '21-08-2025'}
                  </td>
                  <td className="px-[16px] py-[14px] text-[14px] text-foreground">
                    {b.timeSlot || 'Lorem Ipsum'}
                  </td>
                  <td className="px-[16px] py-[14px] text-[14px] text-foreground">
                    {b.status || 'Accepted'}
                  </td>
                  <td className="px-[16px] py-[14px] text-[14px] text-foreground">
                    {b.status === 'PENDING' ? 'Accept/Reject' : 'Lorem Ipsum'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-[6px]">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <button
            key={n}
            className={`flex size-[32px] items-center justify-center rounded-[4px] text-[13px] ${n === 1 ? 'bg-[#01adf1] text-white' : 'bg-card text-muted-foreground hover:text-foreground'}`}
          >
            {n}
          </button>
        ))}
        <span className="text-[13px] text-muted-foreground">...</span>
        <button className="rounded-[4px] bg-card px-[12px] py-[6px] text-[13px] text-muted-foreground hover:text-foreground">
          Next
        </button>
      </div>
    </div>
  );
}
