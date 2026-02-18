import { createZodDto } from 'nestjs-zod';
import { updateCurrentBlockIndexResponseSchema } from '../../../../domain/schemas/sessions/session.schema';

export class UpdateCurrentBlockIndexResponseDto extends createZodDto(
  updateCurrentBlockIndexResponseSchema,
) {}
