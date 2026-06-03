'use client';

import { createContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { getTranslations, type Locale } from '@/lib/i18n';

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string | string[];
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const langParam = searchParams.get('lang');
  const initialLocale: Locale = langParam === 'en' ? 'en' : 'de';

  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  // Sync locale when URL param changes externally
  useEffect(() => {
    const newLocale: Locale = langParam === 'en' ? 'en' : 'de';
    setLocaleState(newLocale);
  }, [langParam]);

  // Update <html lang="..."> attribute
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback(
    (newLocale: Locale) => {
      setLocaleState(newLocale);
      const params = new URLSearchParams(searchParams.toString());
      params.set('lang', newLocale);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname],
  );

  const t = useCallback(
    (key: string): string | string[] => {
      const translations = getTranslations(locale);
      return translations[key] ?? key;
    },
    [locale],
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
