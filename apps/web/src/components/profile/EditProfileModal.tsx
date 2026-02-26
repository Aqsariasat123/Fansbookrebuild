import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { api } from '../../lib/api';
import { Modal, Field, parseApiError, trimOrUndefined } from './Modal';

export function EditProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      const payload = {
        displayName: trimOrUndefined(displayName),
        bio: trimOrUndefined(bio),
        location: trimOrUndefined(location),
        website: trimOrUndefined(website),
      };
      const { data: res } = await api.put('/profile', payload);
      setUser({ ...user!, ...res.data });
      onClose();
    } catch (err: unknown) {
      setError(parseApiError(err, 'Failed to update profile'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit Profile">
      <div className="flex flex-col gap-[16px]">
        <Field
          label="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your display name"
          maxLength={50}
        />
        <div className="flex flex-col gap-[8px]">
          <label className="text-[14px] text-[#5d5d5d]">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself"
            maxLength={1000}
            rows={3}
            className="rounded-[12px] bg-[#15191c] px-[16px] py-[12px] text-[16px] text-[#f8f8f8] outline-none border border-[#2a2d30] focus:border-[#2e80c8] transition-colors resize-none"
          />
        </div>
        <Field
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City, Country"
          maxLength={100}
        />
        <Field
          label="Website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://example.com"
          maxLength={200}
        />
        {error && <p className="text-[14px] text-red-500">{error}</p>}
        <div className="flex gap-[12px] mt-[8px]">
          <button
            onClick={onClose}
            className="flex-1 h-[44px] rounded-[12px] border border-[#2a2d30] text-[16px] text-[#5d5d5d] hover:text-[#f8f8f8] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 h-[44px] rounded-[12px] bg-[#2e4882] text-[16px] text-[#f8f8f8] hover:bg-[#3a5a9e] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
