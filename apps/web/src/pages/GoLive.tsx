import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveStream } from '../hooks/useLiveStream';

export default function GoLive() {
  const navigate = useNavigate();
  const { startBroadcast } = useLiveStream();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [policyAgreed, setPolicyAgreed] = useState(false);
  const [title, setTitle] = useState('');
  const [privateShow, setPrivateShow] = useState(false);
  const [streamExt, setStreamExt] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [starting, setStarting] = useState(false);

  const startPreview = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
      await videoRef.current.play();
    }
    setPreviewing(true);
  };

  const handleGoLive = async () => {
    setStarting(true);
    try {
      // Stop preview stream first
      const previewStream = videoRef.current?.srcObject as MediaStream | null;
      previewStream?.getTracks().forEach((t) => t.stop());

      const sessionId = await startBroadcast(title || 'Live Session', videoRef.current);
      navigate(`/creator/live?session=${sessionId}`);
    } catch {
      setStarting(false);
    }
  };

  const Checkbox = ({ checked, onClick }: { checked: boolean; onClick: () => void }) => (
    <button onClick={onClick} className="shrink-0">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        {checked ? (
          <>
            <rect x="3" y="3" width="18" height="18" rx="2" fill="#01adf1" />
            <path
              d="M9 12l2 2 4-4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        ) : (
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
        )}
      </svg>
    </button>
  );

  return (
    <div className="flex flex-col gap-[20px]">
      {/* Camera Preview */}
      <div className="flex flex-col items-center gap-[16px] rounded-[22px] bg-card px-[20px] py-[32px]">
        {!previewing ? (
          <>
            <p className="text-[20px] font-semibold text-foreground">Start Your Broadcasting Now</p>
            <p className="max-w-[800px] text-center text-[14px] leading-[1.8] text-muted-foreground">
              Go live directly from your browser — no extra software needed. Your camera and
              microphone will be used to stream in real-time to your fans with sub-second latency.
            </p>
            <button
              onClick={startPreview}
              className="rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[32px] py-[12px] text-[14px] font-medium text-white"
            >
              Enable Camera Preview
            </button>
          </>
        ) : (
          <>
            <p className="text-[20px] font-semibold text-foreground">Camera Preview</p>
            <div className="relative w-full max-w-[640px] overflow-hidden rounded-[12px] bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="aspect-video w-full -scale-x-100 object-cover"
              />
              <div className="absolute left-[12px] top-[12px] rounded-[4px] bg-black/60 px-[10px] py-[4px] text-[12px] text-white">
                Preview
              </div>
            </div>
          </>
        )}

        {/* Policy checkbox */}
        <label className="flex cursor-pointer items-center gap-[10px]">
          <Checkbox checked={policyAgreed} onClick={() => setPolicyAgreed(!policyAgreed)} />
          <span className="text-[14px] text-foreground">
            I have accepted the &quot;
            <span className="font-bold underline">Live Broadcast Policy</span>&quot;.
          </span>
        </label>
      </div>

      {/* Title */}
      <div className="flex flex-col gap-[12px]">
        <p className="text-[16px] font-medium text-foreground">Stream Title</p>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's your stream about?"
          className="w-full rounded-[8px] border border-foreground bg-transparent px-[16px] py-[14px] text-[14px] text-foreground placeholder-muted-foreground outline-none"
        />
      </div>

      {/* Checkboxes */}
      <div className="flex flex-wrap items-center gap-[32px]">
        <label className="flex cursor-pointer items-center gap-[10px]">
          <Checkbox checked={privateShow} onClick={() => setPrivateShow(!privateShow)} />
          <span className="text-[14px] text-foreground">Available for the private show</span>
        </label>
        <label className="flex cursor-pointer items-center gap-[10px]">
          <Checkbox checked={streamExt} onClick={() => setStreamExt(!streamExt)} />
          <span className="text-[14px] text-foreground">Stream Extension</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-[20px]">
        <button
          disabled={!policyAgreed || !previewing || starting}
          onClick={handleGoLive}
          className="w-[240px] rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[14px] text-[16px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {starting ? 'Starting...' : 'Go Live'}
        </button>
        <button
          onClick={() => navigate(-1)}
          className="w-[240px] rounded-[8px] border border-border py-[14px] text-[16px] text-foreground transition-colors hover:border-foreground"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
