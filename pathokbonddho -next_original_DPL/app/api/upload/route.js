import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const fileType = formData.get('fileType'); // 'favicon' or 'logo'

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedMimes = ['image/x-icon', 'image/png', 'image/jpeg', 'image/webp'];
        if (!allowedMimes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only PNG, JPG, WEBP, and ICO files are allowed' },
                { status: 400 }
            );
        }

        // Create filename with timestamp
        const ext = file.type === 'image/x-icon' ? 'ico' : file.type.split('/')[1];
        const filename = `${fileType}-${Date.now()}.${ext}`;

        // Define upload directory (public/uploads)
        const uploadDir = join(process.cwd(), 'public', 'uploads');

        // Create directory if it doesn't exist
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Convert file to buffer and save
        const buffer = await file.arrayBuffer();
        const filePath = join(uploadDir, filename);

        await writeFile(filePath, Buffer.from(buffer));

        // Return the public path
        const publicPath = `/uploads/${filename}`;

        return NextResponse.json(
            {
                success: true,
                path: publicPath,
                message: 'File uploaded successfully'
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file', details: error.message },
            { status: 500 }
        );
    }
}
