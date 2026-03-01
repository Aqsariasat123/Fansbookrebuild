import { useCallStore } from '../../stores/callStore';
import { useCall } from '../../hooks/useCall';
import { useAuthStore } from '../../stores/authStore';

export function IncomingCallModal() {
  const status = useCallStore((s) => s.status);
  const callerId = useCallStore((s) => s.callerId);
  const callerName = useCallStore((s) => s.callerName);
  const callerAvatar = useCallStore((s) => s.callerAvatar);
  const mode = useCallStore((s) => s.mode);
  const userId = useAuthStore((s) => s.user?.id);
  const { acceptCall, rejectCall } = useCall();

  // Only show when ringing AND callerId is set (callee only — caller has callerId=null)
  if (status !== 'ringing' || !callerId || callerId === userId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="flex w-[320px] flex-col items-center gap-[24px] rounded-[22px] bg-card p-[32px] shadow-2xl">
        {/* Avatar */}
        <div className="size-[80px] overflow-hidden rounded-full bg-muted">
          {callerAvatar ? (
            <img src={callerAvatar} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[28px] font-bold text-muted-foreground">
              {callerName?.charAt(0) || '?'}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="text-center">
          <p className="text-[18px] font-semibold text-foreground">{callerName}</p>
          <p className="mt-[4px] text-[14px] text-muted-foreground">
            Incoming {mode === 'audio' ? 'Audio' : 'Video'} Call...
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-[24px]">
          <button
            onClick={rejectCall}
            className="flex size-[56px] items-center justify-center rounded-full bg-red-600 shadow-lg transition-transform hover:scale-105"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" />
            </svg>
          </button>
          <button
            onClick={acceptCall}
            className="flex size-[56px] items-center justify-center rounded-full bg-green-600 shadow-lg transition-transform hover:scale-105"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
