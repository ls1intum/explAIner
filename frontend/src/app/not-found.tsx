import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <Image
            src="/images/owlbert/sad.png"
            alt="Owlbert is sad this page is missing"
            width={120}
            height={120}
          />
        </div>
        <h2 className="mb-4 text-5xl font-bold">404</h2>
        <p className="mb-6 text-xl text-muted-foreground">Page not found</p>
        <a
          href="/"
          className="rounded-xl bg-brand-gradient px-6 py-3 text-white transition-opacity hover:opacity-90"
        >
          Go back home
        </a>
      </div>
    </div>
  );
}
