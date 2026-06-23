# 🚀 cPanel Deployment Guide — pathakbondhu.com

Complete step-by-step guide to deploy your Next.js + Express application to cPanel.

---

## Prerequisites

- ✅ cPanel access with **Node.js Selector** (Setup Node.js App)
- ✅ MySQL database created in cPanel
- ✅ Domain `pathakbondhu.com` pointed to your cPanel server
- ✅ SSL certificate installed (most cPanel have free AutoSSL)
- ✅ Node.js installed locally for building

---

## Step 1: Build Locally

Open **PowerShell** in your project root and run:

```powershell
.\deploy.ps1
```

This will:
1. Clean previous builds
2. Run `npm run build` (Next.js production build)
3. Assemble all needed files into `deploy_package/`
4. Create `deploy_package.zip`

> **If the script fails**, you can also build manually:
> ```powershell
> npm run build
> ```
> Then manually zip the files listed in Step 2.

---

## Step 2: What Gets Deployed

The zip includes these files/directories:

| Item | Purpose |
|------|---------|
| `.next/` | Next.js production build (minus cache) |
| `app/` | Next.js App Router pages (for SSR) |
| `server.js` | Custom Express + Next.js server |
| `middleware.js` | Next.js auth middleware |
| `next.config.mjs` | Next.js configuration |
| `package.json` | Dependencies manifest |
| `package-lock.json` | Lock file for consistent installs |
| `.npmrc` | NPM config (legacy-peer-deps) |
| `.htaccess` | Apache/Passenger routing + caching |
| `.env` | Environment variables (from .env.production) |
| `controllers/` | Express API controllers |
| `config/` | Sequelize & app configuration |
| `db/` | Database connection setup |
| `lib/` | Shared libraries |
| `middlewares/` | Express middlewares |
| `migrations/` | Database migration files |
| `models/` | Sequelize models |
| `router/` | Express API routes |
| `services/` | Business logic services |
| `utils/` | Utility functions |
| `validators/` | Input validators |
| `public/` | Static public assets |
| `uploads/` | User-uploaded files |

---

## Step 3: Create MySQL Database in cPanel

1. Log in to **cPanel**
2. Go to **MySQL® Databases**
3. Create a new database (e.g., `yourusername_pathok`)
4. Create a new database user with a strong password
5. **Add the user to the database** with **ALL PRIVILEGES**
6. Note down:
   - Database name: `yourusername_pathok`
   - Username: `yourusername_dbuser`
   - Password: `your_strong_password`

---

## Step 4: Upload to cPanel

1. Log in to **cPanel → File Manager**
2. Navigate to your **application root** directory:
   - If using a dedicated folder: create `/home/yourusername/pathakbondhu` (outside public_html)
   - If using domain root: use `/home/yourusername/public_html`
   
   > **Recommended**: Use a folder **outside** `public_html` and let Node.js Selector handle routing.

3. **Upload** `deploy_package.zip` to the app directory
4. **Right-click → Extract** the zip file
5. After extraction, delete the zip to save space

---

## Step 5: Edit .env on Server

1. In **File Manager**, navigate to your app directory
2. Open/Edit the `.env` file
3. Update with your **cPanel MySQL credentials**:

```env
MYSQL_HOST=localhost
MYSQL_USER=yourusername_dbuser
MYSQL_PASSWORD=your_strong_password
MYSQL_DATABASE=yourusername_pathok
MYSQL_PORT=3306

PORT=5000
SERVER_PORT=5000
NODE_ENV=production

FRONTEND_URL=https://pathakbondhu.com
NEXT_PUBLIC_API_URL=https://pathakbondhu.com/api
NEXT_PUBLIC_API_BASE_URL=https://pathakbondhu.com

JWT_SECRET_KEY=CHANGE_THIS_TO_A_LONG_RANDOM_STRING
```

> ⚠️ **IMPORTANT**: `NEXT_PUBLIC_*` variables are baked into the Next.js build at build time. If you change these, you must rebuild locally and re-upload.

---

## Step 6: Setup Node.js Application in cPanel

1. In cPanel, search for **"Setup Node.js App"**
2. Click **"CREATE APPLICATION"**
3. Fill in:

| Setting | Value |
|---------|-------|
| **Node.js version** | `18.x` or `20.x` (latest LTS available) |
| **Application mode** | `Production` |
| **Application root** | Path to your app (e.g., `pathakbondhu` or `public_html`) |
| **Application URL** | `pathakbondhu.com` |
| **Application startup file** | `server.js` |

