'use client';

import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
      className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      title="Switch Language / ভাষা পরিবর্তন করুন"
    >
      <span className={lang === 'en' ? 'text-primary-600 dark:text-primary-400 font-extrabold' : 'text-gray-400'}>
        EN
      </span>
      <span className="text-gray-300 dark:text-gray-600">/</span>
      <span className={lang === 'bn' ? 'text-primary-600 dark:text-primary-400 font-extrabold' : 'text-gray-400'}>
        বাং
      </span>
    </button>
  );
}
