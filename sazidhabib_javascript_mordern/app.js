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
  '.webm': 'video/webm',
  '.gif': 'image/gif'
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

// Relocates MP4 moov metadata atom before mdat for instant byte-0 browser streaming (FastStart)
function optimizeMp4Faststart(buffer) {
  try {
    let pos = 0;
    let ftyp = null, free = null, moov = null;
    const atoms = [];
    while (pos < buffer.length) {
      let size = buffer.readUInt32BE(pos);
      const type = buffer.slice(pos + 4, pos + 8).toString('ascii');
      if (size === 1) size = Number(buffer.readBigUInt64BE(pos + 8));
      else if (size === 0) size = buffer.length - pos;
      const atom = { type, pos, size };
      atoms.push(atom);
      if (type === 'ftyp' && !ftyp) ftyp = atom;
      else if (type === 'free' && !free && ftyp && pos === ftyp.size) free = atom;
      else if (type === 'moov') moov = atom;
      pos += size;
    }

    if (!moov) return buffer;
    const firstMdat = atoms.find(a => a.type === 'mdat');
    if (!firstMdat || moov.pos < firstMdat.pos) return buffer;

    const moovBuf = Buffer.from(buffer.subarray(moov.pos, moov.pos + moov.size));
    const shift = moov.size;

    function patchStco(buf, start, end) {
      let p = start;
      while (p + 8 <= end) {
        let sz = buf.readUInt32BE(p);
        const tp = buf.slice(p + 4, p + 8).toString('ascii');
        if (sz === 1) sz = Number(buf.readBigUInt64BE(p + 8));
        else if (sz === 0) sz = end - p;

        if (tp === 'stco') {
          const count = buf.readUInt32BE(p + 12);
          for (let i = 0; i < count; i++) {
            const entryPos = p + 16 + i * 4;
            const oldOffset = buf.readUInt32BE(entryPos);
            buf.writeUInt32BE(oldOffset + shift, entryPos);
          }
        } else if (tp === 'co64') {
          const count = buf.readUInt32BE(p + 12);
          for (let i = 0; i < count; i++) {
            const entryPos = p + 16 + i * 8;
            const oldOffset = buf.readBigUInt64BE(entryPos);
            buf.writeBigUInt64BE(oldOffset + BigInt(shift), entryPos);
          }
        } else if (['moov', 'trak', 'mdia', 'minf', 'stbl'].includes(tp)) {
          patchStco(buf, p + 8, p + sz);
        }
        p += sz;
      }
    }

    patchStco(moovBuf, 8, moovBuf.length);

    const prefixEnd = (free && free.pos === ftyp.size) ? (free.pos + free.size) : ftyp.size;
    const prefixBuf = buffer.subarray(0, prefixEnd);
    const mediaBuf = buffer.subarray(prefixEnd, moov.pos);
    const trailingBuf = buffer.subarray(moov.pos + moov.size);

    return Buffer.concat([prefixBuf, moovBuf, mediaBuf, trailingBuf]);
  } catch (err) {
    console.warn('Faststart optimization skipped:', err.message);
    return buffer;
  }
}

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

        let dataBuffer = Buffer.from(base64.replace(/^data:[^;]+;base64,/, ''), 'base64');
        if (ext.toLowerCase() === '.mp4') {
          dataBuffer = optimizeMp4Faststart(dataBuffer);
        }
        fs.writeFileSync(targetPath, dataBuffer);

        // Also sync to public/uploads if running with vite source folder
        try {
          const publicFolder = path.join(__dirname, 'public', 'uploads', type);
          if (fs.existsSync(path.join(__dirname, 'public'))) {
            if (!fs.existsSync(publicFolder)) fs.mkdirSync(publicFolder, { recursive: true });
            fs.writeFileSync(path.join(publicFolder, cleanName), dataBuffer);
          }
        } catch (e) {}

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

    const isMediaOrFont = ['.mp4', '.webm', '.webp', '.png', '.jpg', '.jpeg', '.svg', '.gif', '.woff2', '.woff'].includes(ext);

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
        'Cache-Control': 'public, max-age=31536000, immutable',
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
      } else if (isMediaOrFont) {
        head['Cache-Control'] = 'public, max-age=31536000, immutable';
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

