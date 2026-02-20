import { Middleware } from '@reduxjs/toolkit';
import { isRejectedWithValue } from '@reduxjs/toolkit';
import { isLogEnabled } from '../../config/logging.config';

type ActionWithMeta = { type?: string; meta?: { arg?: { endpointName?: string; originalArgs?: unknown } } };

/**
 * Redux logging middleware
 * Format: [REDUX] <API endpoint> <body>
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- middleware API requires first param
export const loggingMiddleware: Middleware = (storeApi) => (next) => (action: unknown) => {
  if (!isLogEnabled('redux')) {
    return next(action);
  }

  const a = action as ActionWithMeta;
  const actionType = a.type as string;

  if (actionType && a.meta && 'arg' in a.meta) {
    const meta = a.meta;
    
    // Log queries and mutations when they start (pending state)
    if (actionType.endsWith('/pending')) {
      const endpointName = meta.arg?.endpointName || extractEndpointFromType(actionType);
      
      // Get the original args (the actual parameters passed to the query/mutation)
      const originalArgs = meta.arg?.originalArgs;
      const body = formatBody(originalArgs);
      
      console.log(`[REDUX] ${endpointName} ${body}`);
    }
  }

  if (isRejectedWithValue(action as Parameters<typeof isRejectedWithValue>[0])) {
    const endpointName = extractEndpointFromType(actionType);
    console.error(`[REDUX] ${endpointName} Error:`, (action as { payload?: unknown }).payload);
  }

  return next(action);
};

/**
 * Extract endpoint name from action type
 */
function extractEndpointFromType(type: string): string {
  // RTK Query action types look like: 
  // "api/executeQuery/pending" or "api/executeMutation/pending"
  // or "api/queries/createSession(...)/pending"
  const parts = type.split('/');
  
  // Handle executeQuery/executeMutation patterns
  if (parts.includes('executeQuery') || parts.includes('executeMutation')) {
    return parts[1] || 'unknown';
  }
  
  // Handle other patterns like "api/queries/endpointName(...)/pending"
  if (parts.length >= 3) {
    // Get the part before /pending
    const endpointPart = parts[parts.length - 2];
    // Remove function call syntax if present: "createSession(...)" -> "createSession"
    return endpointPart.replace(/\(.*\)/, '') || 'unknown';
  }
  
  return 'unknown';
}

/**
 * Format body for logging (truncate strings to 30 chars, one-line)
 */
function formatBody(body: unknown): string {
  if (!body) return '{}';
  
  try {
    const sanitized = sanitizeAndTruncate(body);
    return JSON.stringify(sanitized);
  } catch {
    return '{}';
  }
}

/**
 * Sanitize and truncate data for logging
 */
function sanitizeAndTruncate(obj: unknown): unknown {
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
      if (sensitiveKeys.some((sensitive) => key.toLowerCase().includes(sensitive))) {
        result[key] = '***';
      } else {
        result[key] = sanitizeAndTruncate(record[key]);
      }
    }
    return result;
  }

  return obj;
}
