import { useState, useEffect } from 'react';
import { api } from '../lib/api';

interface BotConfig {
  enabled: boolean;
  persona: string;
  greeting: string;
  explicitAllowed: boolean;
}

const DEFAULT: BotConfig = { enabled: false, persona: '', greeting: '', explicitAllowed: false };

function BotTestPanel() {
  const [testMsg, setTestMsg] = useState('');
  const [testReply, setTestReply] = useState('');
  const [testing, setTesting] = useState(false);
  const [testError, setTestError] = useState('');

  async function handleTest() {
    if (!testMsg.trim()) return;
    setTesting(true);
    setTestReply('');
    setTestError('');
    try {
      const r = await api.post('/creator/bot/test', { message: testMsg });
      if (r.data.success) setTestReply(r.data.data.reply);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setTestError(msg ?? 'Test failed. Check that bot is enabled and API key is configured.');
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="rounded-[14px] bg-card p-[18px] space-y-[12px]">
      <p className="font-outfit text-[15px] font-medium text-foreground">Test Your Bot</p>
      <div className="flex gap-[8px]">
        <input
          type="text"
          value={testMsg}
          onChange={(e) => setTestMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleTest()}
          placeholder="Type a fan message to test..."
          className="flex-1 rounded-[10px] bg-background p-[10px] font-outfit text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-[#01adf1]"
        />
        <button
          onClick={handleTest}
          disabled={testing || !testMsg.trim()}
          className="rounded-[10px] bg-gradient-to-r from-[#01adf1] to-[#a61651] px-[18px] py-[10px] font-outfit text-[13px] text-white disabled:opacity-50"
        >
          {testing ? '...' : 'Send'}
        </button>
      </div>
      {testReply && (
        <div className="rounded-[10px] border border-border bg-background p-[12px]">
          <p className="mb-[4px] text-[11px] font-medium text-[#01adf1]">Bot Reply:</p>
          <p className="font-outfit text-[13px] text-foreground">{testReply}</p>
        </div>
      )}
      {testError && <p className="text-[12px] text-red-400">{testError}</p>}
    </div>
  );
}

export default function CreatorBotSettings() {
  const [config, setConfig] = useState<BotConfig>(DEFAULT);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/creator/bot').then((r) => {
      if (r.data.success) setConfig({ ...DEFAULT, ...r.data.data });
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await api.post('/creator/bot', config);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-[680px] space-y-[24px] p-[20px]">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-semibold text-foreground">AI Chatbot</h1>
        <p className="mt-[4px] text-[13px] text-muted-foreground">
          Your AI chatbot replies to fans automatically when you're away — in your voice.
        </p>
      </div>

      {/* Enable toggle */}
      <div className="flex items-center justify-between rounded-[14px] bg-card p-[18px]">
        <div>
          <p className="font-outfit text-[15px] font-medium text-foreground">Enable AI Chatbot</p>
          <p className="text-[12px] text-muted-foreground">
            Bot will reply to fan messages automatically
          </p>
        </div>
        <button
          onClick={() => setConfig((c) => ({ ...c, enabled: !c.enabled }))}
          className={`relative h-[28px] w-[52px] rounded-full transition-colors ${config.enabled ? 'bg-gradient-to-r from-[#01adf1] to-[#a61651]' : 'bg-muted'}`}
        >
          <span
            className={`absolute top-[3px] h-[22px] w-[22px] rounded-full bg-white shadow transition-transform ${config.enabled ? 'translate-x-[26px]' : 'translate-x-[3px]'}`}
          />
        </button>
      </div>

      {/* Persona */}
      <div className="rounded-[14px] bg-card p-[18px] space-y-[10px]">
        <div>
          <p className="font-outfit text-[15px] font-medium text-foreground">Your Persona</p>
          <p className="text-[12px] text-muted-foreground">
            Describe your personality, tone, and how you talk to fans. The bot will mimic this.
          </p>
        </div>
        <textarea
          value={config.persona}
          onChange={(e) => setConfig((c) => ({ ...c, persona: e.target.value }))}
          placeholder="e.g. I'm Sophia, a fun and flirty creator who loves connecting with fans. I use casual language, lots of emojis, and always make fans feel special. I'm confident and playful..."
          rows={5}
          maxLength={2000}
          className="w-full resize-none rounded-[10px] bg-background p-[12px] font-outfit text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-[#01adf1]"
        />
        <p className="text-right text-[11px] text-muted-foreground">{config.persona.length}/2000</p>
      </div>

      {/* Greeting */}
      <div className="rounded-[14px] bg-card p-[18px] space-y-[10px]">
        <div>
          <p className="font-outfit text-[15px] font-medium text-foreground">
            Opening Greeting <span className="text-[11px] text-muted-foreground">(optional)</span>
          </p>
          <p className="text-[12px] text-muted-foreground">
            Auto-sent when a fan messages you for the first time.
          </p>
        </div>
        <input
          type="text"
          value={config.greeting}
          onChange={(e) => setConfig((c) => ({ ...c, greeting: e.target.value }))}
          placeholder="Hey babe! So happy you messaged me 🥰 What's on your mind?"
          maxLength={500}
          className="w-full rounded-[10px] bg-background p-[12px] font-outfit text-[13px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-[#01adf1]"
        />
      </div>

      {/* Explicit toggle */}
      <div className="flex items-center justify-between rounded-[14px] bg-card p-[18px]">
        <div>
          <p className="font-outfit text-[15px] font-medium text-foreground">
            Allow Explicit Content
          </p>
          <p className="text-[12px] text-muted-foreground">
            Bot will engage with adult content from fans. Keep off for general audiences.
          </p>
        </div>
        <button
          onClick={() => setConfig((c) => ({ ...c, explicitAllowed: !c.explicitAllowed }))}
          className={`relative h-[28px] w-[52px] rounded-full transition-colors ${config.explicitAllowed ? 'bg-[#a61651]' : 'bg-muted'}`}
        >
          <span
            className={`absolute top-[3px] h-[22px] w-[22px] rounded-full bg-white shadow transition-transform ${config.explicitAllowed ? 'translate-x-[26px]' : 'translate-x-[3px]'}`}
          />
        </button>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full rounded-[10px] bg-gradient-to-r from-[#01adf1] to-[#a61651] py-[13px] font-outfit text-[15px] font-medium text-white disabled:opacity-60"
      >
        {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Settings'}
      </button>

      <BotTestPanel />
    </div>
  );
}
