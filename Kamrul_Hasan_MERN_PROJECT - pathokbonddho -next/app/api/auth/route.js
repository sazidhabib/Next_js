import { NextResponse } from 'next/server';
import User from '@/lib/models/user-model';

export async function GET(request) {
    try {
        return NextResponse.json(
            { message: "Auth API working" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
