import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const dbConfig = {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    multipleStatements: true,
  };

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    
    // Initialize Schema
    const initSqlPath = path.join(process.cwd(), 'scripts', 'init-db.sql');
    const initSql = fs.readFileSync(initSqlPath, 'utf8');
    await connection.query(initSql);
    
    // Seed Data (Extended with Footer & Social settings)
    const seedSqlPath = path.join(process.cwd(), 'scripts', 'seed-data.sql');
    let seedSql = fs.readFileSync(seedSqlPath, 'utf8');
    
    // Append new settings to the seed SQL if they don't exist
    const newSettings = `
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
('facebook_url', 'https://www.facebook.com/NextIdeaSolution', 'string', 'Facebook profile URL'),
('linkedin_url', 'https://www.linkedin.com/company/next-idea-solution', 'string', 'LinkedIn company URL'),
('youtube_url', '#', 'string', 'YouTube channel URL'),
('instagram_url', '#', 'string', 'Instagram profile URL'),
('footer_about', 'Next Idea Solution is a 360-degree digital-first advertising agency in Bangladesh.', 'string', 'Short description in footer'),
('copyright_text', 'All rights reserved.', 'string', 'Copyright text in footer'),
('about_hero_title', 'Empowering your Digital Future', 'string', 'Hero title on about page'),
('about_hero_subtitle', 'We are a passionate team of technologists, designers, and strategists dedicated to transforming ideas into impactful digital realities.', 'text', 'Hero subtitle on about page'),
('about_story_title', 'Built on a foundation of innovation', 'string', 'Our story title'),
('about_story_desc_1', 'Since our inception, NextIdea Solution has been driven by a singular mission: to bridge the gap between complex technology and tangible business success. We believe that every challenge is an opportunity to innovate.', 'text', 'Our story description paragraph 1'),
('about_story_desc_2', 'What started as a small team of passionate developers has grown into a full-service digital agency. From robust enterprise software to captivating brand identities, we bring a wealth of expertise and a commitment to excellence to every project we touch.', 'text', 'Our story description paragraph 2'),
('about_mission_text', 'To empower businesses with cutting-edge digital solutions that drive growth, enhance user experiences, and solve complex challenges with elegance and efficiency.', 'text', 'Mission statement text'),
('about_vision_text', 'To be the global benchmark for digital innovation, shaping the future of technology by delivering transformative experiences that leave a lasting impact.', 'text', 'Vision statement text'),
('about_experience_years', '10+', 'string', 'Years of experience badge text'),
('about_story_image', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', 'string', 'Main image on about page')
ON DUPLICATE KEY UPDATE setting_key=setting_key;
`;
    await connection.query(seedSql + newSettings);

    return NextResponse.json({ 
      success: true, 
      message: 'Database initialized and seeded successfully!',
      admin: {
        email: 'admin@nextideasolution.com',
        password: 'Admin@12345'
      }
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      code: error.code 
    }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
