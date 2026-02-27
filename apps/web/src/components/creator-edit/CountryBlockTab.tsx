import { useState } from 'react';
import {
  api,
  extractError,
  selectClass,
  saveButtonClass,
  cancelButtonClass,
  COUNTRIES_LIST,
} from './shared';

interface CountryBlockTabProps {
  onToast: (type: 'success' | 'error', message: string) => void;
}

export function CountryBlockTab({ onToast }: CountryBlockTabProps) {
  const [blockedCountries, setBlockedCountries] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await api.put('/creator/profile/blocked-countries', { countries: blockedCountries });
      onToast('success', 'Blocked countries updated successfully');
    } catch (err) {
      onToast('error', extractError(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex items-center justify-between">
        <p className="text-[16px] text-[#5d5d5d]">Select Block Country</p>
        <div className="flex min-w-[200px] items-center justify-center rounded-[6px] border border-[#5d5d5d] px-[20px] py-[10px]">
          <span className="text-[16px] text-[#f8f8f8]">
            {blockedCountries.length > 0 ? blockedCountries.join(', ') : 'None Selected'}
          </span>
        </div>
      </div>
      <select
        multiple
        value={blockedCountries}
        onChange={(e) => setBlockedCountries(Array.from(e.target.selectedOptions, (o) => o.value))}
        className={`${selectClass} h-auto min-h-[120px] py-[8px]`}
      >
        {COUNTRIES_LIST.map((c) => (
          <option key={c} value={c} className="py-[6px] px-[12px]">
            {c}
          </option>
        ))}
      </select>
      <div className="mt-[20px] flex flex-col items-center gap-[16px]">
        <button onClick={handleSave} disabled={saving} className={saveButtonClass}>
          {saving ? 'Saving...' : 'Update'}
        </button>
        <button className={cancelButtonClass}>Cancel</button>
      </div>
    </div>
  );
}
