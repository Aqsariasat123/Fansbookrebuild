interface ConfirmDeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({ onConfirm, onCancel }: ConfirmDeleteModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onCancel}
    >
      <div
        className="mx-[20px] w-full max-w-[360px] rounded-[16px] bg-card p-[24px] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-[8px] text-[16px] font-semibold text-foreground">Delete Post</h3>
        <p className="mb-[20px] text-[14px] text-muted-foreground">
          Are you sure you want to permanently delete this post? This cannot be undone.
        </p>
        <div className="flex justify-end gap-[10px]">
          <button
            onClick={onCancel}
            className="rounded-[8px] px-[16px] py-[8px] text-[14px] text-muted-foreground hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-[8px] bg-red-500 px-[16px] py-[8px] text-[14px] font-medium text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
