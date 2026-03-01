import { useState } from 'react';

interface ImagePreviewProps {
  file: File;
  onSend: (file: File, caption: string) => void;
  onClose: () => void;
  sending: boolean;
}

export function ImagePreview({ file, onSend, onClose, sending }: ImagePreviewProps) {
  const [caption, setCaption] = useState('');
  const previewUrl = URL.createObjectURL(file);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center">
      <div className="relative w-full max-w-[600px] bg-card rounded-[16px] overflow-hidden mx-[20px]">
        <button
          onClick={onClose}
          className="absolute top-[12px] right-[12px] z-10 size-[36px] rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="p-[16px] flex items-center justify-center bg-muted min-h-[300px] max-h-[60vh]">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-full max-h-[55vh] object-contain rounded-[8px]"
          />
        </div>

        <div className="flex items-center gap-[12px] p-[16px]">
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !sending && onSend(file, caption)}
            placeholder="Add a caption..."
            className="flex-1 bg-muted rounded-[52px] px-[16px] py-[10px] text-[16px] text-foreground placeholder-muted-foreground outline-none"
          />
          <button
            onClick={() => onSend(file, caption)}
            disabled={sending}
            className="size-[44px] rounded-full bg-[#2e80c8] flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

interface ImageViewerProps {
  url: string;
  onClose: () => void;
}

interface ChatOverlaysProps {
  previewFile: File | null;
  onSendImage: (file: File, caption: string) => void;
  onClosePreview: () => void;
  sending: boolean;
  viewImage: string | null;
  onCloseViewer: () => void;
}

export function ChatOverlays(p: ChatOverlaysProps) {
  return (
    <>
      {p.previewFile && (
        <ImagePreview
          file={p.previewFile}
          onSend={p.onSendImage}
          onClose={p.onClosePreview}
          sending={p.sending}
        />
      )}
      {p.viewImage && <ImageViewer url={p.viewImage} onClose={p.onCloseViewer} />}
    </>
  );
}

export function ImageViewer({ url, onClose }: ImageViewerProps) {
  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-[20px] right-[20px] z-10 size-[40px] rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
      <img
        src={url}
        alt=""
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-[8px]"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
