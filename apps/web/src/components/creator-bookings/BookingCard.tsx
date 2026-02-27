import { BookingStatusBadge } from './BookingStatusBadge';
import type { BookingStatus } from './BookingStatusBadge';

interface BookingFan {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
}

export interface Booking {
  id: string;
  fan: BookingFan;
  date: string;
  timeSlot: string;
  status: Exclude<BookingStatus, 'ALL'>;
  note: string | null;
  createdAt: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface BookingCardProps {
  booking: Booking;
  onAction: (id: string, status: string) => void;
  updating: string | null;
}

export function BookingCard({ booking, onAction, updating }: BookingCardProps) {
  const fan = booking.fan;
  const initial = fan.displayName?.charAt(0)?.toUpperCase() || '?';
  const isUpdating = updating === booking.id;

  return (
    <div className="rounded-[22px] bg-[#0e1012] p-[16px] md:p-[22px]">
      <div className="flex flex-col gap-[12px] md:flex-row md:items-center md:justify-between">
        {/* Fan info */}
        <div className="flex items-center gap-[12px]">
          {fan.avatar ? (
            <img
              src={fan.avatar}
              alt=""
              className="size-[44px] rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="size-[44px] rounded-full bg-[#2e4882] flex items-center justify-center shrink-0">
              <span className="text-[16px] font-medium text-[#f8f8f8]">{initial}</span>
            </div>
          )}
          <div>
            <p className="text-[15px] font-medium text-[#f8f8f8]">{fan.displayName}</p>
            <p className="text-[12px] text-[#5d5d5d]">@{fan.username}</p>
          </div>
        </div>

        {/* Date & Time */}
        <div className="flex items-center gap-[20px] text-[13px]">
          <div className="flex flex-col gap-[2px]">
            <span className="text-[11px] text-[#5d5d5d]">Date</span>
            <span className="text-[#f8f8f8]">{formatDate(booking.date)}</span>
          </div>
          <div className="flex flex-col gap-[2px]">
            <span className="text-[11px] text-[#5d5d5d]">Time</span>
            <span className="text-[#f8f8f8]">{booking.timeSlot}</span>
          </div>
        </div>

        {/* Status + Actions */}
        <div className="flex items-center gap-[10px]">
          <BookingStatusBadge status={booking.status} />

          {booking.status === 'PENDING' && (
            <div className="flex gap-[6px]">
              <button
                onClick={() => onAction(booking.id, 'ACCEPTED')}
                disabled={isUpdating}
                className="h-[32px] rounded-[8px] bg-green-500/15 px-[14px] text-[12px] font-medium text-green-400 hover:bg-green-500/25 transition-colors disabled:opacity-50"
              >
                Accept
              </button>
              <button
                onClick={() => onAction(booking.id, 'REJECTED')}
                disabled={isUpdating}
                className="h-[32px] rounded-[8px] bg-red-500/15 px-[14px] text-[12px] font-medium text-red-400 hover:bg-red-500/25 transition-colors disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          )}

          {booking.status === 'ACCEPTED' && (
            <div className="flex gap-[6px]">
              <button
                onClick={() => onAction(booking.id, 'COMPLETED')}
                disabled={isUpdating}
                className="h-[32px] rounded-[8px] bg-blue-500/15 px-[14px] text-[12px] font-medium text-blue-400 hover:bg-blue-500/25 transition-colors disabled:opacity-50"
              >
                Complete
              </button>
              <button
                onClick={() => onAction(booking.id, 'NO_SHOW')}
                disabled={isUpdating}
                className="h-[32px] rounded-[8px] bg-[#5d5d5d]/15 px-[14px] text-[12px] font-medium text-[#5d5d5d] hover:bg-[#5d5d5d]/25 transition-colors disabled:opacity-50"
              >
                No Show
              </button>
            </div>
          )}
        </div>
      </div>

      {booking.note && (
        <p className="mt-[10px] rounded-[8px] bg-[#15191c] px-[12px] py-[8px] text-[12px] text-[#5d5d5d]">
          Note: {booking.note}
        </p>
      )}
    </div>
  );
}
