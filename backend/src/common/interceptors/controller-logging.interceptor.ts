import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { isLogEnabled } from '../config/logging.config';

/**
 * Controller Logging Interceptor
 * Format: [CONTROLLER] <ControllerName>.<methodName> (<param names>)
 */
@Injectable()
export class ControllerLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('CONTROLLER');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (!isLogEnabled('controller')) {
      return next.handle();
    }

    const controllerName = context.getClass().name;
    const methodName = context.getHandler().name;
    
    // Extract parameter names from request
    const paramNames = this.extractParamNames(context);
    const paramsStr = paramNames.length > 0 ? paramNames.join(', ') : 'no params';

    this.logger.log(`${controllerName}.${methodName} (${paramsStr})`);

    return next.handle();
  }

  /**
   * Extract parameter names from the execution context
   */
  private extractParamNames(context: ExecutionContext): string[] {
    const params: string[] = [];
    const request = context.switchToHttp().getRequest();
    
    // Add route params
    if (request.params && Object.keys(request.params).length > 0) {
      params.push(...Object.keys(request.params));
    }
    
    // Add body params
    if (request.body && Object.keys(request.body).length > 0) {
      params.push(...Object.keys(request.body));
    }
    
    // Add query params
    if (request.query && Object.keys(request.query).length > 0) {
      params.push(...Object.keys(request.query));
    }

    return params;
  }
}
