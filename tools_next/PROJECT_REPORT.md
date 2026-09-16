# Next Tools — Comprehensive Technical & Architectural Project Report

---

## 1. Executive Summary & Project Overview

**Next Tools** (also referred to as *File Converter Pro*) is a modern, high-performance, full-stack online file conversion and media processing platform. Built on the Next.js 16 (React 19) App Router architecture, the platform enables individual users, teams, and developers to convert, transform, optimize, and compress files across **11 core categories** encompassing **200+ distinct file extensions**.

### Key Highlights:
- **Unified Conversion Hub**: Seamlessly handles documents, images, video, audio, spreadsheets, presentations, e-books, archives, vector art, CAD drawings, and fonts.
- **Multi-Engine Conversion Pipeline**: Combines native C/C++ image pipelines (**Sharp / libvips**), industry-standard multimedia suites (**FFmpeg**), headless office suites (**LibreOffice**), and native Node archive streams.
- **SaaS & Monetization Ready**: Integrated credit system, pay-as-you-go credit packs, recurring monthly/annual subscriptions via **Stripe**, team role-based access control (RBAC), and developer API key management.
- **Programmatic SEO Architecture**: Dynamically generates hundreds of targeted landing pages (e.g., `/pdf-to-docx`, `/mp4-to-mp3`, `/png-converter`) to capture organic search traffic.
- **Enterprise-Grade Privacy & Storage**: Hybrid storage supporting AWS S3 (with presigned secure download URLs) and automated local fallback storage, paired with instant temporary scratch cleanup after conversion.

---

## 2. Technology Stack

| Layer | Technologies / Libraries | Purpose & Details |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 16.2.11**, **React 19.2.4** | Modern App Router with Server Components (RSC), Client Components, and Streaming UI. |
| **Styling & Design** | **Tailwind CSS v4**, PostCSS 8 | Ultra-fast utility-first CSS styling, responsive grid layouts, custom UI components, and dark/light palettes. |
| **Backend Runtime** | **Node.js (ES Modules)** | Server-side execution, child process execution, asynchronous streams, and file system management. |
| **Conversion Engines** | **Sharp (libvips)** | Ultra-fast native image conversions, resizing, and web format encoding (WebP, AVIF, PNG, JPG, TIFF). |
| | **FFmpeg (Binary / CLI)** | High-fidelity audio and video encoding, transcoding, codec switching, audio stripping, and container conversion. |
| | **LibreOffice Headless** | Industrial-grade document, spreadsheet, presentation, vector, and CAD conversions to/from PDF, Office, and OpenDocument. |
| | **Archiver & Unzipper** | Node.js stream-based file compression and archive unpacking (`.zip` to `.tar`). |
| **Database & ORM** | **MySQL / MariaDB (`mysql2`)** | High-concurrency relational database with connection pooling, transactional integrity, and indexing. |
| **Storage Layer** | **AWS SDK v3 (`@aws-sdk/client-s3`)** | Cloud Object Storage (S3 / Cloudflare R2 / MinIO) with Presigned URLs and automated local disk fallback. |
| **Authentication** | **NextAuth.js v5 (Beta)**, **BcryptJS** | Secure credentials-based authentication, password hashing, and session management. |
| **Payments & Billing** | **Stripe Node SDK (`stripe`)** | Stripe Checkout Sessions, Customer Portal, Webhook event processing, credit top-ups, and recurring billing. |
| **Utilities & Testing** | `uuid`, `gray-matter`, `eslint 10` | Unique ID generation, metadata parsing, linting, and custom integration test suites. |

---

## 3. How the Project Works (System Architecture & Workflow)

The platform follows an asynchronous, job-driven conversion lifecycle:

