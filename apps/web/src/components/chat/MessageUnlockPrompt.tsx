import { useState } from 'react';
import { api } from '../../lib/api';

export function MessageUnlockPrompt({
  conversationId,
  price,
  onUnlocked,
}: {
  conversationId: string;
  price: number;
  onUnlocked: () => void;
}) {
  const [unlocking, setUnlocking] = useState(false);

  const handleUnlock = async () => {
    if (unlocking) return;
    setUnlocking(true);
    try {
      const { data: r } = await api.post(`/messages/${conversationId}/unlock`);
      if (r.success) onUnlocked();
    } catch {
      /* */
    }
    setUnlocking(false);
  };

  return (
    <div className="flex flex-col items-center gap-[10px] border-t border-muted px-[17px] py-[16px]">
      <p className="text-[14px] text-muted-foreground">
        Unlock this conversation for{' '}
        <span className="font-bold text-foreground">{price} coins</span>
      </p>
      <button
        onClick={handleUnlock}
        disabled={unlocking}
        className="rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[24px] py-[10px] text-[14px] font-medium text-white disabled:opacity-50"
      >
        {unlocking ? 'Unlocking...' : `Unlock for ${price} coins`}
      </button>
    </div>
  );
}
