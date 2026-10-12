import { notFound } from 'next/navigation';
import SigilPageClient from './SigilPageClient';
import {
  VALID_SIGIL_GROUPS,
  VALID_SIGIL_SECTIONS,
  type SigilGroup,
  type SigilSection,
} from '@/lib/sigil/groupConfig';

export default function SigilPage({
  params,
  searchParams,
}: {
  params: { group: string; section: string };
  searchParams: { lang?: string; session?: string; case?: string; test?: string };
}) {
  if (!VALID_SIGIL_GROUPS.includes(params.group as SigilGroup)) {
    notFound();
  }
  if (!VALID_SIGIL_SECTIONS.includes(params.section as SigilSection)) {
    notFound();
  }

  const group = params.group as SigilGroup;
  const section = params.section as SigilSection;
  const lang = (searchParams.lang === 'en' ? 'en' : 'de') as 'de' | 'en';
  const existingSessionId = searchParams.session ?? null;
  // Set by the SoSci Survey iframe: the survey case number and the pretest
  // marker (&test=1). A malformed case is dropped rather than sent, so a survey
  // misconfiguration costs the link to the survey data, not the participant's
  // learning session (the server rejects anything but this pattern).
  const sosciCase =
    typeof searchParams.case === 'string' && /^[1-9][0-9]{0,11}$/.test(searchParams.case) ? searchParams.case : null;
  const isTestRun = searchParams.test === '1';

  return (
    <SigilPageClient
      group={group}
      section={section}
      lang={lang}
      existingSessionId={existingSessionId}
      sosciCase={sosciCase}
      isTestRun={isTestRun}
    />
  );
}
