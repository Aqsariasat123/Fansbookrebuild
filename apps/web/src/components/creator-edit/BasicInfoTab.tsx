import { useState } from 'react';
import {
  api,
  extractError,
  inputClass,
  selectClass,
  textareaClass,
  labelClass,
  saveButtonClass,
  cancelButtonClass,
  TIMEZONES,
} from './shared';

interface BasicInfoTabProps {
  onToast: (type: 'success' | 'error', message: string) => void;
}

const PROFILE_TYPES = ['Standard', 'Premium', 'VIP'];

export function BasicInfoTab({ onToast }: BasicInfoTabProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [location, setLocation] = useState('');
  const [profileType, setProfileType] = useState('');
  const [email] = useState('info@fansbook.vip');
  const [timezone, setTimezone] = useState('');
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
    <div className="flex flex-col gap-[20px]">
      <Field label="First Name">
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Admin"
          className={inputClass}
        />
      </Field>

      <Field label="Last Name">
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Fanbook"
          className={inputClass}
        />
      </Field>

      <Field label="Location">
        <div className="relative">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter A Location"
            className={inputClass}
          />
          <svg
            className="absolute right-[12px] top-1/2 -translate-y-1/2 text-muted-foreground"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </div>
      </Field>

      <Field label="Profile Type">
        <select
          value={profileType}
          onChange={(e) => setProfileType(e.target.value)}
          className={selectClass}
        >
          <option value="">Choose Profile Type</option>
          {PROFILE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Email">
        <input
          type="email"
          value={email}
          readOnly
          className={`${inputClass} cursor-not-allowed opacity-60`}
        />
      </Field>

      <Field label="Time Zone">
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className={selectClass}
        >
          <option value="">Choose Time zone...</option>
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Tell Us About Yourself">
        <textarea
          value={aboutMe}
          onChange={(e) => setAboutMe(e.target.value)}
          placeholder="Enter About Yourself"
          rows={4}
          className={textareaClass}
        />
      </Field>

      {/* Documents Section */}
      <div className="mt-[10px] flex flex-col gap-[16px]">
        <DocRow label="Your Uploaded ID:" btnText="View Document" />
        <DocRow label="Your Uploaded Selfie:" btnText="Upload Document" />
        <DocRow label="Add Intro Videos:" btnText="Add" />
      </div>

      <Field label="">
        <input
          type="text"
          placeholder="Your Intro Videos"
          className={`${inputClass} border-0 border-b border-border rounded-none`}
        />
      </Field>

      {/* Action Buttons */}
      <div className="mt-[20px] flex flex-col items-center gap-[16px]">
        <button onClick={handleSave} disabled={saving} className={saveButtonClass}>
          {saving ? 'Saving...' : 'Update'}
        </button>
        <button className={cancelButtonClass}>Cancel</button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[10px]">
      {label && <label className={labelClass}>{label}</label>}
      {children}
    </div>
  );
}

function DocRow({ label, btnText }: { label: string; btnText: string }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-[20px] font-medium text-white">{label}</p>
      <button className="rounded-[6px] bg-foreground px-[19px] py-[8px] text-[20px] font-medium text-foreground hover:opacity-90 transition-opacity">
        {btnText}
      </button>
    </div>
  );
}
