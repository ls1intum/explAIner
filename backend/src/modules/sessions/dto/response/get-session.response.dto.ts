import { createZodDto } from 'nestjs-zod';
import { sessionSchema } from '../../../../domain/schemas/sessions/session.schema';

/**
 * Response body returning the session with all blocks.
 */
export class GetSessionResponseDto extends createZodDto(sessionSchema) {}
