import type { RefObject } from 'react';
import { WebcamCapture } from './WebcamCapture';

type SourceMode = 'upload' | 'camera';

interface StorySourceSelectorProps {
  sourceMode: SourceMode;
  onSourceModeChange: (mode: SourceMode) => void;
  onFileSelect: (file: File) => void;
  fileRef: RefObject<HTMLInputElement | null>;
}

export function StorySourceSelector({
  sourceMode,
  onSourceModeChange,
  onFileSelect,
  fileRef,
}: StorySourceSelectorProps) {
  const handleCameraCapture = (capturedFile: File) => {
    onFileSelect(capturedFile);
    onSourceModeChange('upload');
  };

  return (
    <>
      {/* Source mode tabs */}
      <div className="mb-[12px] flex gap-[8px]">
        <button
          onClick={() => onSourceModeChange('upload')}
          className={`rounded-[50px] px-[14px] py-[6px] text-[12px] font-medium transition-colors ${
            sourceMode === 'upload'
              ? 'bg-foreground text-background'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          Upload
        </button>
        <button
          onClick={() => onSourceModeChange('camera')}
          className={`rounded-[50px] px-[14px] py-[6px] text-[12px] font-medium transition-colors ${
            sourceMode === 'camera'
              ? 'bg-foreground text-background'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          Camera
        </button>
      </div>

      {sourceMode === 'camera' ? (
        <WebcamCapture
          onCapture={handleCameraCapture}
          onClose={() => onSourceModeChange('upload')}
        />
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          className="flex w-full flex-col items-center gap-3 rounded-[16px] border-2 border-dashed border-border/40 py-16 hover:border-[#01adf1]/50"
        >
          <svg
            className="size-12 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="text-[14px] text-muted-foreground">Upload Image or Video</span>
          <span className="text-[12px] text-muted-foreground/60">Max 50MB</span>
        </button>
      )}
    </>
  );
}
