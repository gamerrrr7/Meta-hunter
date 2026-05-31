import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { i18n, Language } from '../i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('cacador_metas_lang');
    if (saved === 'pt' || saved === 'en') return saved;
    return 'pt'; // default to Portuguese
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('cacador_metas_lang', lang);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const dict = i18n[language];
    // Find the translation string
    const text = (dict as Record<string, string>)[key] || key;

    if (!params) return text;

    // Replace placeholders like {months} or {amount}
    let result = text;
    Object.entries(params).forEach(([paramKey, value]) => {
      result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value));
    });
    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
