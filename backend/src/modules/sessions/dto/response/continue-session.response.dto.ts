import { createZodDto } from 'nestjs-zod';
import { continueSessionResponseSchema } from '../../../../domain/schemas/sessions/session.schema';

export class ContinueSessionResponseDto extends createZodDto(continueSessionResponseSchema) {}
