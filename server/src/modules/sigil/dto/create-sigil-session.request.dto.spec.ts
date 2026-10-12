import { CreateSigilSessionRequestDtoSchema } from './create-sigil-session.request.dto';

describe('CreateSigilSessionRequestDtoSchema', () => {
  const base = { group: 'explainer', section: 'elements', lang: 'de' };

  it('accepts a request without case and test flag (unchanged behaviour)', () => {
    const result = CreateSigilSessionRequestDtoSchema.parse(base);
    expect(result).toEqual(base);
    expect(result.sosciCase).toBeUndefined();
    expect(result.isTestRun).toBeUndefined();
  });

  it('defaults lang to de', () => {
    const withoutLang = { group: 'chat', section: 'elements' };
    expect(CreateSigilSessionRequestDtoSchema.parse(withoutLang).lang).toBe(
      'de',
    );
  });

  it.each(['1', '42', '123456789012'])(
    'accepts the SoSci case %p',
    (sosciCase) => {
      expect(
        CreateSigilSessionRequestDtoSchema.parse({ ...base, sosciCase })
          .sosciCase,
      ).toBe(sosciCase);
    },
  );

  it.each([
    ['empty', ''],
    ['zero', '0'],
    ['leading zero', '0123'],
    ['negative', '-5'],
    ['decimal', '1.5'],
    ['letters', '12a'],
    ['whitespace', ' 12'],
    ['unreplaced placeholder', '%case%'],
    ['SQL-ish', "1' OR '1'='1"],
    ['13 digits', '1234567890123'],
  ])('rejects a %s case', (_label, sosciCase) => {
    expect(
      CreateSigilSessionRequestDtoSchema.safeParse({ ...base, sosciCase })
        .success,
    ).toBe(false);
  });

  it('rejects a numeric (non-string) case', () => {
    expect(
      CreateSigilSessionRequestDtoSchema.safeParse({ ...base, sosciCase: 42 })
        .success,
    ).toBe(false);
  });

  it('accepts isTestRun as boolean only', () => {
    expect(
      CreateSigilSessionRequestDtoSchema.parse({ ...base, isTestRun: true })
        .isTestRun,
    ).toBe(true);
    expect(
      CreateSigilSessionRequestDtoSchema.parse({ ...base, isTestRun: false })
        .isTestRun,
    ).toBe(false);
    expect(
      CreateSigilSessionRequestDtoSchema.safeParse({ ...base, isTestRun: '1' })
        .success,
    ).toBe(false);
  });

  it('still rejects unknown groups and sections', () => {
    expect(
      CreateSigilSessionRequestDtoSchema.safeParse({ ...base, group: 'other' })
        .success,
    ).toBe(false);
    expect(
      CreateSigilSessionRequestDtoSchema.safeParse({
        ...base,
        section: 'details',
      }).success,
    ).toBe(false);
  });
});
