import { createZodDto } from 'nestjs-zod';
import { blockSequenceSchema } from '../../../../domain/schemas/blocks/block-sequence.schema';

/**
 * Generate Block Sequence Response DTO
 *
 * Returns the generated block sequence (1 inform + 3 practice blocks).
 */
export class GenerateBlockSequenceResponseDto extends createZodDto(blockSequenceSchema) {}
