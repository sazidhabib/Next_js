import fs from 'fs';
import path from 'path';

export function adminApiPlugin() {
  const contentPath = path.resolve(process.cwd(), 'data/portfolio-content.json');
  const indexPath = path.resolve(process.cwd(), 'index.html');
  const publicDir = path.resolve(process.cwd(), 'public');
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
            const seenUrls = new Set();
            const allowedExts = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.mp4', '.webm', '.pdf'];

            // 3.1. Scan files directly in uploadsDir (public/uploads)
            if (fs.existsSync(uploadsDir)) {
              const rootFiles = fs.readdirSync(uploadsDir);
              rootFiles.forEach(file => {
                try {
                  const filePath = path.join(uploadsDir, file);
                  const stat = fs.statSync(filePath);
                  if (stat.isFile()) {
                    const ext = path.extname(file).toLowerCase();
                    if (allowedExts.includes(ext)) {
                      let type = 'projects';
                      if (file.toLowerCase().includes('resume')) type = 'resumes';
                      else if (file.toLowerCase().includes('icon') || file.toLowerCase().includes('logo')) type = 'icons';
                      const fileUrl = `/uploads/${file}`;
                      if (!seenUrls.has(fileUrl)) {
                        seenUrls.add(fileUrl);
                        allFiles.push({
                          name: file,
                          type,
                          url: fileUrl,
                          size: stat.size,
                          mtime: stat.mtime
                        });
                      }
                    }
                  }
                } catch (err) {}
              });
            }

            // 3.2. Scan subdirectories in uploadsDir (public/uploads/<type>)
            types.forEach(type => {
              const typeDir = path.join(uploadsDir, type);
              if (fs.existsSync(typeDir)) {
                const files = fs.readdirSync(typeDir);
                files.forEach(file => {
                  try {
                    const filePath = path.join(typeDir, file);
                    const stat = fs.statSync(filePath);
                    if (stat.isFile()) {
                      const ext = path.extname(file).toLowerCase();
                      if (allowedExts.includes(ext)) {
                        const fileUrl = `/uploads/${type}/${file}`;
                        if (!seenUrls.has(fileUrl)) {
                          seenUrls.add(fileUrl);
                          allFiles.push({
                            name: file,
                            type,
                            url: fileUrl,
                            size: stat.size,
                            mtime: stat.mtime
                          });
                        }
                      }
                    }
                  } catch (err) {}
                });
              }
            });

            // 3.3. Scan public/src/assets for existing portfolio media & icons
            const srcAssetsDir = path.resolve(process.cwd(), 'public/src/assets');
            if (fs.existsSync(srcAssetsDir)) {
              const scanFolder = (dir, subPath = '') => {
                const entries = fs.readdirSync(dir);
                entries.forEach(entry => {
                  const full = path.join(dir, entry);
                  const stat = fs.statSync(full);
                  if (stat.isFile()) {
                    const ext = path.extname(entry).toLowerCase();
                    if (allowedExts.includes(ext)) {
                      let t = 'projects';
                      if (subPath.includes('tech') || subPath.includes('company')) t = 'icons';
                      else if (entry.toLowerCase().includes('resume')) t = 'resumes';
                      const fileUrl = `/src/assets/${subPath ? subPath + '/' : ''}${entry}`;
                      if (!seenUrls.has(fileUrl)) {
                        seenUrls.add(fileUrl);
                        allFiles.push({
                          name: entry,
                          type: t,
                          url: fileUrl,
                          size: stat.size,
                          mtime: stat.mtime
                        });
                      }
                    }
                  } else if (stat.isDirectory() && entry !== 'node_modules') {
                    scanFolder(full, subPath ? `${subPath}/${entry}` : entry);
                  }
                });
              };
              scanFolder(srcAssetsDir);
            }

            // 3.4. Scan root public directory for resumes and key assets
            if (fs.existsSync(publicDir)) {
              const rootEntries = fs.readdirSync(publicDir);
              rootEntries.forEach(entry => {
                const full = path.join(publicDir, entry);
                const stat = fs.statSync(full);
                if (stat.isFile()) {
                  const ext = path.extname(entry).toLowerCase();
                  if (allowedExts.includes(ext)) {
                    let t = 'general';
                    if (entry.toLowerCase().includes('resume')) t = 'resumes';
                    else if (entry.toLowerCase().includes('logo') || ext === '.svg' || ext === '.ico') t = 'icons';
                    const fileUrl = `/${entry}`;
                    if (!seenUrls.has(fileUrl)) {
                      seenUrls.add(fileUrl);
                      allFiles.push({
                        name: entry,
                        type: t,
                        url: fileUrl,
                        size: stat.size,
                        mtime: stat.mtime
                      });
                    }
                  }
                }
              });
            }

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
            if (!fileUrl) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ ok: false, error: 'Invalid file URL' }));
            }

            let targetPath = null;
            if (fileUrl.startsWith('/uploads/')) {
              targetPath = path.join(uploadsDir, fileUrl.replace(/^\/uploads\//, ''));
            } else if (fileUrl.startsWith('/src/assets/')) {
              targetPath = path.join(publicDir, fileUrl.replace(/^\//, ''));
            } else if (fileUrl.startsWith('/')) {
              targetPath = path.join(publicDir, fileUrl.replace(/^\//, ''));
            }

            // Security check against directory traversal
            if (!targetPath || !targetPath.startsWith(publicDir)) {
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

            const publicContentPath = path.resolve(process.cwd(), 'public/data/portfolio-content.json');
            try {
              if (fs.existsSync(path.dirname(publicContentPath))) {
                fs.writeFileSync(publicContentPath, JSON.stringify(body, null, 2), 'utf8');
              }
            } catch (err) {}

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
