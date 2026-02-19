import { createZodDto } from 'nestjs-zod';
import { SessionSchema } from '../../../../domain/schemas/sessions/session.schema';

/**
 * Response body returning the created session with initial block sequence.
 */
export class CreateSessionResponseDto extends createZodDto(SessionSchema) {}
