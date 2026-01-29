// App constants (Bloom's levels, SOLO levels)

export const BLOOMS_LEVELS = {
  REMEMBER: "remember",
  UNDERSTAND: "understand",
  APPLY: "apply",
  ANALYZE: "analyze",
  EVALUATE: "evaluate",
  CREATE: "create",
} as const;

export const SOLO_LEVELS = {
  PRESTRUCTURAL: "prestructural",
  UNISTRUCTURAL: "unistructural",
  MULTISTRUCTURAL: "multistructural",
  RELATIONAL: "relational",
  EXTENDED_ABSTRACT: "extended_abstract",
} as const;

export const BLOCK_TYPES = {
  INFORM: "inform",
  PRACTICE: "practice",
  SUMMARY: "summary",
} as const;