4. Click **"CREATE"**

---

## Step 7: Set Environment Variables (Optional Method)

You can also set env vars directly in the Node.js Selector:

1. Scroll down to **"Environment variables"** section
2. Add each variable from your `.env`:
   - `NODE_ENV` = `production`
   - `MYSQL_HOST` = `localhost`
   - `MYSQL_USER` = `yourusername_dbuser`
   - `MYSQL_PASSWORD` = `your_strong_password`
   - `MYSQL_DATABASE` = `yourusername_pathok`
   - `JWT_SECRET_KEY` = `your_secret`
   - `PORT` = `5000`

> The `.env` file method (Step 5) is usually sufficient. Use this only if `.env` isn't being read.

---

## Step 8: Install Dependencies

1. In the **Node.js Selector**, find the **"Run NPM Install"** button
2. Click it and wait for completion
3. If it fails, open the **Terminal** (or SSH) and run:

```bash
# Enter the virtual environment first (copy the command from Node.js Selector)
source /home/yourusername/nodevenv/pathakbondhu/20/bin/activate

# Navigate to app directory
cd ~/pathakbondhu

# Install dependencies
npm install --production
```

> **If `npm install` fails with peer dependency errors**, the `.npmrc` file with `legacy-peer-deps=true` should handle it. If not, run:
> ```bash
> npm install --production --legacy-peer-deps
> ```

---

## Step 9: Run Database Migrations

If this is a fresh deployment and you need to set up database tables:

```bash
# Make sure you're in the Node.js virtual env
source /home/yourusername/nodevenv/pathakbondhu/20/bin/activate
cd ~/pathakbondhu

# Run migrations
node run-migration.js
```

> The server also auto-creates missing tables on startup (see `server.js` lines 95-105).

---

## Step 10: Start / Restart the Application

1. Go back to **"Setup Node.js App"** in cPanel
2. Click **"RESTART"**
3. Visit **https://pathakbondhu.com** to verify

---

## Troubleshooting

### Check Logs
```bash
# Passenger/Node.js error log location (check Node.js Selector for exact path)
cat /home/yourusername/logs/pathakbondhu.log

# Or check stderr log
cat /home/yourusername/pathakbondhu/passenger.log
```

### Common Issues

| Issue | Solution |
|-------|----------|
| **502 Bad Gateway** | Check Node.js Selector → Restart. Check logs for startup errors. |
| **"Cannot find module"** | Run `npm install` again in the app directory. |
| **Database connection refused** | Verify MySQL credentials in `.env`. Ensure the user has permissions. |
| **CORS errors** | Already configured in `server.js` for `pathakbondhu.com`. |
| **Images not loading** | Ensure `uploads/` directory exists and has correct permissions (`chmod 755`). |
| **CSS/JS not loading** | Check that `.next/` directory was uploaded correctly. |
| **"ENOMEM" during install** | cPanel has limited RAM. Try `npm install --production` to skip devDependencies. |
| **Blank page** | Check browser console. Likely a `NEXT_PUBLIC_API_URL` mismatch — must rebuild. |

### Fix Permissions
```bash
cd ~/pathakbondhu
chmod -R 755 uploads/
chmod -R 755 .next/
chmod 644 .env
```

### Rebuild on Server (if needed)
```bash
source /home/yourusername/nodevenv/pathakbondhu/20/bin/activate
cd ~/pathakbondhu
npm run build
```

> ⚠️ This requires enough RAM on the server. If it fails, always build locally and re-upload `.next/`.

---

## Updating the Site

When you make changes and need to re-deploy:

1. Make your code changes locally
2. Run `.\deploy.ps1` again
3. Upload the new `deploy_package.zip` to cPanel
4. Extract (overwrite existing files)
5. In Node.js Selector → Click **"RESTART"**

> **Tip**: For small backend-only changes, you can upload individual files instead of the full package.

---

## Architecture Overview

```
pathakbondhu.com (cPanel)
├── Phusion Passenger (Apache module)
│   └── Proxies all requests to Node.js
│
├── server.js (Express + Next.js custom server)
│   ├── /api/* → Express API routes
│   ├── /uploads/* → Static file serving
│   └── /* → Next.js SSR/SSG pages
│
├── .next/ → Pre-built Next.js pages
├── MySQL → Database (Sequelize ORM)
└── uploads/ → User-uploaded images
```
