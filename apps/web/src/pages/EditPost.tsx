import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { AuthorRow, VisibilityDropdown } from '../components/create-post/CreatePostParts';
import type { Visibility } from '../components/create-post/CreatePostParts';

function backendVisToUi(vis: string, ppvPrice?: number | null): Visibility {
  if (vis === 'PUBLIC' && ppvPrice && ppvPrice > 0) return 'PPV';
  if (vis === 'SUBSCRIBERS') return 'SUBSCRIBERS';
  if (vis === 'TIER_SPECIFIC') return 'TIER_SPECIFIC';
  return 'PUBLIC';
}

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [text, setText] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('PUBLIC');
  const [ppvPrice, setPpvPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [tooOld, setTooOld] = useState(false);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/posts/${id}`)
      .then(({ data }) => {
        if (data.success) {
          const post = data.data;
          const hoursSince = (Date.now() - new Date(post.createdAt).getTime()) / 3600000;
          if (hoursSince > 24) {
            setTooOld(true);
          }
          setText(post.text ?? '');
          const uiVis = backendVisToUi(post.visibility, post.ppvPrice);
          setVisibility(uiVis);
          if (uiVis === 'PPV' && post.ppvPrice) setPpvPrice(String(post.ppvPrice));
        }
      })
      .catch(() => setError('Failed to load post'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit() {
    if (!text.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const body: Record<string, string | number | null> = {
        text: text.trim(),
        visibility: visibility === 'PPV' ? 'PUBLIC' : visibility,
      };
      if (visibility === 'PPV' && ppvPrice) {
        body.ppvPrice = parseFloat(ppvPrice);
      } else {
        body.ppvPrice = null;
      }
      await api.put(`/posts/${id}`, body);
      navigate('/creator/profile');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Failed to update post');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-foreground border-t-transparent" />
      </div>
    );
  }

  if (tooOld) {
    return (
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-center justify-between">
          <p className="text-[20px] font-semibold text-foreground">Edit Post</p>
          <button
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="rounded-[22px] bg-card p-[24px] text-center">
          <p className="text-[16px] text-muted-foreground">
            Posts can only be edited within 24 hours of creation.
          </p>
        </div>
      </div>
    );
  }

  const showPpv = visibility === 'PPV';
  const canSubmit = submitting || !text.trim();

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex items-center justify-between">
        <p className="text-[20px] font-semibold text-foreground">Edit Post</p>
        <button
          onClick={handleSubmit}
          disabled={canSubmit}
          className="rounded-[50px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[32px] py-[10px] text-[16px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {submitting ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="rounded-[22px] bg-card p-[20px]">
        <div className="flex items-start justify-between">
          <AuthorRow user={user} />
          <div className="flex items-center gap-[16px]">
            <VisibilityDropdown
              value={visibility}
              onChange={(v) => {
                setVisibility(v);
                if (v !== 'PPV') setPpvPrice('');
              }}
            />
            <button
              onClick={() => navigate(-1)}
              className="text-muted-foreground hover:text-foreground"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          className="mt-[16px] min-h-[120px] w-full resize-none bg-transparent text-[14px] text-foreground placeholder-muted-foreground outline-none"
        />

        {showPpv && (
          <div className="mt-[12px] flex items-center gap-[8px]">
            <label className="text-[13px] text-muted-foreground">PPV Price $</label>
            <input
              type="number"
              min="1"
              max="500"
              step="0.01"
              value={ppvPrice}
              onChange={(e) => setPpvPrice(e.target.value)}
              placeholder="0.00"
              className="w-[90px] rounded-[8px] bg-muted px-[10px] py-[6px] text-[13px] text-foreground outline-none"
            />
          </div>
        )}

        <p className="mt-[16px] text-[12px] text-muted-foreground">
          Note: media cannot be changed after posting. Posts are editable within 24 hours only.
        </p>

        {error && <p className="mt-[12px] text-[14px] text-red-400">{error}</p>}
      </div>
    </div>
  );
}
