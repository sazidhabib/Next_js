# cPanel Deployment Guide 🚀

This package contains your built and optimized application, ready for cPanel.

### 1. Upload & Extract
1. Log in to your cPanel.
2. Open **File Manager**.
3. Create a folder for your app (e.g., `public_html/app` or a separate folder outside `public_html`).
4. **Upload** the `deploy_package.zip` file to that folder.
5. Right-click the file and select **Extract**.

### 2. Configure Node.js Selector
1. Search for **Setup Node.js App** in cPanel.
2. Click **Create Application**.
3. **Application root**: Path to the folder where you extracted the files.
4. **Application URL**: Your domain/subdomain.
5. **Application startup file**: `server.js`
6. Click **Create**.

### 3. Environment Variables (.env)
1. In the Node.js Selector, scroll down to **Environment variables**.
2. Add the following variables (refer to your `.env.local` for values):
   - `MYSQL_HOST`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`
   - `JWT_SECRET_KEY`
   - `PORT` (usually `5000` but cPanel handles it; set it if the app requires it).
   - `NODE_ENV`: `production`

---
### 4. Install Dependencies
1. Scroll down to the bottom of the Node.js Selector.
2. Click **Run npm install**.
3. Wait for it to finish.

### 5. Start the Application
1. Click **Restart** to ensure everything is running.
2. Visit your domain to see the live site.

---
### Troubleshooting
- **Logs**: If it fails, check the `passenger.log` file (you can find the path in the Node.js Selector).
- **.htaccess**: The included `.htaccess` helps with routing; ensure it is present in the `public_html` or the app root.
