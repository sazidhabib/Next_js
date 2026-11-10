# Deployment & Data Protection Guide

> **Important**: This guide explains how to build and deploy updates to your cPanel hosting **without losing or overwriting any projects, experience, or images** you uploaded through the live Admin Panel (`/admin.html`).

---

## 1. How Your Portfolio Architecture Works

Your portfolio has two parts working together:

```
┌────────────────────────────────────────────────────────┐
│                   YOUR LOCAL MACHINE                   │
│  - Code edits (HTML, CSS, JS)                          │
│  - Runs `npm run build` -> outputs to `dist/`          │
└───────────────────────────┬────────────────────────────┘
                            │  Deploys files
                            ▼
┌────────────────────────────────────────────────────────┐
│                   CPANEL WEB SERVER                    │
│  - Serves live visitors from `public_html/`            │
│  - Runs Admin Panel (`/admin.html`) & PHP API          │
│  - Saves live content to:                              │
│      • `data/portfolio-content.json`                   │
│      • `uploads/` (images, photos, resumes)            │
└────────────────────────────────────────────────────────┘
```

> [!WARNING]
> **Why data gets lost if deployed incorrectly:**  
> cPanel does **not** merge files. When you upload a file with the same name (like `index.html` or `portfolio-content.json`), cPanel **completely replaces** the server file with the one you upload.
>
> If you add projects or images on your live site using the Admin Panel, but run `npm run build` locally without pulling those changes first, your local build will contain **old data** and overwrite your live site!

---

## 2. The Golden Rule of Deployment

> **Always sync your live data from the server to your local machine BEFORE running `npm run build`.**

---

## 3. Safe Deployment Workflow

Choose either **Method A** (Fastest - 1 Command) or **Method B** (Manual via cPanel).

---

### Method A: Automated Sync (Recommended & Fastest)

A built-in sync script is included in your project that automatically downloads the latest live content and any new images before building:

#### Step 1: Run Live Sync
In your terminal, run this command (replace `https://yourdomain.com` with your actual website URL):
```bash
npm run sync:live -- https://yourdomain.com
```

What this does automatically:
1. Downloads the live `portfolio-content.json` from your server into `public/data/portfolio-content.json`.
2. Creates a timestamped backup of your previous local data file.
3. Scans for any images or resumes uploaded on the live site and automatically downloads any missing files into your local `public/uploads/` folder.

#### Step 2: Build the Production Files
Now that your local machine has all latest content and code:
```bash
npm run build
```
This generates the optimized production bundle in the `dist/` folder.

#### Step 3: Upload to cPanel
1. Open **cPanel** &rarr; **File Manager** &rarr; open `public_html` (or your domain's document root).
2. Upload the contents of your local `dist/` folder:
   - Upload & overwrite: `index.html`
   - Upload & overwrite: `admin.html`
   - Upload & overwrite: `assets/` folder
3. **DO NOT delete** the existing `uploads/` folder on cPanel.

---

### Method B: Manual Sync via cPanel File Manager

If you prefer doing it manually without running the sync script:

#### Step 1: Download live data from cPanel
1. Log into your **cPanel** &rarr; click **File Manager**.
2. Navigate to `public_html/data/`.
3. Select `portfolio-content.json` &rarr; click **Download**.
4. Move this downloaded file into your local project folder at:
   ```
   public/data/portfolio-content.json
   ```
   *(Replace the local file so your local computer has the live server's content).*

#### Step 2: Check for new uploaded media
1. In cPanel File Manager, open `public_html/uploads/`.
2. If you uploaded new project screenshots or a new resume PDF on the live site:
   - Download those new files to your local folder: `public/uploads/projects/`, `public/uploads/resumes/`, etc.

#### Step 3: Run the local build
In your local project terminal:
```bash
npm run build
```

#### Step 4: Upload `dist/` to cPanel
1. In cPanel File Manager (`public_html`):
   - Upload the new `dist/index.html` (replaces old `index.html`).
   - Upload the new `dist/admin.html`.
   - Upload the new `dist/assets/` folder.
2. Keep your server's `uploads/` folder untouched.

---

## 4. What to Overwrite vs. What to Keep

When uploading files from `dist/` to your server's `public_html/`:

| File / Folder | Safe to Overwrite? | Instructions |
| :--- | :---: | :--- |
| `index.html` | ✅ **Yes** | Always overwrite with the latest build. |
| `admin.html` | ✅ **Yes** | Overwrite whenever updated. |
| `assets/` folder | ✅ **Yes** | Overwrite. Vite creates unique hashed file names (e.g., `assets/index-DGrY7Whw.js`). |
| `.htaccess` | ⚠️ **Only if changed** | Only upload if you modified server routing or security headers. |
| `api/` folder | ⚠️ **Only if changed** | Contains `index.php`. Only upload if you edited the PHP backend API. |
| `data/` folder | ⚠️ **Careful** | Only overwrite if you pulled the latest `portfolio-content.json` in Step 1. |
| `uploads/` folder | ⛔ **DO NOT DELETE** | **Never delete this folder on cPanel.** It stores all live photos, project mockups, and client logos. |

---

## 5. Emergency Recovery: What If You Accidentally Overwrote Live Data?

If you ever deployed and realized your live changes disappeared:

1. **Check Local Auto-Backups:**
   - Every time `npm run sync:live` runs, it creates a backup in:
     `public/data/portfolio-content.backup-[timestamp].json`
   - Check if you have an earlier backup there.
2. **Check cPanel Trash / File Manager Backups:**
   - In cPanel File Manager, click **View Trash** in the top toolbar to see if the previous `portfolio-content.json` was saved.
3. **Check cPanel Daily Backups:**
   - Most cPanel hosts (Namecheap, Hostinger, Bluehost, cPanel JetBackup) keep automatic daily snapshots. You can restore just the `public_html/data/` folder from yesterday’s snapshot with 1 click.
4. **Git Version Control:**
   - If you commit your synced `public/data/portfolio-content.json` to Git regularly, you can always revert to any previous version using `git checkout`.

---

## 6. Quick Cheat-Sheet for Every Update

```bash
# 1. Pull live data from production server
npm run sync:live -- https://yourdomain.com

# 2. Make your local code or design edits

# 3. Build production bundle
npm run build

# 4. Upload dist/ contents to public_html on cPanel (Keep uploads/ intact)
```