```
[ User / Client Browser ]
           │
           │ 1. Uploads file + Selects Target Format
           ▼
[ /api/convert (Next.js API Route) ]
           │
           ├─► 2. Validates Format & Size (Up to 1 GB limit)
           ├─► 3. Uploads original file to Storage (S3 or Local Disk)
           ├─► 4. Inserts record into `jobs` table (status: 'pending')
           │
           ├─► 5. Returns Job ID immediately to Client
           │
           ▼
[ Background Execution: processConversion() ]
           │
           ├─► 6. Updates job status: 'converting', progress: 25%
           ├─► 7. Creates isolated sandbox temp directory (`mkdtemp`)
           ├─► 8. Dispatches to Engine based on category:
           │        ├── Images                 ──► Sharp Pipeline
           │        ├── Audio / Video          ──► FFmpeg Process
           │        ├── Documents/Office/CAD   ──► LibreOffice Headless
           │        └── Archives               ──► Unzipper / Archiver
           │
           ├─► 9. Saves converted output buffer & uploads to Storage
           ├─► 10. Updates job status: 'completed', progress: 100%, records credits used
           └─► 11. Securely removes all temporary scratch files
           
[ User / Client Browser ]
           │
           │ 12. Polls `/api/jobs/[id]` or checks status
           │ 13. Receives signed download URL or static URL
           ▼
[ Converted File Downloaded ]
```

### Conversion Engine Routing Logic (`lib/conversions.js`)
When a conversion request arrives, `getConversionEngine()` and `convertFile()` analyze the source and destination formats:
1. **Sharp Engine**: Triggered when both input and output are raster or web image formats (`png`, `jpg`, `webp`, `avif`, `tiff`, `gif`, `bmp`, `ico`, etc.).
2. **FFmpeg Engine**: Triggered when media involves audio or video formats (`mp4`, `mkv`, `avi`, `mov`, `webm`, `mp3`, `wav`, `flac`, `aac`, `ogg`, etc.). Also handles extracting audio tracks from video (e.g., MP4 to MP3).
3. **LibreOffice Engine**: Triggered for all office documents (`docx`, `pdf`, `odt`, `rtf`, `txt`, `html`), spreadsheets (`xlsx`, `csv`, `ods`), presentations (`pptx`, `odp`), e-books (`epub`, `mobi`, `djvu`), vector drawings (`dxf`, `svg`, `eps`), and CAD drawings.
4. **Archive Engine**: Extracts and compresses archive structures (e.g. converting `zip` to `tar`).

---

## 4. Comprehensive Conversion Types & Formats

The system supports **11 Categories** covering **200+ distinct file formats**:

```
                       ┌───────────────────────────────┐
                       │   11 Conversion Categories   │
                       └──────────────┬────────────────┘
         ┌──────────────┬─────────────┼─────────────┬──────────────┐
         ▼              ▼             ▼             ▼              ▼
     Documents       Images         Audio         Video      Spreadsheets
    (23 Formats)  (42 Formats)  (21 Formats)  (28 Formats)   (8 Formats)
         │              │             │             │              │
         ├──────────────┼─────────────┼─────────────┼──────────────┤
         ▼              ▼             ▼             ▼              ▼
       Slides        E-books       Archives        Vector         CAD / Fonts
    (11 Formats)  (22 Formats)  (39 Formats)  (10 Formats)   (3 CAD / 5 Fonts)
```

### Detailed Breakdown by Category

