/**
 * Control which log categories are enabled/disabled by setting respective keys to true/false
 * 
 * Example LOG if all categories are enabled (called function: updateCurrentBlockIndex):
 * ─────────────────────────────────────────────────────────────────────────────────
 * LOG [HTTP - Request]     PATCH /api/sessions/5a06ccde-22fd-4470-962a-6c425ea6c7d5/current-block-index {"currentBlockIndex":1}
 * LOG [CONTROLLER]         SessionsController.updateCurrentBlockIndex (sessionId, currentBlockIndex)
 * LOG [SERVICE]            UpdateCurrentBlockIndexService.updateCurrentBlockIndex (sessionId, currentBlockIndex)
 * LOG [HTTP - Response]    PATCH /api/sessions/5a06ccde-22fd-4470-962a-6c425ea6c7d5/current-block-index {"success":true,"currentBlockIndex":1}
 * ─────────────────────────────────────────────────────────────────────────────────
 */
export const LOGGING_CONFIG = {
  'http': true,
  'controller': true,
  'service': true,
  'ai-chain': true,
};

export function isLogEnabled(category: keyof typeof LOGGING_CONFIG): boolean {
  return LOGGING_CONFIG[category];
}
