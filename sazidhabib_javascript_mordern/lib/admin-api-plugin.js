import fs from 'fs';
import path from 'path';

export function adminApiPlugin() {
  const contentPath = path.resolve(process.cwd(), 'data/portfolio-content.json');
  const indexPath = path.resolve(process.cwd(), 'index.html');
  const uploadsDir = path.resolve(process.cwd(), 'public/uploads');

  const getAdminPassword = () => {
    try {
      const envPath = path.resolve(process.cwd(), '.env.local');
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/ADMIN_PASSWORD=["']?([^"'\r\n]+)/);
        if (match) return match[1];
      }
    } catch (e) {}
    return process.env.ADMIN_PASSWORD || 'sazidadmin123';
  };

  return {
    name: 'admin-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url.split('?')[0];
        if (!url.startsWith('/api/admin/')) {
          return next();
        }

        // Helper to parse JSON body with large payload limit (up to 50MB for video/image uploads)
        const parseBody = () => new Promise((resolve) => {
          let data = '';
          req.on('data', chunk => { data += chunk; });
          req.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              resolve({});
            }
          });
        });

        // 1. Login
        if (req.method === 'POST' && url === '/api/admin/login') {
          const body = await parseBody();
          const expected = getAdminPassword();
          if (body.password === expected) {
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ ok: true, token: 'sazid-admin-session-token' }));
          } else {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ ok: false, error: 'Incorrect admin password' }));
          }
        }

        // 2. Get Content (Public or Admin read)
        if (req.method === 'GET' && url === '/api/admin/content') {
          try {
            if (!fs.existsSync(contentPath)) {
              res.statusCode = 404;
              return res.end(JSON.stringify({ error: 'portfolio-content.json not found' }));
            }
            const data = fs.readFileSync(contentPath, 'utf8');
            res.setHeader('Content-Type', 'application/json');
            return res.end(data);
          } catch (e) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: e.message }));
          }
        }

        // Auth check for write/upload/media operations
        const authHeader = req.headers.authorization || '';
        const isAuth = authHeader.includes('sazid-admin-session-token');
        if (!isAuth) {
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ ok: false, error: 'Unauthorized. Please sign in.' }));
        }

        // 3. Centralized Media List: GET /api/admin/media
        if (req.method === 'GET' && url === '/api/admin/media') {
          try {
            const types = ['projects', 'resumes', 'testimonials', 'icons', 'experience', 'general'];
            const allFiles = [];

            types.forEach(type => {
              const typeDir = path.join(uploadsDir, type);
              if (fs.existsSync(typeDir)) {
                const files = fs.readdirSync(typeDir);
                files.forEach(file => {
                  try {
                    const filePath = path.join(typeDir, file);
                    const stat = fs.statSync(filePath);
                    if (stat.isFile()) {
                      allFiles.push({
                        name: file,
                        type,
                        url: `/uploads/${type}/${file}`,
                        size: stat.size,
                        mtime: stat.mtime
                      });
                    }
                  } catch (err) {}
                });
              }
            });

            // Sort newest first
            allFiles.sort((a, b) => new Date(b.mtime) - new Date(a.mtime));

            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ ok: true, files: allFiles }));
          } catch (e) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ ok: false, error: e.message }));
          }
        }

        // 4. Delete Media File: DELETE /api/admin/media
        if (req.method === 'DELETE' && url === '/api/admin/media') {
          try {
            const body = await parseBody();
            const { url: fileUrl } = body;
            if (!fileUrl || !fileUrl.startsWith('/uploads/')) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ ok: false, error: 'Invalid file URL' }));
            }

            const relativePath = fileUrl.replace(/^\/uploads\//, '');
            const targetPath = path.join(uploadsDir, relativePath);

            // Security check against directory traversal
            if (!targetPath.startsWith(uploadsDir)) {
              res.statusCode = 403;
              return res.end(JSON.stringify({ ok: false, error: 'Access denied' }));
            }

            if (fs.existsSync(targetPath)) {
              fs.unlinkSync(targetPath);
            }

            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ ok: true, message: 'File deleted' }));
          } catch (e) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ ok: false, error: e.message }));
          }
        }

        // 5. Save Content & Pre-hydrate index.html
        if (req.method === 'POST' && url === '/api/admin/content') {
          try {
            const body = await parseBody();
            fs.writeFileSync(contentPath, JSON.stringify(body, null, 2), 'utf8');

            // Sync index.html window.__C pre-hydration
            if (fs.existsSync(indexPath)) {
              let html = fs.readFileSync(indexPath, 'utf8');
              const jsonString = JSON.stringify(body);
              html = html.replace(/window\.__C\s*=\s*\{[\s\S]*?\};/, `window.__C=${jsonString};`);
              fs.writeFileSync(indexPath, html, 'utf8');
            }

            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ ok: true, message: 'Content saved & published successfully!' }));
          } catch (e) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ ok: false, error: e.message }));
          }
        }

        // 6. File Upload (Base64 file receiver)
        if (req.method === 'POST' && url === '/api/admin/upload') {
          try {
            const body = await parseBody();
            const { name, type = 'projects', base64 } = body;
            if (!name || !base64) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ ok: false, error: 'Missing filename or base64 data' }));
            }

            const targetDir = path.join(uploadsDir, type);
            if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

            const ext = path.extname(name);
            const rawBase = path.basename(name, ext);
            const cleanBase = rawBase.replace(/[^a-zA-Z0-9_-]/g, '_');
            const cleanName = `${cleanBase}-${Date.now().toString().slice(-6)}${ext}`;
            const targetPath = path.join(targetDir, cleanName);

            const base64Data = base64.replace(/^data:[^;]+;base64,/, '');
            fs.writeFileSync(targetPath, Buffer.from(base64Data, 'base64'));

            const publicUrl = `/uploads/${type}/${cleanName}`;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ ok: true, url: publicUrl, name: cleanName, type }));
          } catch (e) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ ok: false, error: e.message }));
          }
        }

        next();
      });
    }
  };
}
