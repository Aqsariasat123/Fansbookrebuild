interface Props {
  form: Record<string, string | number | boolean>;
  update: (key: string, val: string | number | boolean) => void;
  inputCls: string;
  fileCls: string;
}

export function WithdrawalTab({ form, update, inputCls }: Omit<Props, 'fileCls'>) {
  return (
    <div className="flex max-w-[500px] flex-col gap-[16px]">
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">
          Withdrawal Admin Commission(%)
        </label>
        <input
          type="number"
          value={String(form.commissionRate || 30)}
          onChange={(e) => update('commissionRate', Number(e.target.value))}
          className={inputCls}
        />
      </div>
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">
          Withdrawal Min Limit
        </label>
        <input
          type="number"
          value={String(form.minWithdrawal || 10)}
          onChange={(e) => update('minWithdrawal', Number(e.target.value))}
          className={inputCls}
        />
      </div>
    </div>
  );
}

export function ReferralBonusTab({ form, update, inputCls }: Omit<Props, 'fileCls'>) {
  return (
    <div className="flex max-w-[500px] flex-col gap-[16px]">
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">
          Referral Bonus Token
        </label>
        <input
          type="number"
          value={String(form.referralBonus || 30)}
          onChange={(e) => update('referralBonus', Number(e.target.value))}
          className={inputCls}
        />
      </div>
    </div>
  );
}

export function UserTokenTab({ form, update, inputCls }: Omit<Props, 'fileCls'>) {
  return (
    <div className="flex max-w-[500px] flex-col gap-[16px]">
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">Total Token</label>
        <input
          type="number"
          value={String(form.totalToken || 1)}
          onChange={(e) => update('totalToken', Number(e.target.value))}
          className={inputCls}
        />
      </div>
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">Token Price</label>
        <input
          type="number"
          value={String(form.tokenPrice || 1)}
          onChange={(e) => update('tokenPrice', Number(e.target.value))}
          className={inputCls}
        />
      </div>
    </div>
  );
}

export function BroadcastingTab({ form, update, inputCls }: Omit<Props, 'fileCls'>) {
  return (
    <div className="flex max-w-[500px] flex-col gap-[16px]">
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">
          One To One Broadcasting Token
        </label>
        <input
          type="number"
          value={String(form.broadcastingToken || 100)}
          onChange={(e) => update('broadcastingToken', Number(e.target.value))}
          className={inputCls}
        />
      </div>
    </div>
  );
}

export function WithdrawFormTab({ form, update, inputCls, fileCls }: Props) {
  return (
    <div className="flex max-w-[500px] flex-col gap-[16px]">
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">
          Withdraw Form US Resident PDF
        </label>
        <input type="file" className={fileCls} />
      </div>
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">
          Withdraw Form US Resident Text
        </label>
        <input
          value={String(form.withdrawFormUSText || '')}
          onChange={(e) => update('withdrawFormUSText', e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">
          Withdraw Form Non US Resident PDF
        </label>
        <input type="file" className={fileCls} />
      </div>
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">
          Withdraw Form Non US Resident Text
        </label>
        <input
          value={String(form.withdrawFormNonUSText || '')}
          onChange={(e) => update('withdrawFormNonUSText', e.target.value)}
          className={inputCls}
        />
      </div>
    </div>
  );
}

export function OthersTab({ form, update, inputCls }: Omit<Props, 'fileCls'>) {
  return (
    <div className="flex max-w-[500px] flex-col gap-[16px]">
      <div>
        <label className="mb-[4px] block font-outfit text-[14px] text-black">VAT Percentage</label>
        <input
          type="number"
          value={String(form.vatPercentage || 10)}
          onChange={(e) => update('vatPercentage', Number(e.target.value))}
          className={inputCls}
        />
      </div>
      <div className="flex items-center gap-[8px]">
        <label className="font-outfit text-[14px] text-black">Age Restriction Pop Up</label>
        <button
          onClick={() => update('ageRestriction', !form.ageRestriction)}
          className={`h-[24px] w-[44px] rounded-full transition-colors ${form.ageRestriction ? 'bg-[#28a745]' : 'bg-[#ddd]'}`}
        >
          <div
            className={`size-[20px] rounded-full bg-white shadow transition-transform ${form.ageRestriction ? 'translate-x-[22px]' : 'translate-x-[2px]'}`}
          />
        </button>
      </div>
    </div>
  );
}
