import { useState } from 'react';
import {
  api,
  extractError,
  inputClass,
  selectClass,
  labelClass,
  saveButtonClass,
  cancelButtonClass,
} from './shared';

interface StatsTabProps {
  onToast: (type: 'success' | 'error', message: string) => void;
}

const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Arabic',
  'Urdu',
  'Hindi',
  'Chinese',
  'Turkish',
  'Bangla',
];
const AGES = Array.from({ length: 63 }, (_, i) => `${i + 18}`);
const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
const REGIONS = [
  'North America',
  'South America',
  'Europe',
  'Asia',
  'Africa',
  'Oceania',
  'Middle East',
];

export function StatsTab({ onToast }: StatsTabProps) {
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [language, setLanguage] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [region, setRegion] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await api.put('/creator/profile/stats', { dateOfBirth, language, age, gender, region });
      onToast('success', 'Stats updated successfully');
    } catch (err) {
      onToast('error', extractError(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex flex-col gap-[10px]">
        <label className={labelClass}>Date Of Birth</label>
        <input
          type="text"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          placeholder="DD / MM / YYYY"
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-[10px]">
        <label className={labelClass}>Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className={selectClass}
        >
          <option value="">Select Language</option>
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-[10px]">
        <label className={labelClass}>Age</label>
        <select value={age} onChange={(e) => setAge(e.target.value)} className={selectClass}>
          <option value="">Select Age</option>
          {AGES.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-[10px]">
        <label className={labelClass}>Gender</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)} className={selectClass}>
          <option value="">Select Gender</option>
          {GENDERS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-[10px]">
        <label className={labelClass}>Region</label>
        <select value={region} onChange={(e) => setRegion(e.target.value)} className={selectClass}>
          <option value="">Select Region</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
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
