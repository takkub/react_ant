'use client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../public/locales/en/common.json';
import th from '../public/locales/th/common.json';

// ป้องกันการ initialize ซ้ำซ้อน
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { common: en },
      th: { common: th },
    },
    lng: 'th',
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    // ป้องกันการแจ้งเตือนในเบราว์เซอร์
    react: {
      useSuspense: false
    }
  });
}

export default i18n;
