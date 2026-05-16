import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import {
  AuthorRow,
  VisibilityDropdown,
  MediaUploadArea,
  HashtagPanel,
  PostOptionsRow,
} from '../components/create-post/CreatePostParts';
import type { Visibility } from '../components/create-post/CreatePostParts';
import { PostImageCropModal } from '../components/create-post/PostImageCropModal';
import { UploadProgressBar } from '../components/create-post/UploadProgressBar';
import { useImageCropQueue } from '../hooks/useImageCropQueue';
import { buildPostFormData, extractErrorMessage } from '../components/create-post/postSubmit';

// eslint-disable-next-line complexity -- form page with multiple visibility/upload/PPV states
export default function CreatePost() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [text, setText] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('PUBLIC');
  const [ppvPrice, setPpvPrice] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [isPinned, setIsPinned] = useState(false);
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const showPpv = visibility === 'PPV';

  function changeVisibility(v: Visibility) {
    if (v === 'STORY') {
      navigate('/stories/create');
      return;
    }
    setVisibility(v);
    if (v !== 'PPV') setPpvPrice('');
  }

  const crop = useImageCropQueue((file) =>
    setImages((prev) => [...prev, { file, preview: URL.createObjectURL(file) }]),
  );

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const slots = Math.max(0, 10 - images.length - crop.queue.length);
    const accepted = files.slice(0, slots);
    const videos = accepted.filter((f) => !f.type.startsWith('image/'));
    const imgs = accepted.filter((f) => f.type.startsWith('image/'));
    if (videos.length) {
      setImages((prev) => [
        ...prev,
        ...videos.map((f) => ({ file: f, preview: URL.createObjectURL(f) })),
      ]);
    }
    crop.enqueue(imgs);
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
    setUploadProgress(0);
    setError('');
    try {
      const fd = buildPostFormData(
        { text: text.trim(), visibility, ppvPrice, isPinned, hashtags },
        images,
      );
      // Don't set Content-Type — let axios add multipart boundary automatically
      await api.post('/posts', fd, {
        onUploadProgress: (e) => {
          if (e.total) setUploadProgress(Math.round((e.loaded / e.total) * 100));
        },
      });
      navigate('/creator/profile');
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const needsPpvPrice = visibility === 'PPV' && (!ppvPrice || Number(ppvPrice) <= 0);
  const canSubmit = submitting || (!text.trim() && images.length === 0) || needsPpvPrice;

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex items-center justify-between">
        <p className="text-[20px] font-semibold text-foreground">Create Post</p>
      </div>

      <div className="rounded-[22px] bg-card p-[20px]">
        <div className="flex items-start justify-between">
          <AuthorRow user={user} />
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

        {/* Post type selector — left-aligned, right before the post text body */}
        <div className="mt-[16px] flex items-center gap-[10px]">
          <VisibilityDropdown value={visibility} onChange={changeVisibility} />
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Say Something about this photo..."
          className="mt-[16px] min-h-[50px] w-full resize-none bg-transparent text-[14px] text-foreground placeholder-muted-foreground outline-none"
        />

        <HashtagPanel
          tags={hashtags}
          onAdd={(tag) => setHashtags((prev) => [...prev, tag])}
          onRemove={(tag) => setHashtags((prev) => prev.filter((t) => t !== tag))}
        />

        <PostOptionsRow
          showPpv={showPpv}
          ppvPrice={ppvPrice}
          onPpvChange={setPpvPrice}
          isPinned={isPinned}
          onPinChange={setIsPinned}
        />

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
        {needsPpvPrice && (
          <p className="mt-[12px] text-[13px] text-amber-400">
            Set a PPV price above before posting — otherwise the post would go live as public.
          </p>
        )}
        {error && <p className="mt-[12px] text-[14px] text-red-400">{error}</p>}
        {submitting && images.length > 0 && <UploadProgressBar progress={uploadProgress} />}
        <div className="mt-[16px] flex justify-start">
          <button
            onClick={handleSubmit}
            disabled={canSubmit}
            className="rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[40px] py-[10px] text-[16px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {submitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
      {crop.src && crop.queue[0] && (
        <PostImageCropModal
          key={crop.src}
          src={crop.src}
          fileName={crop.queue[0].name || 'image.jpg'}
          originalFile={crop.queue[0]}
          remaining={crop.queue.length}
          onApply={crop.apply}
          onUseOriginal={crop.useOriginal}
          onCancelAll={crop.clear}
        />
      )}
    </div>
  );
}
