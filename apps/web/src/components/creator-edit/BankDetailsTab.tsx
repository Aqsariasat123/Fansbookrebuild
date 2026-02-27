import { useState } from 'react';
import { api, extractError, selectClass, labelClass, saveButtonClass } from './shared';

interface BankDetailsTabProps {
  onToast: (type: 'success' | 'error', message: string) => void;
}

export function BankDetailsTab({ onToast }: BankDetailsTabProps) {
  const [bankCountry, setBankCountry] = useState('US');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await api.put('/creator/profile/bank', { bankCountry });
      onToast('success', 'Bank details updated successfully');
    } catch (err) {
      onToast('error', extractError(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-[20px] max-w-[600px]">
      <div className="flex flex-col gap-[8px]">
        <label className={labelClass}>Bank Country</label>
        <select
          value={bankCountry}
          onChange={(e) => setBankCountry(e.target.value)}
          className={selectClass}
        >
          <option value="US">United States</option>
          <option value="UK">United Kingdom</option>
          <option value="EU">European Union</option>
          <option value="CA">Canada</option>
          <option value="AU">Australia</option>
        </select>
      </div>
      <div className="rounded-[12px] border border-[#5d5d5d]/30 bg-[#15191c] px-[20px] py-[16px]">
        <p className="text-[14px] text-[#5d5d5d]">
          Bank integration coming soon. You will be able to connect your bank account for payouts
          once this feature is live.
        </p>
      </div>
      <div className="flex justify-center mt-[10px]">
        <button onClick={handleSave} disabled={saving} className={saveButtonClass}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}