| # | Category | Format Count | Supported Format Extensions | Primary Engine |
| :---: | :--- | :---: | :--- | :---: |
| **1** | **Documents** | 23 | `abw`, `djvu`, `doc`, `docm`, `docx`, `dot`, `dotx`, `html`, `hwp`, `hwpx`, `lwp`, `md`, `odt`, `pages`, `pdf`, `rst`, `rtf`, `sdw`, `tex`, `txt`, `wpd`, `wps`, `zabw` | LibreOffice |
| **2** | **Images** | 42 | `ai`, `apng`, `arw`, `avif`, `bmp`, `cr2`, `cr3`, `crw`, `dcr`, `dng`, `erf`, `gif`, `heic`, `heif`, `ico`, `jfif`, `jpeg`, `jpg`, `mos`, `mrw`, `nef`, `odd`, `orf`, `pef`, `png`, `psb`, `psd`, `raf`, `raw`, `rw2`, `sk`, `sk1`, `svg`, `svgz`, `tga`, `tif`, `tiff`, `webp`, `wmf`, `xcf`, `x3f` | Sharp / LibreOffice |
| **3** | **Video** | 28 | `3gp`, `3g2`, `avi`, `flv`, `m4v`, `mkv`, `mov`, `mp4`, `mpeg`, `mpg`, `mts`, `mxf`, `ogv`, `ts`, `vob`, `webm`, `wmv`, `asf`, `divx`, `f4v`, `m2ts`, `mpv`, `nsv`, `rm`, `rmvb`, `swf`, `viv`, `wtv` | FFmpeg |
| **4** | **Audio** | 21 | `aac`, `ac3`, `aif`, `aiff`, `amr`, `ape`, `au`, `dts`, `flac`, `m4a`, `m4b`, `mid`, `midi`, `mp3`, `mpc`, `oga`, `ogg`, `opus`, `tta`, `wav`, `wma` | FFmpeg |
| **5** | **Spreadsheets**| 8 | `csv`, `ods`, `xls`, `xlsb`, `xlsm`, `xlsx`, `xlt`, `xltx` | LibreOffice |
| **6** | **Slides** | 11 | `dps`, `key`, `odp`, `pot`, `potm`, `potx`, `pps`, `ppsm`, `ppsx`, `ppt`, `pptx` | LibreOffice |
| **7** | **E-books** | 22 | `azw`, `azw3`, `azw4`, `cbc`, `cbr`, `cbz`, `chm`, `djvu`, `epub`, `fb2`, `htmlz`, `lit`, `lrf`, `mobi`, `pdb`, `pml`, `prc`, `rb`, `snb`, `tcr`, `txtz`, `kepub` | LibreOffice |
| **8** | **Archives** | 39 | `7z`, `bz2`, `cab`, `cpio`, `deb`, `gz`, `iso`, `lz`, `lzma`, `lzo`, `lz4`, `rar`, `rpm`, `sz`, `tar`, `tbz2`, `tgz`, `tlz`, `xz`, `z`, `zip`, `zst`, `zstd`, `dd`, `squashfs`, `warc`, `xar`, `dmg`, `fat`, `ext`, `ntfs`, `vhd`, `vhdx`, `vdi`, `vmdk`, `qcow2`, `viv`, `jar` | Node Stream / Archiver |
| **9** | **Vector** | 10 | `cgm`, `dwg`, `dxf`, `emf`, `eps`, `odg`, `pnm`, `ppm`, `ps`, `svg` | LibreOffice / Sharp |
| **10**| **CAD** | 3 | `dwg`, `dxf`, `stl` | LibreOffice |
| **11**| **Fonts** | 5 | `otf`, `ttf`, `woff`, `woff2`, `eot` | Format Hub |

### Popular Conversion Workflows
- **PDF to Office / Office to PDF**: `PDF -> DOCX`, `DOCX -> PDF`, `PPTX -> PDF`, `XLSX -> CSV`, `HTML -> PDF`.
- **Media Transcoding & Extraction**: `MP4 -> MP3` (Audio Rip), `MKV -> MP4`, `WAV -> MP3`, `OGG -> AAC`.
- **Modern Web Image Optimization**: `PNG -> WebP`, `JPG -> AVIF`, `HEIC -> JPG`, `SVG -> PNG`.
- **E-Book Formatting**: `EPUB -> PDF`, `MOBI -> EPUB`.
- **Data & Spreadsheet Interchange**: `CSV -> XLSX`, `ODS -> XLSX`.

---

## 5. Core Platform Features & Modules

### 1. User & Credit Economy
- **Free Daily Allocation**: New and guest users can perform free conversions within daily rate limits.
- **Credit-Weighted Conversions**: Complex or heavy compute conversions require proportional credits:
  - Standard conversions (e.g., Image to Image): **1 Credit**
  - Standard Office to PDF: **2 Credits**
  - Apple iWork to PDF: **2 Credits**
  - OCR / PDF to Office (DOCX/XLSX): **4 Credits**

