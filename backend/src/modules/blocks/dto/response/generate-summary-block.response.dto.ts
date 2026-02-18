import { createZodDto } from 'nestjs-zod';
import { GenerateSummaryBlockResponseSchema } from '../../../../domain/schemas/blocks/summary/summary-block.schema';

export class GenerateSummaryBlockResponseDto extends createZodDto(GenerateSummaryBlockResponseSchema) {}
