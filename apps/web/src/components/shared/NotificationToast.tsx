import { useState, useEffect, useCallback } from 'react';

interface ToastItem {
  id: string;
  message: string;
  createdAt: number;
}

let addToastFn: ((msg: string) => void) | null = null;

export function showToast(message: string) {
  addToastFn?.(message);
}

export function NotificationToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev.slice(-4), { id, message, createdAt: Date.now() }]);
  }, []);

  useEffect(() => {
    addToastFn = addToast;
    return () => {
      addToastFn = null;
    };
  }, [addToast]);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setInterval(() => {
      setToasts((prev) => prev.filter((t) => Date.now() - t.createdAt < 5000));
    }, 1000);
    return () => clearInterval(timer);
  }, [toasts.length]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-[20px] right-[20px] z-[100] flex flex-col gap-[8px]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-slide-in-right flex items-center gap-[10px] rounded-[12px] bg-card px-[16px] py-[12px] shadow-lg border border-muted min-w-[280px] max-w-[380px]"
        >
          <div className="size-[8px] rounded-full bg-[#01adf1] shrink-0" />
          <p className="text-[14px] text-foreground font-outfit line-clamp-2">{t.message}</p>
          <button
            onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            className="ml-auto text-muted-foreground hover:text-foreground text-[16px] shrink-0"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
