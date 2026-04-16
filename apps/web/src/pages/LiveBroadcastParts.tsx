export function PrivateRequestBanner({
  userName,
  tokens,
  onAccept,
  onDecline,
}: {
  userName: string;
  tokens: number;
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-[12px] border border-[#e91e8c] bg-card px-[16px] py-[14px]">
      <div>
        <p className="text-[15px] font-semibold text-foreground">Private Show Request</p>
        <p className="text-[13px] text-muted-foreground">
          <span className="font-medium text-foreground">{userName}</span> wants a private call
          <span className="ml-[6px] rounded-[12px] bg-yellow-400/20 px-[8px] py-[2px] text-[12px] font-bold text-yellow-500">
            🪙 {tokens} tokens
          </span>
        </p>
      </div>
      <div className="flex gap-[10px]">
        <button
          onClick={onAccept}
          className="rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[16px] py-[8px] text-[13px] font-medium text-white"
        >
          Accept
        </button>
        <button
          onClick={onDecline}
          className="rounded-[8px] border border-border px-[16px] py-[8px] text-[13px] text-foreground hover:border-foreground"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
