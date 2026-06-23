import { NextResponse } from 'next/server';
import User from '@/lib/models/user-model';

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        const userExist = await User.findOne({ where: { email } });

        if (!userExist) {
            return NextResponse.json(
                { msg: "Invalid credentials" },
                { status: 400 }
            );
        }

        const isPasswordValid = await userExist.comparePassword(password);

        if (isPasswordValid) {
            return NextResponse.json({
                msg: "Login success",
                token: userExist.generateToken(),
                userId: userExist.id,
                isAdmin: userExist.isAdmin,
                role: userExist.role,
                username: userExist.username,
                permissions: userExist.permissions
            }, { status: 200 });
        } else {
            return NextResponse.json(
                { msg: "Invalid email or password" },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { msg: "Internal server error" },
            { status: 500 }
        );
    }
}
