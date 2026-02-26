export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[460px] rounded-[22px] bg-[#0e1012] p-[32px] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[20px] font-medium text-[#f8f8f8] mb-[24px]">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export function trimOrUndefined(val: string): string | undefined {
  const trimmed = val.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function parseApiError(err: unknown, fallback: string): string {
  const axiosErr = err as { response?: { data?: { error?: string } } };
  return axiosErr?.response?.data?.error ?? fallback;
}

export function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-[8px]">
      <label className="text-[14px] text-[#5d5d5d]">{label}</label>
      <input
        {...props}
        className="h-[44px] rounded-[12px] bg-[#15191c] px-[16px] text-[16px] text-[#f8f8f8] outline-none border border-[#2a2d30] focus:border-[#2e80c8] transition-colors"
      />
    </div>
  );
}
