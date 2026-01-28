import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h2 className="mb-4 text-6xl font-bold">404</h2>
        <p className="mb-6 text-xl text-gray-600">Page not found</p>
        <Link
          href="/"
          className="rounded bg-blue-500 px-6 py-3 text-white hover:bg-blue-600"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
