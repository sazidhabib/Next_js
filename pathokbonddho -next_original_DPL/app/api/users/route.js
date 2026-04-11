import { NextResponse } from 'next/server';
import User from '@/lib/models/user-model';

export async function GET() {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });

        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error("Get Users Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
