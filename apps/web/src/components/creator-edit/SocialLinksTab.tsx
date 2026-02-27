import { useState } from 'react';
import {
  api,
  extractError,
  inputClass,
  selectClass,
  saveButtonClass,
  cancelButtonClass,
  SOCIAL_PLATFORMS,
} from './shared';
import type { SocialLink } from './shared';

interface SocialLinksTabProps {
  onToast: (type: 'success' | 'error', message: string) => void;
}

export function SocialLinksTab({ onToast }: SocialLinksTabProps) {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
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
        links: socialLinks.filter((l) => l.url.trim()),
      });
      onToast('success', 'Social links updated successfully');
    } catch (err) {
      onToast('error', extractError(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-[20px]">
      {socialLinks.length === 0 ? (
        <div className="flex justify-center py-[30px]">
          <button
            onClick={addLink}
            className="w-full max-w-[500px] rounded-[8px] border border-[#5d5d5d] py-[14px] text-[16px] text-[#f8f8f8] hover:border-[#01adf1] transition-colors"
          >
            Add Social Profile Links
          </button>
        </div>
      ) : (
        <>
          {socialLinks.map((link, index) => (
            <div key={index} className="flex items-end gap-[12px]">
              <div className="flex w-[180px] shrink-0 flex-col gap-[10px]">
                {index === 0 && (
                  <label className="text-[20px] font-medium text-[#f8f8f8]">Platform</label>
                )}
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
              <div className="flex flex-1 flex-col gap-[10px]">
                {index === 0 && (
                  <label className="text-[20px] font-medium text-[#f8f8f8]">URL</label>
                )}
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
                className="flex size-[46px] shrink-0 items-center justify-center rounded-[6px] border border-red-500/40 text-[18px] text-red-400 hover:bg-red-500/10 transition-colors"
              >
                &times;
              </button>
            </div>
          ))}
          <button
            onClick={addLink}
            className="self-start rounded-[8px] border border-[#5d5d5d] px-[16px] py-[10px] text-[14px] text-[#f8f8f8] hover:border-[#01adf1] transition-colors"
          >
            + Add Link
          </button>
          <div className="mt-[20px] flex flex-col items-center gap-[16px]">
            <button onClick={handleSave} disabled={saving} className={saveButtonClass}>
              {saving ? 'Saving...' : 'Update'}
            </button>
            <button className={cancelButtonClass}>Cancel</button>
          </div>
        </>
      )}
    </div>
  );
}
