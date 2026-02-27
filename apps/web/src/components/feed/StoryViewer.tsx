import { useCallback, useRef, useState } from 'react';
import { useStoryNav } from './useStoryNav';
import { StoryFooter } from './StoryFooter';

interface StoryMedia {
  id: string;
  mediaUrl: string;
  mediaType: string;
  createdAt: string;
  viewCount?: number;
}

export interface StoryGroup {
  authorId: string;
  username: string;
  displayName: string;
  avatar: string | null;
  stories: StoryMedia[];
}

interface StoryViewerProps {
  groups: StoryGroup[];
  initialGroupIndex: number;
  onClose: () => void;
}

function StoryHeader({
  avatar,
  displayName,
  timeAgo,
  onClose,
}: {
  avatar: string | null;
  displayName: string;
  timeAgo: string;
  onClose: () => void;
}) {
  return (
    <div className="absolute left-0 right-0 top-6 z-20 flex items-center justify-between px-3">
      <div className="flex items-center gap-2">
        {avatar ? (
          <img src={avatar} alt="" className="size-8 rounded-full object-cover" />
        ) : (
          <div className="size-8 rounded-full bg-gray-600" />
        )}
        <span className="text-sm font-medium text-white">{displayName}</span>
        <span className="text-xs text-white/60">{timeAgo}</span>
      </div>
      <button onClick={onClose} className="rounded-full p-1 text-white hover:bg-white/10">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M18 6L6 18M6 6l12 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

function HeartOverlay() {
  const HEART =
    'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <svg
        width="100"
        height="100"
        viewBox="0 0 24 24"
        className="animate-ping fill-red-500 opacity-80"
      >
        <path d={HEART} />
      </svg>
    </div>
  );
}

export function StoryViewer({ groups, initialGroupIndex, onClose }: StoryViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const nav = useStoryNav(groups, initialGroupIndex, onClose);
  const { group, story, isVideo, groupIdx, storyIdx, progress, setProgress, goNext, goPrev } = nav;
  const [heartAnim, setHeartAnim] = useState(false);

  const handleVideoTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (v && v.duration) setProgress(v.currentTime / v.duration);
  }, [setProgress]);

  if (!group || !story) return null;

  const totalStories = group.stories.length;
  const canGoPrev = groupIdx > 0 || storyIdx > 0;
  const canGoNext = groupIdx < groups.length - 1 || storyIdx < totalStories - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
      {canGoPrev && <NavArrow direction="left" onClick={goPrev} />}

      <div className="relative flex h-full w-full max-w-[420px] flex-col md:h-[90vh] md:overflow-hidden md:rounded-xl">
        <ProgressBars total={totalStories} current={storyIdx} progress={progress} />
        <StoryHeader
          avatar={group.avatar}
          displayName={group.displayName}
          timeAgo={getTimeAgo(story.createdAt)}
          onClose={onClose}
        />

        <div
          className="flex flex-1 items-center justify-center bg-black"
          onDoubleClick={() => {
            setHeartAnim(true);
            setTimeout(() => setHeartAnim(false), 1000);
          }}
        >
          {isVideo ? (
            <video
              ref={videoRef}
              key={story.id}
              src={story.mediaUrl}
              autoPlay
              playsInline
              className="h-full w-full object-contain"
              onTimeUpdate={handleVideoTimeUpdate}
              onEnded={goNext}
            />
          ) : (
            <img
              key={story.id}
              src={story.mediaUrl}
              alt=""
              className="h-full w-full object-contain"
            />
          )}
          {heartAnim && <HeartOverlay />}
        </div>

        <div className="absolute inset-0 z-10 flex">
          <div className="w-[30%]" onClick={goPrev} />
          <div className="w-[70%]" onClick={goNext} />
        </div>

        <StoryFooter
          storyId={story.id}
          authorId={group.authorId}
          viewCount={story.viewCount || 0}
        />
      </div>

      {canGoNext && <NavArrow direction="right" onClick={goNext} />}
    </div>
  );
}

function ProgressBars({
  total,
  current,
  progress,
}: {
  total: number;
  current: number;
  progress: number;
}) {
  return (
    <div className="absolute left-0 right-0 top-0 z-20 flex gap-[3px] px-3 pt-3">
      {Array.from({ length: total }).map((_, i) => {
        const width = i < current ? 100 : i === current ? progress * 100 : 0;
        return (
          <div key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
            <div
              className="h-full rounded-full bg-white transition-none"
              style={{ width: `${width}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}

function NavArrow({ direction, onClick }: { direction: 'left' | 'right'; onClick: () => void }) {
  const isLeft = direction === 'left';
  return (
    <button
      onClick={onClick}
      className={`absolute ${isLeft ? 'left-4' : 'right-4'} top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 md:block`}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d={isLeft ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}
