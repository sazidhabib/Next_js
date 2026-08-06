import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const slug = formData.get("slug");
    const zipFile = formData.get("zipFile");
    const previewFile = formData.get("previewFile");
    const imageFile = formData.get("imageFile");

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    let zipUrl = "";
    let previewUrl = "";
    let imageUrl = "";

    if (zipFile && zipFile.size > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "fonts");
      await mkdir(uploadDir, { recursive: true });
      const buffer = Buffer.from(await zipFile.arrayBuffer());
      const ext = path.extname(zipFile.name) || ".zip";
      const filename = `${slug}${ext}`;
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);
      zipUrl = `/uploads/fonts/${filename}`;
    }

    if (previewFile && previewFile.size > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "fonts");
      await mkdir(uploadDir, { recursive: true });
      const buffer = Buffer.from(await previewFile.arrayBuffer());
      const ext = path.extname(previewFile.name) || ".ttf";
      const filename = `${slug}-preview${ext}`;
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);
      previewUrl = `/uploads/fonts/${filename}`;
    }

    if (imageFile && imageFile.size > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "images");
      await mkdir(uploadDir, { recursive: true });
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const ext = path.extname(imageFile.name) || ".jpg";
      const filename = `${slug}${ext}`;
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);
      imageUrl = `/uploads/images/${filename}`;
    }

    return NextResponse.json({ success: true, zipUrl, previewUrl, imageUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}

