const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Setting up Next Idea Solutions Backend...\n');

const envFile = path.join(process.cwd(), '.env');
if (!fs.existsSync(envFile)) {
  console.log('Creating .env from template...');
  const templateEnv = `# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=nextidea_user
DATABASE_PASSWORD=nextidea_dev_password_2024
DATABASE_NAME=nextidea_db
DATABASE_CONNECTION_LIMIT=10

# JWT Secrets
JWT_ACCESS_SECRET=dev_access_secret_change_in_production_32chars
JWT_REFRESH_SECRET=dev_refresh_secret_change_in_production_32chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Session
SESSION_COOKIE_NAME=nextidea_session
SESSION_SECURE=false

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_LOGIN_MAX=5
RATE_LIMIT_REGISTER_MAX=3
RATE_LIMIT_CONTACT_MAX=3

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/gif
UPLOAD_DIR=./public/uploads

# Email (Optional)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=noreply@nextideasolution.com
EMAIL_TO=support@nextideasolution.com

# Analytics
ANALYTICS_ENABLED=true
ANALYTICS_IP_ANONYMIZE=true

# Admin
ADMIN_DEFAULT_EMAIL=admin@nextideasolution.com
ADMIN_DEFAULT_PASSWORD=Admin@12345`;
  fs.writeFileSync(envFile, templateEnv);
  console.log('Please update .env with your database credentials before running migrations.\n');
}

console.log('Checking MySQL connection...');
try {
  const mysql = require('mysql2/promise');
  console.log('MySQL driver loaded successfully.');
} catch (error) {
  console.error('Error loading MySQL driver:', error.message);
  process.exit(1);
}

console.log('\nSetup complete! Next steps:');
console.log('1. Update .env.local with your MySQL credentials');
console.log('2. Run: node scripts/migrate.js init');
console.log('3. Run: node scripts/migrate.js seed');
console.log('4. Start the dev server: npm run dev');
console.log('5. Login at http://localhost:3000/admin/login');
console.log('   Default: admin@nextideasolution.com / Admin@12345');
