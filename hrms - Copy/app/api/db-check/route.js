import { NextResponse } from 'next/server';
import sequelize from '@/lib/db/sequelize';
import { getAuthSession } from '@/lib/auth/rbac';

export async function GET(request) {
  const session = await getAuthSession(request);
  const isSuperAdmin =
    session?.id === 'system-superadmin' || session?.roleName === 'Super Admin' || session?.isSuperAdmin;

  if (!isSuperAdmin) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Diagnostic tool restricted to Super Administrator.' },
      { status: 403 }
    );
  }

  const isProd = process.env.NODE_ENV === 'production';
  const dbInfo = {
    dialect: process.env.DB_DIALECT || 'mysql',
    database: process.env.DB_NAME || 'hrms_db',
    ...(isProd ? {} : {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || '3306',
      user: process.env.DB_USER || 'root',
    }),
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
      ...(isProd ? {} : { stack: error.stack }),
      config: dbInfo,
    }, { status: 500 });
  }
}
