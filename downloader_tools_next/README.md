# 🎬 MediaDrop - Universal Social Media & Video Downloader

A modern, fast, and responsive web application built with **Next.js 16 (App Router)**, **React 19**, and **Tailwind CSS v4** to fetch and download high-quality videos, audio, and media from multiple social platforms without watermarks.

---

## 🚀 Features

- **Multi-Platform Support**: Extract media from 12+ popular platforms with automatic URL detection.
- **High Quality Formats**: Download HD Video (MP4), SD Video, or extracted Audio (MP3).
- **No Watermarks**: Clean video extraction for supported platforms (TikTok, Instagram Reels, etc.).
- **Dedicated Platform Landing Pages**: Dynamic SEO-optimized pages for each platform (`/youtube`, `/tiktok`, `/instagram`, `/reels`, `/shorts`, etc.).
- **One-Click Paste**: Quick clipboard paste button for desktop and mobile users.
- **Fast & Responsive UI**: Clean, mobile-friendly interface styled with Tailwind CSS v4 and smooth micro-interactions.
- **REST API Endpoint**: Simple unified `/api/download` endpoint for URL processing and link generation.

---

## 🌐 Supported Platforms

| Platform | Supported Formats / Features | Dedicated Page |
| :--- | :--- | :--- |
| **YouTube** | HD Video (MP4), Audio (MP3) | [`/youtube`](http://localhost:3000/youtube) |
| **YouTube Shorts** | HD Video (MP4), Audio (MP3) | [`/shorts`](http://localhost:3000/shorts) |
| **TikTok** | HD Video (No Watermark), Audio (MP3) | [`/tiktok`](http://localhost:3000/tiktok) |
| **Instagram** | Video / Reels / Stories (MP4) | [`/instagram`](http://localhost:3000/instagram) |
| **Instagram Reels**| High-Definition Reels (MP4) | [`/reels`](http://localhost:3000/reels) |
| **Facebook** | HD Video, SD Video (MP4) | [`/facebook`](http://localhost:3000/facebook) |
| **Twitter / X** | HD Video (MP4) | [`/twitter`](http://localhost:3000/twitter) |
| **Pinterest** | HD Video (MP4), Image (JPG) | [`/pinterest`](http://localhost:3000/pinterest) |
| **LinkedIn** | Video (MP4) | [`/linkedin`](http://localhost:3000/linkedin) |
| **Douyin** | HD Video (MP4) | [`/douyin`](http://localhost:3000/douyin) |
| **Kuaishou** | HD Video (MP4) | [`/kuaishou`](http://localhost:3000/kuaishou) |
| **Discord** | Direct Video Attachments (MP4) | [`/discord`](http://localhost:3000/discord) |
| **Quora** | Video Posts (MP4) | [`/quora`](http://localhost:3000/quora) |
| **Tencent QQ** | Web Video (MP4) | [`/tencent`](http://localhost:3000/tencent) |

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Frontend Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Media Extraction**: [`btch-downloader`](https://www.npmjs.com/package/btch-downloader)

---

## 📂 Project Structure

```text
├── app/
│   ├── [platform]/           # Dynamic SEO landing pages for each platform
│   │   └── page.js
│   ├── api/
│   │   └── download/         # Centralized download API route
│   │       └── route.js
│   ├── components/           # Reusable UI components
│   │   ├── DownloadResult.jsx
│   │   ├── Features.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── HeroSection.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── PlatformPageClient.jsx
│   │   ├── SEOContent.jsx
│   │   └── SupportedPlatforms.jsx
│   ├── globals.css           # Tailwind CSS imports & global styles
│   ├── layout.js             # Root layout with metadata
│   └── page.js               # Homepage
├── public/                   # Static assets & icons
├── package.json              # Dependencies and scripts
└── next.config.mjs           # Next.js configuration
```

---

## ⚡ Getting Started

### Prerequisites

- **Node.js**: v18.18.0 or later (Node.js 20+ recommended)
- **Package Manager**: `npm`, `yarn`, `pnpm`, or `bun`

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd downloader_tools_next
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the Next.js development server on `http://localhost:3000` |
| `npm run build` | Builds the optimized production application |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint to check for code issues |

---

## 🔌 API Documentation

### Extract Media Links

- **Endpoint**: `POST /api/download`
- **Headers**: `Content-Type: application/json`

#### Request Body
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "platform": "youtube",
  "title": "Rick Astley - Never Gonna Give You Up (Official Video) (4K Remaster)",
  "thumbnail": "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
  "downloads": [
    {
      "quality": "HD Video (MP4)",
      "url": "https://...",
      "format": "mp4",
      "type": "video"
    },
    {
      "quality": "Audio (MP3)",
      "url": "https://...",
      "format": "mp3",
      "type": "audio"
    }
  ]
}
```

#### Error Response (`400 / 404 / 500`)
```json
{
  "error": "Could not extract download links. The URL may be invalid or the content may be private."
}
```

---

## 📄 License

This project is licensed under the MIT License.
