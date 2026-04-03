import { NextResponse } from 'next/server';
import { addSecurityHeaders } from './lib/middleware';

export function middleware(request) {
  const response = NextResponse.next();

  addSecurityHeaders(response);

  const accessToken = request.cookies.get('access_token')?.value;
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  if (isAdminRoute && !request.nextUrl.pathname.startsWith('/admin/login')) {
    if (!accessToken) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/portfolio/:path*',
    '/api/categories/:path*',
    '/api/analytics/stats/:path*',
    '/api/admin/:path*',
  ],
};
