import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Check if the path starts with /admin
    if (pathname.startsWith('/admin')) {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            // Redirect to login if no token
            const url = new URL('/login', request.url);
            return NextResponse.redirect(url);
        }
        
        // Note: For full security, we would verify the JWT here,
        // but that requires a library like 'jose' that works in Edge Runtime.
        // The server-side check in AdminLayout handles actual decoding/validation.
    }

    // Redirect /login to /admin if already logged in
    // Removed to prevent infinite redirect loops if the token exists but is expired.
    // Let the login page handle redirection if needed.
    /*
    if (pathname === '/login') {
        const token = request.cookies.get('token')?.value;
        if (token) {
            const url = new URL('/admin', request.url);
            return NextResponse.redirect(url);
        }
    }
    */

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/login'],
};
