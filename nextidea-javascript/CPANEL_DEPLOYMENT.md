# cPanel Deployment Guide — Next Idea Solution

> **This is a Node.js app (not a static site).** It requires cPanel's "Setup Node.js App" feature or SSH access to run.

---

## Prerequisites

- cPanel with **Node.js Selector** (CloudLinux) or SSH access
- **Node.js 18+** available on the server
- **MySQL database** created in cPanel
- At least **512MB RAM** available (app uses ~150-200MB)

---

## Method 1: cPanel Node.js Selector (Recommended)

### Step 1: Upload Project Files

1. Compress your project folder into a **ZIP** (exclude `node_modules` and `.next`)
2. Go to **cPanel → File Manager**
3. Navigate to your desired directory (e.g., `/home/username/nextidea`)
4. Upload and extract the ZIP file

### Step 2: Create MySQL Database

1. Go to **cPanel → MySQL Databases**
2. Create a new database (e.g., `username_nextidea`)
3. Create a database user and assign it to the database with **All Privileges**
4. Import your database schema via **phpMyAdmin**

### Step 3: Configure Environment Variables

Create/edit `.env` file in your project directory:

```env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=username_nextidea
DATABASE_PASSWORD=your_secure_password
DATABASE_NAME=username_nextidea

JWT_ACCESS_SECRET=your_random_secret_here
JWT_REFRESH_SECRET=your_random_secret_here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

SESSION_COOKIE_NAME=nextidea_session
SESSION_SECURE=true

NODE_ENV=production
PORT=3000
```

### Step 4: Setup Node.js App in cPanel

1. Go to **cPanel → Setup Node.js App**
2. Click **Create Application**
3. Configure:
   - **Node.js version**: 18.x or higher
   - **Application mode**: Production
   - **Application root**: `/home/username/nextidea` (your project path)
   - **Application URL**: your domain
   - **Application startup file**: `server.js`
4. Click **Create**

### Step 5: Install Dependencies & Build

In the Node.js App panel, click **Run NPM Install**, or via SSH:

```bash
# Enter the virtual environment (shown in cPanel Node.js panel)
source /home/username/nodevenv/nextidea/18/bin/activate

# Install dependencies
npm ci --omit=dev

# Build with memory limit
NODE_OPTIONS="--max-old-space-size=512" npm run build

# Copy required files to standalone
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
cp server.js .next/standalone/server.js
cp .env .next/standalone/.env
```

### Step 6: Start the Application

In the cPanel Node.js panel, click **Restart** or via SSH:

```bash
# Start with memory limit
NODE_OPTIONS="--max-old-space-size=256" node .next/standalone/server.js
```

---

## Method 2: SSH + PM2 (Advanced)

If you have SSH access and PM2 installed:

```bash
# SSH into your server
ssh username@your-server.com

# Navigate to project
cd /home/username/nextidea

# Run the deploy script
chmod +x deploy.sh
bash deploy.sh

# Start with PM2 (auto-restarts, memory limits)
cd .next/standalone
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Auto-start on server reboot
```

---

## Memory Optimization Details

This project is configured for **low RAM usage**:

| Setting | Value | Purpose |
|---------|-------|---------|
| V8 Heap Limit | 256MB | Prevents Node.js from using too much memory |
| PM2 Max Memory | 200MB | Auto-restarts if exceeded |
| MySQL Pool | 5 connections max | Reduces idle memory |
| MySQL Idle Timeout | 30 seconds | Frees unused connections |
| MySQL Max Idle | 3 connections | Minimum idle connections |
| Source Maps | Disabled | Reduces build output size |
| Image Optimization | Disabled | Uses less CPU/RAM at runtime |
| Workers | Disabled | Single-threaded for low RAM |
| Compression | Enabled | Smaller responses |

**Expected memory usage**: ~120-200MB in production.

---

## .htaccess (If Using Apache Reverse Proxy)

If your cPanel uses Apache and your Node.js app runs on port 3000, place the `.htaccess` file in `public_html`:

```apache
RewriteEngine On
RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
```

> **Note**: Most cPanel Node.js Selector setups handle the proxy automatically. You only need `.htaccess` if configuring manually.

---

## Updating the Site

```bash
# Pull latest code (if using Git)
git pull origin main

# Rebuild
NODE_OPTIONS="--max-old-space-size=512" npm run build

# Copy assets to standalone
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
cp server.js .next/standalone/server.js

# Restart
pm2 restart nextidea
# OR in cPanel: click Restart in Node.js App panel
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Build runs out of memory** | Use `NODE_OPTIONS="--max-old-space-size=1024" npm run build` |
| **App crashes on start** | Check `logs/err.log` or cPanel error logs |
| **Database connection refused** | Verify MySQL credentials in `.env` and that the DB exists |
| **502 Bad Gateway** | App isn't running — restart via cPanel or PM2 |
| **Static files not loading** | Ensure `public/` and `.next/static/` are copied to standalone |
| **Port already in use** | Change PORT in `.env` or kill the existing process |
