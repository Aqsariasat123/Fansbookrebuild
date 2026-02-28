import { useState } from 'react';
import { api, extractError, saveButtonClass } from './shared';

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
    <div className="flex flex-col items-center gap-[24px] py-[40px]">
      <p className="text-[18px] text-muted-foreground">
        You Can Deactive Account By Clicking Below Button
      </p>
      <button onClick={handleDeactivate} disabled={saving} className={saveButtonClass}>
        {saving ? 'Processing...' : 'Deactivate Account'}
      </button>
    </div>
  );
}
