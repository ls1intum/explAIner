/** Used to always display a different loading screen message */
export const getRandomMessage = (messages: string[]): string => {
  return messages[Math.floor(Math.random() * messages.length)];
};

/** Sanitize sensitive data and truncate long strings to 30 chars (for logging) */
export function sanitizeAndTruncate(obj: unknown): unknown {
  if (typeof obj === 'string') {
    return obj.length > 30 ? obj.substring(0, 30) + '...' : obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeAndTruncate(item));
  }
  if (obj && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    const sensitiveKeys = ['password', 'token', 'apiKey', 'secret'];
    const record = obj as Record<string, unknown>;
    for (const key of Object.keys(record)) {
      if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
        result[key] = '***';
      } else {
        result[key] = sanitizeAndTruncate(record[key]);
      }
    }
    return result;
  }
  return obj;
}

/** Format body for logging: sanitize, truncate, one-line JSON */
export function formatBodyForLogging(body: unknown): string {
  if (!body) return '{}';
  try {
    return JSON.stringify(sanitizeAndTruncate(body));
  } catch {
    return '{}';
  }
}
