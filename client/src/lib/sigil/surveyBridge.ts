/**
 * Messages from the sigil study page to the SoSci Survey questionnaire that
 * embeds it as an iframe (the questionnaire listens via window 'message').
 */

/** Origin of the SoSci Survey page embedding the study. Messages go to this origin only. */
export const SOSCI_SURVEY_ORIGIN = 'https://www.soscisurvey.de';

export type SurveyErrorReason = 'llm_unavailable' | 'failed' | 'create_failed';

export type SurveyMessage =
  | { type: 'explainer:practice-done' }
  | { type: 'explainer:error'; reason: SurveyErrorReason };

/** True when the page runs inside an iframe (e.g. the survey). */
export function isEmbedded(): boolean {
  return typeof window !== 'undefined' && window.parent !== window;
}

/** Posts a message to the embedding survey; no-op when not embedded. */
export function postToSurvey(message: SurveyMessage): void {
  if (!isEmbedded()) return;
  try {
    window.parent.postMessage(message, SOSCI_SURVEY_ORIGIN);
  } catch (error) {
    console.warn('Could not notify the survey:', error);
  }
}
