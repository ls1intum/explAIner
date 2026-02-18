import { createZodDto } from 'nestjs-zod';
import { blockSequenceSchema } from '../../../../domain/schemas/blocks/block-sequence.schema';

/**
 * Response body returning the generated block sequence (1 inform block + 3 practice blocks).
 */
export class GenerateBlockSequenceResponseDto extends createZodDto(blockSequenceSchema) {}
