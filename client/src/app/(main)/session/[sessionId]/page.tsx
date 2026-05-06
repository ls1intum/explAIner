import SessionPageClient from '@/app/(main)/session/[sessionId]/SessionPageClient';

export default function SessionPage({
  params,
}: {
  params: { sessionId: string };
}) {
  return <SessionPageClient sessionId={params.sessionId} />;
}
