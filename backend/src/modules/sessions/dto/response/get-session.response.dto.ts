import { createZodDto } from 'nestjs-zod';
import { sessionSchema } from '../../../../common/schemas/sessions/session.schema';

/**
 * Get Session Response DTO
 *
 * Re-exported from common session schema.
 * Returns the session with all blocks.
 */
export class GetSessionResponseDto extends createZodDto(sessionSchema) {}
