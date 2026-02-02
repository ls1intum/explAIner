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

/**
 * HTTP Request/Response Logging Interceptor
 *
 * Logs all incoming HTTP requests and their responses with timing information.
 * Applied globally to all controllers.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, body } = request;
    const startTime = Date.now();

    // Log incoming request
    this.logger.log(`→ ${method} ${url}`);
    
    // Log request body for POST/PUT/PATCH (exclude sensitive data)
    if (['POST', 'PUT', 'PATCH'].includes(method) && body && Object.keys(body).length > 0) {
      const sanitizedBody = this.sanitizeBody(body);
      this.logger.debug(`  Body: ${JSON.stringify(sanitizedBody)}`);
    }

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;
          this.logger.log(
            `← ${method} ${url} ${response.statusCode} [${duration}ms]`,
          );
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logger.error(
            `← ${method} ${url} ${error.status || 500} [${duration}ms] - ${error.message}`,
          );
        },
      }),
    );
  }

  /**
   * Sanitize request body to hide sensitive information
   */
  private sanitizeBody(body: any): any {
    const sensitiveKeys = ['password', 'token', 'apiKey', 'secret'];
    const sanitized = { ...body };

    for (const key of Object.keys(sanitized)) {
      if (sensitiveKeys.some((sensitive) => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '***REDACTED***';
      }
    }

    return sanitized;
  }
}
