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

const ic =
  'w-full rounded-[8px] border border-border bg-card px-[14px] py-[10px] text-[14px] text-foreground placeholder-muted-foreground outline-none focus:border-[#01adf1]';
const lc = 'mb-[6px] text-[14px] font-medium text-foreground';

interface Props {
  title: string;
  setTitle: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  date: string;
  setDate: (v: string) => void;
  time: string;
  setTime: (v: string) => void;
  audience: string;
  setAudience: (v: string) => void;
  thumbnail: File | null;
  thumbnailPreview: string | null;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ScheduleLiveFields(p: Props) {
  return (
    <div className="flex flex-col gap-[16px]">
      <div>
        <p className={lc}>Live Stream Title *</p>
        <input
          value={p.title}
          onChange={(e) => p.setTitle(e.target.value)}
          placeholder="Enter Title"
          className={ic}
        />
      </div>
      <div>
        <p className={lc}>Description</p>
        <textarea
          value={p.description}
          onChange={(e) => p.setDescription(e.target.value)}
          placeholder="Enter Description"
          rows={3}
          className={`${ic} resize-none`}
        />
      </div>
      <div>
        <p className={lc}>Category</p>
        <select value={p.category} onChange={(e) => p.setCategory(e.target.value)} className={ic}>
          <option value="">Choose Category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <p className={lc}>Cover Thumbnail</p>
        <input
          ref={p.fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={p.onFileChange}
        />
        <div
          className="flex cursor-pointer items-center gap-[10px] rounded-[8px] border border-border px-[14px] py-[10px] hover:border-[#01adf1]"
          onClick={() => p.fileRef.current?.click()}
        >
          {p.thumbnailPreview ? (
            <img src={p.thumbnailPreview} className="size-[40px] rounded-[6px] object-cover" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#666">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
          )}
          <span className="flex-1 text-[14px] text-muted-foreground">
            {p.thumbnail ? p.thumbnail.name : 'Upload Your Photo'}
          </span>
        </div>
      </div>
      <div>
        <p className={lc}>Date & Time *</p>
        <div className="flex gap-[10px]">
          <input
            type="date"
            value={p.date}
            onChange={(e) => p.setDate(e.target.value)}
            className={`${ic} flex-1`}
          />
          <input
            type="time"
            value={p.time}
            onChange={(e) => p.setTime(e.target.value)}
            className={`${ic} flex-1`}
          />
        </div>
      </div>
      <div>
        <p className={lc}>Audience & Privacy</p>
        <select value={p.audience} onChange={(e) => p.setAudience(e.target.value)} className={ic}>
          <option value="public">Public</option>
          <option value="subscribers">Subscribers Only</option>
          <option value="followers">Followers Only</option>
        </select>
      </div>
    </div>
  );
}
