import type { BloomsLevel } from '../../domain/schemas/enums.schema';

export type SigilGroupKey = 'explainer' | 'chat' | 'text';
// The study runs a single learning round, so there is only one section.
export type SigilSectionKey = 'elements';
export type SigilLang = 'de' | 'en';

interface SigilGroupConfig {
  hasPractice: boolean;
  hasChat: boolean;
}

interface SigilSectionConfig {
  /** Material sections that are taught: practice and remediation are built from these only. */
  sections: [number, number];
  /** Material sections that are displayed: the taught ones plus the "further elements" note. */
  displaySections: [number, number];
  bloomsLevel: BloomsLevel;
}

export const SIGIL_GROUP_CONFIG: Record<SigilGroupKey, SigilGroupConfig> = {
  explainer: { hasPractice: true,  hasChat: true },
  chat:      { hasPractice: false, hasChat: true },
  text:      { hasPractice: false, hasChat: false },
};

export const SIGIL_SECTION_CONFIG: Record<SigilSectionKey, SigilSectionConfig> = {
  // Elements 1–5 are taught. Section 6 only names the Short Registration Plate
  // and Coordinate Rectangle (visible on the survey's sigil images) as out of scope.
  elements: { sections: [1, 5], displaySections: [1, 6], bloomsLevel: 'Understand' },
};

export const SIGIL_TOPICS: Record<SigilLang, string> = {
  de: 'Aufbau eines Stadtsiegels',
  en: 'Building a City Sigil',
};

export const SIGIL_LEARNING_GOALS: Record<SigilSectionKey, Record<SigilLang, string>> = {
  elements: {
    de: 'Ich kann die Verwendung der Elemente eines Stadtsiegels (Bundeslandshintergrund, Bevölkerungsrahmen, Hauptstadtkrone, Orientierungskreis, Gründungsmittelpunkt) erklären.',
    en: 'I can explain the use of the elements of a city sigil (State Background, Population Frame, Capital Crown, Orientation Disk, Founding Center).',
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

// Map group to the DB enum value. Explainer sessions are stored as 'Elements';
// the enum's 'Details' and 'Analysis' values only remain for sessions from the
// earlier three-round design.
export function toSigilModeEnum(group: SigilGroupKey): string {
  if (group === 'chat') return 'Chat';
  if (group === 'text') return 'Text';
  return 'Elements';
}

/** Maximum practice rounds for the explainer group: the initial one plus one remediation. */
export const SIGIL_MAX_PRACTICE_SEQUENCES = 2;
