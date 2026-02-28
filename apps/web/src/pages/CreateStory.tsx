import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export default function CreateStory() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/') && !f.type.startsWith('video/')) {
      setError('Only images and videos allowed');
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError('');
  };

  const handleSubmit = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    const fd = new FormData();
    fd.append('media', file);
    try {
      await api.post('/stories', fd);
      navigate('/feed');
    } catch {
      setError('Failed to create story');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[500px]">
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-center justify-between">
          <p className="text-[20px] text-foreground">Create Story</p>
          <button
            onClick={() => navigate('/feed')}
            className="text-[14px] text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>

        <div className="rounded-[22px] bg-card p-[20px]">
          {!preview ? (
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
          ) : (
            <div className="relative">
              {file?.type.startsWith('video/') ? (
                <video src={preview} className="w-full rounded-[16px]" controls />
              ) : (
                <img src={preview} alt="Preview" className="w-full rounded-[16px] object-cover" />
              )}
              <button
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                }}
                className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
              >
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFile}
            className="hidden"
          />
        </div>

        {error && <p className="text-[12px] text-red-400">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={!file || uploading}
          className="w-full rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[12px] text-[14px] font-medium text-white disabled:opacity-50"
        >
          {uploading ? 'Posting...' : 'Post Story'}
        </button>
      </div>
    </div>
  );
}
