import { createZodDto } from 'nestjs-zod';
import { ContinueSessionResponseSchema } from '../../../../domain/schemas/sessions/session.schema';

/**
 * Response body returning the continued session with updated state.
 */
export class ContinueSessionResponseDto extends createZodDto(ContinueSessionResponseSchema) {}
