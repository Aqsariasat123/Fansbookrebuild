import { useState } from 'react';
import { api } from '../../lib/api';

export function StoryDeleteButton({
  storyId,
  onClose,
  onRefetch,
}: {
  storyId: string;
  onClose?: () => void;
  onRefetch?: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/stories/${storyId}`);
      onRefetch?.();
      onClose?.();
    } catch {
      setDeleting(false);
      setConfirming(false);
    }
  };
  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-white/80">Delete this story?</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          disabled={deleting}
          className="rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white"
        >
          {deleting ? 'Deleting...' : 'Yes, delete'}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setConfirming(false);
          }}
          className="rounded-full bg-card/20 px-3 py-1 text-sm text-white"
        >
          Cancel
        </button>
      </div>
    );
  }
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setConfirming(true);
      }}
      className="flex items-center gap-1.5 rounded-full bg-card/10 px-3 py-1.5 text-sm text-white/80 hover:bg-card/20"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
          fill="currentColor"
        />
      </svg>
      Delete Story
    </button>
  );
}
