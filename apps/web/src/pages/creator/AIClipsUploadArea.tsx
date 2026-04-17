import { useState, useRef } from 'react';
import { api } from '../../lib/api';

export function UploadArea({ onUploaded }: { onUploaded: (jobId: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const upload = async (file: File) => {
    setError('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('video', file);
      const res = await api.post('/creator/clips/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUploaded(res.data.data.jobId);
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('video/')) upload(file);
  };

  return (
    <div className="flex flex-col gap-[8px]">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className="cursor-pointer rounded-[16px] border-2 border-dashed border-border bg-card p-[40px] text-center hover:border-[#01adf1]/50 transition-colors"
      >
        <div className="flex flex-col items-center gap-[12px]">
          <div className="flex size-[56px] items-center justify-center rounded-full bg-muted">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-muted-foreground"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
          </div>
          <div>
            <p className="text-[14px] font-medium text-foreground">
              {uploading ? 'Uploading…' : 'Drop a video or click to browse'}
            </p>
            <p className="text-[12px] text-muted-foreground mt-[2px]">
              MP4, MOV, AVI — up to 500MB
            </p>
          </div>
          {uploading && (
            <div className="h-[4px] w-[200px] overflow-hidden rounded-full bg-muted">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-[#01adf1]" />
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
          }}
        />
      </div>
      {error && <p className="text-[13px] text-red-400">{error}</p>}
    </div>
  );
}
