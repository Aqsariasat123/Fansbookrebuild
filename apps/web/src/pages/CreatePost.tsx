import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import {
  AuthorRow,
  VisibilityDropdown,
  MediaUploadArea,
} from '../components/create-post/CreatePostParts';
import type { Visibility } from '../components/create-post/CreatePostParts';

export default function CreatePost() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [text, setText] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('PUBLIC');
  const [ppvPrice, setPpvPrice] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const showPpv = visibility === 'PPV';

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setImages((prev) => {
      const slots = Math.max(0, 10 - prev.length);
      return [
        ...prev,
        ...files.slice(0, slots).map((f) => ({ file: f, preview: URL.createObjectURL(f) })),
      ];
    });
    e.target.value = '';
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
      const fullText = text.trim();
      const fd = new FormData();
      fd.append('text', fullText);
      // PPV maps to PUBLIC visibility on the backend (visible/blurred to all) + ppvPrice gate
      fd.append('visibility', visibility === 'PPV' ? 'PUBLIC' : visibility);
      if (visibility === 'PPV' && ppvPrice) fd.append('ppvPrice', ppvPrice);
      if (isPinned) fd.append('isPinned', 'true');
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

      <div className="rounded-[22px] bg-card p-[20px]">
        <div className="flex items-start justify-between">
          <AuthorRow user={user} />
          <div className="flex items-center gap-[16px]">
            <VisibilityDropdown
              value={visibility}
              onChange={(v) => {
                if (v === 'STORY') {
                  navigate('/stories/create');
                  return;
                }
                setVisibility(v);
                if (v !== 'PPV') setPpvPrice('');
              }}
            />
            <button
              onClick={() => navigate(-1)}
              className="text-muted-foreground hover:text-foreground"
            >
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

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Say Something about this photo..."
          className="mt-[16px] min-h-[50px] w-full resize-none bg-transparent text-[14px] text-foreground placeholder-muted-foreground outline-none"
        />

        <div className="mt-[12px] flex flex-wrap items-center gap-[16px]">
          {showPpv && (
            <div className="flex items-center gap-[8px]">
              <label className="text-[13px] text-muted-foreground">PPV Price $</label>
              <input
                type="number"
                min="1"
                max="500"
                step="0.01"
                value={ppvPrice}
                onChange={(e) => setPpvPrice(e.target.value)}
                placeholder="0.00"
                className="w-[90px] rounded-[8px] bg-muted px-[10px] py-[6px] text-[13px] text-foreground outline-none"
              />
            </div>
          )}
          <label className="flex cursor-pointer items-center gap-[8px]">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="size-[16px] accent-[#01adf1]"
            />
            <span className="text-[13px] text-muted-foreground">Pin to top</span>
          </label>
          <div className="flex items-center gap-[6px] rounded-[6px] bg-[#01adf1]/10 px-[10px] py-[5px]">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#01adf1"
              strokeWidth="2"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="text-[12px] text-[#01adf1]">
              All media is forensically watermarked
            </span>
          </div>
        </div>

        <MediaUploadArea
          images={images}
          onRemove={removeImage}
          onPickFiles={() => fileRef.current?.click()}
        />

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
