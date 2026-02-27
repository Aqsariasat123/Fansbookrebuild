import { useCallback, useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface CommentAuthor {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
}

interface Comment {
  id: string;
  text: string;
  createdAt: string;
  author: CommentAuthor;
  children?: Comment[];
}

interface CommentsSectionProps {
  postId: string;
  onCountChange: (delta: number) => void;
}

export function CommentsSection({ postId, onCountChange }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const res = await api.get(`/posts/${postId}/comments`);
      setComments(res.data.data || []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/posts/${postId}/comment`, { text: text.trim() });
      setComments((prev) => [...prev, res.data.data]);
      setText('');
      onCountChange(1);
    } catch {
      /* ignore */
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 border-t border-[#1a1d20] pt-3">
      {loading ? (
        <div className="flex justify-center py-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
      ) : (
        <div className="flex max-h-[200px] flex-col gap-2 overflow-y-auto">
          {comments.length === 0 && (
            <p className="text-center text-xs text-[#5d5d5d]">No comments yet</p>
          )}
          {comments.map((c) => (
            <CommentItem key={c.id} comment={c} />
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Write a comment..."
          className="flex-1 rounded-full bg-[#15191c] px-3 py-2 text-xs text-[#f8f8f8] outline-none placeholder:text-[#5d5d5d] md:text-sm"
        />
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || submitting}
          className="shrink-0 rounded-full bg-gradient-to-r from-[#a61651] to-[#01adf1] px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50 md:text-sm"
        >
          Post
        </button>
      </div>
    </div>
  );
}

function CommentItem({ comment }: { comment: Comment }) {
  const timeAgo = getTimeAgo(comment.createdAt);
  return (
    <div className="flex gap-2">
      <img
        src={comment.author.avatar || ''}
        alt=""
        className="mt-0.5 size-6 shrink-0 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-[#f8f8f8]">{comment.author.displayName}</span>
          <span className="text-[10px] text-[#5d5d5d]">{timeAgo}</span>
        </div>
        <p className="text-xs text-[#c0c0c0]">{comment.text}</p>
      </div>
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}
