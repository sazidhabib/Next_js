import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import net from 'node:net';
import path from 'node:path';

const DATA_ROOT = path.join(/*turbopackIgnore: true*/ process.cwd(), '.cineflow_data');
const UPLOADS_DIR = path.join(DATA_ROOT, 'uploads');
const CACHE_DIR = path.join(DATA_ROOT, 'cache');
const RENDERS_DIR = path.join(DATA_ROOT, 'renders');

export async function ensureRenderDirs() {
  await Promise.all([
    fs.mkdir(UPLOADS_DIR, { recursive: true }),
    fs.mkdir(CACHE_DIR, { recursive: true }),
    fs.mkdir(RENDERS_DIR, { recursive: true }),
  ]);
}

export function sanitizeFileName(name: string): string {
  const base = path.basename(name).replace(/[^a-zA-Z0-9._-]/g, '_');
  return base || 'media_file';
}

export function getUploadFilePath(assetId: string, originalName: string): string {
  const safeAssetId = assetId.replace(/[^a-zA-Z0-9_-]/g, '');
  const safeName = sanitizeFileName(originalName);
  return path.join(UPLOADS_DIR, `${safeAssetId}_${safeName}`);
}

export async function findUploadedAssetFile(assetId: string): Promise<string | null> {
  await ensureRenderDirs();
  const safeAssetId = assetId.replace(/[^a-zA-Z0-9_-]/g, '');
  if (!safeAssetId) return null;
  const entries = await fs.readdir(UPLOADS_DIR);
  const match = entries.find((entry) => entry.startsWith(`${safeAssetId}_`));
  return match ? path.join(UPLOADS_DIR, match) : null;
}

export function getRenderOutputPath(jobId: string, fileName: string, ext: string): string {
  const safeJobId = jobId.replace(/[^a-zA-Z0-9_-]/g, '');
  const safeBase = sanitizeFileName(fileName).replace(/\.[^.]+$/, '') || 'export';
  const safeExt = ext.replace(/[^a-zA-Z0-9]/g, '') || 'mp4';
  return path.join(RENDERS_DIR, `${safeJobId}_${safeBase}.${safeExt}`);
}

function isDisallowedHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (
    lower === 'localhost' ||
    lower === '127.0.0.1' ||
    lower === '::1' ||
    lower === '0.0.0.0' ||
    lower.endsWith('.local') ||
    lower.endsWith('.internal')
  ) {
    return true;
  }

  if (net.isIPv4(lower)) {
    const parts = lower.split('.').map(Number);
    if (
      parts[0] === 10 ||
      parts[0] === 127 ||
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
      (parts[0] === 192 && parts[1] === 168) ||
      (parts[0] === 169 && parts[1] === 254)
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Resolves a clip's media source to a local file path (uploaded asset or cached remote media).
 */
export async function resolveMediaSourceToLocalPath(
  assetUrl: string | undefined,
  mediaAssetId?: string
): Promise<string | null> {
  await ensureRenderDirs();

  if (mediaAssetId) {
    const uploaded = await findUploadedAssetFile(mediaAssetId);
    if (uploaded) return uploaded;
  }

  if (!assetUrl) return null;

  if (assetUrl.startsWith('/api/media/file/')) {
    const idPart = assetUrl.replace('/api/media/file/', '').split('/')[0];
    return findUploadedAssetFile(idPart);
  }

  let parsed: URL;
  try {
    parsed = new URL(assetUrl);
  } catch {
    return null;
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return null;
  }
  if (isDisallowedHost(parsed.hostname)) {
    throw new Error(`Blocked disallowed remote media host: ${parsed.hostname}`);
  }

  const hash = crypto.createHash('sha256').update(assetUrl).digest('hex').slice(0, 20);
  const urlExt = path.extname(parsed.pathname).replace(/[^a-zA-Z0-9.]/g, '') || '.bin';
  const cachedPath = path.join(CACHE_DIR, `${hash}${urlExt}`);

  try {
    const stat = await fs.stat(cachedPath);
    if (stat.size > 0) return cachedPath;
  } catch {
    // Not cached yet
  }

  const response = await fetch(assetUrl, { signal: AbortSignal.timeout(45000) });
  if (!response.ok) {
    throw new Error(`Failed to fetch remote media (${response.status}): ${assetUrl}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  if (buffer.byteLength === 0) {
    throw new Error(`Downloaded empty media file from ${assetUrl}`);
  }

  await fs.writeFile(cachedPath, buffer);
  return cachedPath;
}
