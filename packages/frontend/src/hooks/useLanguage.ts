'use client';

import { useStore } from '../lib/store';
import { translations } from '../lib/translations';

export function useLanguage() {
  const { lang, setLang } = useStore();
  const t = translations[lang] || translations.en;

  const formatText = (enText: string, bnText?: string | null) => {
    if (lang === 'bn' && bnText) return bnText;
    return enText;
  };

  return { lang, setLang, t, formatText };
}
