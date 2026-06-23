import { NextResponse } from 'next/server';
import Author from '@/lib/models/author-model';

export async function GET() {
    try {
        const authors = await Author.findAll({
            order: [['name', 'ASC']]
        });

        return NextResponse.json(authors, { status: 200 });
    } catch (error) {
        console.error("Get Authors Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
