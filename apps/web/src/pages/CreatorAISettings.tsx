import { useState, useEffect } from 'react';
import {
  type AIConfig,
  type UsageStats,
  ToggleRow,
  UsageCard,
  ToneProfileCard,
  fetchAISettings,
  fetchUsage,
  saveAISettings,
  refreshToneProfile,
} from './CreatorAISettingsParts';

export default function CreatorAISettings() {
  const [config, setConfig] = useState<AIConfig>({
    suggestEnabled: true,
    polishEnabled: true,
    persona: '',
    toneProfile: null,
    greeting: '',
  });
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [saving, setSaving] = useState(false);
  const [refreshingTone, setRefreshingTone] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    fetchAISettings().then(setConfig);
    fetchUsage(currentMonth).then(setUsage);
  }, [currentMonth]);

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    setError('');
    try {
      const ok = await saveAISettings(config);
      if (ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleToneRefresh() {
    if (refreshingTone) return;
    setRefreshingTone(true);
    try {
      const profile = await refreshToneProfile();
      if (profile) {
        setConfig((c) => ({ ...c, toneProfile: profile }));
      } else {
        setError('Not enough message history (need at least 10 sent messages).');
        setTimeout(() => setError(''), 3000);
      }
    } catch {
      setError('Tone refresh failed. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setRefreshingTone(false);
    }
  }

  return (
    <div className="max-w-[600px] mx-auto px-[16px] py-[24px] md:py-[32px]">
      <div className="mb-[24px]">
        <h1 className="text-[20px] md:text-[24px] font-bold text-foreground">
          AI Writing Assistant
        </h1>
        <p className="text-[13px] text-muted-foreground mt-[4px]">
          AI-powered reply suggestions and message polish for your fan conversations.
        </p>
      </div>

      <UsageCard usage={usage} />

      <div className="bg-card border border-muted rounded-[12px] px-[16px] mb-[20px]">
        <ToggleRow
          label="Reply Suggestions"
          description="Show 3 AI-generated reply options below the message input in conversations."
          checked={config.suggestEnabled}
          onChange={(v) => setConfig((c) => ({ ...c, suggestEnabled: v }))}
        />
        <ToggleRow
          label="Polish Mode"
          description="Rewrite your rough message into a polished, engaging reply with one click."
          checked={config.polishEnabled}
          onChange={(v) => setConfig((c) => ({ ...c, polishEnabled: v }))}
        />
      </div>

      <div className="bg-card border border-muted rounded-[12px] p-[16px] mb-[20px]">
        <label className="block text-[14px] font-medium text-foreground mb-[6px]">
          Writing Style Hints
          <span className="ml-[6px] text-[12px] text-muted-foreground font-normal">(optional)</span>
        </label>
        <p className="text-[12px] text-muted-foreground mb-[10px]">
          Tell the AI how you want to sound. E.g. &quot;Friendly and playful, use emojis, keep
          replies short.&quot;
        </p>
        <textarea
          value={config.persona ?? ''}
          onChange={(e) => setConfig((c) => ({ ...c, persona: e.target.value }))}
          maxLength={500}
          rows={3}
          placeholder="Describe your tone and style..."
          className="w-full bg-muted rounded-[8px] px-[12px] py-[10px] text-[13px] text-foreground placeholder-muted-foreground outline-none resize-none"
        />
        <p className="text-[11px] text-muted-foreground text-right mt-[4px]">
          {(config.persona ?? '').length}/500
        </p>
      </div>

      <ToneProfileCard
        toneProfile={config.toneProfile}
        refreshingTone={refreshingTone}
        onRefresh={handleToneRefresh}
      />

      {error && <p className="text-[13px] text-red-500 mb-[12px]">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full rounded-[10px] bg-[#2e80c8] py-[12px] text-[14px] font-semibold text-white hover:opacity-90 disabled:opacity-60 transition-opacity"
      >
        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
      </button>
    </div>
  );
}
