import { notFound } from 'next/navigation';
import SigilPageClient from './SigilPageClient';

const VALID_MODES = ['elements', 'details', 'analysis', 'chat'] as const;

export default function SigilPage({
  params,
  searchParams,
}: {
  params: { mode: string };
  searchParams: { lang?: string; session?: string };
}) {
  if (!VALID_MODES.includes(params.mode as typeof VALID_MODES[number])) {
    notFound();
  }

  const mode = params.mode as typeof VALID_MODES[number];
  const lang = (searchParams.lang === 'en' ? 'en' : 'de') as 'de' | 'en';
  const existingSessionId = searchParams.session ?? null;

  return (
    <SigilPageClient
      mode={mode}
      lang={lang}
      existingSessionId={existingSessionId}
    />
  );
}
