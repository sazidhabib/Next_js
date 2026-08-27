import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        // Get the token from the request
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, message: 'No token provided' },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];

        const url = new URL(req.url);
        const origin = url.origin;
        
        let response;
        let fetchError;
        
        // 1. Try process.env.NEXT_PUBLIC_API_BASE_URL first if it's set
        if (process.env.NEXT_PUBLIC_API_BASE_URL) {
            try {
                response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            } catch (err) {
                console.warn(`⚠️ Fetching profile using NEXT_PUBLIC_API_BASE_URL (${process.env.NEXT_PUBLIC_API_BASE_URL}) failed:`, err.message);
                fetchError = err;
            }
        }
        
        // 2. If the first try didn't happen or failed to connect/respond ok, try using the request's own origin
        if (!response || !response.ok) {
            try {
                console.log(`🔄 Attempting fallback profile fetch using request origin: ${origin}`);
                const fallbackResponse = await fetch(`${origin}/api/auth/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                
                if (fallbackResponse.ok || !response) {
                    response = fallbackResponse;
                }
            } catch (err) {
                console.error(`❌ Fallback profile fetch to ${origin} also failed:`, err.message);
                if (!response) {
                    throw fetchError || err;
                }
            }
        }

        if (!response.ok) {
            return NextResponse.json(
                { success: false, message: 'Invalid token' },
                { status: 401 }
            );
        }

        const data = await response.json();

        // Check if user is admin
        if (data.data.role !== 'admin') {
            return NextResponse.json(
                { success: false, message: 'Not an admin user' },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { success: true, data: data.data },
            { status: 200 }
        );
    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json(
            { success: false, message: 'Authentication failed' },
            { status: 500 }
        );
    }
}
