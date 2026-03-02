import { Logger } from '@nestjs/common';
import { isLogEnabled } from '../../config/logging.config';
import { getParamNames } from '../utils/logging.utils';

/**
 * Service method logging decorator.
 * Format: [SERVICE] <ServiceName>.<methodName> (<param names>)
 * Usage: @LogService()
 */
export function LogService() {
  const logger = new Logger('SERVICE');

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    const serviceName = target.constructor.name;
    const paramNames = getParamNames(originalMethod);

    descriptor.value = async function (...args: any[]) {
      if (isLogEnabled('service')) {
        const paramsStr = paramNames.length > 0 ? paramNames.join(', ') : 'no params';
        logger.log(`${serviceName}.${propertyKey} (${paramsStr})`);
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
