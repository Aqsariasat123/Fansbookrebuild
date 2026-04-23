import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveStream } from '../hooks/useLiveStream';
import { isGoLiveReady, GoLiveCheckbox, PRICE_INPUT_CLASS, CameraPreview } from './GoLiveParts';

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

  const handlePrivateShowToggle = () => {
    const next = !privateShow;
    setPrivateShow(next);
    if (!next) {
      setStreamExt(false);
      setStreamExtTokens('');
    }
  };

  const handleStreamExtToggle = () => {
    if (!privateShow) return;
    setStreamExt((v) => !v);
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
      <CameraPreview
        previewing={previewing}
        videoRef={videoRef}
        onStart={startPreview}
        policyAgreed={policyAgreed}
        onPolicyToggle={() => setPolicyAgreed((v) => !v)}
      />

      {/* Form card — centered, ~6 of 12 columns */}
      <div className="mx-auto w-full max-w-[640px] rounded-[22px] bg-card p-[24px] md:p-[32px]">
        {/* Title */}
        <div className="flex flex-col gap-[8px]">
          <p className="text-[14px] font-medium text-foreground">Stream Title</p>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's your stream about?"
            className="w-full rounded-[8px] border border-foreground bg-transparent px-[16px] py-[12px] text-[14px] text-foreground placeholder-muted-foreground outline-none"
          />
        </div>

        {/* Options — 2 columns */}
        <div className="mt-[20px] grid grid-cols-1 gap-[12px] md:grid-cols-2">
          {/* Private show */}
          <div className="flex flex-col gap-[10px] rounded-[12px] border border-border p-[16px]">
            <div
              className="flex cursor-pointer items-center gap-[10px]"
              onClick={handlePrivateShowToggle}
            >
              <GoLiveCheckbox checked={privateShow} />
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

          {/* Stream Extension — requires private show */}
          <div
            className={`flex flex-col gap-[10px] rounded-[12px] border p-[16px] transition-opacity ${
              privateShow ? 'border-border' : 'cursor-not-allowed border-border opacity-50'
            }`}
          >
            <div
              className={`flex items-center gap-[10px] ${privateShow ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              onClick={handleStreamExtToggle}
              title={!privateShow ? 'Enable "Private show" first' : undefined}
            >
              <GoLiveCheckbox checked={streamExt} disabled={!privateShow} />
              <span className="text-[14px] text-foreground">Stream Extension</span>
              {!privateShow && (
                <span className="ml-auto text-[11px] text-muted-foreground">
                  requires private show
                </span>
              )}
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

        {/* Action Buttons — 3 cols each (half of 6-col container) */}
        <div className="mt-[24px] grid grid-cols-2 gap-[12px]">
          <button
            disabled={!ready}
            onClick={handleGoLive}
            className="rounded-[8px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[14px] text-[16px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {starting ? 'Starting...' : 'Go Live'}
          </button>
          <button
            onClick={() => {
              stopPreview();
              navigate(-1);
            }}
            className="rounded-[8px] border border-border py-[14px] text-[16px] text-foreground transition-colors hover:border-foreground"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
