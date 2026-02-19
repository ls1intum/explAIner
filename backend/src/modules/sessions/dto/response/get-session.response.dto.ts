import { createZodDto } from 'nestjs-zod';
import { SessionSchema } from '../../../../domain/schemas/sessions/session.schema';

/**
 * Response body returning the session with all blocks.
 */
export class GetSessionResponseDto extends createZodDto(SessionSchema) {}
