// BloomsLevel, BlockType, SoloLevel

export enum BloomsLevel {
  REMEMBER = "remember",
  UNDERSTAND = "understand",
  APPLY = "apply",
  ANALYZE = "analyze",
  EVALUATE = "evaluate",
  CREATE = "create",
}

export enum BlockType {
  INFORM = "inform",
  PRACTICE = "practice",
  SUMMARY = "summary",
}

export enum SoloLevel {
  PRESTRUCTURAL = "prestructural",
  UNISTRUCTURAL = "unistructural",
  MULTISTRUCTURAL = "multistructural",
  RELATIONAL = "relational",
  EXTENDED_ABSTRACT = "extended_abstract",
}

export enum SessionStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  ABANDONED = "abandoned",
}
