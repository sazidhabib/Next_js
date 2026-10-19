import { NextResponse } from 'next/server';
import { Tag } from '@/lib/models/index.js';
import { Op, Sequelize } from 'sequelize';
import path from 'path';
import fs from 'fs';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page');
        const limit = searchParams.get('limit');
        const search = searchParams.get('search');
        const status = searchParams.get('status');

        let whereClause = {};

        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { slug: { [Op.like]: `%${search}%` } },
                { tagTitle: { [Op.like]: `%${search}%` } }
            ];
        }

        if (status !== null && status !== undefined && status !== '') {
            whereClause.status = status === 'true' || status === '1';
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

            const { count, rows } = await Tag.findAndCountAll(queryOptions);

            return NextResponse.json({
                tags: rows,
                totalCount: count,
                currentPage: parsedPage,
                totalPages: Math.ceil(count / parsedLimit),
                hasNext: parsedPage * parsedLimit < count,
                hasPrev: parsedPage > 1
            }, { status: 200 });
        }

        const tags = await Tag.findAll(queryOptions);
        return NextResponse.json({
            tags,
            totalCount: tags.length,
            currentPage: 1,
            totalPages: 1,
            hasNext: false,
            hasPrev: false
        }, { status: 200 });
    } catch (error) {
        console.error("Get Tags Error:", error);
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
                    const uploadDir = path.join(process.cwd(), 'uploads');
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

        const { name, slug, tagTitle, tagDescription, metaTitle, metaDescription, metaKeywords, status } = body;

        if (!name || !slug) {
            return NextResponse.json({ message: "Name and Slug are required" }, { status: 400 });
        }

        const existingSlug = await Tag.findOne({ where: { slug: slug.toLowerCase() } });
        if (existingSlug) {
            return NextResponse.json({ message: "A tag with this slug already exists." }, { status: 409 });
        }

        const existingName = await Tag.findOne({
            where: Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('name')),
                '=',
                name.toLowerCase()
            )
        });
        if (existingName) {
            return NextResponse.json({ message: "A tag with this name already exists." }, { status: 409 });
        }

        const parsedStatus = status === 'true' || status === true || status === '1' || status === 1;

        const newTag = await Tag.create({
            name,
            slug: slug.toLowerCase(),
            tagTitle,
            tagDescription,
            image: imageFileName,
            metaTitle,
            metaDescription,
            metaKeywords,
            status: parsedStatus
        });

        return NextResponse.json({
            message: "Tag Created Successfully",
            tag: newTag
        }, { status: 201 });
    } catch (error) {
        console.error("Create Tag Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}
