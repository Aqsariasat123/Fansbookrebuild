export function InsufficientCoinsModal({
  required,
  balance,
  onCancel,
  onBuy,
}: {
  required: number;
  balance: number;
  onCancel: () => void;
  onBuy: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-[420px] rounded-[16px] border border-border bg-card p-[24px]">
        <p className="text-[18px] font-semibold text-foreground">Insufficient coins</p>
        <p className="mt-[10px] text-[14px] text-muted-foreground">
          This private show requires{' '}
          <span className="font-semibold text-foreground">🪙 {required}</span> coins. Your balance
          is <span className="font-semibold text-foreground">🪙 {balance}</span>.
        </p>
        <div className="mt-[20px] flex gap-[10px]">
          <button
            onClick={onCancel}
            className="flex-1 rounded-[8px] border border-border py-[10px] text-[14px] text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={onBuy}
            className="flex-1 rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[10px] text-[14px] font-semibold text-white"
          >
            Buy Coins
          </button>
        </div>
      </div>
    </div>
  );
}
