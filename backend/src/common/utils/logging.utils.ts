/**
 * Extract parameter names from a function's signature (parses toString()).
 */
export function getParamNames(fn: Function): string[] {
  const s = fn.toString();
  const open = s.indexOf('(');
  if (open === -1) return [];
  const close = s.indexOf(')', open);
  if (close === -1) return [];
  const inner = s.slice(open + 1, close).trim();
  if (!inner) return [];
  return inner
    .split(',')
    .map((part) => part.trim().replace(/\s*[=:].*$/, '').replace(/^\.\.\./, '').trim())
    .filter(Boolean);
}

/**
 * Sanitize sensitive data and truncate long strings to 30 chars
 */
export function sanitizeAndTruncate(obj: any): any {
  if (typeof obj === 'string') {
    return obj.length > 30 ? obj.substring(0, 30) + '...' : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeAndTruncate(item));
  }

  if (obj && typeof obj === 'object') {
    const result: any = {};
    const sensitiveKeys = ['password', 'token', 'apiKey', 'secret'];
    
    for (const key of Object.keys(obj)) {
      if (sensitiveKeys.some((sensitive) => key.toLowerCase().includes(sensitive))) {
        result[key] = '***';
      } else {
        result[key] = sanitizeAndTruncate(obj[key]);
      }
    }
    return result;
  }

  return obj;
}

/**
 * Format body for logging: sanitize, truncate strings, one-line
 */
export function formatBody(body: any): string {
  if (!body || Object.keys(body).length === 0) return '{}';
  
  const sanitized = sanitizeAndTruncate(body);
  return JSON.stringify(sanitized);
}
