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
            className="flex shrink-0 cursor-pointer flex-col items-center gap-[6px]"
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
              <div className="absolute inset-0 hidden rounded-[16px] bg-gradient-to-b from-[rgba(14,16,18,0)] from-[44%] to-[rgba(14,16,18,0.88)] to-[80%] md:block" />
              <div className="absolute bottom-[30px] left-1/2 hidden -translate-x-1/2 md:block">
                <img
                  src={group.avatar || ''}
                  alt=""
                  className="size-[42px] rounded-full object-cover"
                />
              </div>
            </div>
            <p className="w-[52px] truncate text-center text-[12px] font-normal text-[#f8f8f8] md:w-[91px] md:text-[16px]">
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
        />
      )}
    </>
  );
}
