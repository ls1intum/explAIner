/**
 * Block sequence generation mode
 * INITIAL: First block sequence with keyFacts in inform block
 * SUBSEQUENT: Follow-up sequences with keyMisconceptions addressing wrong answers
 */
export enum BlockSequenceMode {
  INITIAL = 'initial',
  SUBSEQUENT = 'subsequent',
}
