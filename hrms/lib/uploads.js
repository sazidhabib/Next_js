import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';

export function getUploadsDir() {
  // Primary directory: <root>/public/uploads
  const primary = path.join(process.cwd(), 'public', 'uploads');
  return primary;
}

export function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.webp':
      return 'image/webp';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.gif':
      return 'image/gif';
    case '.svg':
      return 'image/svg+xml';
    case '.pdf':
      return 'application/pdf';
    case '.ico':
      return 'image/x-icon';
    case '.avif':
      return 'image/avif';
    default:
      return 'application/octet-stream';
  }
}

export function findUploadedFile(relativePath) {
  const cleanPath = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, '');
  const candidateDirs = [
    path.join(process.cwd(), 'public', 'uploads'),
    path.join(process.cwd(), 'uploads'),
    path.join(process.cwd(), 'public'),
    path.resolve(process.cwd(), '..', 'public', 'uploads'),
  ];

  for (const dir of candidateDirs) {
    const fullPath = path.join(dir, cleanPath);
    if (existsSync(fullPath)) {
      return fullPath;
    }
  }

  return null;
}
