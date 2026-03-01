import { useEffect, useRef, useState } from 'react';
import { useCallStore } from '../stores/callStore';
import { useCall } from '../hooks/useCall';
import { CallControlBar } from '../components/call/CallControlBar';

export default function VideoCallScreen() {
  const localStream = useCallStore((s) => s.localStream);
  const remoteStream = useCallStore((s) => s.remoteStream);
  const status = useCallStore((s) => s.status);
  const mode = useCallStore((s) => s.mode);
  const callerName = useCallStore((s) => s.callerName);
  const { endCall, toggleMute } = useCall();
  const isAudio = mode === 'audio';

  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (localRef.current && localStream) localRef.current.srcObject = localStream;
  }, [localStream]);

  useEffect(() => {
    if (remoteRef.current && remoteStream) remoteRef.current.srcObject = remoteStream;
  }, [remoteStream]);

  useEffect(() => {
    if (status !== 'active') return;
    const i = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(i);
  }, [status]);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m.toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const initial = callerName?.charAt(0) || '?';

  return (
    <div className="relative flex h-[calc(100vh-120px)] flex-col items-center justify-center overflow-hidden rounded-[22px] bg-black">
      <RemoteMedia
        isAudio={isAudio}
        remoteStream={remoteStream}
        remoteRef={remoteRef}
        status={status}
        initial={initial}
        callerName={callerName}
      />

      {/* Local Video (PIP) — only for video calls */}
      {!isAudio && localStream && (
        <div className="absolute right-[16px] top-[16px] h-[160px] w-[120px] overflow-hidden rounded-[12px] border-2 border-white/30 shadow-lg">
          <video
            ref={localRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full -scale-x-100 object-cover"
          />
        </div>
      )}

      {/* Timer */}
      {status === 'active' && (
        <div className="absolute left-1/2 top-[16px] -translate-x-1/2 rounded-[8px] bg-black/60 px-[16px] py-[8px]">
          <p className="text-[16px] font-medium text-white">{fmt(elapsed)}</p>
        </div>
      )}

      <CallControlBar
        isAudio={isAudio}
        onToggleAudio={() => toggleMute('audio')}
        onToggleVideo={() => toggleMute('video')}
        onEndCall={endCall}
      />
    </div>
  );
}

function RemoteMedia({
  isAudio,
  remoteStream,
  remoteRef,
  status,
  initial,
  callerName,
}: {
  isAudio: boolean;
  remoteStream: MediaStream | null;
  remoteRef: React.RefObject<HTMLVideoElement | HTMLAudioElement | null>;
  status: string;
  initial: string;
  callerName: string | null;
}) {
  if (!remoteStream) {
    return (
      <div className="flex flex-col items-center gap-[12px]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent" />
        <p className="text-[16px] text-white">
          {status === 'ringing' ? 'Ringing...' : 'Connecting...'}
        </p>
      </div>
    );
  }

  if (isAudio) {
    return (
      <div className="flex flex-col items-center gap-[16px]">
        <div className="flex size-[120px] items-center justify-center rounded-full bg-white/10">
          <span className="text-[48px] font-bold text-white">{initial}</span>
        </div>
        <p className="text-[20px] font-semibold text-white">{callerName}</p>
        <audio ref={remoteRef as React.RefObject<HTMLAudioElement>} autoPlay />
      </div>
    );
  }

  return (
    <video
      ref={remoteRef as React.RefObject<HTMLVideoElement>}
      autoPlay
      playsInline
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}
