import { NextResponse } from 'next/server';

export function middleware(request) {
    const pathname = request.nextUrl.pathname;

    // Only protect dashboard route
    if (pathname === '/admin/dashboard') {
        const token = request.cookies.get('adminToken')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/dashboard'],
};
