import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import ur from './locales/ur.json';
import ar from './locales/ar.json';
import zh from './locales/zh.json';
import hi from './locales/hi.json';
import bn from './locales/bn.json';
import tr from './locales/tr.json';

const LANG_MAP: Record<string, string> = {
  English: 'en',
  Spanish: 'es',
  French: 'fr',
  German: 'de',
  Urdu: 'ur',
  Arabic: 'ar',
  Chinese: 'zh',
  Hindi: 'hi',
  Bangla: 'bn',
  Turkish: 'tr',
};

const saved = localStorage.getItem('fansbook_language') || 'English';
const lng = LANG_MAP[saved] || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },
    de: { translation: de },
    ur: { translation: ur },
    ar: { translation: ar },
    zh: { translation: zh },
    hi: { translation: hi },
    bn: { translation: bn },
    tr: { translation: tr },
  },
  lng,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export { LANG_MAP };
export default i18n;
