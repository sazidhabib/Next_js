import { NextResponse } from 'next/server';
import { Author } from '@/lib/models/index.js';
import { Op, Sequelize } from 'sequelize';
import path from 'path';
import fs from 'fs';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const author = await Author.findByPk(id);
        if (!author) {
            return NextResponse.json({ message: "Author Not Found" }, { status: 404 });
        }
        return NextResponse.json(author, { status: 200 });
    } catch (error) {
        console.error("Get Author Error:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}

export async function PATCH(request, { params }) {
    try {
        const { id } = await params;
        const existingAuthor = await Author.findByPk(id);
        if (!existingAuthor) {
            return NextResponse.json({ message: "Author Not Found" }, { status: 404 });
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
                    const uploadDir = path.join(process.cwd(), 'uploads', 'authors');
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

        const { name, description, websiteLink, isSpecialAuthor } = body;

        if (name && name.toLowerCase() !== existingAuthor.name.toLowerCase()) {
            const duplicateName = await Author.findOne({
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
                return NextResponse.json({ message: "Another author with this name already exists." }, { status: 409 });
            }
        }

        if (newImageFileName && existingAuthor.image) {
            const oldPath = path.join(process.cwd(), 'uploads', 'authors', existingAuthor.image);
            if (fs.existsSync(oldPath)) {
                try { fs.unlinkSync(oldPath); } catch (e) {}
            }
        }

        const updateData = {
            name: name || existingAuthor.name,
            description: description !== undefined ? description : existingAuthor.description,
            websiteLink: websiteLink !== undefined ? websiteLink : existingAuthor.websiteLink,
            isSpecialAuthor: isSpecialAuthor !== undefined
                ? (isSpecialAuthor === 'true' || isSpecialAuthor === true || isSpecialAuthor === '1' || isSpecialAuthor === 1)
                : existingAuthor.isSpecialAuthor
        };

        if (newImageFileName) {
            updateData.image = newImageFileName;
        }

        const updatedAuthor = await existingAuthor.update(updateData);

        return NextResponse.json({
            message: "Author Updated Successfully",
            author: updatedAuthor
        }, { status: 200 });
    } catch (error) {
        console.error("Update Author Error:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        const author = await Author.findByPk(id);
        if (!author) {
            return NextResponse.json({ message: "Author Not Found" }, { status: 404 });
        }

        if (author.image) {
            const imgPath = path.join(process.cwd(), 'uploads', 'authors', author.image);
            if (fs.existsSync(imgPath)) {
                try { fs.unlinkSync(imgPath); } catch (e) {}
            }
        }

        await author.destroy();
        return NextResponse.json({ message: "Author Deleted Successfully" }, { status: 200 });
    } catch (error) {
        console.error("Delete Author Error:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
