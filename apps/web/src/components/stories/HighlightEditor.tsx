import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface HighlightData {
  id: string;
  name: string;
  coverUrl: string | null;
  storyIds: string[];
}

interface StoryOption {
  id: string;
  mediaUrl: string;
  createdAt: string;
}

interface Props {
  highlight?: HighlightData | null;
  onClose: () => void;
  onSaved: () => void;
}

export function HighlightEditor({ highlight, onClose, onSaved }: Props) {
  const [name, setName] = useState(highlight?.name || '');
  const [selectedIds, setSelectedIds] = useState<string[]>(highlight?.storyIds || []);
  const [stories, setStories] = useState<StoryOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!highlight;

  useEffect(() => {
    api
      .get('/feed/stories')
      .then((res) => {
        const groups = res.data.data || [];
        const all: StoryOption[] = [];
        for (const g of groups) {
          for (const s of g.stories || []) {
            all.push({ id: s.id, mediaUrl: s.mediaUrl, createdAt: s.createdAt });
          }
        }
        setStories(all);
      })
      .catch(() => {});
  }, []);

  const toggleStory = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (isEdit) {
        await api.put(`/story-highlights/${highlight.id}`, {
          name: name.trim(),
          storyIds: selectedIds,
        });
      } else {
        await api.post('/story-highlights', { name: name.trim(), storyIds: selectedIds });
      }
      onSaved();
    } catch {
      setError('Failed to save highlight');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-[#1a1e22] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-semibold text-white">
          {isEdit ? 'Edit Highlight' : 'New Highlight'}
        </h2>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Highlight name"
          className="mb-4 w-full rounded-lg bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:ring-1 focus:ring-white/20"
        />

        {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

        <p className="mb-2 text-xs text-white/50">Select stories to include:</p>
        <div className="mb-4 grid max-h-48 grid-cols-4 gap-2 overflow-y-auto">
          {stories.map((s) => (
            <button
              key={s.id}
              onClick={() => toggleStory(s.id)}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 ${
                selectedIds.includes(s.id) ? 'border-blue-500' : 'border-transparent'
              }`}
            >
              <img src={s.mediaUrl} alt="" className="size-full object-cover" />
              {selectedIds.includes(s.id) && (
                <div className="absolute inset-0 flex items-center justify-center bg-blue-500/30">
                  <span className="text-lg text-white">&#10003;</span>
                </div>
              )}
            </button>
          ))}
          {stories.length === 0 && (
            <p className="col-span-4 py-4 text-center text-sm text-white/40">No stories found</p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-white/60 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
