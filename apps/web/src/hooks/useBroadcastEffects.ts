import { useEffect, type RefObject } from 'react';

export function useBroadcastEffects({
  videoRef,
  isLive,
  zoomLevel,
  screenSharing,
  privateIncoming,
  applyTrackZoom,
}: {
  videoRef: RefObject<HTMLVideoElement | null>;
  isLive: boolean;
  zoomLevel: number;
  screenSharing: boolean;
  privateIncoming: unknown;
  applyTrackZoom: (z: number) => Promise<boolean>;
}) {
  // Audible notification when fan requests private show
  useEffect(() => {
    if (!privateIncoming) return;
    const audio = new Audio('/sounds/notification.wav');
    audio.volume = 0.8;
    audio.play().catch(() => {});
  }, [privateIncoming]);

  // Propagate zoom to the actual camera track so viewers see the same crop
  useEffect(() => {
    if (!isLive || screenSharing) return;
    void applyTrackZoom(zoomLevel);
  }, [zoomLevel, isLive, screenSharing, applyTrackZoom]);

  // Picture-in-Picture when navigating away while still live (PC only)
  useEffect(() => {
    if (!isLive) return;
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch(() => {});
    }
    return () => {
      const v = videoRef.current;
      if (!v || !document.pictureInPictureEnabled) return;
      if (v === document.pictureInPictureElement) return;
      v.requestPictureInPicture().catch(() => {});
    };
  }, [isLive, videoRef]);
}