### 2. Stripe Monetization & Subscriptions
- **Prepaid Credit Packages**:
  - `100 Credits` — $9.00 USD
  - `500 Credits` — $39.00 USD
  - `1,000 Credits` — $69.00 USD
  - `5,000 Credits` — $299.00 USD
  - `10,000 Credits` — $499.00 USD
- **Recurring SaaS Subscriptions**: Monthly/annual plans managed via Stripe Customer Portal and Stripe Webhooks (`app/api/webhooks/route.js`).

### 3. Team Management & Multi-Tenancy
- Organizations can create teams and invite team members.
- **Role-Based Access Control (RBAC)**:
  - `admin`: Full team configuration, invite/remove users, manage billing.
  - `member`: Convert files using shared team credit pool.
  - `consumer`: Restrained API / conversion access.
  - `billing`: Dedicated access to manage payment methods and invoices.

### 4. Developer REST API & API Keys
- Users can create API keys with custom permission scopes (`conversions:read`, `conversions:write`, `billing:read`).
- Hashed API key storage with prefix identification for secure programmatic conversion automation.

### 5. Automated SEO & Landing Page Engine
- Dynamic route handler `app/[slug]/page.js` statically pre-renders and dynamically handles:
  - Format overview pages: `/[format]-converter` (e.g. `/pdf-converter`, `/mp4-converter`).
  - Conversion pair landing pages: `/[from]-to-[to]` (e.g. `/pdf-to-docx`, `/png-to-jpg`, `/heic-to-pdf`).
  - Fully populated OpenGraph metadata, structured JSON schemas, and SEO-optimized heading hierarchy.

---

## 6. Database Schema Summary (`lib/schema.sql`)

```
  ┌───────────────┐          1:N         ┌───────────────────┐
  │     users     │─────────────────────►│       teams       │
  └───────┬───────┘                      └─────────┬─────────┘
          │ 1:N                                    │ 1:N
          ├──────────────────────────┐             │
          │                          ▼             ▼
          │                  ┌───────────────────────────────┐
          │                  │         team_members          │
          │                  └───────────────────────────────┘
          │ 1:N
          ├───► api_keys       (user_id, key_hash, scopes, last_used_at)
          ├───► jobs           (user_id, status, input_format, output_format, file_keys, progress)
          ├───► subscriptions  (user_id, package_id, stripe_subscription_id, status)
          └───► transactions   (user_id, type, amount_cents, credits, stripe_payment_id)
```

- **`users`**: User identity, email, hashed credentials, available credits, daily free usage tracker, Stripe Customer ID.
- **`teams` & `team_members`**: Organization hierarchy, membership relationships, and user roles.
- **`api_keys`**: Developer API authentication keys and scope definitions.
- **`jobs`**: Complete audit trail of conversion operations, input/output storage keys, execution engine, progress percentage, error messages, and expiration timestamps.
- **`packages`**: Pricing tiers, credit allocations, Stripe price mappings.
- **`subscriptions`**: Active and canceled recurring subscriptions linked to Stripe.
- **`transactions`**: Complete ledger of credit purchases, subscription billings, and refunds.

---

## 7. Storage Architecture (Hybrid S3 & Local Fallback)

The file storage subsystem in `lib/storage.js` is built with a resilient dual-mode architecture:

1. **Cloud Mode (AWS S3 / S3-Compatible Storage)**:
   - Activated when `STORAGE_ENDPOINT`, `STORAGE_ACCESS_KEY_ID`, and `STORAGE_SECRET_ACCESS_KEY` are provided in the environment.
   - Uploads files categorized by format (`upload/{category}/{uuid}.{ext}`).
   - Secure temporary downloads powered by **AWS S3 Presigned URLs** (`GetObjectCommand`) with customizable expiration periods (default: 1 hour).
2. **Local Fallback Mode**:
   - Automatically engaged during local development or when external object storage is omitted.
   - Stores files in `public/upload/{category}/` and serves them safely through the local web server.

---

