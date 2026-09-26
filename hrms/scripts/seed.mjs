import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local if exists
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...values] = trimmed.split('=');
      if (key && values.length > 0) {
        process.env[key.trim()] = values.join('=').trim().replace(/(^"|"$|^'|'$)/g, '');
      }
    }
  });
}

async function runSeeder() {
  console.log('🚀 Connecting to MySQL database:', process.env.DB_NAME || 'hrms_db', 'on', process.env.DB_HOST || '127.0.0.1');
  
  try {
    const { seedDatabase } = await import('../lib/db/seed.js');
    const result = await seedDatabase();
    console.log('✅ Success:', result.message);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder Error:', error);
    process.exit(1);
  }
}

runSeeder();
