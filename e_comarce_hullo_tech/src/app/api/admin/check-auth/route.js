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

        // Forward the request to the Express backend
        const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${backendUrl}/api/auth/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

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
