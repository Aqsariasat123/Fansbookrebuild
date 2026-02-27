import { useState } from 'react';
import { api, extractError, saveButtonClass, COUNTRIES_LIST } from './shared';

interface CountryBlockTabProps {
  onToast: (type: 'success' | 'error', message: string) => void;
}

export function CountryBlockTab({ onToast }: CountryBlockTabProps) {
  const [blockedCountries, setBlockedCountries] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  function toggleCountry(country: string) {
    setBlockedCountries((prev) =>
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country],
    );
  }

  async function handleSave() {
    setSaving(true);
    try {
      await api.put('/creator/profile/blocked-countries', {
        countries: blockedCountries,
      });
      onToast('success', 'Blocked countries updated successfully');
    } catch (err) {
      onToast('error', extractError(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-[20px] max-w-[600px]">
      <p className="text-[14px] text-[#5d5d5d]">
        Block your profile from being visible in specific countries.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-[12px]">
        {COUNTRIES_LIST.map((country) => {
          const checked = blockedCountries.includes(country);
          return (
            <label key={country} className="flex items-center gap-[10px] cursor-pointer group">
              <div
                onClick={() => toggleCountry(country)}
                className={`w-[20px] h-[20px] rounded-[4px] border flex items-center justify-center transition-colors shrink-0 ${
                  checked
                    ? 'bg-gradient-to-r from-[#a61651] to-[#8b32c7] border-transparent'
                    : 'border-[#5d5d5d] group-hover:border-[#f8f8f8]'
                }`}
              >
                {checked && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6L5 9L10 3"
                      stroke="#f8f8f8"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span className="text-[14px] text-[#f8f8f8] group-hover:text-white transition-colors">
                {country}
              </span>
            </label>
          );
        })}
      </div>
      <div className="flex justify-center mt-[10px]">
        <button onClick={handleSave} disabled={saving} className={saveButtonClass}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}
