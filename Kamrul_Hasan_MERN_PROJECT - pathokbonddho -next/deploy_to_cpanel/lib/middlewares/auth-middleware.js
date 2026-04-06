import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/lib/models/user-model';

const authMiddleware = async (req) => {
    try {
        const authHeader = req.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { message: "Access Denied: No Token Provided" },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await User.findByPk(decoded.userId);

        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized: User not found" },
                { status: 401 }
            );
        }

        if (!user.isAdmin) {
            return NextResponse.json(
                { message: "Unauthorized: Not an Admin" },
                { status: 403 }
            );
        }

        if (!user.isActive) {
            return NextResponse.json(
                { message: "Unauthorized: Account is deactivated" },
                { status: 403 }
            );
        }

        return null;
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        return NextResponse.json(
            { message: "Invalid Token" },
            { status: 401 }
        );
    }
};

export { authMiddleware };
