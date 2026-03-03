import SessionPageClient from '@/app/session/[sessionId]/SessionPageClient';

export default function SessionPage({
  params,
}: {
  params: { sessionId: string };
}) {
  return <SessionPageClient sessionId={params.sessionId} />;
}
