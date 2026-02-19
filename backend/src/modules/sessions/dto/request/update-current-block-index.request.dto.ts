import { createZodDto } from 'nestjs-zod';
import { UpdateCurrentBlockIndexRequestSchema } from '../../../../domain/schemas/sessions/session.schema';

/**
 * Request body for updating the current block index in a session.
 */
export class UpdateCurrentBlockIndexRequestDto extends createZodDto(
  UpdateCurrentBlockIndexRequestSchema,
) {}
