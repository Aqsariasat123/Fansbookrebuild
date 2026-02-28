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
    <div className="rounded-[22px] bg-card p-[16px] md:p-[22px]">
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
              <span className="text-[16px] font-medium text-foreground">{initial}</span>
            </div>
          )}
          <div>
            <p className="text-[15px] font-medium text-foreground">{fan.displayName}</p>
            <p className="text-[12px] text-muted-foreground">@{fan.username}</p>
          </div>
        </div>

        {/* Date & Time */}
        <div className="flex items-center gap-[20px] text-[13px]">
          <div className="flex flex-col gap-[2px]">
            <span className="text-[11px] text-muted-foreground">Date</span>
            <span className="text-foreground">{formatDate(booking.date)}</span>
          </div>
          <div className="flex flex-col gap-[2px]">
            <span className="text-[11px] text-muted-foreground">Time</span>
            <span className="text-foreground">{booking.timeSlot}</span>
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
                className="h-[32px] rounded-[8px] bg-muted-foreground/15 px-[14px] text-[12px] font-medium text-muted-foreground hover:bg-muted-foreground/25 transition-colors disabled:opacity-50"
              >
                No Show
              </button>
            </div>
          )}
        </div>
      </div>

      {booking.note && (
        <p className="mt-[10px] rounded-[8px] bg-muted px-[12px] py-[8px] text-[12px] text-muted-foreground">
          Note: {booking.note}
        </p>
      )}
    </div>
  );
}
