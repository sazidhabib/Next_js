import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';
import mysql from 'mysql2/promise';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const execAsync = promisify(exec);

export async function GET() {
  const results = {
    sharp: 'unknown',
    ffmpeg: 'unknown',
    libreoffice: 'unknown',
    database: 'unknown',
    storage: 'unknown',
    logs: []
  };

  const log = (msg) => results.logs.push(msg);

  // 1. Sharp
  try {
    const imgBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    await sharp(imgBuffer).jpeg().toBuffer();
    results.sharp = 'working';
    log('Sharp: loaded and successfully processed image conversion');
  } catch (err) {
    results.sharp = 'failed';
    log(`Sharp error: ${err.message}`);
  }

  // 2. FFmpeg
  try {
    const localFfmpeg = join(process.cwd(), 'bin', 'ffmpeg.exe');
    const ffmpegCmd = existsSync(localFfmpeg) ? `"${localFfmpeg}"` : 'ffmpeg';
    const { stdout } = await execAsync(`${ffmpegCmd} -version`);
    results.ffmpeg = `working (${stdout.split('\n')[0].trim()})`;
    log(`FFmpeg: found and working (using ${existsSync(localFfmpeg) ? 'local bin' : 'system PATH'})`);
  } catch (err) {
    results.ffmpeg = 'missing';
    log('FFmpeg error: not found. Required for audio/video conversions.');
  }

  // 3. LibreOffice
  try {
    const localLO = join(process.cwd(), 'bin', 'libreoffice', 'program', 'soffice.exe');
    const loCmd = existsSync(localLO) ? `"${localLO}"` : 'soffice';
    const { stdout } = await execAsync(`${loCmd} --version`);
    results.libreoffice = `working (${stdout.trim()})`;
    log(`LibreOffice: found and working (using ${existsSync(localLO) ? 'local bin soffice' : 'system PATH'})`);
  } catch (err) {
    try {
      const { stdout } = await execAsync('libreoffice --version');
      results.libreoffice = `working (${stdout.trim()})`;
      log('LibreOffice: libreoffice command found in system PATH');
    } catch (err2) {
      results.libreoffice = 'missing';
      log('LibreOffice error: not found. Required for document/office conversions.');
    }
  }

  // 4. Database
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'fileconverter',
  };
  try {
    const connection = await mysql.createConnection(dbConfig);
    results.database = 'working';
    log('Database: connection established successfully');
    await connection.end();
  } catch (err) {
    results.database = `failed (${err.message})`;
    log(`Database error: ${err.message}`);
  }

  // 5. Storage (S3)
  const s3Config = {
    region: 'auto',
    endpoint: process.env.STORAGE_ENDPOINT,
    credentials: {
      accessKeyId: process.env.STORAGE_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY || '',
    },
  };
  const bucket = process.env.STORAGE_BUCKET || 'fileconverter';
  try {
    if (!s3Config.credentials.accessKeyId) {
      throw new Error('Access Key ID is empty. Check your env variables.');
    }
    const s3 = new S3Client(s3Config);
    await s3.send(new ListObjectsV2Command({ Bucket: bucket, MaxKeys: 1 }));
    results.storage = 'working';
    log('Storage: connection and list operation successful');
  } catch (err) {
    results.storage = `failed (${err.message})`;
    log(`Storage error: ${err.message}`);
  }

  return NextResponse.json(results);
}
