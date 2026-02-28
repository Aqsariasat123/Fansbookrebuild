import { useState } from 'react';
import { api } from '../../lib/api';

interface BlockConfirmModalProps {
  userId: string;
  displayName: string;
  onClose: () => void;
  onBlocked: () => void;
}

export function BlockConfirmModal({
  userId,
  displayName,
  onClose,
  onBlocked,
}: BlockConfirmModalProps) {
  const [blocking, setBlocking] = useState(false);

  const handleBlock = async () => {
    setBlocking(true);
    try {
      await api.post(`/social/users/${userId}/block`);
      onBlocked();
    } catch {
      /* ignore */
    } finally {
      setBlocking(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-[380px] rounded-[22px] bg-[#0e1012] p-[24px]"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-2 text-[16px] text-[#f8f8f8]">Block {displayName}?</p>
        <p className="text-[14px] text-[#5d5d5d]">
          They won&apos;t be able to see your profile, posts, or message you. You will also unfollow
          each other.
        </p>
        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-[50px] bg-[#15191c] py-[10px] text-[14px] text-[#5d5d5d]"
          >
            Cancel
          </button>
          <button
            onClick={handleBlock}
            disabled={blocking}
            className="flex-1 rounded-[50px] bg-red-500 py-[10px] text-[14px] text-white disabled:opacity-50"
          >
            {blocking ? 'Blocking...' : 'Block'}
          </button>
        </div>
      </div>
    </div>
  );
}
