import { useRef, useState } from 'react';
import { api } from '../../lib/api';

interface AddStoryCardProps {
  onStoryUploaded: () => void;
}

export function AddStoryCard({ onStoryUploaded }: AddStoryCardProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append('media', file);
      await api.post('/stories', form);
      onStoryUploaded();
    } catch {
      /* upload failed silently */
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="flex shrink-0 cursor-pointer flex-col items-center gap-[6px]"
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="relative flex size-[52px] items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#a61651] to-[#01adf1] md:h-[186px] md:w-[133px] md:rounded-[16px]">
        {uploading ? (
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <img
            src="/icons/dashboard/add-circle.svg"
            alt="Add"
            className="size-[24px] md:size-[40px]"
          />
        )}
      </div>
      <p className="w-[52px] truncate text-center text-[12px] font-normal text-foreground md:w-[91px] md:text-[16px]">
        Add Your Story
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}
