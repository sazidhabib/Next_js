import { NextResponse } from 'next/server';
import { Tag } from '@/lib/models/index.js';
import { Op, Sequelize } from 'sequelize';
import path from 'path';
import fs from 'fs';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const tag = await Tag.findByPk(id);
        if (!tag) {
            return NextResponse.json({ message: "Tag Not Found" }, { status: 404 });
        }
        return NextResponse.json(tag, { status: 200 });
    } catch (error) {
        console.error("Get Tag Error:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}

export async function PATCH(request, { params }) {
    try {
        const { id } = await params;
        const existingTag = await Tag.findByPk(id);
        if (!existingTag) {
            return NextResponse.json({ message: "Tag Not Found" }, { status: 404 });
        }

        const contentType = request.headers.get('content-type') || '';
        let body = {};
        let newImageFileName = null;

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
                    newImageFileName = filename;
                } else {
                    body[key] = value;
                }
            }
        } else {
            body = await request.json();
            if (body.image && typeof body.image === 'string') {
                newImageFileName = body.image;
            }
        }

        const { name, slug, tagTitle, tagDescription, metaTitle, metaDescription, metaKeywords, status } = body;

        if (slug && slug.toLowerCase() !== existingTag.slug) {
            const duplicateSlug = await Tag.findOne({
                where: {
                    slug: slug.toLowerCase(),
                    id: { [Op.ne]: id }
                }
            });
            if (duplicateSlug) {
                return NextResponse.json({ message: "Another tag with this slug already exists." }, { status: 409 });
            }
        }

        if (name && name.toLowerCase() !== existingTag.name.toLowerCase()) {
            const duplicateName = await Tag.findOne({
                where: {
                    [Op.and]: [
                        Sequelize.where(
                            Sequelize.fn('LOWER', Sequelize.col('name')),
                            '=',
                            name.toLowerCase()
                        ),
                        { id: { [Op.ne]: id } }
                    ]
                }
            });
            if (duplicateName) {
                return NextResponse.json({ message: "Another tag with this name already exists." }, { status: 409 });
            }
        }

        // Delete old image if new one uploaded
        if (newImageFileName && existingTag.image) {
            const oldPath = path.join(process.cwd(), 'uploads', existingTag.image);
            if (fs.existsSync(oldPath)) {
                try { fs.unlinkSync(oldPath); } catch (e) {}
            }
        }

        const updateData = {
            name: name || existingTag.name,
            slug: slug ? slug.toLowerCase() : existingTag.slug,
            tagTitle: tagTitle !== undefined ? tagTitle : existingTag.tagTitle,
            tagDescription: tagDescription !== undefined ? tagDescription : existingTag.tagDescription,
            metaTitle: metaTitle !== undefined ? metaTitle : existingTag.metaTitle,
            metaDescription: metaDescription !== undefined ? metaDescription : existingTag.metaDescription,
            metaKeywords: metaKeywords !== undefined ? metaKeywords : existingTag.metaKeywords,
            status: status !== undefined ? (status === 'true' || status === true || status === '1' || status === 1) : existingTag.status
        };

        if (newImageFileName) {
            updateData.image = newImageFileName;
        }

        const updatedTag = await existingTag.update(updateData);

        return NextResponse.json({
            message: "Tag Updated Successfully",
            tag: updatedTag
        }, { status: 200 });
    } catch (error) {
        console.error("Update Tag Error:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        const tag = await Tag.findByPk(id);
        if (!tag) {
            return NextResponse.json({ message: "Tag Not Found" }, { status: 404 });
        }

        if (tag.image) {
            const imgPath = path.join(process.cwd(), 'uploads', tag.image);
            if (fs.existsSync(imgPath)) {
                try { fs.unlinkSync(imgPath); } catch (e) {}
            }
        }

        await tag.destroy();
        return NextResponse.json({ message: "Tag Deleted Successfully" }, { status: 200 });
    } catch (error) {
        console.error("Delete Tag Error:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
