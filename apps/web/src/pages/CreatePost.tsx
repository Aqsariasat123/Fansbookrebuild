import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

type Visibility = 'PUBLIC' | 'SUBSCRIBERS' | 'TIER_SPECIFIC';

export default function CreatePost() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('PUBLIC');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!text.trim() || submitting) return;
    setError('');
    setSubmitting(true);
    try {
      await api.post('/posts', { text: text.trim(), visibility });
      navigate('/feed');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create post';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#15191c] px-4 py-8 md:px-8">
      <h1 className="text-[24px] md:text-[28px] font-semibold text-[#f8f8f8] mb-6">
        Create New Post
      </h1>

      <div className="rounded-[22px] bg-[#0e1012] p-[24px] max-w-[720px] flex flex-col gap-5">
        {/* Post content */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          className="min-h-[150px] w-full resize-none rounded-[12px] bg-[#15191c] px-4 py-3 text-[#f8f8f8] placeholder-[#5d5d5d] outline-none text-[15px] font-light"
        />

        {/* Audience select */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-[#f8f8f8]">Audience</label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as Visibility)}
            className="h-[46px] w-full rounded-[12px] bg-[#15191c] px-4 py-3 text-[#f8f8f8] outline-none text-[15px] appearance-none cursor-pointer"
          >
            <option value="PUBLIC">Public</option>
            <option value="SUBSCRIBERS">Subscribers Only</option>
            <option value="TIER_SPECIFIC">Tier Specific</option>
          </select>
        </div>

        {/* Tags input */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-[#f8f8f8]">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Add tags, separated by commas"
            className="h-[46px] w-full rounded-[12px] bg-[#15191c] px-4 py-3 text-[#f8f8f8] placeholder-[#5d5d5d] outline-none text-[15px] font-light"
          />
        </div>

        {/* Image upload placeholder */}
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-[#f8f8f8]">Media</label>
          <div className="flex flex-col items-center justify-center gap-3 rounded-[12px] border-2 border-dashed border-[#5d5d5d] bg-[#15191c] py-10 cursor-pointer hover:border-[#8a8a8a] transition-colors">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#5d5d5d"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-[14px] text-[#5d5d5d]">Drop images here or click to upload</p>
          </div>
        </div>

        {/* Error message */}
        {error && <p className="text-[14px] text-red-400">{error}</p>}

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="h-[44px] rounded-[12px] border border-[#5d5d5d] px-6 text-[15px] font-medium text-[#f8f8f8] hover:bg-[#1a1e22] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!text.trim() || submitting}
            onClick={handleSubmit}
            className="h-[44px] rounded-[12px] bg-gradient-to-r from-[#2e80c8] to-[#6c5ce7] px-8 text-[15px] font-medium text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
}
