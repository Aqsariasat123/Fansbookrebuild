import { useEffect, useRef, useState } from 'react';

interface VideoThumbnailProps {
  src: string;
  className?: string;
  fallback?: string;
}

export function VideoThumbnail({ src, className = '', fallback }: VideoThumbnailProps) {
  const [thumb, setThumb] = useState<string | null>(fallback || null);
  const attempted = useRef(false);

  useEffect(() => {
    // Skip generation if we already have a usable fallback image
    if (attempted.current || !src || fallback) return;
    attempted.current = true;

    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.preload = 'metadata';

    video.onloadeddata = () => {
      video.currentTime = 0.1;
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          setThumb(canvas.toDataURL('image/jpeg', 0.8));
        }
      } catch {
        /* cross-origin or other error — keep fallback */
      }
      video.src = '';
      video.load();
    };

    video.onerror = () => {
      /* keep fallback */
    };

    video.src = src;
  }, [src, fallback]);

  if (!thumb) {
    return <div className={`bg-[#15191c] ${className}`} />;
  }

  return <img src={thumb} alt="" className={className} />;
}
