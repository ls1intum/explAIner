import { createZodDto } from 'nestjs-zod';
import { GenerateSummaryBlockResponseSchema } from '../../../../domain/schemas/blocks/summary/summary-block.schema';

/**
 * Response body returning the generated summary block.
 */
export class GenerateSummaryBlockResponseDto extends createZodDto(GenerateSummaryBlockResponseSchema) {}
