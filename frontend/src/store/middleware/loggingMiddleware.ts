import { Middleware } from '@reduxjs/toolkit';
import { isRejectedWithValue } from '@reduxjs/toolkit';
import { isLogEnabled } from '../../config/logging.config';
import { formatBodyForLogging } from '../../lib/utils';

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
    if (actionType.endsWith('/pending')) {
      const endpointName = meta.arg?.endpointName || extractEndpointFromType(actionType);
      const body = formatBodyForLogging(meta.arg?.originalArgs);
      console.log(`[REDUX] ${endpointName} ${body}`);
    }
  }

  if (isRejectedWithValue(action as Parameters<typeof isRejectedWithValue>[0])) {
    const endpointName = extractEndpointFromType(actionType);
    console.error(`[REDUX] ${endpointName} Error:`, (action as { payload?: unknown }).payload);
  }

  return next(action);
};

/** Extract endpoint name from RTK Query action type */
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
