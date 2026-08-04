import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const slug = formData.get("slug");
    const zipFile = formData.get("zipFile");
    const previewFile = formData.get("previewFile");

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "fonts");
    await mkdir(uploadDir, { recursive: true });

    let zipUrl = "";
    let previewUrl = "";

    if (zipFile && zipFile.size > 0) {
      const buffer = Buffer.from(await zipFile.arrayBuffer());
      const ext = path.extname(zipFile.name) || ".zip";
      const filename = `${slug}${ext}`;
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);
      zipUrl = `/uploads/fonts/${filename}`;
    }

    if (previewFile && previewFile.size > 0) {
      const buffer = Buffer.from(await previewFile.arrayBuffer());
      const ext = path.extname(previewFile.name) || ".ttf";
      const filename = `${slug}-preview${ext}`;
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);
      previewUrl = `/uploads/fonts/${filename}`;
    }

    return NextResponse.json({ success: true, zipUrl, previewUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
