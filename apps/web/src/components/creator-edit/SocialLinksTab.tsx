import { useState } from 'react';
import {
  api,
  extractError,
  inputClass,
  selectClass,
  labelClass,
  saveButtonClass,
  SOCIAL_PLATFORMS,
} from './shared';
import type { SocialLink } from './shared';

interface SocialLinksTabProps {
  onToast: (type: 'success' | 'error', message: string) => void;
}

export function SocialLinksTab({ onToast }: SocialLinksTabProps) {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { platform: 'Instagram', url: '' },
  ]);
  const [saving, setSaving] = useState(false);

  function addLink() {
    setSocialLinks((prev) => [...prev, { platform: 'Instagram', url: '' }]);
  }

  function removeLink(index: number) {
    setSocialLinks((prev) => prev.filter((_, i) => i !== index));
  }

  function updateLink(index: number, field: 'platform' | 'url', value: string) {
    setSocialLinks((prev) =>
      prev.map((link, i) => (i === index ? { ...link, [field]: value } : link)),
    );
  }

  async function handleSave() {
    setSaving(true);
    try {
      await api.put('/creator/profile/social-links', {
        links: socialLinks.filter((l) => l.url.trim() !== ''),
      });
      onToast('success', 'Social links updated successfully');
    } catch (err) {
      onToast('error', extractError(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-[20px] max-w-[700px]">
      {socialLinks.map((link, index) => (
        <div key={index} className="flex items-end gap-[12px]">
          <div className="flex flex-col gap-[8px] w-[180px] shrink-0">
            {index === 0 && <label className={labelClass}>Platform</label>}
            <select
              value={link.platform}
              onChange={(e) => updateLink(index, 'platform', e.target.value)}
              className={selectClass}
            >
              {SOCIAL_PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-[8px] flex-1">
            {index === 0 && <label className={labelClass}>URL</label>}
            <input
              type="url"
              value={link.url}
              onChange={(e) => updateLink(index, 'url', e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </div>
          <button
            onClick={() => removeLink(index)}
            className="h-[46px] w-[46px] shrink-0 rounded-[6px] border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center text-[18px]"
            title="Remove link"
          >
            &times;
          </button>
        </div>
      ))}
      <button
        onClick={addLink}
        className="self-start px-[16px] py-[10px] rounded-[8px] border border-[#5d5d5d] text-[13px] text-[#f8f8f8] hover:border-[#2e80c8] transition-colors"
      >
        + Add Link
      </button>
      <div className="flex justify-center mt-[10px]">
        <button onClick={handleSave} disabled={saving} className={saveButtonClass}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}
