import { createZodDto } from 'nestjs-zod';
import { GenerateSummaryBlockResponseDtoSchema } from '../../../../domain/schemas/dto/blocks.schema';

/**
 * Response body returning the generated summary block
 */
export class GenerateSummaryBlockResponseDto extends createZodDto(GenerateSummaryBlockResponseDtoSchema) {}
