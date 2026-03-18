import { useRef, useState } from 'react';
import { api } from '../../lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { ScheduleLiveFields } from './ScheduleLiveFields';

interface ScheduleLiveModalProps {
  onClose: () => void;
}

export function ScheduleLiveModal({ onClose }: ScheduleLiveModalProps) {
  const qc = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [audience, setAudience] = useState('public');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleThumbnail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  function validate(): { ok: boolean; date?: Date } {
    if (!title.trim()) {
      setError('Title is required');
      return { ok: false };
    }
    if (!date || !time) {
      setError('Date & time are required');
      return { ok: false };
    }
    const d = new Date(`${date}T${time}`);
    if (isNaN(d.getTime()) || d <= new Date()) {
      setError('Scheduled time must be in the future');
      return { ok: false };
    }
    return { ok: true, date: d };
  }

  function buildForm(scheduledAt: Date): FormData {
    const form = new FormData();
    form.append('title', title.trim());
    form.append('scheduledAt', scheduledAt.toISOString());
    if (description.trim()) form.append('description', description.trim());
    if (category) form.append('category', category);
    if (audience) form.append('privacy', audience);
    if (thumbnail) form.append('thumbnail', thumbnail);
    return form;
  }

  const handleSubmit = async () => {
    setError(null);
    const { ok, date: scheduledAt } = validate();
    if (!ok || !scheduledAt) return;
    setLoading(true);
    try {
      await api.post('/live/schedule', buildForm(scheduledAt), {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      qc.invalidateQueries({ queryKey: ['upcoming-lives'] });
      onClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Failed to schedule live');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-[16px]"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-[460px] overflow-y-auto rounded-[16px] bg-card p-[24px] md:p-[32px]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-[16px] top-[16px] flex size-[32px] items-center justify-center rounded-full bg-muted text-foreground"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <h2 className="mb-[20px] text-center text-[20px] font-semibold text-foreground">
          Schedule Live
        </h2>
        {error && (
          <p className="mb-[12px] rounded-[8px] bg-red-500/10 px-[12px] py-[8px] text-[13px] text-red-500">
            {error}
          </p>
        )}
        <ScheduleLiveFields
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          category={category}
          setCategory={setCategory}
          date={date}
          setDate={setDate}
          time={time}
          setTime={setTime}
          audience={audience}
          setAudience={setAudience}
          thumbnail={thumbnail}
          thumbnailPreview={thumbnailPreview}
          fileRef={fileRef}
          onFileChange={handleThumbnail}
        />
        <div className="mt-[16px] flex flex-col gap-[12px]">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[12px] text-[15px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Scheduling...' : 'Schedule Live'}
          </button>
          <button
            onClick={onClose}
            className="w-full rounded-[50px] border border-border py-[12px] text-[15px] text-foreground transition-colors hover:bg-muted"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
