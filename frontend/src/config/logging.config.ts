/**
 * Frontend logging configuration
 * Control which log categories are enabled/disabled
 */
export const LOGGING_CONFIG = {
  redux: true,
};

/**
 * Check if a specific log category is enabled
 */
export function isLogEnabled(category: keyof typeof LOGGING_CONFIG): boolean {
  return LOGGING_CONFIG[category];
}
