import { NextResponse } from 'next/server';
import sequelize from '@/lib/db/sequelize';

export async function GET() {
  const dbInfo = {
    dialect: process.env.DB_DIALECT || 'mysql',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || '3306',
    database: process.env.DB_NAME || 'hrms_db',
    user: process.env.DB_USER || 'root',
    hasPassword: Boolean(process.env.DB_PASSWORD),
  };

  try {
    await sequelize.authenticate();
    return NextResponse.json({
      success: true,
      status: 'Connected successfully to database!',
      config: dbInfo,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      status: 'Database connection failed',
      error: error.message,
      stack: error.stack,
      config: dbInfo,
    }, { status: 200 });
  }
}
