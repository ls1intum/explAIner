import { Middleware } from '@reduxjs/toolkit';
import { isRejectedWithValue } from '@reduxjs/toolkit';
import { isLogEnabled } from '../../config/logging.config';

type ActionWithMeta = { type?: string; meta?: { arg?: { endpointName?: string; originalArgs?: unknown } } };

/**
 * Redux logging middleware
 * 
 * Purpose:   Logs all RTK Query calls sent to from the client via the API to the server
 * Format:    [REDUX-RTK-QUERY] <API endpoint> <body>
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- redux middleware has a fixed signature that requires the first param (storeApi)
export const loggingMiddleware: Middleware = (storeApi) => (next) => (action: unknown) => {
  if (!isLogEnabled('redux-rtk-query')) {
    return next(action);
  }

  const a = action as ActionWithMeta;
  const actionType = a.type as string;

  if (actionType && a.meta && 'arg' in a.meta) {
    const meta = a.meta;
    if (actionType.endsWith('/pending')) {
      const endpointName = meta.arg?.endpointName || extractEndpointFromType(actionType);
      const body = formatForLogging(meta.arg?.originalArgs);
      console.log(`[REDUX-RTK-QUERY] ${endpointName} ${body}`);
    }
  }

  if (isRejectedWithValue(action as Parameters<typeof isRejectedWithValue>[0])) {
    const endpointName = extractEndpointFromType(actionType);
    console.error(`[REDUX-RTK-QUERY] ${endpointName} Error:`, (action as { payload?: unknown }).payload);
  }

  return next(action);
};

/* 
 * Helper functions
 */

// extracts the endpoint name from the action type
function extractEndpointFromType(type: string): string {
  const parts = type.split('/');
  if (parts.includes('executeQuery') || parts.includes('executeMutation')) {
    return parts[1] || 'unknown';
  }
  if (parts.length >= 3) {
    const endpointPart = parts[parts.length - 2];
    return endpointPart.replace(/\(.*\)/, '') || 'unknown';
  }
  return 'unknown';
}

// redacts sensitive keys, truncates long strings to 30 chars, returns one-line JSON
export function formatForLogging(body: unknown): string {
  if (!body) return '{}';
  const sensitiveKeys = ['password', 'token', 'apiKey', 'secret'];

  function sanitize(obj: unknown): unknown {
    if (typeof obj === 'string') {
      return obj.length > 30 ? obj.substring(0, 30) + '...' : obj;
    }
    if (Array.isArray(obj)) return obj.map(sanitize);
    if (obj && typeof obj === 'object') {
      const result: Record<string, unknown> = {};
      const record = obj as Record<string, unknown>;
      for (const key of Object.keys(record)) {
        result[key] = sensitiveKeys.some((s) => key.toLowerCase().includes(s))
          ? '***'
          : sanitize(record[key]);
      }
      return result;
    }
    return obj;
  }
  try {
    return JSON.stringify(sanitize(body));
  } catch {
    return '{}';
  }
}
