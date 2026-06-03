import { notFound } from 'next/navigation';
import SigilPageClient from './SigilPageClient';

const VALID_GROUPS = ['explainer', 'chat', 'text'] as const;
const VALID_SECTIONS = ['elements', 'details', 'all'] as const;

export default function SigilPage({
  params,
  searchParams,
}: {
  params: { group: string; section: string };
  searchParams: { lang?: string; session?: string };
}) {
  if (!VALID_GROUPS.includes(params.group as typeof VALID_GROUPS[number])) {
    notFound();
  }
  if (!VALID_SECTIONS.includes(params.section as typeof VALID_SECTIONS[number])) {
    notFound();
  }

  const group = params.group as typeof VALID_GROUPS[number];
  const section = params.section as typeof VALID_SECTIONS[number];
  const lang = (searchParams.lang === 'en' ? 'en' : 'de') as 'de' | 'en';
  const existingSessionId = searchParams.session ?? null;

  return (
    <SigilPageClient
      group={group}
      section={section}
      lang={lang}
      existingSessionId={existingSessionId}
    />
  );
}
