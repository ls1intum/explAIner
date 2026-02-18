import { createZodDto } from 'nestjs-zod';
import { deleteSessionResponseSchema } from '../../../../domain/schemas/sessions/session.schema';

export class DeleteSessionResponseDto extends createZodDto(deleteSessionResponseSchema) {}
