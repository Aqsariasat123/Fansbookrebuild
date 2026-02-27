import { useCallback, useRef } from 'react';
import { useStoryNav } from './useStoryNav';

interface StoryMedia {
  id: string;
  mediaUrl: string;
  mediaType: string;
  createdAt: string;
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

export function StoryViewer({ groups, initialGroupIndex, onClose }: StoryViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const nav = useStoryNav(groups, initialGroupIndex, onClose);
  const { group, story, isVideo, groupIdx, storyIdx, progress, setProgress, goNext, goPrev } = nav;

  const handleVideoTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (v && v.duration) setProgress(v.currentTime / v.duration);
  }, [setProgress]);

  if (!group || !story) return null;

  const timeAgo = getTimeAgo(story.createdAt);
  const totalStories = group.stories.length;
  const canGoPrev = groupIdx > 0 || storyIdx > 0;
  const canGoNext = groupIdx < groups.length - 1 || storyIdx < totalStories - 1;
  const avatarSrc = group.avatar;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
      {canGoPrev && <NavArrow direction="left" onClick={goPrev} />}

      <div className="relative flex h-full w-full max-w-[420px] flex-col md:h-[90vh] md:rounded-xl md:overflow-hidden">
        <ProgressBars total={totalStories} current={storyIdx} progress={progress} />

        <div className="absolute top-6 left-0 right-0 z-20 flex items-center justify-between px-3">
          <div className="flex items-center gap-2">
            {avatarSrc ? (
              <img src={avatarSrc} alt="" className="size-8 rounded-full object-cover" />
            ) : (
              <div className="size-8 rounded-full bg-gray-600" />
            )}
            <span className="text-sm font-medium text-white">{group.displayName}</span>
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

        <div className="flex flex-1 items-center justify-center bg-black">
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
        </div>

        <div className="absolute inset-0 z-10 flex">
          <div className="w-[30%]" onClick={goPrev} />
          <div className="w-[70%]" onClick={goNext} />
        </div>
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
    <div className="absolute top-0 left-0 right-0 z-20 flex gap-[3px] px-3 pt-3">
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
  const pos = isLeft ? 'left-4' : 'right-4';
  const d = isLeft ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6';
  return (
    <button
      onClick={onClick}
      className={`absolute ${pos} top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 md:block`}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d={d}
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
