import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoryNav } from './useStoryNav';
import { StoryFooter } from './StoryFooter';
import { ProgressBars, NavArrow, getTimeAgo } from './StoryViewerParts';

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
  onRefetch?: () => void;
}

interface StoryHeaderProps {
  avatar: string | null;
  displayName: string;
  timeAgo: string;
  onClose: () => void;
  onNavigateProfile: () => void;
}

function StoryHeader({
  avatar,
  displayName,
  timeAgo,
  onClose,
  onNavigateProfile,
}: StoryHeaderProps) {
  return (
    <div className="absolute left-0 right-0 top-6 z-20 flex items-center justify-between px-3">
      <div
        className="flex cursor-pointer items-center gap-2 hover:opacity-80"
        onClick={(e) => {
          e.stopPropagation();
          onNavigateProfile();
        }}
      >
        {avatar ? (
          <img src={avatar} alt="" className="size-8 rounded-full object-cover" />
        ) : (
          <div className="size-8 rounded-full bg-gray-600" />
        )}
        <span className="text-sm font-medium text-white">{displayName}</span>
        <span className="text-xs text-white/60">{timeAgo}</span>
      </div>
      <button onClick={onClose} className="rounded-full p-1 text-white hover:bg-card/10">
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

const HEART_PATH =
  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

function HeartOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <svg
        width="100"
        height="100"
        viewBox="0 0 24 24"
        className="animate-ping fill-red-500 opacity-80"
      >
        <path d={HEART_PATH} />
      </svg>
    </div>
  );
}

export function StoryViewer({ groups, initialGroupIndex, onClose, onRefetch }: StoryViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
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
          onNavigateProfile={() => {
            onClose();
            navigate(`/u/${group.username}`);
          }}
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
          onClose={onClose}
          onRefetch={onRefetch}
        />
      </div>
      {canGoNext && <NavArrow direction="right" onClick={goNext} />}
    </div>
  );
}
