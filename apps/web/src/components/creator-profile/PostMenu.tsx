interface PostMenuProps {
  open: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
}

export function PostMenu({ open, onClose, onAction }: PostMenuProps) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className="absolute right-0 top-[28px] z-20 min-w-[120px] rounded-[8px] bg-card py-[4px] shadow-lg">
        {['Edit', 'Remove', 'Unpin'].map((a) => (
          <button
            key={a}
            onClick={() => {
              onAction(a.toLowerCase());
              onClose();
            }}
            className="flex w-full items-center gap-[8px] px-[14px] py-[8px] text-[13px] text-foreground hover:bg-muted"
          >
            {a}
          </button>
        ))}
      </div>
    </>
  );
}
