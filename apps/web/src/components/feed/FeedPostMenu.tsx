import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

interface Props {
  postId: string;
  isOwner: boolean;
  onDelete?: () => void;
}

export function FeedPostMenu({ postId, isOwner, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => {
      setFeedback('');
      setOpen(false);
    }, 1200);
  };

  const copyLink = async () => {
    const url = `${window.location.origin}/post/${postId}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    showFeedback('Copied!');
  };

  const reportPost = async () => {
    try {
      await api.post(`/posts/${postId}/report`, { reason: 'inappropriate' });
      showFeedback('Reported');
    } catch {
      showFeedback('Failed');
    }
  };

  const deletePost = async () => {
    try {
      await api.delete(`/posts/${postId}`);
      onDelete?.();
    } catch {
      showFeedback('Failed');
    }
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex size-[11px] items-center justify-center hover:opacity-70 md:size-[24px]"
        aria-label="Post options"
      >
        <img src="/icons/dashboard/pending.svg" alt="" className="size-full rotate-90" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[130px] rounded-[8px] border border-border bg-card py-1 shadow-lg">
          {feedback ? (
            <p className="px-4 py-2 text-[13px] text-muted-foreground">{feedback}</p>
          ) : (
            <>
              {isOwner ? (
                <>
                  <button
                    onClick={() => navigate(`/creator/post/edit/${postId}`)}
                    className="w-full px-4 py-2 text-left text-[13px] text-foreground hover:bg-muted"
                  >
                    Edit post
                  </button>
                  <button
                    onClick={deletePost}
                    className="w-full px-4 py-2 text-left text-[13px] text-destructive hover:bg-muted"
                  >
                    Delete post
                  </button>
                </>
              ) : (
                <button
                  onClick={reportPost}
                  className="w-full px-4 py-2 text-left text-[13px] text-foreground hover:bg-muted"
                >
                  Report
                </button>
              )}
              <button
                onClick={copyLink}
                className="w-full px-4 py-2 text-left text-[13px] text-foreground hover:bg-muted"
              >
                Copy link
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
