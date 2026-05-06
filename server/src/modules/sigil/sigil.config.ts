import type { BloomsLevel } from '../../domain/schemas/enums.schema';

export type SigilModeKey = 'elements' | 'details' | 'analysis' | 'chat';
export type SigilLang = 'de' | 'en';

interface SigilModeConfig {
  sections: [number, number];
  bloomsLevel: BloomsLevel | null;
  hasPractice: boolean;
}

export const SIGIL_MODE_CONFIG: Record<SigilModeKey, SigilModeConfig> = {
  elements: { sections: [1, 4], bloomsLevel: 'Understand', hasPractice: true },
  details:  { sections: [5, 7], bloomsLevel: 'Understand', hasPractice: true },
  analysis: { sections: [1, 7], bloomsLevel: 'Analyze',    hasPractice: true },
  chat:     { sections: [1, 7], bloomsLevel: null,          hasPractice: false },
};

export const SIGIL_TOPICS: Record<SigilLang, string> = {
  de: 'Aufbau eines Stadtsiegels',
  en: 'Building a City Sigil',
};

export const SIGIL_LEARNING_GOALS: Record<SigilModeKey, Record<SigilLang, string>> = {
  elements: {
    de: 'Ich kann die äußeren Elemente eines Stadtsiegels (Bundeslandshintergrund, Bevölkerungsrahmen, Hauptstadtkrone, Orientierungskreis) verstehen und erklären.',
    en: 'I can understand and explain the outer elements of a city sigil (State Background, Population Frame, Capital Crown, Orientation Disk).',
  },
  details: {
    de: 'Ich kann die inneren Informationselemente eines Stadtsiegels (Gründungsmittelpunkt, Kurzkennzeichen, Koordinatenrechteck) verstehen und erklären.',
    en: 'I can understand and explain the inner information elements of a city sigil (Founding Center, Short Registration Plate, Coordinate Rectangle).',
  },
  analysis: {
    de: 'Ich kann alle sieben Elemente eines Stadtsiegels analysieren und beurteilen, ob sie korrekt zusammengesetzt sind.',
    en: 'I can analyze all seven elements of a city sigil and assess whether they are correctly assembled.',
  },
  chat: {
    de: 'Ich kann die Elemente eines Stadtsiegels verstehen.',
    en: 'I can understand the elements of a city sigil.',
  },
};

export const SIGIL_OWLBERT_GREETING: Record<SigilLang, string> = {
  de: 'Lies diese Informationen und stell mir bei Bedarf gerne Fragen.',
  en: 'Read through this information and feel free to ask me any questions.',
};
