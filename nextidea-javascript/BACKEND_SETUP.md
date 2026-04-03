# Backend Setup Guide - Next Idea Solutions

## Prerequisites

- Node.js 18+ installed
- MySQL 8.0+ installed and running
- npm or yarn package manager

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your MySQL credentials
# Update these values:
# DATABASE_HOST=localhost
# DATABASE_USER=your_mysql_user
# DATABASE_PASSWORD=your_mysql_password
# DATABASE_NAME=nextidea_db
```

### 3. Initialize Database

```bash
# Create database tables
npm run db:init

# Seed with initial data (creates admin user and categories)
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Access Admin Panel

- **URL:** http://localhost:3000/admin/login
- **Email:** admin@nextideasolution.com
- **Password:** Admin@12345

**IMPORTANT:** Change the default password immediately after first login!

## Database Scripts

```bash
# Initialize database schema
npm run db:init

# Seed database with initial data
npm run db:seed

# Run setup wizard (creates .env.local if missing)
npm run db:setup
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset

### Portfolio
- `GET /api/portfolio` - Get all portfolio items (with pagination/filters)
- `POST /api/portfolio` - Create portfolio item (admin/editor)
- `GET /api/portfolio/[id]` - Get single portfolio item
- `PUT /api/portfolio/[id]` - Update portfolio item (admin/editor)
- `DELETE /api/portfolio/[id]` - Delete portfolio item (admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)
- `GET /api/categories/[id]` - Get single category
- `PUT /api/categories/[id]` - Update category (admin)
- `DELETE /api/categories/[id]` - Delete category (admin)

### Contact
- `POST /api/contact` - Submit contact form

### Analytics
- `POST /api/analytics/page-views` - Track page view
- `POST /api/analytics/events` - Track custom event
- `GET /api/analytics/stats` - Get analytics stats (admin)

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users (admin)
- `POST /api/admin/users` - Create user (admin)
- `PUT /api/admin/users/[id]` - Update user (admin)
- `DELETE /api/admin/users/[id]` - Delete user (admin)
- `GET /api/admin/settings` - Get site settings
- `PUT /api/admin/settings` - Update site settings

### Upload
- `POST /api/upload` - Upload file (admin/editor)

## Default Users

After running `npm run db:seed`, these users are created:

1. **Admin User**
   - Email: admin@nextideasolution.com
   - Password: Admin@12345
   - Role: admin

2. **Editor User**
   - Email: editor@nextideasolution.com
   - Password: Admin@12345
   - Role: editor

## Security Features

- **Password Hashing:** bcrypt with 12 rounds
- **JWT Authentication:** Access tokens (15min) + Refresh tokens (7 days)
- **HTTP-only Cookies:** Secure session management
- **Rate Limiting:** Prevents brute force attacks
- **Input Validation:** All inputs validated and sanitized
- **SQL Injection Protection:** Prepared statements (mysql2)
- **XSS Protection:** Output encoding
- **Security Headers:** X-Content-Type-Options, X-Frame-Options, etc.

## Environment Variables

See `.env.example` for all available configuration options.

### Required Variables
- `DATABASE_HOST` - MySQL host
- `DATABASE_USER` - MySQL username
- `DATABASE_PASSWORD` - MySQL password
- `DATABASE_NAME` - Database name
- `JWT_ACCESS_SECRET` - Secret for access tokens (min 32 chars)
- `JWT_REFRESH_SECRET` - Secret for refresh tokens (min 32 chars)

### Optional Variables
- `SMTP_*` - Email configuration for notifications
- `ANALYTICS_ENABLED` - Enable/disable analytics tracking
- `MAX_FILE_SIZE` - Maximum upload file size (default: 5MB)

## Troubleshooting

### Cannot connect to MySQL
1. Verify MySQL is running: `mysql --version`
2. Check credentials in `.env.local`
3. Ensure database exists: `CREATE DATABASE nextidea_db;`

### JWT secrets error
Generate new secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Port already in use
Change the port:
```bash
npm run dev -- -p 3001
```

## File Structure

```
nextidea-javascript/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── portfolio/         # Portfolio endpoints
│   │   ├── categories/        # Category endpoints
│   │   ├── contact/           # Contact form endpoint
│   │   ├── analytics/         # Analytics endpoints
│   │   ├── admin/             # Admin endpoints
│   │   └── upload/            # File upload endpoint
│   ├── lib/                   # Utility libraries
│   │   ├── db.js             # Database connection
│   │   ├── auth.js           # Auth utilities
│   │   ├── middleware.js     # Middleware functions
│   │   ├── validation.js     # Input validation
│   │   └── analytics.js      # Analytics tracking
│   ├── admin/                 # Admin dashboard pages
│   └── middleware.js          # Route protection middleware
├── config/
│   └── database.js           # Database configuration
├── scripts/
│   ├── init-db.sql           # Database initialization
│   ├── seed-data.sql         # Seed data
│   ├── migrate.js            # Migration runner
│   └── setup.js              # Setup wizard
├── public/uploads/portfolio/  # Uploaded files
├── .env.example              # Environment template
├── .env.local                # Local environment (gitignored)
└── BACKEND_SETUP.md          # This file
```

## Next Steps

1. **Migrate Existing Data:** Use the migration script to import portfolio data from the external PHP API
2. **Configure Email:** Set up SMTP for contact form notifications
3. **Customize Admin Panel:** Add more features to the admin dashboard
4. **Deploy to Production:** Follow deployment guide for production setup

## Support

For issues or questions, contact: support@nextideasolution.com
