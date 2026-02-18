import { createZodDto } from 'nestjs-zod';
import { continueSessionResponseSchema } from '../../../../domain/schemas/sessions/session.schema';

/**
 * Response body returning the continued session with updated state.
 */
export class ContinueSessionResponseDto extends createZodDto(continueSessionResponseSchema) {}
