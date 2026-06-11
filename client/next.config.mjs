/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-markdown', 'remark-gfm'],
  // Inline the soft-gate token into the bundle at build time. Middleware runs
  // in the Edge runtime, which does not auto-expose non-public env vars; the
  // `env` key replaces `process.env.SITE_ACCESS_TOKEN` with the literal value
  // (taken from the build-time env / build arg) so the gate can read it.
  env: {
    SITE_ACCESS_TOKEN: process.env.SITE_ACCESS_TOKEN ?? '',
  },
  async headers() {
    return [
      {
        source: '/sigil/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.soscisurvey.de",
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
