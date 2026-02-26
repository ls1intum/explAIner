import Image from 'next/image';

interface LoadingScreenShellProps {
  message: string;
}

/** Presentational loading UI (server-capable). Message is passed in so it can be chosen on server or client. */
export default function LoadingScreenShell({ message }: LoadingScreenShellProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-6 bg-background">
      <div className="mb-8 animate-bounce">
        <Image
          src="/images/owlbert/flying.png"
          alt="Owlbert is thinking..."
          width={150}
          height={150}
          className="object-contain"
          priority
        />
      </div>
      <p className="text-muted-foreground text-center text-lg max-w-md">
        {message}
      </p>
    </div>
  );
}
