import { useCallback, useState } from 'react';

export function useCropSrc(onApply: (file: File) => void) {
  const [src, setSrc] = useState<string | null>(null);

  const setFromFile = useCallback((file: File) => {
    setSrc(URL.createObjectURL(file));
  }, []);

  const apply = useCallback(
    (file: File) => {
      setSrc((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      onApply(file);
    },
    [onApply],
  );

  const cancel = useCallback(() => {
    setSrc((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  return { src, setFromFile, apply, cancel };
}
