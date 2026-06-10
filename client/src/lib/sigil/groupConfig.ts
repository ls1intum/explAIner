/**
 * Client-side mirror of the server's sigil group configuration.
 *
 * Source of truth on the server: server/src/modules/sigil/sigil.config.ts
 * (SIGIL_GROUP_CONFIG). Keep these two in sync — they decide which features
 * each research-study group sees:
 *   - text      → reading material only
 *   - chat      → reading material + Owlbert chat
 *   - explainer → reading material + Owlbert chat + practice quiz
 */

export const VALID_SIGIL_GROUPS = ['explainer', 'chat', 'text'] as const;
export const VALID_SIGIL_SECTIONS = ['elements', 'details', 'all'] as const;

export type SigilGroup = (typeof VALID_SIGIL_GROUPS)[number];
export type SigilSection = (typeof VALID_SIGIL_SECTIONS)[number];

export interface SigilGroupCapabilities {
  /** Owlbert follow-up chat is available. */
  hasChat: boolean;
  /** Practice quiz blocks are generated. */
  hasPractice: boolean;
}

export const SIGIL_GROUP_CAPABILITIES: Record<SigilGroup, SigilGroupCapabilities> = {
  explainer: { hasChat: true, hasPractice: true },
  chat: { hasChat: true, hasPractice: false },
  text: { hasChat: false, hasPractice: false },
};
