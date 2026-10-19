import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
import path from 'path';
import fs from 'fs';
import { News, Tag, Menu, Author, NewsTag, NewsCategory } from '@/lib/models/index.js';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status');
        const categories = searchParams.get('categories');
        const tag = searchParams.get('tag');
        const excludeIds = searchParams.get('excludeIds');

        const offset = (page - 1) * limit;
        let whereClause = {};

        if (excludeIds) {
            const idsList = excludeIds.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
            if (idsList.length > 0) {
                whereClause.id = { [Op.notIn]: idsList };
            }
        }

        if (search) {
            whereClause = {
                [Op.or]: [
                    { newsHeadline: { [Op.like]: `%${search}%` } },
                    { alternativeHeadline: { [Op.like]: `%${search}%` } },
                    { shortDescription: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        if (status) {
            whereClause.status = status;
        }

        const { count, rows } = await News.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Tag,
                    through: { attributes: [] },
                    attributes: ['id', 'name', 'slug'],
                    as: 'Tags',
                    ...(tag && { where: { name: tag } })
                },
                {
                    model: Menu,
                    through: { attributes: [] },
                    attributes: ['id', 'name', 'path'],
                    as: 'Categories',
                    ...(categories && {
                        where: {
                            [Op.or]: [
                                { name: { [Op.in]: categories.split(',') } },
                                { path: { [Op.in]: categories.split(',') } }
                            ]
                        }
                    })
                },
                {
                    model: Author,
                    attributes: ['id', 'name'],
                    as: 'Author'
                }
            ],
            order: [["createdAt", "DESC"]],
            limit: parseInt(limit),
            offset: parseInt(offset),
            distinct: true
        });

        return NextResponse.json({
            news: rows,
            totalCount: count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            hasNext: page * limit < count,
            hasPrev: page > 1
        }, { status: 200 });

    } catch (error) {
        console.error("Get All News Error:", error);
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
        let leadImagePath = null;
        let thumbImagePath = null;
        let metaImagePath = null;

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            for (const [key, value] of formData.entries()) {
                if (value instanceof File) {
                    if (value.size > 0) {
                        const buffer = Buffer.from(await value.arrayBuffer());
                        const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${value.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
                        const uploadDir = path.join(process.cwd(), 'uploads', 'post_image');
                        if (!fs.existsSync(uploadDir)) {
                            fs.mkdirSync(uploadDir, { recursive: true });
                        }
                        const filePath = path.join(uploadDir, filename);
                        fs.writeFileSync(filePath, buffer);
                        const relPath = `uploads/post_image/${filename}`;
                        if (key === 'leadImage') leadImagePath = relPath;
                        if (key === 'thumbImage') thumbImagePath = relPath;
                        if (key === 'metaImage') metaImagePath = relPath;
                    }
                } else {
                    body[key] = value;
                }
            }
            if (body.leadImagePath) leadImagePath = body.leadImagePath;
            if (body.thumbImagePath) thumbImagePath = body.thumbImagePath;
            if (body.metaImagePath) metaImagePath = body.metaImagePath;
        } else {
            body = await request.json();
            leadImagePath = body.leadImagePath || body.leadImage;
            thumbImagePath = body.thumbImagePath || body.thumbImage;
            metaImagePath = body.metaImagePath || body.metaImage;
        }

        const {
            newsHeadline,
            highlight,
            alternativeHeadline,
            authorId,
            shortDescription,
            tagIds,
            categoryIds,
            content,
            imageCaption,
            videoLink,
            newsSchedule,
            metaTitle,
            metaKeywords,
            metaDescription,
            status,
            newsType,
            galleryItems
        } = body;

        const generateRandomSlug = () => {
            return uuidv4().replace(/-/g, '').substring(0, 12);
        };

        let slug = generateRandomSlug();

        if (!newsHeadline || !authorId || !content) {
            return NextResponse.json(
                { message: "News Headline, Author, and Content are required" },
                { status: 400 }
            );
        }

        let parsedTagIds = [];
        if (tagIds) {
            if (typeof tagIds === 'string') {
                try {
                    parsedTagIds = JSON.parse(tagIds);
                } catch {
                    parsedTagIds = tagIds.split(',').filter(id => id.trim() !== '');
                }
            } else if (Array.isArray(tagIds)) {
                parsedTagIds = tagIds;
            }
        }

        let parsedCategoryIds = [];
        if (categoryIds) {
            if (typeof categoryIds === 'string') {
                try {
                    const parsed = JSON.parse(categoryIds);
                    parsedCategoryIds = Array.isArray(parsed) ? parsed : [parsed];
                } catch {
                    parsedCategoryIds = categoryIds.split(',').filter(id => id.trim() !== '');
                }
            } else if (Array.isArray(categoryIds)) {
                parsedCategoryIds = categoryIds;
            } else {
                parsedCategoryIds = [categoryIds];
            }
            parsedCategoryIds = parsedCategoryIds.map(id => parseInt(id)).filter(id => !isNaN(id));
        }

        const newNews = await News.create({
            newsHeadline,
            highlight,
            alternativeHeadline,
            authorId: parseInt(authorId),
            shortDescription,
            content,
            imageCaption,
            videoLink,
            newsSchedule: newsSchedule || null,
            metaTitle: metaTitle || newsHeadline,
            metaKeywords,
            metaDescription: metaDescription || shortDescription,
            status: status || 'draft',
            newsType: newsType || 'standard',
            slug,
            leadImage: leadImagePath || null,
            thumbImage: thumbImagePath || leadImagePath || null,
            metaImage: metaImagePath || null
        });

        if (parsedTagIds.length > 0) {
            const newsTags = parsedTagIds.map(tagId => ({
                newsId: newNews.id,
                tagId: parseInt(tagId)
            }));
            await NewsTag.bulkCreate(newsTags);
        }

        if (parsedCategoryIds.length > 0) {
            const newsCategories = parsedCategoryIds.map(categoryId => ({
                newsId: newNews.id,
                categoryId: parseInt(categoryId)
            }));
            await NewsCategory.bulkCreate(newsCategories);
        }

        const completeNews = await News.findByPk(newNews.id, {
            include: [
                { model: Tag, through: { attributes: [] }, as: 'Tags' },
                { model: Menu, through: { attributes: [] }, as: 'Categories' },
                { model: Author, as: 'Author' }
            ]
        });

        return NextResponse.json({
            message: "News Post Created Successfully",
            news: completeNews,
            slug: slug
        }, { status: 201 });

    } catch (error) {
        console.error("Create News Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}
