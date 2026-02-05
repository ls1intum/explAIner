import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { isLogEnabled } from '../config/logging.config';
import { formatBody } from '../utils/logging.utils';

/**
 * HTTP Request/Response Logging Interceptor
 * Format: [HTTP - Request] <method> <url> <body>
 * Format: [HTTP - Response] <method> <url> <body>
 */
@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  private readonly requestLogger = new Logger('HTTP - Request');
  private readonly responseLogger = new Logger('HTTP - Response');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (!isLogEnabled('http')) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, body } = request;

    // Add dividing lines to indicate new log flow
    console.log('─────────────────────────────────────────────────────────────────────────────────');
    console.log('─────────────────────────────────────────────────────────────────────────────────');

    // Log incoming request
    const requestBody = formatBody(body);
    this.requestLogger.log(`${method} ${url} ${requestBody}`);

    return next.handle().pipe(
      tap({
        next: (data) => {
          // Log response
          const responseBody = formatBody(data);
          this.responseLogger.log(`${method} ${url} ${responseBody}`);
        },
        error: (error) => {
          this.responseLogger.error(
            `${method} ${url} Error: ${error.message}`,
          );
        },
      }),
    );
  }
}
