import { useCallback, useEffect, useState } from 'react';

export function useImageCropQueue(onCropped: (file: File) => void) {
  const [queue, setQueue] = useState<File[]>([]);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (queue.length === 0) {
      setSrc(null);
      return;
    }
    const url = URL.createObjectURL(queue[0]);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [queue]);

  const enqueue = useCallback((files: File[]) => {
    if (files.length) setQueue((q) => [...q, ...files]);
  }, []);

  const apply = useCallback(
    (file: File) => {
      onCropped(file);
      setQueue((q) => q.slice(1));
    },
    [onCropped],
  );

  const useOriginal = useCallback(() => {
    setQueue((q) => {
      if (q[0]) onCropped(q[0]);
      return q.slice(1);
    });
  }, [onCropped]);

  const clear = useCallback(() => setQueue([]), []);

  return { queue, src, enqueue, apply, useOriginal, clear };
}
