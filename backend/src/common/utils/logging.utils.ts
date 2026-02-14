import { Logger } from '@nestjs/common';

const aiChainLogger = new Logger('AI-CHAIN');

/**
 * Extract parameter names and their types from method arguments
 */
export function extractParamNames(args: any[]): string[] {
  const params: string[] = [];
  
  args.forEach((arg, index) => {
    if (arg !== undefined && arg !== null) {
      if (typeof arg === 'string') {
        params.push(`param${index}: string`);
      } else if (typeof arg === 'number') {
        params.push(`param${index}: number`);
      } else if (typeof arg === 'object') {
        // For objects, try to get meaningful property names
        const keys = Object.keys(arg);
        if (keys.length > 0 && keys.length <= 3) {
          params.push(...keys);
        } else if (keys.length > 3) {
          params.push(`${keys.slice(0, 3).join(', ')}...`);
        } else {
          params.push(`param${index}: object`);
        }
      }
    }
  });

  return params;
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

/**
 * Log AI chain execution
 * Format: [AI - CHAIN] <chain name>
 */
export function logAiChain(chainName: string): void {
  aiChainLogger.log(chainName);
}
