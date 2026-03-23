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
    <div className="px-[10px] pb-[6px] md:px-[17px]">
      {/* Toolbar row */}
      <div className="flex items-center gap-[8px]">
        {/* Suggest button */}
        <button
          onClick={fetchSuggestions}
          disabled={state === 'loading' || state === 'polishing'}
          title="AI reply suggestions"
          className="flex items-center gap-[5px] rounded-[20px] bg-[#2e80c8]/10 px-[10px] py-[4px] text-[12px] text-[#2e80c8] hover:bg-[#2e80c8]/20 disabled:opacity-50 transition-colors"
        >
          {state === 'loading' ? (
            <span className="size-[13px] animate-spin rounded-full border-2 border-[#2e80c8] border-t-transparent inline-block" />
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
            </svg>
          )}
          Suggest
        </button>

        {/* Polish button — only show when there's text in input */}
        {currentText.trim().length > 0 && (
          <button
            onClick={handlePolish}
            disabled={state === 'polishing'}
            title="Polish this message with AI"
            className="flex items-center gap-[5px] rounded-[20px] bg-purple-500/10 px-[10px] py-[4px] text-[12px] text-purple-500 hover:bg-purple-500/20 disabled:opacity-50 transition-colors"
          >
            {state === 'polishing' ? (
              <span className="size-[13px] animate-spin rounded-full border-2 border-purple-500 border-t-transparent inline-block" />
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.5 5.6L10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8L17 14l1.4 2.5L17 19l2.5-1.4L22 19l-1.4-2.5L22 14zM22 2l-2.5 1.4L17 2l1.4 2.5L17 7l2.5-1.4L22 7l-1.4-2.5zm-7.63 5.29a1 1 0 00-1.41 0L1.29 18.96a1 1 0 000 1.41l2.34 2.34a1 1 0 001.41 0L16.7 11.05a1 1 0 000-1.41l-2.33-2.35z" />
              </svg>
            )}
            Polish
          </button>
        )}
      </div>

      {/* Suggestion pills */}
      {state === 'showing' && suggestions.length > 0 && (
        <div className="mt-[8px] flex flex-col gap-[6px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">
              Tap to use, edit before sending
            </span>
            <button
              onClick={dismiss}
              className="text-[11px] text-muted-foreground hover:text-foreground"
            >
              Dismiss
            </button>
          </div>
          <div className="flex flex-col gap-[4px]">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  onSelect(s);
                  dismiss();
                }}
                className="w-full text-left rounded-[8px] bg-muted px-[12px] py-[8px] text-[13px] text-foreground hover:bg-muted/80 transition-colors truncate"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
