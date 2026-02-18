import { createZodDto } from 'nestjs-zod';
import { sessionSchema } from '../../../../domain/schemas/sessions/session.schema';

/**
 * Create Session Response DTO
 *
 * Re-exported from common session schema.
 * Returns the created session with initial block sequence.
 */
export class CreateSessionResponseDto extends createZodDto(sessionSchema) {}
