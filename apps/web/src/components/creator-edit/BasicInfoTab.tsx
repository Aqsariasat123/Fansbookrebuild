import { useState } from 'react';
import {
  api,
  extractError,
  inputClass,
  selectClass,
  labelClass,
  saveButtonClass,
  TIMEZONES,
} from './shared';

interface BasicInfoTabProps {
  onToast: (type: 'success' | 'error', message: string) => void;
}

export function BasicInfoTab({ onToast }: BasicInfoTabProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [location, setLocation] = useState('');
  const [profileType, setProfileType] = useState('Standard');
  const [timezone, setTimezone] = useState('America/New_York');
  const [aboutMe, setAboutMe] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await api.put('/creator/profile/basic', {
        firstName,
        lastName,
        location,
        profileType,
        timezone,
        aboutMe,
      });
      onToast('success', 'Basic info updated successfully');
    } catch (err) {
      onToast('error', extractError(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-[20px] max-w-[600px]">
      <div className="flex flex-col gap-[8px]">
        <label className={labelClass}>First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter first name"
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-[8px]">
        <label className={labelClass}>Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Enter last name"
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-[8px]">
        <label className={labelClass}>Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Los Angeles, CA"
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-[8px]">
        <label className={labelClass}>Profile Type</label>
        <select
          value={profileType}
          onChange={(e) => setProfileType(e.target.value)}
          className={selectClass}
        >
          <option value="Standard">Standard</option>
          <option value="Premium">Premium</option>
          <option value="VIP">VIP</option>
        </select>
      </div>
      <div className="flex flex-col gap-[8px]">
        <label className={labelClass}>Timezone</label>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className={selectClass}
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-[8px]">
        <label className={labelClass}>About Me</label>
        <textarea
          value={aboutMe}
          onChange={(e) => setAboutMe(e.target.value)}
          placeholder="Tell fans about yourself..."
          rows={5}
          className="w-full rounded-[6px] border border-[#5d5d5d] bg-transparent px-[12px] py-[12px] text-[14px] font-light text-[#f8f8f8] outline-none transition-colors focus:border-[#2e80c8] resize-none"
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
