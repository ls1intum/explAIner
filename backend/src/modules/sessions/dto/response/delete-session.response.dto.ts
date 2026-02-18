import { createZodDto } from 'nestjs-zod';
import { deleteSessionResponseSchema } from '../../../../domain/schemas/sessions/session.schema';

/**
 * Response body returned after successfully deleting a session.
 */
export class DeleteSessionResponseDto extends createZodDto(deleteSessionResponseSchema) {}
