import { createZodDto } from 'nestjs-zod';
import { sessionSchema } from '../../../../domain/schemas/sessions/session.schema';

/**
 * Response body returning the created session with initial block sequence.
 */
export class CreateSessionResponseDto extends createZodDto(sessionSchema) {}
