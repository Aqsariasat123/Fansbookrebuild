import { useState } from 'react';
import { api } from '../../lib/api';

interface SmartReplyBarProps {
  conversationId: string;
  onSelect: (text: string) => void;
  currentText: string;
  onPolish: (polished: string) => void;
}

type BarState = 'idle' | 'loading' | 'showing' | 'polishing';

export function SmartReplyBar({
  conversationId,
  onSelect,
  currentText,
  onPolish,
}: SmartReplyBarProps) {
  const [state, setState] = useState<BarState>('idle');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  async function fetchSuggestions() {
    if (state === 'loading') return;
    setState('loading');
    try {
      const { data: res } = await api.post('/creator/ai/suggest', { conversationId });
      if (res.success && res.data.suggestions.length > 0) {
        setSuggestions(res.data.suggestions);
        setState('showing');
      } else {
        setState('idle');
      }
    } catch {
      setState('idle');
    }
  }

  async function handlePolish() {
    if (!currentText.trim() || state === 'polishing') return;
    setState('polishing');
    try {
      const { data: res } = await api.post('/creator/ai/polish', { text: currentText.trim() });
      if (res.success && res.data.polished) {
        onPolish(res.data.polished);
      }
    } catch {
      // silent fail
    } finally {
      setState('idle');
    }
  }

  function dismiss() {
    setState('idle');
    setSuggestions([]);
  }

  return (
    <div className="border-t border-muted px-[12px] pt-[10px] pb-[8px] md:px-[17px]">
      {/* AI toolbar */}
      <div className="flex items-center gap-[8px]">
        {/* Suggest button — large, prominent */}
        <button
          onClick={fetchSuggestions}
          disabled={state === 'loading' || state === 'polishing'}
          className="flex items-center gap-[8px] rounded-[10px] border-2 border-[#2e80c8] bg-[#2e80c8] px-[16px] py-[8px] text-[13px] font-semibold text-white shadow-sm hover:bg-[#2571b3] hover:border-[#2571b3] disabled:opacity-50 transition-all"
        >
          {state === 'loading' ? (
            <span className="size-[14px] animate-spin rounded-full border-2 border-white border-t-transparent inline-block shrink-0" />
          ) : (
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="shrink-0"
            >
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
            </svg>
          )}
          {state === 'loading' ? 'Getting suggestions…' : 'Suggest replies'}
        </button>

        {/* Polish button — shows only when text is typed */}
        {currentText.trim().length > 0 && (
          <button
            onClick={handlePolish}
            disabled={state === 'polishing'}
            className="flex items-center gap-[8px] rounded-[10px] border-2 border-purple-500 bg-purple-500 px-[16px] py-[8px] text-[13px] font-semibold text-white shadow-sm hover:bg-purple-600 hover:border-purple-600 disabled:opacity-50 transition-all"
          >
            {state === 'polishing' ? (
              <span className="size-[14px] animate-spin rounded-full border-2 border-white border-t-transparent inline-block shrink-0" />
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="shrink-0"
              >
                <path d="M7.5 5.6L10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8L17 14l1.4 2.5L17 19l2.5-1.4L22 19l-1.4-2.5L22 14zM22 2l-2.5 1.4L17 2l1.4 2.5L17 7l2.5-1.4L22 7l-1.4-2.5zm-7.63 5.29a1 1 0 00-1.41 0L1.29 18.96a1 1 0 000 1.41l2.34 2.34a1 1 0 001.41 0L16.7 11.05a1 1 0 000-1.41l-2.33-2.35z" />
              </svg>
            )}
            {state === 'polishing' ? 'Polishing…' : 'Polish'}
          </button>
        )}
      </div>

      {/* Suggestions panel */}
      {state === 'showing' && suggestions.length > 0 && (
        <div className="mt-[10px] rounded-[12px] border border-[#2e80c8]/40 bg-[#2e80c8]/8 p-[12px]">
          <div className="flex items-center justify-between mb-[10px]">
            <div className="flex items-center gap-[6px]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#2e80c8">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
              </svg>
              <span className="text-[12px] font-semibold text-[#2e80c8]">AI Suggestions</span>
              <span className="text-[11px] text-muted-foreground">
                — tap to use, edit before sending
              </span>
            </div>
            <button
              onClick={dismiss}
              className="text-[12px] text-muted-foreground hover:text-foreground transition-colors px-[6px]"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-col gap-[6px]">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  onSelect(s);
                  dismiss();
                }}
                className="group w-full text-left rounded-[8px] border border-[#2e80c8]/25 bg-card px-[14px] py-[10px] text-[13px] text-foreground hover:border-[#2e80c8] hover:bg-[#2e80c8]/10 transition-all"
              >
                <span className="mr-[8px] text-[11px] font-bold text-[#2e80c8]/70 group-hover:text-[#2e80c8]">
                  {i + 1}
                </span>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
