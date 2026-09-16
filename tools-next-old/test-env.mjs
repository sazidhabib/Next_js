import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

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
  console.log('\n3. Checking MySQL Database & Auto-Schema...');
  console.log(`   Attempting connection to ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '3306'} (user: ${process.env.DB_USER || 'root'}, db: ${process.env.DB_NAME || 'fileconverter'})...`);
  try {
    const { query } = await import('./lib/db.js');
    await query('SELECT 1');
    console.log('   - Database & Schema Auto-Init: SUCCESSFUL');
  } catch (err) {
    console.log(`   - Database Connection/Schema Failed: ${err.message}`);
    console.log('     (Ensure your MySQL server is running and credentials in .env are correct)');
  }

  // 4. Local Storage Check
  console.log('\n4. Checking Local Storage Directory...');
  const uploadPath = join(process.cwd(), 'public', 'upload');
  const categories = [
    'documents',
    'images',
    'video',
    'audio',
    'spreadsheets',
    'slides',
    'ebooks',
    'archives',
    'vector',
    'cad',
    'fonts'
  ];
  
  let allDirsExist = true;
  for (const cat of categories) {
    const catPath = join(uploadPath, cat);
    if (existsSync(catPath)) {
      console.log(`   - ${cat} directory: EXISTS`);
    } else {
      console.log(`   - ${cat} directory: MISSING`);
      allDirsExist = false;
    }
  }

  if (allDirsExist) {
    console.log('\n   - Local Storage Status: READY (all 11 category folders exist under public/upload)');
  } else {
    console.log('\n   - Local Storage Status: INCOMPLETE (some category folders are missing in public/upload)');
  }

  console.log('\n==================================');
}

runDiagnostics().catch(console.error);
