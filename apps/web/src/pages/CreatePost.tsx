import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { AuthorRow, VisibilityDropdown } from '../components/create-post/CreatePostParts';
import type { Visibility } from '../components/create-post/CreatePostParts';

export default function CreatePost() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [text, setText] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('PUBLIC');
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const newImgs = files.map((f) => ({ file: f, preview: URL.createObjectURL(f) }));
    setImages((prev) => [...prev, ...newImgs]);
  }

  function removeImage(idx: number) {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  }

  async function handleSubmit() {
    if (!text.trim() && images.length === 0) return;
    setSubmitting(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('text', text.trim());
      fd.append('visibility', visibility);
      images.forEach((img) => fd.append('media', img.file));
      await api.post('/posts', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/creator/profile');
    } catch {
      setError('Failed to create post');
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit = submitting || (!text.trim() && images.length === 0);

  return (
    <div className="flex flex-col gap-[20px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[20px] font-semibold text-foreground">Create Post</p>
        <button
          onClick={handleSubmit}
          disabled={canSubmit}
          className="rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[32px] py-[10px] text-[16px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {submitting ? 'Posting...' : 'Post'}
        </button>
      </div>

      {/* Card */}
      <div className="rounded-[22px] bg-card p-[20px]">
        {/* Author row */}
        <div className="flex items-start justify-between">
          <AuthorRow user={user} />
          <div className="flex items-center gap-[16px]">
            <VisibilityDropdown value={visibility} onChange={setVisibility} />
            <button onClick={() => fileRef.current?.click()}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
            </button>
            <button onClick={() => navigate(-1)}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Text input */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Say Something about this photo..."
          className="mt-[16px] min-h-[50px] w-full resize-none bg-transparent text-[14px] text-foreground placeholder-muted-foreground outline-none"
        />

        {/* Image previews */}
        {images.length > 0 && (
          <div className="mt-[16px] grid grid-cols-2 gap-[8px] md:grid-cols-3">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-[12px]">
                <img src={img.preview} alt="" className="size-full object-cover" />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute right-[6px] top-[6px] flex size-[24px] items-center justify-center rounded-full bg-black/60 text-white"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Empty state - click to upload */}
        {images.length === 0 && (
          <div
            onClick={() => fileRef.current?.click()}
            className="mt-[16px] flex h-[300px] cursor-pointer items-center justify-center rounded-[16px] border-2 border-dashed border-border bg-muted transition-colors hover:border-border"
          >
            <div className="flex flex-col items-center gap-[12px]">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <p className="text-[14px] text-muted-foreground">Click to add photos or videos</p>
            </div>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={handleFiles}
        />
        {error && <p className="mt-[12px] text-[14px] text-red-400">{error}</p>}
      </div>
    </div>
  );
}
