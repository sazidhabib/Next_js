# Quick Start Guide - Backend Setup

## Prerequisites Check
```bash
# Verify Node.js is installed
node --version  # Should be 18+

# Verify MySQL is installed and running
mysql --version

# Verify npm is installed
npm --version
```

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Database
```bash
# Create MySQL database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS nextidea_db;"

# Update .env.local with your MySQL credentials
# Open .env.local and update these lines:
# DATABASE_USER=your_mysql_username
# DATABASE_PASSWORD=your_mysql_password
```

### Step 3: Initialize Database
```bash
# Create tables and seed data
npm run db:init
npm run db:seed
```

### Step 4: Start Server
```bash
npm run dev
```

### Step 5: Login to Admin
- Open: http://localhost:3000/admin/login
- Email: admin@nextideasolution.com
- Password: Admin@12345

**That's it! Your backend is now running! 🚀**

## Verify Installation

Test the API endpoints:

```bash
# Test portfolio endpoint
curl http://localhost:3000/api/portfolio

# Test categories endpoint
curl http://localhost:3000/api/categories

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nextideasolution.com","password":"Admin@12345"}' \
  -c -
```

## Common Issues

### MySQL Connection Error
```bash
# Check MySQL is running
mysql -u root -p

# Verify database exists
mysql -u root -p -e "SHOW DATABASES;" | grep nextidea_db
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use
```bash
# Use a different port
npm run dev -- -p 3001
```

## Next Steps

1. **Change Default Password** - Update admin password immediately
2. **Configure Email** - Set up SMTP for contact form notifications
3. **Add Portfolio Items** - Use the admin panel or API
4. **Migrate Existing Data** - Import from your external PHP API

## Helpful Commands

```bash
# View all available scripts
npm run

# Database commands
npm run db:init      # Initialize database
npm run db:seed      # Seed data
npm run db:setup     # Setup wizard

# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
```

## Need Help?

- **Full Documentation:** See `BACKEND_SETUP.md`
- **Implementation Details:** See `IMPLEMENTATION_COMPLETE.md`
- **API Endpoints:** See plan file at `.kilo/plans/1775234140961-quiet-panda.md`

---

**Your backend is ready! Start building amazing things! 🎉**
