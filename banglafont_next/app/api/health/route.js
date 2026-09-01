import { NextResponse } from "next/server";
import { sequelize } from "../../../lib/db.js";

export const dynamic = "force-dynamic";

export async function GET() {
  const envSummary = {
    DB_HOST: process.env.DB_HOST || "(not set - fallback: localhost)",
    DB_PORT: process.env.DB_PORT || "(not set - fallback: 3306)",
    DB_USER: process.env.DB_USER || "(not set - fallback: root)",
    DB_NAME: process.env.DB_NAME || "(not set - fallback: banglafont_next)",
    HAS_DB_PASSWORD: Boolean(process.env.DB_PASSWORD),
    HAS_DATABASE_URL: Boolean(process.env.DATABASE_URL),
    NODE_ENV: process.env.NODE_ENV || "not set",
    APP_URL: process.env.NEXT_PUBLIC_APP_URL || "not set",
  };

  try {
    await sequelize.authenticate();
    return NextResponse.json({
      success: true,
      database: "CONNECTED",
      message: "Database connection authenticated successfully.",
      environment: envSummary,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        database: "FAILED",
        errorName: error.name,
        errorMessage: error.message,
        errorCode: error.original?.code || error.parent?.code || "UNKNOWN",
        environment: envSummary,
        tip: "Please check your cPanel MySQL database name, user, password, and privileges.",
      },
      { status: 500 }
    );
  }
}
