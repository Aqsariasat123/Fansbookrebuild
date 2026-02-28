export type BookingStatus = 'ALL' | 'ACCEPTED' | 'PENDING' | 'REJECTED' | 'COMPLETED' | 'NO_SHOW';

const STATUS_BADGE: Record<Exclude<BookingStatus, 'ALL'>, { bg: string; text: string }> = {
  ACCEPTED: { bg: 'bg-green-500/15', text: 'text-green-400' },
  PENDING: { bg: 'bg-yellow-500/15', text: 'text-yellow-400' },
  REJECTED: { bg: 'bg-red-500/15', text: 'text-red-400' },
  COMPLETED: { bg: 'bg-blue-500/15', text: 'text-blue-400' },
  NO_SHOW: { bg: 'bg-muted-foreground/20', text: 'text-muted-foreground' },
};

interface StatusBadgeProps {
  status: Exclude<BookingStatus, 'ALL'>;
}

export function BookingStatusBadge({ status }: StatusBadgeProps) {
  const style = STATUS_BADGE[status];
  return (
    <span
      className={`inline-block rounded-[20px] px-[10px] py-[3px] text-[11px] font-medium ${style.bg} ${style.text}`}
    >
      {status.replace('_', ' ')}
    </span>
  );
}
