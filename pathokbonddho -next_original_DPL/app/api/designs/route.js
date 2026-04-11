import { NextResponse } from 'next/server';
import Design from '@/lib/models/design-model';

export async function GET() {
    try {
        const designs = await Design.findAll({
            where: { design_status: true },
            order: [['createdAt', 'DESC']]
        });

        return NextResponse.json(designs, { status: 200 });
    } catch (error) {
        console.error("Get Designs Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
