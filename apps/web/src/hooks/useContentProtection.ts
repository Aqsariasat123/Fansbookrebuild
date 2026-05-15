import { useEffect } from 'react';

/**
 * Casual-leak deterrent for creator media. Suppresses the right-click
 * context menu and drag-to-desktop on <img> and <video> elements, so an
 * opportunistic viewer can't trivially "Save image as…" or drag the file
 * out. This is a deterrent, not a hard guarantee — DevTools and screenshots
 * still work — and is layered under the forensic watermark, which is what
 * actually attributes a leak to a viewer.
 */
export function useContentProtection() {
  useEffect(() => {
    const isMedia = (el: EventTarget | null) => {
      const t = el as HTMLElement | null;
      return !!t && (t.tagName === 'IMG' || t.tagName === 'VIDEO');
    };
    const onContextMenu = (e: MouseEvent) => {
      if (isMedia(e.target)) e.preventDefault();
    };
    const onDragStart = (e: DragEvent) => {
      if (isMedia(e.target)) e.preventDefault();
    };
    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('dragstart', onDragStart);
    return () => {
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('dragstart', onDragStart);
    };
  }, []);
}
