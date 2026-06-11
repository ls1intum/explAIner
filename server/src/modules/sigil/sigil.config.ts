import type { BloomsLevel } from '../../domain/schemas/enums.schema';

export type SigilGroupKey = 'explainer' | 'chat' | 'text';
export type SigilSectionKey = 'elements' | 'details' | 'all';
export type SigilLang = 'de' | 'en';

// Legacy mode key for backward compatibility with DB enum
export type SigilModeKey = 'elements' | 'details' | 'analysis' | 'chat';

interface SigilGroupConfig {
  hasPractice: boolean;
  hasChat: boolean;
}

interface SigilSectionConfig {
  sections: [number, number];
  bloomsLevel: BloomsLevel;
}

export const SIGIL_GROUP_CONFIG: Record<SigilGroupKey, SigilGroupConfig> = {
  explainer: { hasPractice: true,  hasChat: true },
  chat:      { hasPractice: false, hasChat: true },
  text:      { hasPractice: false, hasChat: false },
};

export const SIGIL_SECTION_CONFIG: Record<SigilSectionKey, SigilSectionConfig> = {
  elements: { sections: [1, 4], bloomsLevel: 'Understand' },
  details:  { sections: [5, 7], bloomsLevel: 'Understand' },
  all:      { sections: [1, 7], bloomsLevel: 'Analyze' },
};

export const SIGIL_TOPICS: Record<SigilLang, string> = {
  de: 'Aufbau eines Stadtsiegels',
  en: 'Building a City Sigil',
};

export const SIGIL_LEARNING_GOALS: Record<SigilSectionKey, Record<SigilLang, string>> = {
  elements: {
    de: 'Ich kann die Verwendung der äußeren Elemente eines Stadtsiegels (Bundeslandshintergrund, Bevölkerungsrahmen, Hauptstadtkrone, Orientierungskreis) erklären.',
    en: 'I can explain the use of the outer elements of a city sigil (State Background, Population Frame, Capital Crown, Orientation Disk).',
  },
  details: {
    de: 'Ich kann die Verwendung der inneren Informationselemente eines Stadtsiegels (Gründungsmittelpunkt, Kurzkennzeichen, Koordinatenrechteck) erklären.',
    en: 'I can explain the use of the inner information elements of a city sigil (Founding Center, Short Registration Plate, Coordinate Rectangle).',
  },
  all: {
    de: 'Ich kann Städte auf Basis eines unvollständigen Siegels identifizieren.',
    en: 'Based on an incomplete sigil I can assess which city a sigil belongs to.',
  },
};

export const SIGIL_OWLBERT_GREETING: Record<SigilLang, string> = {
  de: 'Lies diese Informationen und stell mir bei Bedarf gerne Fragen.',
  en: 'Read through this information and feel free to ask me any questions.',
};

// Reference knowledge given ONLY to Owlbert (chat), not shown in the learning
// material. Lets the assistant answer questions about the federal-state
// background colors correctly when a student asks, without putting the table
// into the displayed material (which would also reach the text-only group).
export const SIGIL_STATE_COLORS_REFERENCE: Record<SigilLang, string> = {
  de: `Referenzwissen – Farben der Bundeslandshintergründe (nutze dies, um Fragen korrekt zu beantworten):
| Bundesland | Farben (von oben nach unten) |
| --- | --- |
| Berlin | Rot – Weiß – Rot (rotes Band oben, weiße Mitte, rotes Band unten) |
| Hamburg | Weiß mit rotem Ring (weiße Kreisfläche, roter Rand) |
| Bayern | Weiß – Blau |
| Nordrhein-Westfalen | Grün – Weiß – Rot |
| Hessen | Rot – Weiß |
| Baden-Württemberg | Schwarz – Gelb |
| Sachsen | Weiß – Grün |
| Bremen | Rot – Weiß |
| Niedersachsen | Schwarz – Rot – Gold |`,
  en: `Reference knowledge – federal-state background colors (use this to answer questions correctly):
| Federal State | Colors (top to bottom) |
| --- | --- |
| Berlin | Red – White – Red (red band on top, white center, red band on bottom) |
| Hamburg | White with a red ring (white circle, red border) |
| Bavaria | White – Blue |
| North Rhine-Westphalia | Green – White – Red |
| Hesse | Red – White |
| Baden-Württemberg | Black – Yellow |
| Saxony | White – Green |
| Bremen | Red – White |
| Lower Saxony | Black – Red – Gold |`,
};

// Legacy compatibility: map group+section to old mode key for DB storage
export function toSigilModeEnum(group: SigilGroupKey, section: SigilSectionKey): string {
  if (group === 'chat') return 'Chat';
  if (group === 'text') return 'Text';
  // explainer group
  if (section === 'all') return 'Analysis';
  return section.charAt(0).toUpperCase() + section.slice(1); // 'Elements' | 'Details'
}

// Legacy: resolve config from old mode key stored in DB
export const SIGIL_MODE_CONFIG: Record<SigilModeKey, { sections: [number, number]; bloomsLevel: BloomsLevel | null; hasPractice: boolean }> = {
  elements: { sections: [1, 4], bloomsLevel: 'Understand', hasPractice: true },
  details:  { sections: [5, 7], bloomsLevel: 'Understand', hasPractice: true },
  analysis: { sections: [1, 7], bloomsLevel: 'Analyze',    hasPractice: true },
  chat:     { sections: [1, 7], bloomsLevel: null,          hasPractice: false },
};
