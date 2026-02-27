import SessionPageClient from '@/components/session/SessionPageClient';

export default function SessionPage({
  params,
}: {
  params: { sessionId: string };
}) {
  return <SessionPageClient sessionId={params.sessionId} />;
}
