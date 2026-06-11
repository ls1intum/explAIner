import { NextRequest, NextResponse } from 'next/server';

/**
 * Soft access gate for the whole site.
 *
 * The site is temporarily hidden behind a token while the privacy policy and
 * imprint are not yet final. The token can be supplied two ways:
 *   - as a URL query param `?token=XXX` (used when the site is embedded, e.g.
 *     the soscisurvey iframe links to `/sigil/...?token=XXX`)
 *   - typed manually on the access page below (for testing)
 *
 * On a valid query token we also set an `explainer_access` cookie so that
 * manual browsing across several pages stays unlocked. The cookie is
 * `SameSite=None; Secure` so it can work inside the (third-party) survey
 * iframe too — but since many browsers block third-party cookies, the gate
 * only ever guards *document* navigations and lets assets/RSC through. That
 * way an embed keeps working from the `?token=` URL alone, even when the
 * cookie is dropped.
 *
 * If SITE_ACCESS_TOKEN is unset (e.g. local dev) the gate is disabled.
 *
 * Note: middleware runs in Next's Edge runtime, which does NOT read non-public
 * env vars from the running container at request time — it only sees values
 * inlined at `next build`. The token is therefore (a) supplied as a build arg
 * (see Dockerfile.prd / build-and-push.yml) and (b) inlined into the bundle via
 * the `env` key in next.config.mjs. It must be read via plain dot access here
 * (`process.env.SITE_ACCESS_TOKEN`) so Next's DefinePlugin can replace it with
 * the literal — bracket access would not be substituted and would stay undefined.
 */

const COOKIE_NAME = 'explainer_access';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function middleware(req: NextRequest) {
  const expected = process.env.SITE_ACCESS_TOKEN;

  // Gate disabled when no token is configured.
  if (!expected) {
    return NextResponse.next();
  }

  // Only guard top-level page (document) navigations. Sub-resources and RSC
  // payloads pass through so embeds work even without the cookie.
  const dest = req.headers.get('sec-fetch-dest');
  const accept = req.headers.get('accept') ?? '';
  const isDocument =
    dest === 'document' || (dest === null && accept.includes('text/html'));
  if (!isDocument) {
    return NextResponse.next();
  }

  const queryToken = req.nextUrl.searchParams.get('token');
  const cookieToken = req.cookies.get(COOKIE_NAME)?.value;

  // Valid token in the URL: allow and remember via cookie.
  if (queryToken && queryToken === expected) {
    const res = NextResponse.next();
    res.cookies.set(COOKIE_NAME, expected, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: COOKIE_MAX_AGE,
    });
    return res;
  }

  // Already unlocked via cookie.
  if (cookieToken === expected) {
    return NextResponse.next();
  }

  // No valid token: show the access page.
  return new NextResponse(accessPage(), {
    status: 401,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}

// Exclude Next internals and the favicon so they are never gated.
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

function accessPage(): string {
  // Self-contained page (inline styles, no external assets), GET form submits
  // back to the current path with `?token=<value>`.
  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Zugang erforderlich</title>
  <style>
    :root { color-scheme: light dark; }
    body {
      margin: 0; min-height: 100vh; display: flex; align-items: center;
      justify-content: center; font-family: system-ui, -apple-system, sans-serif;
      background: #0f172a; color: #e2e8f0;
    }
    .card {
      width: min(92vw, 360px); padding: 2rem; border-radius: 14px;
      background: #1e293b; box-shadow: 0 10px 30px rgba(0,0,0,.35);
    }
    h1 { font-size: 1.15rem; margin: 0 0 .35rem; }
    p { font-size: .9rem; line-height: 1.5; color: #94a3b8; margin: 0 0 1.25rem; }
    form { display: flex; gap: .5rem; }
    input {
      flex: 1; padding: .6rem .75rem; border-radius: 8px; border: 1px solid #334155;
      background: #0f172a; color: #e2e8f0; font-size: .95rem;
    }
    input:focus { outline: 2px solid #6366f1; outline-offset: 0; }
    button {
      padding: .6rem 1rem; border: 0; border-radius: 8px; cursor: pointer;
      background: #6366f1; color: #fff; font-size: .95rem; font-weight: 600;
    }
    button:hover { background: #4f46e5; }
  </style>
</head>
<body>
  <main class="card">
    <h1>Zugang erforderlich</h1>
    <p>Diese Seite ist derzeit nur mit Zugangstoken erreichbar.</p>
    <form method="GET">
      <input
        name="token"
        type="password"
        placeholder="Zugangstoken"
        autocomplete="off"
        autofocus
        aria-label="Zugangstoken"
      />
      <button type="submit">Zugang</button>
    </form>
  </main>
</body>
</html>`;
}
