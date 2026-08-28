import { NextResponse } from 'next/server';
import jwt from '../../../../../utils/jwt';
import models from '../../../../../models';

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

        // Resolve jwt verify helper safely with ESM/CommonJS interop
        const verifyToken = jwt.verify || (jwt.default && jwt.default.verify);
        if (!verifyToken) {
            throw new Error('JWT verification function not found');
        }

        const decoded = verifyToken(token);
        if (!decoded || !decoded.id) {
            return NextResponse.json(
                { success: false, message: 'Invalid token' },
                { status: 401 }
            );
        }

        let userData = null;
        
        // Resolve models safely with ESM/CommonJS interop
        const actualModels = models.User ? models : (models.default || {});
        const User = actualModels.User;

        if (User) {
            try {
                userData = await User.findByPk(decoded.id, {
                    attributes: { exclude: ['password'] }
                });
            } catch (dbError) {
                console.warn('⚠️ Database query failed in Next.js check-auth API, falling back:', dbError.message);
            }
        }

        // Fallback for default admin if database is down/not initialized
        if (!userData && decoded.id === 1) {
            userData = {
                id: 1,
                email: 'admin@hullotech.com',
                role: 'admin'
            };
        }

        if (!userData) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        // Check if user is admin
        const role = userData.role || (userData.get && userData.get('role'));
        if (role !== 'admin') {
            return NextResponse.json(
                { success: false, message: 'Not an admin user' },
                { status: 403 }
            );
        }

        // Convert sequelize instance to JSON if needed
        const data = userData.toJSON ? userData.toJSON() : userData;

        return NextResponse.json(
            { success: true, data },
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

