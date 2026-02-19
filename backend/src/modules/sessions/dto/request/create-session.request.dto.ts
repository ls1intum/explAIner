import { createZodDto } from 'nestjs-zod';
import { CreateSessionRequestSchema } from '../../../../domain/schemas/sessions/session.schema';

/**
 * Request body for creating a new learning session.
 */
export class CreateSessionRequestDto extends createZodDto(CreateSessionRequestSchema) {}
