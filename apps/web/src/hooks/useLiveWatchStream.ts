import { useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';
import { attachHls } from '../pages/LiveWatchParts';
import { useLiveStream } from './useLiveStream';

export function useLiveWatchStream(sessionId: string | undefined) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<{ destroy: () => void } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHls, setIsHls] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { joinLive, consumeTrack, leaveLive, sendChat } = useLiveStream();

  useEffect(() => {
    if (!sessionId) return;
    let mounted = true;
    (async () => {
      try {
        await joinLive(sessionId, videoRef.current);
        const { data: prodData } = await api.get(`/live/${sessionId}/producers`);
        for (const p of prodData.data ?? [])
          await consumeTrack(sessionId, p.producerId, videoRef.current);
        if (mounted) setLoading(false);
      } catch {
        if (!mounted) return;
        try {
          const hls = await attachHls(sessionId, videoRef);
          hlsRef.current = hls;
          if (mounted) {
            setIsHls(true);
            setLoading(false);
          }
        } catch {
          if (mounted) {
            setError('Stream not available or ended.');
            setLoading(false);
          }
        }
      }
    })();
    return () => {
      mounted = false;
      leaveLive();
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return { videoRef, loading, isHls, error, sendChat, leaveLive };
}
