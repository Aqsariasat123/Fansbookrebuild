import { useState, useRef } from 'react';
import { api } from '../../lib/api';

function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
      <path
        d="M10 2V13M10 2L6 6M10 2L14 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 14V15C2 16.6569 3.34315 18 5 18H15C16.6569 18 18 16.6569 18 15V14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ReportForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setMsgType('error');
      setMsg('Please fill in both title and description.');
      return;
    }

    setSubmitting(true);
    setMsg('');

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      if (photo) formData.append('photo', photo);

      await api.post('/support/report', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMsgType('success');
      setMsg('Report submitted successfully!');
      setTitle('');
      setDescription('');
      setPhoto(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch {
      setMsgType('error');
      setMsg('Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setPhoto(file);
  }

  return (
    <div className="flex flex-col gap-[16px]">
      <p className="text-[16px] text-foreground">Report a Problem</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
        {/* Issue Title */}
        <div className="flex flex-col gap-[8px]">
          <label className="text-[18px] text-muted-foreground capitalize">Issue Title</label>
          <div className="border border-[rgba(93,93,93,0.34)] rounded-[8px] h-[48px] w-full px-[16px] flex items-center">
            <input
              type="text"
              placeholder="Enter Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent text-[12px] text-foreground outline-none placeholder:text-muted-foreground w-full"
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-[8px]">
          <label className="text-[18px] text-muted-foreground capitalize">Description</label>
          <div className="border border-[rgba(93,93,93,0.34)] rounded-[8px] h-[129px] w-full px-[16px] py-[12px]">
            <textarea
              placeholder="Enter Description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-transparent text-[12px] text-foreground outline-none placeholder:text-muted-foreground w-full h-full resize-none"
            />
          </div>
        </div>

        {/* Upload Photo */}
        <div
          className="border border-[rgba(93,93,93,0.34)] rounded-[6px] h-[48px] w-full px-[16px] flex items-center justify-between cursor-pointer"
          onClick={() => fileRef.current?.click()}
        >
          <span className="text-[12px] text-muted-foreground">
            {photo ? photo.name : 'Upload Your Photo'}
          </span>
          <UploadIcon />
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Message */}
        {msg && (
          <p
            className={`text-[12px] text-center ${
              msgType === 'success' ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {msg}
          </p>
        )}

        {/* Submit button */}
        <div className="flex justify-center mt-[4px]">
          <button
            type="submit"
            disabled={submitting}
            className="bg-gradient-to-r from-[#01adf1] to-[#a61651] rounded-[80px] h-[45px] w-[306px] text-[20px] text-foreground shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}
