import { useState } from 'react';
import { api, extractError } from './shared';

interface DeactivateTabProps {
  onToast: (type: 'success' | 'error', message: string) => void;
}

export function DeactivateTab({ onToast }: DeactivateTabProps) {
  const [saving, setSaving] = useState(false);

  async function handleDeactivate() {
    const confirmed = window.confirm(
      'Are you sure you want to deactivate your account? This will make all your content inaccessible.',
    );
    if (!confirmed) return;
    setSaving(true);
    try {
      await api.put('/creator/profile/deactivate');
      onToast('success', 'Account deactivated');
    } catch (err) {
      onToast('error', extractError(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-[24px] max-w-[600px]">
      <div className="rounded-[12px] border border-red-500/40 bg-red-500/10 px-[20px] py-[18px]">
        <p className="text-[14px] text-red-300 leading-[1.6]">
          Once you deactivate your account, all your content and data will become inaccessible. This
          action can be reversed by contacting support.
        </p>
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleDeactivate}
          disabled={saving}
          className="w-full max-w-[280px] h-[45px] rounded-[80px] bg-red-600 text-[16px] text-[#f8f8f8] hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Processing...' : 'Deactivate Account'}
        </button>
      </div>
    </div>
  );
}
