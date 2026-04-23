import { useState } from 'react';
import { AddStoryCard } from './AddStoryCard';
import { StoryViewer } from './StoryViewer';
import { VideoThumbnail } from './VideoThumbnail';
import type { StoryGroup } from './StoryViewer';

interface StoriesRowProps {
  groups: StoryGroup[];
  isCreator: boolean;
  onRefetch: () => void;
}

export function StoriesRow({ groups, isCreator, onRefetch }: StoriesRowProps) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  return (
    <>
      <div className="flex gap-[16px] overflow-x-auto scrollbar-hide md:gap-[20px]">
        {isCreator && <AddStoryCard onStoryUploaded={onRefetch} />}
        {groups.map((group, idx) => (
          <div
            key={group.authorId}
            className="group flex shrink-0 cursor-pointer flex-col items-center gap-[6px]"
            onClick={() => setViewerIndex(idx)}
          >
            <div className="relative size-[52px] overflow-hidden rounded-full md:h-[186px] md:w-[133px] md:rounded-[16px]">
              {group.stories[0]?.mediaType === 'VIDEO' ? (
                <VideoThumbnail
                  src={group.stories[0].mediaUrl}
                  className="absolute inset-0 h-full w-full max-w-none object-cover"
                />
              ) : (
                <img
                  src={group.stories[0]?.mediaUrl || ''}
                  alt=""
                  className="absolute inset-0 h-full w-full max-w-none object-cover"
                />
              )}
              {/* Hover overlay — gradient + avatar + name, desktop only */}
              <div className="absolute inset-0 hidden flex-col items-center justify-end rounded-[16px] bg-gradient-to-b from-transparent to-black/80 pb-[10px] opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:flex">
                {group.avatar && (
                  <img
                    src={group.avatar}
                    alt=""
                    className="mb-[4px] size-[36px] rounded-full object-cover ring-2 ring-white/40"
                  />
                )}
                <span className="max-w-[110px] truncate px-1 text-center text-[11px] font-medium text-white">
                  {group.displayName}
                </span>
              </div>
            </div>
            <p className="w-[60px] text-center text-[11px] font-normal leading-tight text-foreground md:w-[133px] md:text-[14px]">
              {group.displayName}
            </p>
          </div>
        ))}
      </div>

      {viewerIndex !== null && (
        <StoryViewer
          groups={groups}
          initialGroupIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
          onRefetch={onRefetch}
        />
      )}
    </>
  );
}
