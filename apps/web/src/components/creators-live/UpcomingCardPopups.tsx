/**
 * Confirm / "already notified" popups for the UpcomingCard, extracted so the
 * card component stays under the project's 200-line file cap.
 */

export function ConfirmNotifyPopup({
  username,
  title,
  scheduledAt,
  onCancel,
  onConfirm,
}: {
  username: string;
  title: string;
  scheduledAt: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-[16px]"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-[380px] rounded-[16px] bg-card p-[24px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-[8px] text-[18px] font-semibold text-foreground">Get Notified?</h3>
        <p className="mb-[4px] text-[14px] text-muted-foreground">
          You'll follow <span className="font-medium text-foreground">@{username}</span> and get
          notified when their live starts.
        </p>
        <p className="mb-[20px] text-[13px] font-medium text-foreground">
          "{title}" —{' '}
          {new Date(scheduledAt).toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
        <div className="flex gap-[10px]">
          <button
            onClick={onCancel}
            className="flex-1 rounded-[50px] border border-border py-[10px] text-[14px] text-foreground hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[10px] text-[14px] font-medium text-white hover:opacity-90"
          >
            Yes, Notify me
          </button>
        </div>
      </div>
    </div>
  );
}

export function AlreadyNotifiedPopup({
  username,
  onClose,
}: {
  username: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-[16px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[340px] rounded-[16px] bg-card p-[24px] text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-[12px] flex size-[48px] items-center justify-center rounded-full bg-primary/10">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#01adf1"
            strokeWidth="2"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
        <h3 className="mb-[6px] text-[16px] font-semibold text-foreground">Already Notified!</h3>
        <p className="mb-[20px] text-[13px] text-muted-foreground">
          You're already following <span className="font-medium text-foreground">@{username}</span>{' '}
          and will be notified when they go live.
        </p>
        <button
          onClick={onClose}
          className="w-full rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[10px] text-[14px] font-medium text-white hover:opacity-90"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
