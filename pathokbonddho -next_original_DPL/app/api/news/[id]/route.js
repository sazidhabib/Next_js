import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
import path from 'path';
import fs from 'fs';
import { News, Tag, Menu, Author, NewsTag, NewsCategory } from '@/lib/models/index.js';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        
        const news = await News.findByPk(id, {
            include: [
                {
                    model: Tag,
                    through: { attributes: [] },
                    attributes: ['id', 'name', 'slug']
                },
                {
                    model: Menu,
                    through: { attributes: [] },
                    attributes: ['id', 'name', 'path'],
                    as: 'Categories'
                },
                {
                    model: Author,
                    attributes: ['id', 'name']
                }
            ]
        });

        if (!news) {
            return NextResponse.json(
                { message: "News Post Not Found" },
                { status: 404 }
            );
        }

        await news.increment('views');

        return NextResponse.json(news, { status: 200 });

    } catch (error) {
        console.error("Get News Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}

export async function PATCH(request, { params }) {
    try {
        const { id } = await params;
        const contentType = request.headers.get('content-type') || '';
        let body = {};
        let leadImagePath = null;
        let thumbImagePath = null;
        let metaImagePath = null;

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            for (const [key, value] of formData.entries()) {
                if (value instanceof File) {
                    // Check if file has size
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

        const existingNews = await News.findByPk(id);
        if (!existingNews) {
            return NextResponse.json(
                { message: "News Post Not Found" },
                { status: 404 }
            );
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
            newsType
        } = body;

        const updateData = {
            newsHeadline: newsHeadline !== undefined ? newsHeadline : existingNews.newsHeadline,
            highlight: highlight !== undefined ? highlight : existingNews.highlight,
            alternativeHeadline: alternativeHeadline !== undefined ? alternativeHeadline : existingNews.alternativeHeadline,
            authorId: authorId ? parseInt(authorId) : existingNews.authorId,
            shortDescription: shortDescription !== undefined ? shortDescription : existingNews.shortDescription,
            content: content !== undefined ? content : existingNews.content,
            imageCaption: imageCaption !== undefined ? imageCaption : existingNews.imageCaption,
            videoLink: videoLink !== undefined ? videoLink : existingNews.videoLink,
            newsSchedule: newsSchedule === '' ? null : (newsSchedule !== undefined ? newsSchedule : existingNews.newsSchedule),
            metaTitle: metaTitle !== undefined ? metaTitle : existingNews.metaTitle,
            metaKeywords: metaKeywords !== undefined ? metaKeywords : existingNews.metaKeywords,
            metaDescription: metaDescription !== undefined ? metaDescription : existingNews.metaDescription,
            status: status || existingNews.status,
            newsType: newsType || existingNews.newsType,
            ...(leadImagePath ? { leadImage: leadImagePath } : {}),
            ...(thumbImagePath ? { thumbImage: thumbImagePath } : {}),
            ...(metaImagePath ? { metaImage: metaImagePath } : {})
        };

        const updatedNews = await existingNews.update(updateData);

        if (tagIds !== undefined) {
            await NewsTag.destroy({ where: { newsId: id } });
            if (tagIds) {
                const parsedTagIds = typeof tagIds === 'string' ? JSON.parse(tagIds) : tagIds;
                if (parsedTagIds.length > 0) {
                    const newsTags = parsedTagIds.map(tagId => ({
                        newsId: id,
                        tagId: parseInt(tagId)
                    }));
                    await NewsTag.bulkCreate(newsTags);
                }
            }
        }

        if (categoryIds !== undefined) {
            await NewsCategory.destroy({ where: { newsId: id } });
            if (categoryIds) {
                const parsedCategoryIds = typeof categoryIds === 'string' ? JSON.parse(categoryIds) : categoryIds;
                if (parsedCategoryIds.length > 0) {
                    const newsCategories = parsedCategoryIds.map(categoryId => ({
                        newsId: id,
                        categoryId: parseInt(categoryId)
                    }));
                    await NewsCategory.bulkCreate(newsCategories);
                }
            }
        }

        const completeNews = await News.findByPk(id, {
            include: [
                { model: Tag, through: { attributes: [] }, as: 'Tags' },
                { model: Menu, through: { attributes: [] }, as: 'Categories' },
                { model: Author, as: 'Author' }
            ]
        });

        return NextResponse.json({
            message: "News Post Updated Successfully",
            news: completeNews
        }, { status: 200 });

    } catch (error) {
        console.error("Update News Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        
        const news = await News.findByPk(id);
        if (!news) {
            return NextResponse.json(
                { message: "News Post Not Found" },
                { status: 404 }
            );
        }

        await NewsTag.destroy({ where: { newsId: id } });
        await NewsCategory.destroy({ where: { newsId: id } });
        await news.destroy();

        return NextResponse.json(
            { message: "News Post Deleted Successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Delete News Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}
