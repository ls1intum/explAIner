import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/**
 * SoSci Survey case number (CASE): a positive integer without leading zeros,
 * at most 12 digits. Kept as a string so nothing but a plain id can be stored.
 */
export const SOSCI_CASE_PATTERN = /^[1-9][0-9]{0,11}$/;

export const CreateSigilSessionRequestDtoSchema = z.object({
  group: z.enum(['explainer', 'chat', 'text']),
  section: z.enum(['elements']),
  lang: z.enum(['de', 'en']).default('de'),
  // Set when the page is embedded in the survey (?case=). A second create
  // request with the same case resumes the existing session.
  sosciCase: z.string().regex(SOSCI_CASE_PATTERN).optional(),
  // Survey pretest (?test=1): store the session as test data.
  isTestRun: z.boolean().optional(),
});

export class CreateSigilSessionRequestDto extends createZodDto(
  CreateSigilSessionRequestDtoSchema,
) {}
