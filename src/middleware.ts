import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle missing _next/data requests (static generation files)
  if (pathname.startsWith('/_next/data/')) {
    // Extract locale and page from the path
    const pathParts = pathname.split('/');
    const buildId = pathParts[3];
    const locale = pathParts[4];
    const page = pathParts[5]?.replace('.json', '');

    // List of valid locales from your config
    const validLocales = ['en', 'zh', 'ru', 'es', 'ko', 'ja', 'pt', 'tr', 'vi', 'de', 'fr', 'hi', 'id'];
    
    // List of valid pages
    const validPages = ['index', 'create', 'daos', 'dao-features'];

    // If it's a request for a valid locale and page combination, but the file doesn't exist,
    // redirect to the default locale version or return a minimal response
    if (validLocales.includes(locale) && (validPages.includes(page) || !page)) {
      // For missing static data files, return a minimal JSON response instead of 404
      return new NextResponse(
        JSON.stringify({ 
          pageProps: {}, 
          __N_SSG: true 
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        }
      );
    }
  }

  // Continue with normal request processing
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|locales).*)',
  ],
};
