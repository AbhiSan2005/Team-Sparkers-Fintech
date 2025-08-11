export const detectLanguageFromInput = (input) => {
  // Simple heuristic stub — replace with real on-device LID
  const lower = input.toLowerCase();
  let locale = 'en';
  
  if (/[ऋअआइईउऊएऐओऔक-ह]/.test(input)) locale = 'hi';
  if (/[मराठी]/.test(input) || lower.includes('maharashtra')) locale = 'mr';
  if (/[ا-ے]/.test(input)) locale = 'ur';

  let confidence = 'medium';
  if (input.length > 10) confidence = 'high';
  if (input.length < 3) confidence = 'low';

  const RTL_LOCALES = ['ur'];

  return {
    locale,
    confidence,
    dominant: locale,
    bilingualNeeded: confidence !== 'high',
    rtl: RTL_LOCALES.includes(locale),
  };
};

export const hasLocaleContent = (locale) => {
  // Simulate missing content for certain locales
  return locale !== 'bn';
};

export const t = (locale, key) => {
  const dict = {
    en: {
      app_title: 'Smart Language Banking',
      banner_using: 'Using',
      change: 'Change',
      search_placeholder: 'Type to search or start',
      amount: 'Amount',
      date: 'Date',
      payee: 'Payee',
      transfer: 'Transfer',
      confirm_transfer: 'Confirm Transfer',
      confirm_desc: 'Please verify transfer details before confirming.',
      confirm: 'Confirm',
      cancel: 'Cancel',
      save_default: 'Set as default language?',
      not_now: 'Not now',
      lang_picker: 'Language',
      fallback_note: 'Some items shown in English.',
      request_translation: 'Request translation',
      switched_to: 'Switched to',
    },
    mr: {
      app_title: 'स्मार्ट भाषा बँकिंग',
      banner_using: 'वापरत आहे',
      change: 'बदला',
      search_placeholder: 'शोधा किंवा टाइप करायला सुरू करा',
      amount: 'रकम',
      date: 'तारीख',
      payee: 'प्राप्तकर्ता',
      transfer: 'ट्रान्स्फर',
      confirm_transfer: 'ट्रान्स्फरची पुष्टी',
      confirm_desc: 'कृपया ट्रान्स्फर तपशील तपासा.',
      confirm: 'पुष्टी करा',
      cancel: 'रद्द करा',
      save_default: 'ही भाषा डीफॉल्ट करायची?',
      not_now: 'आता नाही',
      lang_picker: 'भाषा',
      fallback_note: 'काही मजकूर इंग्रजीत.',
      request_translation: 'भाषांतर विनंती',
      switched_to: 'स्विच झाले',
    },
    hi: {
      app_title: 'स्मार्ट भाषा बैंकिंग',
      banner_using: 'उपयोग हो रही है',
      change: 'बदलें',
      search_placeholder: 'खोजें या टाइप करें',
      amount: 'राशि',
      date: 'तारीख',
      payee: 'प्राप्तकर्ता',
      transfer: 'ट्रांसफर',
      confirm_transfer: 'ट्रांसफर की पुष्टि',
      confirm_desc: 'कृपया विवरण जांचें।',
      confirm: 'पुष्टि करें',
      cancel: 'रद्द करें',
      save_default: 'डिफ़ॉल्ट भाषा बनाएं?',
      not_now: 'अभी नहीं',
      lang_picker: 'भाषा',
      fallback_note: 'कुछ सामग्री अंग्रेज़ी में।',
      request_translation: 'अनुवाद का अनुरोध',
      switched_to: 'स्विच किया गया',
    },
    bn: {}, ta: {}, te: {}, ur: {}
  };
  
  return dict[locale]?.[key] ?? dict['en']?.[key] ?? key;
};

export const LOCALES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'ur', label: 'Urdu', native: 'اردو' },
];
