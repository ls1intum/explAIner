import { createZodDto } from 'nestjs-zod';
import { BlockSequenceSchema } from '../../../../domain/schemas/dto/blocks.schema';

/**
 * Response body returning the generated block sequence (1 inform block + 3 practice blocks).
 */
export class GenerateBlockSequenceResponseDto extends createZodDto(BlockSequenceSchema) {}
