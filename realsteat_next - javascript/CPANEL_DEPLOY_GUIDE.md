# 🚀 cPanel Deployment Guide — presidentpropertiesltd.com

This guide provides step-by-step instructions to deploy your Next.js frontend and Express backend to cPanel using the automated deployment packager.

---

## Step 1: Run the Automated Build Local Packaging Script

1. Open **PowerShell** in your project root.
2. Run the deployment packager:
   ```powershell
   .\deploy.ps1
   ```
   This script will:
   - Clean up old build outputs.
   - Compile the Next.js production build using `.env.production` (statically embedding the production API URL `https://presidentpropertiesltd.com/api` so that no localhost requests are made in production).
   - Convert all Windows build paths to Linux-compatible format.
   - Bundle all backend (`server-api/`, `server.js`) and compiled frontend assets into a `deploy_package/` folder.
   - Generate `deploy_package.zip` ready for cPanel.

---

## Step 2: Upload to cPanel

1. Log in to your **cPanel**.
2. Open **File Manager**.
3. Create a subdirectory outside of your `public_html` directory for security (e.g. `/home/username/president_app`).
4. **Upload** the generated `deploy_package.zip` file to that directory.
5. Right-click the uploaded file and click **Extract**. Delete the `.zip` file after extraction to save server storage.

---

## Step 3: Configure Environment Variables

1. Inside your extracted folder, locate and edit the `.env` file (which was copied and renamed from `.env.production`).
2. Update the cPanel database credentials to match your live cPanel MySQL database details:
   ```env
   MYSQL_HOST=localhost
   MYSQL_USER=your_cpanel_db_user
   MYSQL_PASSWORD=your_cpanel_db_password
   MYSQL_DATABASE=your_cpanel_db_name
   MYSQL_PORT=3306
   ```

---

## Step 4: Configure Node.js Selector in cPanel

1. In cPanel, search for **Setup Node.js App** (or Node.js Selector).
2. Click **Create Application**.
3. Configure the following fields:
   - **Node.js version**: Select `18.x` or `20.x`.
   - **Application mode**: Select `Production`.
   - **Application root**: Path to your application folder (e.g. `president_app`).
   - **Application URL**: `presidentpropertiesltd.com` (select the domain or subdomain from the dropdown).
   - **Application startup file**: `server.js`
4. Click **Create**.

---

## Step 5: Install Dependencies & Start the App

1. Scroll down to the bottom of the Node.js selector page.
2. Click the **Run npm install** button.
3. Wait for the installation to finish successfully.
4. Click the **Restart** button to run the server.
5. Visit your domain `https://presidentpropertiesltd.com` to confirm that all pages load correctly without any browser permission prompts or network issues.
