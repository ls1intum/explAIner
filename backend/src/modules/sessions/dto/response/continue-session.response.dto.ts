import { createZodDto } from 'nestjs-zod';
import { ContinueSessionResponseDtoSchema } from '../../../../domain/schemas/dto/session.schema';

/**
 * Response body returning the continue action type & target block order index
 */
export class ContinueSessionResponseDto extends createZodDto(ContinueSessionResponseDtoSchema) {}
