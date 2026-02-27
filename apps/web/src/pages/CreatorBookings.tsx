import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { BookingCard } from '../components/creator-bookings/BookingCard';
import type { Booking } from '../components/creator-bookings/BookingCard';
import type { BookingStatus } from '../components/creator-bookings/BookingStatusBadge';

const STATUS_TABS: BookingStatus[] = [
  'ALL',
  'ACCEPTED',
  'PENDING',
  'REJECTED',
  'COMPLETED',
  'NO_SHOW',
];

function tabLabel(tab: BookingStatus) {
  return tab === 'NO_SHOW' ? 'No Show' : tab.charAt(0) + tab.slice(1).toLowerCase();
}

export default function CreatorBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<BookingStatus>('ALL');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = activeTab !== 'ALL' ? { status: activeTab } : {};
      const { data: res } = await api.get('/creator/bookings', { params });
      setBookings(res.data || []);
    } catch {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  async function handleStatusChange(bookingId: string, newStatus: string) {
    setUpdating(bookingId);
    try {
      const { data: res } = await api.put(`/creator/bookings/${bookingId}/status`, {
        status: newStatus,
      });
      if (res.data) {
        setBookings((prev) => prev.map((b) => (b.id === bookingId ? res.data : b)));
      } else {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId ? { ...b, status: newStatus as Booking['status'] } : b,
          ),
        );
      }
    } catch {
      setError('Failed to update booking status');
    } finally {
      setUpdating(null);
    }
  }

  const counts = bookings.length;

  return (
    <div className="flex flex-col gap-[16px] md:gap-[22px]">
      <div className="flex items-center justify-between">
        <p className="text-[20px] font-bold text-[#f8f8f8] md:text-[28px]">Bookings</p>
        <span className="text-[14px] text-[#5d5d5d]">
          {counts} booking{counts !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-[6px] overflow-x-auto scrollbar-hide">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 rounded-[20px] px-[16px] py-[8px] text-[13px] font-medium transition-colors ${
              activeTab === tab
                ? 'bg-gradient-to-l from-[#a61651] to-[#01adf1] text-[#f8f8f8]'
                : 'bg-[#0e1012] text-[#5d5d5d] hover:text-[#f8f8f8]'
            }`}
          >
            {tabLabel(tab)}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-[10px] bg-red-500/10 px-[16px] py-[10px]">
          <p className="text-[13px] text-red-400">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-[22px] bg-[#0e1012] px-[20px] py-[40px] text-center">
          <p className="text-[16px] text-[#5d5d5d]">
            {activeTab === 'ALL'
              ? 'No bookings yet'
              : `No ${tabLabel(activeTab).toLowerCase()} bookings`}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-[12px]">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onAction={handleStatusChange}
              updating={updating}
            />
          ))}
        </div>
      )}
    </div>
  );
}