## 8. Directory & File Structure Map

```
tools_next/
├── app/                              # Next.js App Router root
│   ├── (auth)/                       # Authentication routes (login, register, forgot-password)
│   ├── [slug]/                       # Dynamic SEO landing pages (/pdf-to-docx, /png-converter)
│   ├── about/                        # About page
│   ├── api/                          # Backend API endpoints
│   │   ├── auth/                     # NextAuth API handlers
│   │   ├── checkout/                 # Stripe checkout session initiator
│   │   ├── convert/                  # Core conversion submission endpoint
│   │   ├── download/                 # File download and presigned URL redirector
│   │   ├── jobs/                     # Job status polling & management
│   │   ├── test-env/                 # Environment health check endpoint
│   │   └── webhooks/                 # Stripe event listeners
│   ├── api-docs/ & docs/             # Developer documentation
│   ├── dashboard/                    # User & Team conversion management dashboard
│   ├── pricing/                      # Pricing tables & credit purchase UI
│   ├── privacy/, security/, terms/   # Compliance & legal pages
│   ├── layout.js & page.js           # Root layout and homepage
│   └── globals.css                   # Global Tailwind CSS stylesheet
├── bin/                              # Local external conversion binaries (ffmpeg.exe, LibreOffice)
├── components/                       # Modular React components
│   ├── converter/                    # Upload zone, Format Selector, Progress Widget, Graphify
│   ├── dashboard/                    # User jobs list, API key manager, Team settings
│   ├── formats/                      # Format reference grids and badges
│   ├── layout/                       # Header, Navigation, Footer
│   ├── pricing/                      # Credit pricing cards, subscription toggles
│   └── ui/                           # Modals, Buttons, Badges, Input primitives
├── lib/                              # Core backend libraries & engines
│   ├── auth.js                       # NextAuth configuration & credentials provider
│   ├── conversions.js                # Conversion router & execution engine (Sharp, FFmpeg, LibreOffice)
│   ├── db.js                         # MySQL connection pool & SQL query helpers
│   ├── formats.js                    # Catalog of 11 categories, 200+ formats, and cost rules
│   ├── schema.sql                    # Relational database schema & seed data
│   ├── storage.js                    # S3 & Local filesystem storage driver
│   └── stripe.js                     # Stripe billing & payment gateway helpers
├── public/                           # Static assets & local upload directory
├── test-conversions.mjs              # Integration test script for all 11 format categories
├── test-env.mjs                      # Environment and dependency diagnostic script
├── package.json                      # Project dependencies and script targets
└── next.config.mjs                   # Next.js build and runtime configuration
```

---

## 9. Quality Assurance & Integration Testing

The project contains a built-in end-to-end integration test runner (`test-conversions.mjs`) that exercises all 11 conversion categories:
- **Sharp Image Pipeline**: Verifies raster transformations (`PNG -> JPG`).
- **FFmpeg Pipeline**: Generates synthetic audio/video buffers and tests transcoders (`WAV -> MP3`, `MP4 -> MKV`).
- **LibreOffice Headless Pipeline**: Tests document compilation (`TXT -> PDF`, `CSV -> XLSX`, `PPTX -> PDF`, `EPUB -> PDF`, `DXF -> SVG`).
- **Archive Stream Pipeline**: Tests decompression and repackaging (`ZIP -> TAR`).
- **Error Boundaries**: Verifies that unsupported formats gracefully reject before exhausting server resources.

### Running Diagnostics & Tests:
```bash
# Check environment variables, database connectivity, and engine binaries
npm run diagnostics

# Run end-to-end integration tests across all conversion engines
npm run test-conversions
```

---

## 10. Summary & Conclusion

**Next Tools** provides a scalable, enterprise-grade architecture for universal file transformation. By decoupling conversion dispatching across specialized engines (Sharp for raster speed, FFmpeg for media flexibility, LibreOffice for complex office fidelity), backed by an asynchronous database-driven job queue, hybrid S3 storage, and Stripe monetization, the project stands as a fully production-ready SaaS application.
