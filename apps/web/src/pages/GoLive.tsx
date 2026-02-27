import { useState } from 'react';

const CATEGORIES = ['Entertainment', 'Education', 'Music', 'Gaming', 'Lifestyle', 'Other'];

export default function GoLive() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [policyAgreed, setPolicyAgreed] = useState(false);

  return (
    <div className="min-h-screen bg-[#15191c] px-4 py-8 md:px-8">
      <h1 className="text-[24px] md:text-[28px] font-semibold text-[#f8f8f8] mb-6">Go Live</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column - Video preview */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="aspect-video w-full rounded-[22px] bg-[#0a0c0e] flex flex-col items-center justify-center gap-4">
            <svg
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#5d5d5d"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M23 7l-7 5 7 5V7z" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
            <p className="text-[16px] text-[#5d5d5d]">Camera preview will appear here</p>
          </div>
          <p className="text-[14px] text-[#5d5d5d] text-center">
            Live streaming infrastructure coming in a future update
          </p>
        </div>

        {/* Right column - Form */}
        <div className="w-full lg:w-[380px] shrink-0">
          <div className="rounded-[22px] bg-[#0e1012] p-[24px] flex flex-col gap-5">
            {/* Title */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#f8f8f8]">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Stream title"
                className="h-[46px] w-full rounded-[12px] bg-[#15191c] px-4 py-3 text-[#f8f8f8] placeholder-[#5d5d5d] outline-none text-[15px] font-light"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#f8f8f8]">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell viewers what your stream is about"
                className="min-h-[100px] w-full resize-none rounded-[12px] bg-[#15191c] px-4 py-3 text-[#f8f8f8] placeholder-[#5d5d5d] outline-none text-[15px] font-light"
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#f8f8f8]">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-[46px] w-full rounded-[12px] bg-[#15191c] px-4 py-3 text-[#f8f8f8] outline-none text-[15px] appearance-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Comments toggle */}
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-medium text-[#f8f8f8]">Enable Comments</span>
              <button
                type="button"
                onClick={() => setCommentsEnabled(!commentsEnabled)}
                className={`relative h-[26px] w-[48px] shrink-0 rounded-full transition-colors ${
                  commentsEnabled ? 'bg-[#2e80c8]' : 'bg-[#5d5d5d]'
                }`}
              >
                <span
                  className={`absolute top-[3px] h-[20px] w-[20px] rounded-full bg-white transition-transform ${
                    commentsEnabled ? 'left-[25px]' : 'left-[3px]'
                  }`}
                />
              </button>
            </div>

            {/* Policy checkbox */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={policyAgreed}
                onChange={(e) => setPolicyAgreed(e.target.checked)}
                className="mt-[3px] h-[18px] w-[18px] shrink-0 accent-[#2e80c8] cursor-pointer"
              />
              <span className="text-[13px] text-[#5d5d5d] leading-[1.5]">
                I agree to the live streaming community guidelines
              </span>
            </label>

            {/* Go Live button */}
            <button
              type="button"
              disabled={!policyAgreed}
              className="h-[48px] w-full rounded-[12px] bg-gradient-to-r from-[#2e80c8] to-[#6c5ce7] text-[16px] font-semibold text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Go Live
            </button>

            {/* Schedule link */}
            <p className="text-center">
              <button type="button" className="text-[14px] text-[#2e80c8] hover:underline">
                Schedule for Later
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
