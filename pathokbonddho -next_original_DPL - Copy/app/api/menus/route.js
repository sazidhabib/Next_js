import { NextResponse } from 'next/server';
import Menu from '@/lib/models/menu-model';

export async function GET() {
    try {
        const menus = await Menu.findAll({
            where: { isActive: true },
            order: [['order', 'ASC']]
        });

        return NextResponse.json(menus, { status: 200 });
    } catch (error) {
        console.error("Get Menus Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
