import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { ImagePicker } from './MarketplaceCreateParts';

const CATEGORIES = [
  'DIGITAL_CONTENT',
  'PHYSICAL_MERCH',
  'EXPERIENCE',
  'CUSTOM_CONTENT',
  'SHOUTOUT',
];

export default function MarketplaceCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('DIGITAL_CONTENT');
  const [type, setType] = useState<'FIXED_PRICE' | 'AUCTION'>('FIXED_PRICE');
  const [price, setPrice] = useState('');
  const [startingBid, setStartingBid] = useState('');
  const [duration, setDuration] = useState('24');
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleAddImages = (files: File[]) => {
    const newImgs = files.map((f) => ({ file: f, preview: URL.createObjectURL(f) }));
    setImages((prev) => [...prev, ...newImgs].slice(0, 10));
  };

  const handleRemoveImage = (idx: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('title', title.trim());
      fd.append('description', description.trim());
      fd.append('category', category);
      fd.append('type', type);
      if (type === 'FIXED_PRICE') {
        fd.append('price', price);
      } else {
        fd.append('startingBid', startingBid);
        fd.append('duration', duration);
      }
      images.forEach((img) => fd.append('images', img.file));
      const res = await api.post('/marketplace', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/marketplace/${res.data.data.id}`);
    } catch {
      setError('Failed to create listing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[560px]">
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-center justify-between">
          <p className="text-[24px] font-semibold text-foreground">Create Listing</p>
          <button
            onClick={() => navigate('/marketplace')}
            className="text-[14px] text-muted-foreground"
          >
            Cancel
          </button>
        </div>

        <div className="rounded-[22px] bg-card p-[20px]">
          <div className="flex flex-col gap-[12px]">
            <div>
              <label className="text-[13px] text-muted-foreground">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What are you selling?"
                className="mt-[4px] w-full rounded-[8px] bg-muted px-[12px] py-[10px] text-[14px] text-foreground outline-none"
              />
            </div>

            <div>
              <label className="text-[13px] text-muted-foreground">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your item..."
                className="mt-[4px] min-h-[80px] w-full resize-none rounded-[8px] bg-muted px-[12px] py-[10px] text-[14px] text-foreground outline-none"
              />
            </div>

            <div>
              <label className="text-[13px] text-muted-foreground">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-[4px] w-full rounded-[8px] bg-muted px-[12px] py-[10px] text-[14px] text-foreground outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[13px] text-muted-foreground">Listing Type</label>
              <div className="mt-[4px] flex gap-[8px]">
                {(['FIXED_PRICE', 'AUCTION'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`flex-1 rounded-[8px] py-[10px] text-[13px] font-medium transition-colors ${type === t ? 'bg-gradient-to-r from-[#01adf1] to-[#a61651] text-white' : 'bg-muted text-muted-foreground'}`}
                  >
                    {t === 'FIXED_PRICE' ? 'Fixed Price' : 'Auction'}
                  </button>
                ))}
              </div>
            </div>

            {type === 'FIXED_PRICE' ? (
              <div>
                <label className="text-[13px] text-muted-foreground">Price ($)</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="mt-[4px] w-full rounded-[8px] bg-muted px-[12px] py-[10px] text-[14px] text-foreground outline-none"
                />
              </div>
            ) : (
              <div className="flex gap-[12px]">
                <div className="flex-1">
                  <label className="text-[13px] text-muted-foreground">Starting Bid ($)</label>
                  <input
                    type="number"
                    min="1"
                    value={startingBid}
                    onChange={(e) => setStartingBid(e.target.value)}
                    placeholder="0"
                    className="mt-[4px] w-full rounded-[8px] bg-muted px-[12px] py-[10px] text-[14px] text-foreground outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[13px] text-muted-foreground">Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="mt-[4px] w-full rounded-[8px] bg-muted px-[12px] py-[10px] text-[14px] text-foreground outline-none"
                  >
                    <option value="24">24 hours</option>
                    <option value="48">48 hours</option>
                    <option value="72">72 hours</option>
                    <option value="168">7 days</option>
                  </select>
                </div>
              </div>
            )}

            <ImagePicker images={images} onAdd={handleAddImages} onRemove={handleRemoveImage} />
          </div>
        </div>

        {error && <p className="text-[13px] text-red-400">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={submitting || !title.trim()}
          className="w-full rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[12px] text-[16px] font-medium text-white disabled:opacity-50"
        >
          {submitting ? 'Creating...' : 'Create Listing'}
        </button>
      </div>
    </div>
  );
}
