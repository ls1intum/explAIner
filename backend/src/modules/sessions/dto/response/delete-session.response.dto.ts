import { createZodDto } from 'nestjs-zod';
import { DeleteSessionResponseSchema } from '../../../../domain/schemas/sessions/session.schema';

/**
 * Response body returned after successfully deleting a session.
 */
export class DeleteSessionResponseDto extends createZodDto(DeleteSessionResponseSchema) {}
