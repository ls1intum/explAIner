import en from './en';
import de from './de';
import type { Translations, Locale } from './types';

export type { Translations, Locale };

const dictionaries: Record<Locale, Translations> = { en, de };

export function getTranslations(locale: Locale): Translations {
  return dictionaries[locale];
}

export function getRandomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)];
}
