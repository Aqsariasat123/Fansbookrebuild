import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { StoryFilters } from '../components/stories/StoryFilters';
import { StoryTextOverlay, type TextOverlay } from '../components/stories/StoryTextOverlay';
import { StoryStickers, type Sticker } from '../components/stories/StoryStickers';
import { StoryPreview } from '../components/stories/StoryPreview';
import { StorySourceSelector } from '../components/stories/StorySourceSelector';

type StoryVisibility = 'PUBLIC' | 'SUBSCRIBERS';
type SourceMode = 'upload' | 'camera';

export default function CreateStory() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<StoryVisibility>('PUBLIC');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [sourceMode, setSourceMode] = useState<SourceMode>('upload');

  // Enhancement: filters, text overlay, stickers
  const [filterCss, setFilterCss] = useState('');
  const [textOverlay, setTextOverlay] = useState<TextOverlay | null>(null);
  const [stickers, setStickers] = useState<Sticker[]>([]);

  const isVideo = file?.type.startsWith('video/') ?? false;

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

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const clearMedia = () => {
    setFile(null);
    setPreview(null);
    setFilterCss('');
    setTextOverlay(null);
    setStickers([]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    const fd = new FormData();
    fd.append('media', file);
    fd.append('visibility', visibility);

    // Send overlays as JSON (text overlay + stickers + filter)
    const overlays = {
      filter: filterCss || null,
      text: textOverlay,
      stickers: stickers.length > 0 ? stickers : null,
    };
    if (overlays.filter || overlays.text || overlays.stickers) {
      fd.append('overlays', JSON.stringify(overlays));
    }

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
          {/* Visibility selector */}
          <div className="mb-[16px] flex gap-[8px]">
            {(['PUBLIC', 'SUBSCRIBERS'] as StoryVisibility[]).map((v) => (
              <button
                key={v}
                onClick={() => setVisibility(v)}
                className={`rounded-[50px] px-[16px] py-[6px] text-[12px] font-medium transition-colors md:text-[14px] ${
                  visibility === v
                    ? 'bg-gradient-to-r from-[#01adf1] to-[#a61651] text-white'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {v === 'PUBLIC' ? 'Public' : 'Subscribers Only'}
              </button>
            ))}
          </div>

          {preview ? (
            <StoryPreview
              preview={preview}
              isVideo={isVideo}
              filterCss={filterCss}
              textOverlay={textOverlay}
              stickers={stickers}
              onClear={clearMedia}
            />
          ) : (
            <StorySourceSelector
              sourceMode={sourceMode}
              onSourceModeChange={setSourceMode}
              onFileSelect={handleFileSelect}
              fileRef={fileRef}
            />
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFile}
            className="hidden"
          />
        </div>

        {/* Enhancement tools (only visible when media is selected) */}
        {preview && !isVideo && (
          <div className="flex flex-col gap-[16px] rounded-[22px] bg-card p-[20px]">
            <p className="text-[14px] font-medium text-foreground">Filters</p>
            <StoryFilters active={filterCss} onChange={setFilterCss} />

            <p className="text-[14px] font-medium text-foreground">Text Overlay</p>
            <StoryTextOverlay
              overlay={textOverlay}
              onChange={setTextOverlay}
              onRemove={() => setTextOverlay(null)}
            />

            <p className="text-[14px] font-medium text-foreground">Stickers</p>
            <StoryStickers
              stickers={stickers}
              onAdd={(s) => setStickers((prev) => [...prev, s])}
              onRemoveLast={() => setStickers((prev) => prev.slice(0, -1))}
            />
          </div>
        )}

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
