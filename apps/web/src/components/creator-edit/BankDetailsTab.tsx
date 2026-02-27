import { useState } from 'react';
import {
  api,
  extractError,
  selectClass,
  labelClass,
  saveButtonClass,
  cancelButtonClass,
} from './shared';

interface BankDetailsTabProps {
  onToast: (type: 'success' | 'error', message: string) => void;
}

const BANK_COUNTRIES = [
  'United States',
  'United Kingdom',
  'Germany',
  'France',
  'Canada',
  'Australia',
  'Netherlands',
  'Spain',
  'Italy',
  'Sweden',
];

export function BankDetailsTab({ onToast }: BankDetailsTabProps) {
  const [bankCountry, setBankCountry] = useState('');
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
    <div className="flex flex-col gap-[20px]">
      <div className="flex flex-col gap-[10px]">
        <label className={labelClass}>Country</label>
        <select
          value={bankCountry}
          onChange={(e) => setBankCountry(e.target.value)}
          className={selectClass}
        >
          <option value="">Select Country</option>
          {BANK_COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-[20px] flex flex-col items-center gap-[16px]">
        <button onClick={handleSave} disabled={saving} className={saveButtonClass}>
          {saving ? 'Saving...' : 'Update'}
        </button>
        <button className={cancelButtonClass}>Cancel</button>
      </div>
    </div>
  );
}
