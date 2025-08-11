import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const TranslationContext = createContext();

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

export const TranslationProvider = ({ children }) => {
  // Initialize state with session storage values
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    try {
      return sessionStorage.getItem('selectedLanguageCode') || 'en';
    } catch (error) {
      console.warn('Could not access sessionStorage for language code:', error);
      return 'en';
    }
  });

  const [currentLanguageName, setCurrentLanguageName] = useState(() => {
    try {
      return sessionStorage.getItem('selectedLanguage') || 'English';
    } catch (error) {
      console.warn('Could not access sessionStorage for language name:', error);
      return 'English';
    }
  });

  const [translations, setTranslations] = useState(() => {
    try {
      const savedTranslations = sessionStorage.getItem('translations');
      return savedTranslations ? JSON.parse(savedTranslations) : {};
    } catch (error) {
      console.warn('Could not access sessionStorage for translations:', error);
      return {};
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [updateKey, setUpdateKey] = useState(0);

  // Save to session storage whenever state changes
  useEffect(() => {
    try {
      sessionStorage.setItem('selectedLanguageCode', currentLanguage);
    } catch (error) {
      console.warn('Could not save language code to sessionStorage:', error);
    }
  }, [currentLanguage]);

  useEffect(() => {
    try {
      sessionStorage.setItem('selectedLanguage', currentLanguageName);
    } catch (error) {
      console.warn('Could not save language name to sessionStorage:', error);
    }
  }, [currentLanguageName]);

  useEffect(() => {
    try {
      sessionStorage.setItem('translations', JSON.stringify(translations));
    } catch (error) {
      console.warn('Could not save translations to sessionStorage:', error);
    }
  }, [translations]);

  const translateText = useCallback(async (text, targetLang = currentLanguage) => {
    if (!text?.trim() || targetLang === 'en') return text;
    
    const cacheKey = `${text}_${targetLang}`;
    
    if (translations[cacheKey]) {
      return translations[cacheKey];
    }

    const lingvaInstances = [
      'https://lingva.ml/api/v1',
      'https://translate.plausibility.cloud/api/v1',
      'https://lingva.thedaviddelta.com/api/v1'
    ];

    for (const baseUrl of lingvaInstances) {
      try {
        const response = await fetch(
          `${baseUrl}/en/${targetLang}/${encodeURIComponent(text.trim())}`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            }
          }
        );

        if (!response.ok) continue;

        const result = await response.json();
        const translatedText = result.translation || text;
        
        setTranslations(prev => ({
          ...prev,
          [cacheKey]: translatedText
        }));
        
        return translatedText;
      } catch (error) {
        console.warn(`Lingva instance ${baseUrl} failed:`, error);
        continue;
      }
    }

    // Fallback to MyMemory API if all Lingva instances fail
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
      );

      if (response.ok) {
        const result = await response.json();
        const translatedText = result.responseData.translatedText || text;
        
        setTranslations(prev => ({
          ...prev,
          [cacheKey]: translatedText
        }));
        
        return translatedText;
      }
    } catch (error) {
      console.warn('MyMemory fallback failed:', error);
    }

    console.error('All translation services failed');
    return text;
  }, [currentLanguage, translations]);

  const translateBatch = useCallback(async (textArray, targetLang = currentLanguage) => {
    if (targetLang === 'en') return textArray;
    
    setIsLoading(true);
    
    try {
      const batchSize = 5;
      const results = [];
      
      for (let i = 0; i < textArray.length; i += batchSize) {
        const batch = textArray.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map(text => translateText(text, targetLang))
        );
        results.push(...batchResults);
        
        if (i + batchSize < textArray.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      return results;
    } finally {
      setIsLoading(false);
    }
  }, [translateText, currentLanguage]);

  const changeLanguage = useCallback(async (languageCode, languageName) => {
    // Update state - this will trigger the useEffect hooks to save to sessionStorage
    setCurrentLanguage(languageCode);
    setCurrentLanguageName(languageName);
    
    // Force all components to re-render
    setUpdateKey(prev => prev + 1);
    
    // Force immediate sessionStorage update for reliability
    try {
      sessionStorage.setItem('selectedLanguageCode', languageCode);
      sessionStorage.setItem('selectedLanguage', languageName);
    } catch (error) {
      console.warn('Could not immediately save to sessionStorage:', error);
    }
  }, []);

  const t = useCallback((text, options = {}) => {
    if (!text) return '';
    
    const { 
      language = currentLanguage, 
      fallback = text,
      variables = {} 
    } = options;
    
    if (language === 'en') return text;
    
    const cacheKey = `${text}_${language}`;
    let translatedText = translations[cacheKey] || fallback;
    
    Object.entries(variables).forEach(([key, value]) => {
      translatedText = translatedText.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    
    return translatedText;
  }, [currentLanguage, translations]);

  const preloadTranslations = useCallback(async (textArray, targetLang = currentLanguage) => {
    if (targetLang === 'en') return;
    
    const untranslatedTexts = textArray.filter(text => {
      const cacheKey = `${text}_${targetLang}`;
      return !translations[cacheKey];
    });
    
    if (untranslatedTexts.length > 0) {
      await translateBatch(untranslatedTexts, targetLang);
    }
  }, [translateBatch, translations, currentLanguage]);

  const getCurrentLanguageInfo = useCallback(() => {
    const languages = [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
      { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
      { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
      { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
      { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
      { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' }
    ];
    
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  }, [currentLanguage]);

  const value = {
    currentLanguage,
    currentLanguageName,
    changeLanguage,
    t,
    translateText,
    translateBatch,
    preloadTranslations,
    isLoading,
    translations,
    getCurrentLanguageInfo,
    updateKey
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const T = ({ children, variables = {}, fallback, ...props }) => {
  const { t } = useTranslation();
  
  if (typeof children !== 'string') {
    console.warn('T component expects a string child');
    return children;
  }
  
  const translatedText = t(children, { variables, fallback });
  
  return <span {...props}>{translatedText}</span>;
};

export const LanguageSelector = ({ className = '', showLoading = true }) => {
  const { currentLanguage, changeLanguage, isLoading, t, getCurrentLanguageInfo } = useTranslation();
  
  const defaultLanguages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'ta', name: 'Tamil', nativeName: 'தমিল' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' }
  ];
  
  const handleLanguageChange = (e) => {
    const selected = defaultLanguages.find(lang => lang.code === e.target.value);
    if (selected) {
      changeLanguage(selected.code, selected.name);
    }
  };
  
  const currentLangInfo = getCurrentLanguageInfo();
  
  return (
    <div className={`language-selector ${className}`}>
      <select 
        value={currentLanguage} 
        onChange={handleLanguageChange}
        disabled={isLoading}
        className="language-select px-3 py-2 border rounded-lg"
      >
        {defaultLanguages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName}
          </option>
        ))}
      </select>
      {showLoading && isLoading && (
        <span className="loading-indicator ml-2">
          <T>Translating...</T>
        </span>
      )}
    </div>
  );
};

export default TranslationProvider;
