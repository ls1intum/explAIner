import { createZodDto } from 'nestjs-zod';
import { GetBlockResponseDtoSchema } from '../../../../domain/schemas/dto/blocks.schema';

/** Response body returning a single (inform / practice / summary) block by order index */
export class GetBlockResponseDto extends createZodDto(GetBlockResponseDtoSchema) {}
