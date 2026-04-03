const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Setting up Next Idea Solutions Backend...\n');

const envFile = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envFile)) {
  console.log('Creating .env.local from .env.example...');
  const exampleEnv = fs.readFileSync(path.join(process.cwd(), '.env.example'), 'utf8');
  fs.writeFileSync(envFile, exampleEnv);
  console.log('Please update .env.local with your database credentials before running migrations.\n');
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
