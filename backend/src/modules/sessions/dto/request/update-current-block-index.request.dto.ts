import { createZodDto } from 'nestjs-zod';
import { UpdateCurrentBlockIndexRequestDtoSchema } from '../../../../domain/schemas/dto/session.schema';

/**
 * Request body for updating the current block index in a session.
 */
export class UpdateCurrentBlockIndexRequestDto extends createZodDto(
  UpdateCurrentBlockIndexRequestDtoSchema,
) {}
