function fmtNum(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

interface BalanceCardProps {
  balance: number;
  pending: number;
  eurEquivalent: number;
  onWithdraw: () => void;
}

export function BalanceCard({ balance, pending, eurEquivalent, onWithdraw }: BalanceCardProps) {
  return (
    <div className="rounded-[22px] bg-[#0e1012] p-[24px]">
      <p className="mb-[8px] text-[14px] font-medium text-[#5d5d5d]">My Wallet</p>
      <p className="text-[36px] font-bold leading-tight text-[#f8f8f8]">
        {fmtNum(balance)} <span className="text-[20px] font-medium">Coins</span>
      </p>
      <p className="mt-[4px] text-[14px] text-[#5d5d5d]">~{fmtNum(eurEquivalent)} EUR</p>
      {pending > 0 && (
        <p className="mt-[8px] text-[14px] font-medium text-yellow-400">
          ${pending.toFixed(2)} pending
        </p>
      )}
      <button
        onClick={onWithdraw}
        className="mt-[16px] rounded-[12px] bg-gradient-to-r from-purple-600 to-pink-500 px-[24px] py-[10px] text-[14px] font-semibold text-white hover:opacity-90"
      >
        Withdraw
      </button>
    </div>
  );
}
