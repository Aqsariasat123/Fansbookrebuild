import { useState } from 'react';

interface ScheduleLiveModalProps {
  onClose: () => void;
}

const CATEGORIES = [
  'Entertainment',
  'Music',
  'Gaming',
  'Education',
  'Fitness',
  'Cooking',
  'Art',
  'Talk Show',
];

export function ScheduleLiveModal({ onClose }: ScheduleLiveModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [audience, setAudience] = useState('');

  const inputClass =
    'w-full rounded-[8px] border border-[#d0d0d0] bg-white px-[14px] py-[10px] text-[14px] text-[#333] placeholder-[#aaa] outline-none focus:border-[#01adf1]';
  const labelClass = 'mb-[6px] text-[14px] font-medium text-[#333]';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-[16px]"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-[460px] overflow-y-auto rounded-[16px] bg-white p-[24px] md:p-[32px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-[16px] top-[16px] flex size-[32px] items-center justify-center rounded-full bg-[#1a1a2e] text-white"
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

        <h2 className="mb-[20px] text-center text-[20px] font-semibold text-[#1a1a1a]">
          Schedule Live
        </h2>

        <div className="flex flex-col gap-[16px]">
          <div>
            <p className={labelClass}>Live Stream Title</p>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Title"
              className={inputClass}
            />
          </div>

          <div>
            <p className={labelClass}>Description</p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter Description"
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <p className={labelClass}>Category</p>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
            >
              <option value="">Choose Category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className={labelClass}>Cover Thumbnail</p>
            <div className="flex items-center gap-[10px] rounded-[8px] border border-[#d0d0d0] px-[14px] py-[10px]">
              <span className="flex-1 text-[14px] text-[#aaa]">Upload Your Photo</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#666">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>
            </div>
          </div>

          <div>
            <p className={labelClass}>Date & Time</p>
            <div className="flex gap-[10px]">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`${inputClass} flex-1`}
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={`${inputClass} flex-1`}
              />
            </div>
          </div>

          <div>
            <p className={labelClass}>Audience & Privacy</p>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className={inputClass}
            >
              <option value="">Who Can Watch</option>
              <option value="public">Public</option>
              <option value="subscribers">Subscribers Only</option>
              <option value="followers">Followers Only</option>
            </select>
          </div>

          <button className="mt-[8px] w-full rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[12px] text-[15px] font-medium text-white transition-opacity hover:opacity-90">
            Schedule Live
          </button>
          <button
            onClick={onClose}
            className="w-full rounded-[50px] border border-[#d0d0d0] py-[12px] text-[15px] text-[#333] transition-colors hover:bg-[#f5f5f5]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
