/**
 * Logging configuration
 * Control which log categories are enabled/disabled
 */
export const LOGGING_CONFIG = {
  http: true,
  controller: true,
  service: true,
  'ai-chain': true,
};

/**
 * Check if a specific log category is enabled
 */
export function isLogEnabled(category: keyof typeof LOGGING_CONFIG): boolean {
  return LOGGING_CONFIG[category];
}
