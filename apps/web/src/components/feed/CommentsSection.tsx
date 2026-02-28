import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../../lib/api';
import { Comment, CommentThread } from './CommentItem';

interface CommentsSectionProps {
  postId: string;
  onCountChange: (delta: number) => void;
}

export function CommentsSection({ postId, onCountChange }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

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
      const body: { text: string; parentId?: string } = { text: text.trim() };
      if (replyTo) body.parentId = replyTo.id;

      const res = await api.post(`/posts/${postId}/comment`, body);
      const newComment: Comment = { ...res.data.data, children: [] };

      if (replyTo) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === replyTo.id ? { ...c, children: [...(c.children || []), newComment] } : c,
          ),
        );
      } else {
        setComments((prev) => [...prev, newComment]);
      }
      setText('');
      setReplyTo(null);
      onCountChange(1);
      setTimeout(
        () => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }),
        100,
      );
    } catch {
      /* ignore */
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = (commentId: string, authorName: string) => {
    setReplyTo({ id: commentId, name: authorName });
    setText(`@${authorName} `);
    inputRef.current?.focus();
  };

  const toggleCommentLike = async (commentId: string, isChild: boolean, parentId?: string) => {
    const updateLike = (c: Comment): Comment =>
      c.id === commentId
        ? { ...c, isLiked: !c.isLiked, likeCount: c.likeCount + (c.isLiked ? -1 : 1) }
        : c;

    setComments((prev) =>
      prev.map((c) => {
        if (!isChild) return updateLike(c);
        if (c.id === parentId) {
          return { ...c, children: (c.children || []).map(updateLike) };
        }
        return c;
      }),
    );

    const target = isChild
      ? comments.find((c) => c.id === parentId)?.children?.find((ch) => ch.id === commentId)
      : comments.find((c) => c.id === commentId);

    try {
      if (target?.isLiked) {
        await api.delete(`/posts/${postId}/comments/${commentId}/like`);
      } else {
        await api.post(`/posts/${postId}/comments/${commentId}/like`);
      }
    } catch {
      setComments((prev) =>
        prev.map((c) => {
          if (!isChild) return updateLike(c);
          if (c.id === parentId) {
            return { ...c, children: (c.children || []).map(updateLike) };
          }
          return c;
        }),
      );
    }
  };

  return (
    <div className="flex flex-col gap-[12px] border-t border-[#1a1d20] pt-[12px]">
      {loading ? (
        <div className="flex justify-center py-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
        </div>
      ) : (
        <div
          ref={listRef}
          className="flex max-h-[320px] flex-col gap-[14px] overflow-y-auto scroll-smooth pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#2a2d30]"
        >
          {comments.length === 0 && (
            <p className="py-3 text-center text-[12px] text-muted-foreground">
              Be the first to comment
            </p>
          )}
          {comments.map((c) => (
            <CommentThread
              key={c.id}
              comment={c}
              onReply={handleReply}
              onToggleLike={toggleCommentLike}
            />
          ))}
        </div>
      )}

      {/* Reply indicator */}
      {replyTo && (
        <div className="flex items-center gap-[8px] px-[4px]">
          <span className="text-[11px] text-muted-foreground">
            Replying to <span className="font-medium text-primary">@{replyTo.name}</span>
          </span>
          <button
            onClick={() => {
              setReplyTo(null);
              setText('');
            }}
            className="text-[11px] text-muted-foreground hover:text-foreground"
          >
            &times;
          </button>
        </div>
      )}

      {/* Comment input */}
      <div className="flex items-center gap-[8px]">
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder={replyTo ? `Reply to @${replyTo.name}...` : 'Write a comment...'}
          className="flex-1 rounded-[20px] bg-muted px-[14px] py-[10px] text-[12px] text-foreground outline-none ring-1 ring-transparent transition-all placeholder:text-muted-foreground focus:ring-[#2a2d30] md:text-[13px]"
        />
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || submitting}
          className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#a61651] to-[#01adf1] transition-opacity disabled:opacity-40"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  );
}
