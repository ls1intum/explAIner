import { createZodDto } from 'nestjs-zod';
import { DeleteSessionResponseDtoSchema } from '../../../../domain/schemas/dto/session.schema';

/**
 * Response body returned after successfully deleting a session
 */
export class DeleteSessionResponseDto extends createZodDto(DeleteSessionResponseDtoSchema) {}
