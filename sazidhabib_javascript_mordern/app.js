/**
 * Standalone Production Server for cPanel Node.js App
 * Runs with pure Node.js standard library - zero external dependencies required!
 */
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.resolve(__dirname, 'dist');
const DATA_DIR = path.resolve(__dirname, 'data');
const CONTENT_FILE = path.resolve(DATA_DIR, 'portfolio-content.json');
const UPLOADS_DIR = path.resolve(DIST_DIR, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
};

const getAdminPassword = () => {
  try {
    const envPath = path.resolve(__dirname, '.env.local');
    if (fs.existsSync(envPath)) {
      const match = fs.readFileSync(envPath, 'utf8').match(/ADMIN_PASSWORD=["']?([^"'\r\n]+)/);
      if (match) return match[1];
    }
  } catch (e) {}
  return process.env.ADMIN_PASSWORD || 'sazidadmin123';
};

const parseJsonBody = (req) => new Promise((resolve) => {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try { resolve(JSON.parse(body)); }
    catch (e) { resolve({}); }
  });
});

const sendJson = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

const server = http.createServer(async (req, res) => {
  const url = req.url.split('?')[0];

  // API ROUTING
  if (url.startsWith('/api/admin/')) {
    // 1. Login
    if (req.method === 'POST' && url === '/api/admin/login') {
      const body = await parseJsonBody(req);
      if (body.password === getAdminPassword()) {
        return sendJson(res, 200, { ok: true, token: 'sazid-admin-session-token' });
      }
      return sendJson(res, 401, { ok: false, error: 'Incorrect admin password' });
    }

    // 2. Read Content
    if (req.method === 'GET' && url === '/api/admin/content') {
      if (fs.existsSync(CONTENT_FILE)) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return fs.createReadStream(CONTENT_FILE).pipe(res);
      }
      return sendJson(res, 404, { error: 'Content file not found' });
    }

    // Auth validation for write endpoints
    const authHeader = req.headers.authorization || '';
    if (!authHeader.includes('sazid-admin-session-token')) {
      return sendJson(res, 401, { ok: false, error: 'Unauthorized' });
    }

    // 3. Media List
    if (req.method === 'GET' && url === '/api/admin/media') {
      const allFiles = [];
      const seen = new Set();
      const scanDir = (dir, typePrefix = 'general') => {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            scanDir(fullPath, entry.name);
          } else if (entry.isFile()) {
            const relUrl = fullPath.replace(DIST_DIR, '').replace(/\\/g, '/');
            if (!seen.has(relUrl)) {
              seen.add(relUrl);
              const stat = fs.statSync(fullPath);
              allFiles.push({
                name: entry.name,
                type: typePrefix,
                url: relUrl,
                size: stat.size,
                mtime: stat.mtime
              });
            }
          }
        }
      };
      scanDir(UPLOADS_DIR);
      allFiles.sort((a, b) => new Date(b.mtime) - new Date(a.mtime));
      return sendJson(res, 200, { ok: true, files: allFiles });
    }

    // 4. Save Content
    if (req.method === 'POST' && url === '/api/admin/content') {
      try {
        const body = await parseJsonBody(req);
        if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
        fs.writeFileSync(CONTENT_FILE, JSON.stringify(body, null, 2), 'utf8');

        const publicContentFile = path.join(__dirname, 'public/data/portfolio-content.json');
        try {
          if (fs.existsSync(path.dirname(publicContentFile))) {
            fs.writeFileSync(publicContentFile, JSON.stringify(body, null, 2), 'utf8');
          }
        } catch (e) {}

        // Pre-hydrate dist/index.html
        const distIndex = path.join(DIST_DIR, 'index.html');
        if (fs.existsSync(distIndex)) {
          let html = fs.readFileSync(distIndex, 'utf8');
          html = html.replace(/window\.__C\s*=\s*\{[\s\S]*?\};/, `window.__C=${JSON.stringify(body)};`);
          fs.writeFileSync(distIndex, html, 'utf8');
        }
        return sendJson(res, 200, { ok: true, message: 'Content saved successfully!' });
      } catch (err) {
        return sendJson(res, 500, { ok: false, error: err.message });
      }
    }

    // 5. Upload File
    if (req.method === 'POST' && url === '/api/admin/upload') {
      try {
        const body = await parseJsonBody(req);
        const { name, type = 'projects', base64 } = body;
        if (!name || !base64) return sendJson(res, 400, { ok: false, error: 'Missing name or data' });

        const targetFolder = path.join(UPLOADS_DIR, type);
        if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder, { recursive: true });

        const ext = path.extname(name);
        const baseName = path.basename(name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
        const cleanName = `${baseName}-${Date.now().toString().slice(-6)}${ext}`;
        const targetPath = path.join(targetFolder, cleanName);

        const dataBuffer = Buffer.from(base64.replace(/^data:[^;]+;base64,/, ''), 'base64');
        fs.writeFileSync(targetPath, dataBuffer);

        const publicUrl = `/uploads/${type}/${cleanName}`;
        return sendJson(res, 200, { ok: true, url: publicUrl, name: cleanName, type });
      } catch (err) {
        return sendJson(res, 500, { ok: false, error: err.message });
      }
    }

    return sendJson(res, 404, { error: 'Not found' });
  }

  // STATIC FILE SERVING
  let safePath = path.normalize(path.join(DIST_DIR, decodeURIComponent(url))).replace(/^(\.\.[\/\\])+/, '');
  if (!safePath.startsWith(DIST_DIR)) safePath = path.join(DIST_DIR, 'index.html');

  if (fs.existsSync(safePath) && fs.statSync(safePath).isDirectory()) {
    safePath = path.join(safePath, 'index.html');
  }

  if (fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
    const ext = path.extname(safePath).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';
    const stat = fs.statSync(safePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range && (ext === '.mp4' || ext === '.webm')) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(safePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': mime,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      };
      res.writeHead(206, head);
      return file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': mime,
        'Accept-Ranges': 'bytes',
      };
      if (ext === '.html') {
        head['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      }
      res.writeHead(200, head);
      return fs.createReadStream(safePath).pipe(res);
    }
  }

  // Fallback to index.html for SPA routes
  const fallbackIndex = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(fallbackIndex)) {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=UTF-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    return fs.createReadStream(fallbackIndex).pipe(res);
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404 Not Found');
});

server.listen(PORT, () => {
  console.log(`Portfolio server running on port ${PORT}`);
});

