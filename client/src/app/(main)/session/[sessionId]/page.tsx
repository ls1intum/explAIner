import SessionPageClient from '@/app/(main)/session/[sessionId]/SessionPageClient';

export default async function SessionPage(
  props: {
    params: Promise<{ sessionId: string }>;
  }
) {
  const params = await props.params;
  return <SessionPageClient sessionId={params.sessionId} />;
}
