import { NextResponse } from 'next/server';
import { Author } from '@/lib/models/index.js';
import { Op, Sequelize } from 'sequelize';
import path from 'path';
import fs from 'fs';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page');
        const limit = searchParams.get('limit');
        const search = searchParams.get('search');
        const isSpecialAuthor = searchParams.get('isSpecialAuthor');

        let whereClause = {};

        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        if (isSpecialAuthor !== null && isSpecialAuthor !== undefined && isSpecialAuthor !== '') {
            whereClause.isSpecialAuthor = isSpecialAuthor === 'true' || isSpecialAuthor === '1';
        }

        const queryOptions = {
            where: whereClause,
            order: [['createdAt', 'DESC']]
        };

        if (limit) {
            const parsedLimit = parseInt(limit, 10);
            const parsedPage = page ? parseInt(page, 10) : 1;
            queryOptions.limit = parsedLimit;
            queryOptions.offset = (parsedPage - 1) * parsedLimit;

            const { count, rows } = await Author.findAndCountAll(queryOptions);

            return NextResponse.json({
                authors: rows,
                totalCount: count,
                currentPage: parsedPage,
                totalPages: Math.ceil(count / parsedLimit),
                hasNext: parsedPage * parsedLimit < count,
                hasPrev: parsedPage > 1
            }, { status: 200 });
        }

        const authors = await Author.findAll(queryOptions);
        return NextResponse.json({
            authors,
            totalCount: authors.length,
            currentPage: 1,
            totalPages: 1,
            hasNext: false,
            hasPrev: false
        }, { status: 200 });
    } catch (error) {
        console.error("Get Authors Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const contentType = request.headers.get('content-type') || '';
        let body = {};
        let imageFileName = null;

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            for (const [key, value] of formData.entries()) {
                if (value instanceof File && value.size > 0) {
                    const buffer = Buffer.from(await value.arrayBuffer());
                    const safeName = value.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${safeName}`;
                    const uploadDir = path.join(process.cwd(), 'uploads', 'authors');
                    if (!fs.existsSync(uploadDir)) {
                        fs.mkdirSync(uploadDir, { recursive: true });
                    }
                    fs.writeFileSync(path.join(uploadDir, filename), buffer);
                    imageFileName = filename;
                } else {
                    body[key] = value;
                }
            }
        } else {
            body = await request.json();
            if (body.image && typeof body.image === 'string') {
                imageFileName = body.image;
            }
        }

        const { name, description, websiteLink, isSpecialAuthor } = body;

        if (!name) {
            return NextResponse.json({ message: "Name is required" }, { status: 400 });
        }

        const existingName = await Author.findOne({
            where: Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('name')),
                '=',
                name.toLowerCase()
            )
        });
        if (existingName) {
            return NextResponse.json({ message: "An author with this name already exists." }, { status: 409 });
        }

        const parsedIsSpecial = isSpecialAuthor === 'true' || isSpecialAuthor === true || isSpecialAuthor === '1' || isSpecialAuthor === 1;

        const newAuthor = await Author.create({
            name,
            description,
            image: imageFileName,
            websiteLink,
            isSpecialAuthor: parsedIsSpecial
        });

        return NextResponse.json({
            message: "Author Created Successfully",
            author: newAuthor
        }, { status: 201 });
    } catch (error) {
        console.error("Create Author Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}
