import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LANG_MAP } from '../i18n';
import { api } from '../lib/api';

const STORAGE_KEY = 'fansbook_language';

const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Urdu',
  'Arabic',
  'Chinese',
  'Hindi',
  'Turkish',
  'Bangla',
] as const;

function RadioChecked() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#f8f8f8" strokeWidth="2" />
      <circle cx="12" cy="12" r="6" fill="#f8f8f8" />
    </svg>
  );
}

function RadioUnchecked() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#15191c" strokeWidth="2" />
    </svg>
  );
}

export default function Language() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>('English');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (LANGUAGES as readonly string[]).includes(stored)) {
      setSelected(stored);
    }
  }, []);

  function handleClose() {
    navigate(-1);
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }

  const { i18n } = useTranslation();

  async function handleSave() {
    localStorage.setItem(STORAGE_KEY, selected);
    const code = LANG_MAP[selected] || 'en';
    i18n.changeLanguage(code);
    try {
      await api.put('/profile', { language: selected });
    } catch {
      // best effort, ignore errors
    }
    handleClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black/12 backdrop-blur-[3.4px] z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div className="mx-[16px] w-full max-w-[580px] rounded-[22px] bg-[#f8f8f8] p-[20px] shadow-[0px_13px_142.4px_0px_rgba(0,0,0,0.25)] md:mx-0 md:p-[30px]">
        <h2 className="text-[20px] text-[#15191c]">Languages</h2>

        <p className="mt-[20px] mb-[16px] text-[16px] text-[#5d5d5d]">Select Language</p>

        <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2 md:gap-[16px]">
          {LANGUAGES.map((lang) => {
            const isSelected = selected === lang;
            return (
              <button
                key={lang}
                type="button"
                onClick={() => setSelected(lang)}
                className={`flex items-center justify-between px-[10px] py-[12px] rounded-[8px] cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#01adf1] text-[#f8f8f8]'
                    : 'border border-[#15191c] text-[#15191c]'
                }`}
              >
                <span className="text-[16px]">{lang}</span>
                {isSelected ? <RadioChecked /> : <RadioUnchecked />}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center mt-[24px]">
          <button
            type="button"
            onClick={handleSave}
            className="bg-gradient-to-r from-[#01adf1] to-[#a61651] rounded-[80px] h-[45px] w-[306px] text-[20px] text-[#f8f8f8] cursor-pointer shadow-lg"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
