import { NextResponse } from 'next/server';

// Helper function to decode JWT payload without library
function decodeJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;

        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        // Decode base64 to string
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // We only want to protect /admin routes, but not /admin/login
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        const token = request.cookies.get('admin_token')?.value;

        let isExpired = true;

        if (token) {
            const decodedPayload = decodeJwt(token);
            if (decodedPayload && decodedPayload.exp) {
                // Check if the current time is less than expiration time
                const currentTime = Math.floor(Date.now() / 1000);
                if (currentTime < decodedPayload.exp) {
                    isExpired = false;
                }
            }
        }

        if (isExpired) {
            // Redirect to login page and clear the cookie if illegal/expired
            const loginUrl = new URL('/admin/login', request.url);
            const response = NextResponse.redirect(loginUrl);
            response.cookies.delete('admin_token');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
