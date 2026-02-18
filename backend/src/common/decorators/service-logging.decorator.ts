import { Logger } from '@nestjs/common';
import { isLogEnabled } from '../../config/logging.config';
import { extractParamNames } from '../utils/logging.utils';

/**
 * Service method logging decorator
 * Format: [SERVICE] <ServiceName>.<methodName> (<param names>)
 * Format: [SERVICE INTERNAL] <ServiceName>.<methodName> (<param names>)
 * 
 * Usage: 
 *   @LogService() - logs as [SERVICE]
 *   @LogService('service-internal') - logs as [SERVICE INTERNAL]
 */
export function LogService(type: 'service' | 'service-internal' = 'service') {
  const logger = new Logger(type === 'service' ? 'SERVICE' : 'SERVICE INTERNAL');

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    const serviceName = target.constructor.name;

    descriptor.value = async function (...args: any[]) {
      if (isLogEnabled('service')) {
        // Extract parameter names from method signature
        const paramNames = extractParamNames(args);
        const paramsStr = paramNames.length > 0 ? paramNames.join(', ') : 'no params';
        
        logger.log(`${serviceName}.${propertyKey} (${paramsStr})`);
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
