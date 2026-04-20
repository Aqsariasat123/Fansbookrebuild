import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveStream } from '../hooks/useLiveStream';

function isGoLiveReady(
  agreed: boolean,
  live: boolean,
  busy: boolean,
  pvt: boolean,
  pvtTokens: string,
  ext: boolean,
  extTokens: string,
): boolean {
  if (!agreed || !live || busy) return false;
  if (pvt && !pvtTokens.trim()) return false;
  if (ext && !extTokens.trim()) return false;
  return true;
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <div className="pointer-events-none shrink-0">
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
    </div>
  );
}

const PRICE_INPUT_CLASS =
  'w-full rounded-[8px] border border-foreground bg-transparent px-[12px] py-[8px] text-[14px] text-foreground placeholder-muted-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden';

export default function GoLive() {
  const navigate = useNavigate();
  const { startBroadcast } = useLiveStream();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [policyAgreed, setPolicyAgreed] = useState(false);
  const [title, setTitle] = useState('');
  const [privateShow, setPrivateShow] = useState(false);
  const [privateShowTokens, setPrivateShowTokens] = useState('');
  const [streamExt, setStreamExt] = useState(false);
  const [streamExtTokens, setStreamExtTokens] = useState('');
  const [previewing, setPreviewing] = useState(false);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (!previewing || !streamRef.current) return;
    const video = videoRef.current;
    if (!video) return;
    video.srcObject = streamRef.current;
    video.muted = true;
    video.play().catch(() => {});
  }, [previewing]);

  const stopPreview = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const startPreview = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    streamRef.current = stream;
    setPreviewing(true);
  };

  const handleGoLive = async () => {
    setStarting(true);
    try {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      const sessionId = await startBroadcast(title || 'Live Session', videoRef.current, {
        privateShow,
        privateShowTokens: privateShow ? parseInt(privateShowTokens || '0', 10) : 0,
      });
      navigate(`/creator/live?session=${sessionId}`);
    } catch {
      setStarting(false);
    }
  };

  const ready = isGoLiveReady(
    policyAgreed,
    previewing,
    starting,
    privateShow,
    privateShowTokens,
    streamExt,
    streamExtTokens,
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
        <div
          className="flex cursor-pointer items-center gap-[10px]"
          onClick={() => setPolicyAgreed(!policyAgreed)}
        >
          <Checkbox checked={policyAgreed} />
          <span className="text-[14px] text-foreground">
            I have accepted the &quot;
            <span className="font-bold underline">Live Broadcast Policy</span>&quot;.
          </span>
        </div>
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

      {/* Options */}
      <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
        <div className="flex flex-col gap-[10px] rounded-[12px] border border-border p-[16px]">
          <div
            className="flex cursor-pointer items-center gap-[10px]"
            onClick={() => setPrivateShow(!privateShow)}
          >
            <Checkbox checked={privateShow} />
            <span className="text-[14px] text-foreground">Available for the private show</span>
          </div>
          {privateShow && (
            <input
              type="number"
              min="1"
              value={privateShowTokens}
              onChange={(e) => setPrivateShowTokens(e.target.value)}
              placeholder="Tokens required"
              className={PRICE_INPUT_CLASS}
            />
          )}
        </div>
        <div className="flex flex-col gap-[10px] rounded-[12px] border border-border p-[16px]">
          <div
            className="flex cursor-pointer items-center gap-[10px]"
            onClick={() => setStreamExt(!streamExt)}
          >
            <Checkbox checked={streamExt} />
            <span className="text-[14px] text-foreground">Stream Extension</span>
          </div>
          {streamExt && (
            <input
              type="number"
              min="1"
              value={streamExtTokens}
              onChange={(e) => setStreamExtTokens(e.target.value)}
              placeholder="Tokens required"
              className={PRICE_INPUT_CLASS}
            />
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col items-center gap-[12px] md:flex-row md:justify-center md:gap-[20px]">
        <button
          disabled={!ready}
          onClick={handleGoLive}
          className="w-full rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[14px] text-[16px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40 md:w-[240px]"
        >
          {starting ? 'Starting...' : 'Go Live'}
        </button>
        <button
          onClick={() => {
            stopPreview();
            navigate(-1);
          }}
          className="w-full rounded-[8px] border border-border py-[14px] text-[16px] text-foreground transition-colors hover:border-foreground md:w-[240px]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
