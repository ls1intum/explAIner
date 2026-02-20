import { createZodDto } from 'nestjs-zod';
import { ContinueSessionResponseDtoSchema } from '../../../../domain/schemas/dto/session.schema';

/**
 * Response body returning the continued session with updated state.
 */
export class ContinueSessionResponseDto extends createZodDto(ContinueSessionResponseDtoSchema) {}
