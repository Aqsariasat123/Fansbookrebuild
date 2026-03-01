interface Props {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  loading: boolean;
}

export function ConfirmModal({ open, title, message, onConfirm, onClose, loading }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[400px] rounded-[22px] bg-[#f8f8f8] p-[32px] shadow-lg"
      >
        <p className="mb-[8px] font-outfit text-[20px] font-normal text-black">{title}</p>
        <p className="mb-[24px] font-outfit text-[14px] text-[#5d5d5d]">{message}</p>
        <div className="flex justify-end gap-[12px]">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-[80px] border border-[#15191c] px-[24px] py-[8px] font-outfit text-[14px] text-black"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-[80px] bg-red-600 px-[24px] py-[8px] font-outfit text-[14px] text-white"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
