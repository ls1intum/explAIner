import { createZodDto } from 'nestjs-zod';
import { UpdateCurrentBlockIndexResponseDtoSchema } from '../../../../domain/schemas/dto/session.schema';

/**
 * Response body returned after updating the current block index in a session.
 */
export class UpdateCurrentBlockIndexResponseDto extends createZodDto(
  UpdateCurrentBlockIndexResponseDtoSchema,
) {}
