# MERN to Next.js Migration - Documentation

## Migration Summary

This project has been migrated from a separate client (Vite + React) and server (Express + MySQL) setup into a unified Next.js project using the App Router.

## Project Structure

```
.
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── ads/
│   │   ├── articles/
│   │   ├── auth/
│   │   ├── authors/
│   │   ├── blogs/
│   │   ├── designs/
│   │   ├── hero-section/
│   │   ├── menus/
│   │   ├── news/
│   │   ├── sections/
│   │   ├── songs/
│   │   ├── tags/
│   │   ├── users/
│   │   └── v1/videos/
│   ├── admin/             # Admin pages
│   ├── login/             # Login page
│   ├── register/          # Register page
│   ├── providers/         # React Context providers
│   ├── lib/               # Shared utilities
│   ├── layout.js          # Root layout
│   ├── page.js            # Home page
│   └── globals.css        # Global styles
├── lib/                    # Server-side code
│   ├── db/                # Database connection (singleton)
│   ├── middlewares/       # Auth, validation, multer
│   ├── models/            # Sequelize models
│   └── validators/        # Zod validation schemas
├── public/                 # Static files
│   └── uploads/           # Uploaded files
├── client/                 # Original Vite client (to be removed)
├── server/                # Original Express server (to be removed)
├── .env.local              # Environment variables
├── next.config.mjs         # Next.js configuration
├── package.json            # Dependencies
└── tailwind.config.js      # Tailwind configuration
```

## Key Changes Made

### 1. Environment Variables
- Combined `client/.env` and `server/.env` into `.env.local`
- Client-side variables now use `NEXT_PUBLIC_` prefix
- API calls now use same-origin (`/api/...`) instead of full URLs

### 2. Database
- Created singleton pattern for Sequelize connection to prevent "Too Many Connections"
- Moved all models to `lib/models/`
- Set up associations in `lib/models/index.js`

### 3. API Routes
Converted Express routers to Next.js Route Handlers:
- `/api/auth` - Authentication (login, register)
- `/api/news` - News CRUD operations
- `/api/menus` - Menu management
- `/api/tags` - Tag management
- `/api/authors` - Author management
- `/api/articles` - Articles
- `/api/blogs` - Blogs
- `/api/songs` - Songs
- `/api/v1/videos` - Videos
- `/api/hero-section` - Hero sections
- `/api/sections` - Page sections
- `/api/ads` - Advertisements
- `/api/designs` - Design configurations
- `/api/users` - User management

### 4. Frontend
- Created `AuthProvider` for authentication state
- Created `MenuProvider` for menu context
- Set up axios with same-origin API calls
- Created admin layout with sidebar navigation
- Migrated pages: Home, Login, Register, Admin Dashboard, News List

### 5. File Uploads
- Multer configuration adapted for Next.js
- Files now stored in `public/uploads/`

## Next Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Move Existing Uploads
Copy files from `server/uploads/` to `public/uploads/`

### 3. Configure Database
Ensure your `.env.local` has the correct MySQL connection details.

### 4. Run Development Server
```bash
npm run dev
```

### 5. Remaining Tasks
- Migrate remaining client components from `client/src/` to `app/`
- Copy over static assets from `client/public/` to `public/`
- Complete all admin pages (Menu, Tags, Authors, etc.)
- Test all API endpoints
- Remove `client/` and `server/` directories after full migration

## API Changes

### Old (Express)
```
http://localhost:5000/api/auth/login
http://localhost:5000/api/news
```

### New (Next.js)
```
/api/auth/login
/api/news
```

## Notes

- This migration uses Next.js 15 with App Router
- All models are ES modules (`.js` extension)
- API routes use NextResponse for JSON responses
- Authentication middleware adapted for Next.js
- File uploads use Next.js public directory

## Troubleshooting

### Database Connection Issues
- Verify MySQL credentials in `.env.local`
- Check that MySQL server is running
- Ensure database exists

### Model Loading Errors
- Verify all model imports in `lib/models/index.js`
- Check associations are properly defined

### API 404 Errors
- Ensure route files are in correct directory structure
- Check API route handlers export correct HTTP methods
