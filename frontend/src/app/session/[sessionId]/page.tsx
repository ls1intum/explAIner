import SessionPageClient from '@/components/pages/SessionPageClient';

export default function SessionPage({
  params,
}: {
  params: { sessionId: string };
}) {
  return <SessionPageClient sessionId={params.sessionId} />;
}
