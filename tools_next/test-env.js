import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';
import mysql from 'mysql2/promise';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const execAsync = promisify(exec);

async function runDiagnostics() {
  console.log('=== FILE CONVERTER DIAGNOSTICS ===\n');

  // 1. Check Node Modules
  console.log('1. Checking Node Modules...');
  try {
    console.log('   - sharp: loading...');
    const imgBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    await sharp(imgBuffer).jpeg().toBuffer();
    console.log('   - sharp image conversion: WORKING');
  } catch (err) {
    console.error('   - sharp check failed:', err.message);
  }

  // 2. Check CLI Tools (ffmpeg and libreoffice)
  console.log('\n2. Checking CLI Tools...');
  
  // FFmpeg check
  try {
    const localFfmpeg = join(process.cwd(), 'bin', 'ffmpeg.exe');
    const ffmpegCmd = existsSync(localFfmpeg) ? `"${localFfmpeg}"` : 'ffmpeg';
    const { stdout } = await execAsync(`${ffmpegCmd} -version`);
    const firstLine = stdout.split('\n')[0];
    console.log(`   - ffmpeg: WORKING (${firstLine.trim()})`);
  } catch (err) {
    console.log('   - ffmpeg: NOT FOUND in PATH or not installed.');
    console.log('     (Required for audio/video conversions. Install ffmpeg and add it to your system PATH)');
  }

  // LibreOffice check
  try {
    const localLO = join(process.cwd(), 'bin', 'libreoffice', 'program', 'soffice.exe');
    const loCmd = existsSync(localLO) ? `"${localLO}"` : 'soffice';
    const { stdout } = await execAsync(`${loCmd} --version`);
    console.log(`   - libreoffice (soffice): WORKING (${stdout.trim()})`);
  } catch (err) {
    try {
      // Try with direct command path or common locations if needed, or just warn
      const { stdout } = await execAsync('libreoffice --version');
      console.log(`   - libreoffice: WORKING (${stdout.trim()})`);
    } catch {
      console.log('   - libreoffice (soffice): NOT FOUND in PATH or not installed.');
      console.log('     (Required for document conversions like PDF, DOCX, ODT. Install LibreOffice and add it to your PATH)');
    }
  }

  // 3. Database Check
  console.log('\n3. Checking MySQL Database...');
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'fileconverter',
  };
  console.log(`   Attempting connection to ${dbConfig.host}:${dbConfig.port} (user: ${dbConfig.user}, db: ${dbConfig.database})...`);
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('   - Database: CONNECTED SUCCESSFUL');
    await connection.end();
  } catch (err) {
    console.log(`   - Database Connection Failed: ${err.message}`);
    console.log('     (Ensure your MySQL server is running and credentials in .env are correct)');
  }

  // 4. Storage S3 Check
  console.log('\n4. Checking S3 Cloud Storage...');
  const s3Config = {
    region: 'auto',
    endpoint: process.env.STORAGE_ENDPOINT,
    credentials: {
      accessKeyId: process.env.STORAGE_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY || '',
    },
  };
  const bucket = process.env.STORAGE_BUCKET || 'fileconverter';
  console.log(`   Attempting list objects command on bucket: ${bucket}...`);
  try {
    if (!s3Config.credentials.accessKeyId) {
      throw new Error('Access Key ID is empty. Check your environment variables.');
    }
    const s3 = new S3Client(s3Config);
    await s3.send(new ListObjectsV2Command({ Bucket: bucket, MaxKeys: 1 }));
    console.log('   - S3 Storage: CONNECTED SUCCESSFUL');
  } catch (err) {
    console.log(`   - S3 Storage Connection Failed: ${err.message}`);
    console.log('     (Ensure S3 credentials and endpoint are correct in your environment configuration)');
  }

  console.log('\n==================================');
}

runDiagnostics().catch(console.error);
