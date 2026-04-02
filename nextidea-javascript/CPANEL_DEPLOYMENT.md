# cPanel Deployment Guide

## Project is Ready for cPanel Deployment

The project has been configured for static export. All pages are pre-rendered as static HTML files.

---

## Files to Copy to cPanel

After running `npm run build`, copy the contents of the **`out`** folder to your cPanel's **`public_html`** directory.

### What's in the `out` folder:
```
out/
├── index.html                    # Home page
├── about/index.html              # About page
├── contact/index.html            # Contact page
├── protfolio/index.html          # Portfolio page
├── services/*/index.html         # Service pages
├── _next/static/                 # JavaScript, CSS, and assets
└── public assets                 # Images, icons, etc.
```

---

## Step-by-Step Deployment Instructions

### Step 1: Build the Project Locally
Run this command in your project folder:
```bash
npm run build
```
This creates the `out` folder with all static files.

### Step 2: Access cPanel File Manager
1. Log in to your cPanel account
2. Go to **File Manager**
3. Navigate to **public_html** (or your domain's root folder)

### Step 3: Upload Files
**Option A - Using File Manager:**
1. Compress the `out` folder contents into a ZIP file
2. In File Manager, click **Upload**
3. Upload the ZIP file to `public_html`
4. Extract the ZIP file in `public_html`
5. Move all files from the extracted folder to `public_html` root

**Option B - Using FTP:**
1. Connect via FTP (FileZilla, etc.)
2. Navigate to `public_html`
3. Upload all contents from the `out` folder

### Step 4: Verify Deployment
Visit your domain (e.g., `https://yourdomain.com`) to verify the site is working.

---

## Important Notes

1. **Static Site Only**: This is a static export. Features like API routes, server-side rendering, and rewrites are not available.

2. **API Calls**: If your site makes API calls to external services, those will still work from the browser.

3. **Redirects**: The `/portfolio` to `/protfolio` redirect won't work with static export. You can add this in cPanel's **Redirects** section instead.

4. **Future Updates**: To update the site:
   - Make changes locally
   - Run `npm run build`
   - Re-upload the `out` folder contents

---

## Troubleshooting

- **404 Errors**: Ensure all files from `out/` are in `public_html` root, not in a subfolder
- **Missing Styles**: Check that `_next/static/` folder was uploaded
- **Images Not Loading**: Verify the `public/` folder assets are included
