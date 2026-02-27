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
      setBookings(res.data || []);
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
      <p className="text-[24px] font-semibold text-[#f8f8f8]">My Bookings</p>

      {/* Search + Filter */}
      <div className="flex flex-col gap-[12px] md:flex-row md:items-center md:gap-[16px]">
        <div className="flex flex-1 items-center gap-[10px] rounded-[8px] bg-[#0e1012] px-[16px] py-[10px]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#5d5d5d">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="flex-1 bg-transparent text-[14px] text-[#f8f8f8] placeholder-[#5d5d5d] outline-none"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex w-full items-center justify-between gap-[8px] rounded-[8px] bg-[#0e1012] px-[16px] py-[10px] text-[14px] text-[#f8f8f8] md:min-w-[160px]"
          >
            {statusFilter}{' '}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#5d5d5d">
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </button>
          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 top-[42px] z-20 min-w-[160px] rounded-[8px] bg-white py-[4px] shadow-lg">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setStatusFilter(s);
                      setDropdownOpen(false);
                    }}
                    className="flex w-full px-[14px] py-[8px] text-[14px] text-[#1a1a1a] hover:bg-[#f0f0f0]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-[16px]">
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
          <tbody className="bg-[#0e1012]">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-[40px] text-center">
                  <div className="mx-auto size-8 animate-spin rounded-full border-4 border-[#01adf1] border-t-transparent" />
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-[40px] text-center text-[14px] text-[#5d5d5d]">
                  No bookings yet
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className="border-b border-[#15191c] last:border-0">
                  <td className="px-[16px] py-[14px] text-[14px] text-[#f8f8f8]">
                    {b.fanUsername || 'John Doe'}
                  </td>
                  <td className="px-[16px] py-[14px] text-[14px] text-[#f8f8f8]">
                    {b.date ? new Date(b.date).toLocaleDateString('en-GB') : '21-08-2025'}
                  </td>
                  <td className="px-[16px] py-[14px] text-[14px] text-[#f8f8f8]">
                    {b.timeSlot || 'Lorem Ipsum'}
                  </td>
                  <td className="px-[16px] py-[14px] text-[14px] text-[#f8f8f8]">
                    {b.status || 'Accepted'}
                  </td>
                  <td className="px-[16px] py-[14px] text-[14px] text-[#f8f8f8]">
                    {b.status === 'PENDING' ? 'Accept/Reject' : 'Lorem Ipsum'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-[6px]">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <button
            key={n}
            className={`flex size-[32px] items-center justify-center rounded-[4px] text-[13px] ${n === 1 ? 'bg-[#01adf1] text-white' : 'bg-[#0e1012] text-[#5d5d5d] hover:text-white'}`}
          >
            {n}
          </button>
        ))}
        <span className="text-[13px] text-[#5d5d5d]">...</span>
        <button className="rounded-[4px] bg-[#0e1012] px-[12px] py-[6px] text-[13px] text-[#5d5d5d] hover:text-white">
          Next
        </button>
      </div>
    </div>
  );
}
