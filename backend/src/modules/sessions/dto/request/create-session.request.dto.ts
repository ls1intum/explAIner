import { createZodDto } from 'nestjs-zod';
import { CreateSessionRequestDtoSchema } from '../../../../domain/schemas/dto/session.schema';

/**
 * Request body for creating a new learning session
 */
export class CreateSessionRequestDto extends createZodDto(CreateSessionRequestDtoSchema) {}
