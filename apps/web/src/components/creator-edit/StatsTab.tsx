import { useState } from 'react';
import { api, extractError, inputClass, selectClass, labelClass, saveButtonClass } from './shared';

interface StatsTabProps {
  onToast: (type: 'success' | 'error', message: string) => void;
}

export function StatsTab({ onToast }: StatsTabProps) {
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [region, setRegion] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await api.put('/creator/profile/stats', {
        dateOfBirth,
        gender,
        region,
      });
      onToast('success', 'Stats updated successfully');
    } catch (err) {
      onToast('error', extractError(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-[20px] max-w-[600px]">
      <div className="flex flex-col gap-[8px]">
        <label className={labelClass}>Date of Birth</label>
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-[8px]">
        <label className={labelClass}>Gender</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)} className={selectClass}>
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Non-binary">Non-binary</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      </div>
      <div className="flex flex-col gap-[8px]">
        <label className={labelClass}>Region</label>
        <input
          type="text"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder="e.g. North America"
          className={inputClass}
        />
      </div>
      <div className="flex justify-center mt-[10px]">
        <button onClick={handleSave} disabled={saving} className={saveButtonClass}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}
