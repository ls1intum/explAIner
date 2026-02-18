import { createZodDto } from 'nestjs-zod';
import { updateCurrentBlockIndexResponseSchema } from '../../../../domain/schemas/sessions/session.schema';

/**
 * Response body returned after updating the current block index in a session.
 */
export class UpdateCurrentBlockIndexResponseDto extends createZodDto(
  updateCurrentBlockIndexResponseSchema,
) {}
