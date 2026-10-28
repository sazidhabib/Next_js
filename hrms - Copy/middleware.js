import { NextResponse } from 'next/server';

// Public pages and assets that do not require authentication
const PUBLIC_PATHS = [
  '/',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/me',
  '/favicon.ico',
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Allow public assets and Next.js internal requests
  if (
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/uploads') ||
    pathname.startsWith('/static')
  ) {
    const response = NextResponse.next();
    applySecurityHeaders(response);
    return response;
  }

  // 2. Check session token from cookie or Authorization header
  const tokenFromCookie = request.cookies.get('hrms_session_token')?.value;
  const authHeader = request.headers.get('authorization');
  const token = tokenFromCookie || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null);

  if (!token) {
    // If it's an API request, return 401 Unauthorized
    if (pathname.startsWith('/api/')) {
      const unauthorizedResponse = NextResponse.json(
        { success: false, error: 'Unauthorized: Authentication required.' },
        { status: 401 }
      );
      applySecurityHeaders(unauthorizedResponse);
      return unauthorizedResponse;
    }

    // For web page requests, redirect to login page
    const loginUrl = new URL('/', request.url);
    const redirectResponse = NextResponse.redirect(loginUrl);
    applySecurityHeaders(redirectResponse);
    return redirectResponse;
  }

  const response = NextResponse.next();
  applySecurityHeaders(response);
  return response;
}

function applySecurityHeaders(response) {
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
