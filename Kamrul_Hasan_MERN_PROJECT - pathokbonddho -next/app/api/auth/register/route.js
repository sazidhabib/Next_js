import { NextResponse } from 'next/server';
import User from '@/lib/models/user-model';

export async function POST(request) {
    try {
        const body = await request.json();
        const { username, email, phone, password, isAdmin } = body;

        const userExist = await User.findOne({ where: { email } });

        if (userExist) {
            return NextResponse.json(
                { msg: "User already exists" },
                { status: 400 }
            );
        }

        const isAdminValue = isAdmin === true || isAdmin === "true";

        const userCreated = await User.create({
            username,
            email,
            phone,
            password,
            isAdmin: isAdminValue
        });

        return NextResponse.json({
            msg: "User Created.",
            token: userCreated.generateToken(),
            userId: userCreated.id,
            isAdmin: userCreated.isAdmin
        }, { status: 200 });

    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { msg: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}
