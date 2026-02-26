/**
 * Client Logging Config
 * 
 * Control which log categories are enabled/disabled by setting respective keys to true/false (atm there is only 1 category :)
 * 
 * Example LOG (called function: updateCurrentBlockIndex):
 * ─────────────────────────────────────────────────────────────────────────────────
 * [REDUX-RTK-QUERY] updateCurrentBlockIndex {"sessionId":"a5dd9b8d-af8e-4059-9400-0c0da1...","currentBlockIndex":0}
 * ─────────────────────────────────────────────────────────────────────────────────
 */
export const LOGGING_CONFIG = {
  'redux-rtk-query': true,
};

/**
 * Check if a specific log category is enabled
 */
export function isLogEnabled(category: keyof typeof LOGGING_CONFIG): boolean {
  return LOGGING_CONFIG[category];
}