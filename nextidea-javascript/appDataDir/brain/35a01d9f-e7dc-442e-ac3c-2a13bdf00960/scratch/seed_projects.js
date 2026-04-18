require('dotenv').config({ path: '.env' });
const mysql = require('mysql2/promise');

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'nextidea'
  });

  try {
    const [existing] = await connection.query('SELECT id FROM portfolio_items LIMIT 1');
    
    // Only add if empty to avoid duplicates
    if (existing.length === 0) {
      await connection.query(`
        INSERT INTO portfolio_items (title, slug, description, category_id, client_name, is_active) VALUES 
        ('Modern E-commerce Platform', 'modern-ecommerce', 'A high-performance online store built with Next.js and Tailwind.', 4, 'Fashion Brand', 1),
        ('Corporate Portfolio', 'corporate-portfolio', 'A clean and professional corporate website for a financial firm.', 4, 'Wealth Management', 1),
        ('SaaS Landing Page', 'saas-landing', 'A conversion-optimized landing page for a software company.', 4, 'TechCloud Inc', 1)
      `);
      console.log('Successfully added dummy projects to category ID 4.');
    } else {
      console.log('Database already has items. No dummy data added.');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await connection.end();
  }
}

seed();
