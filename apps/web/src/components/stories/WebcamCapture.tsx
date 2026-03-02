import { useState, useRef, useCallback, useEffect } from 'react';

export function WebcamCapture({
  onCapture,
  onClose,
}: {
  onCapture: (file: File) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user', width: 720, height: 1280 } })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setError('Camera access denied'));

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const capture = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `webcam-${Date.now()}.jpg`, { type: 'image/jpeg' });
          streamRef.current?.getTracks().forEach((t) => t.stop());
          onCapture(file);
        }
      },
      'image/jpeg',
      0.9,
    );
  }, [onCapture]);

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[16px] border-2 border-dashed border-border/40 py-16">
        <p className="text-[14px] text-red-400">{error}</p>
        <button
          onClick={onClose}
          className="rounded-[50px] bg-muted px-[16px] py-[6px] text-[12px] text-muted-foreground"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full rounded-[16px] bg-black"
        style={{ transform: 'scaleX(-1)' }}
      />
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-[12px]">
        <button
          onClick={capture}
          className="size-[56px] rounded-full border-4 border-white bg-white/20 transition-colors hover:bg-white/40"
        />
        <button
          onClick={() => {
            streamRef.current?.getTracks().forEach((t) => t.stop());
            onClose();
          }}
          className="absolute right-4 top-[-4px] rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
