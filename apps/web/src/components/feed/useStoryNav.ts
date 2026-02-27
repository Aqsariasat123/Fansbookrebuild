import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../../lib/api';
import type { StoryGroup } from './StoryViewer';

const IMAGE_DURATION = 5000;

export function useStoryNav(groups: StoryGroup[], initialGroupIndex: number, onClose: () => void) {
  const [groupIdx, setGroupIdx] = useState(initialGroupIndex);
  const [storyIdx, setStoryIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);
  const viewedRef = useRef<Set<string>>(new Set());

  const group = groups[groupIdx];
  const story = group?.stories[storyIdx];
  const isVideo = story?.mediaType === 'VIDEO';

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const goNext = useCallback(() => {
    clearTimer();
    const currentGroup = groups[groupIdx];
    if (storyIdx < currentGroup.stories.length - 1) {
      setStoryIdx((i) => i + 1);
      setProgress(0);
    } else if (groupIdx < groups.length - 1) {
      setGroupIdx((i) => i + 1);
      setStoryIdx(0);
      setProgress(0);
    } else {
      onClose();
    }
  }, [groupIdx, storyIdx, groups, clearTimer, onClose]);

  const goPrev = useCallback(() => {
    clearTimer();
    if (storyIdx > 0) {
      setStoryIdx((i) => i - 1);
      setProgress(0);
    } else if (groupIdx > 0) {
      setGroupIdx((i) => i - 1);
      setStoryIdx(groups[groupIdx - 1].stories.length - 1);
      setProgress(0);
    }
  }, [groupIdx, storyIdx, groups, clearTimer]);

  // Track view
  useEffect(() => {
    if (!story || viewedRef.current.has(story.id)) return;
    viewedRef.current.add(story.id);
    api.post(`/stories/${story.id}/view`).catch(() => {});
  }, [story]);

  // Image auto-advance timer
  useEffect(() => {
    if (!story || isVideo) return;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(elapsed / IMAGE_DURATION, 1);
      setProgress(pct);
      if (pct < 1) {
        timerRef.current = requestAnimationFrame(tick);
      } else {
        goNext();
      }
    };
    timerRef.current = requestAnimationFrame(tick);
    return clearTimer;
  }, [story, isVideo, goNext, clearTimer]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, goNext, goPrev]);

  return {
    groupIdx,
    storyIdx,
    progress,
    setProgress,
    group,
    story,
    isVideo,
    goNext,
    goPrev,
  };
}
