import { join } from 'path';
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { uploadFile, getFileBuffer, deleteFile } from './lib/storage.js';
import { convertFile } from './lib/conversions.js';

const execAsync = promisify(exec);

async function runTests() {
  console.log('=== FILE CONVERTER INTEGRATION TESTS ===\n');

  let failedTests = 0;
  let passedTests = 0;

  // Generate a valid MP4 mock using FFmpeg
  console.log('Generating valid video mock using local FFmpeg...');
  let mockMp4 = Buffer.from('AAAAGGZ0eXBtcDQyAAAAAG1wNDJpc29tAAAAHHV1aWR4DirectShow_Ffmpeg_TestAAAAD21vb3YAAABsbXZoZAAAAAD/', 'base64');
  try {
    const localFfmpeg = join(process.cwd(), 'bin', 'ffmpeg.exe');
    const ffmpegCmd = existsSync(localFfmpeg) ? `"${localFfmpeg}"` : 'ffmpeg';
    const tempMp4Path = join(process.cwd(), 'public', 'temp-test-video.mp4');
    
    // Generate 0.5 seconds of silent video with basic mp4 container
    await execAsync(`${ffmpegCmd} -y -f lavfi -i anullsrc=r=44100:cl=mono -t 0.5 -pix_fmt yuv420p "${tempMp4Path}"`);
    
    if (existsSync(tempMp4Path)) {
      mockMp4 = readFileSync(tempMp4Path);
      unlinkSync(tempMp4Path);
      console.log('   - Success: Valid video mock generated dynamically.');
    }
  } catch (err) {
    console.warn('   - Warning: Could not generate dynamic video mock using FFmpeg, falling back to dummy buffer.', err.message);
  }

  // Helper function to run a conversion test
  async function testConversion(name, buffer, filename, fromExt, toExt, contentType, expectSuccess = true) {
    console.log(`\nTesting Category: ${name} (${fromExt.toUpperCase()} -> ${toExt.toUpperCase()})...`);
    let inputKey;
    try {
      const uploadRes = await uploadFile(buffer, filename, contentType);
      inputKey = uploadRes.key;
      console.log(`   - Uploaded test file: ${inputKey}`);

      const result = await convertFile(inputKey, fromExt, toExt);
      console.log(`   - Converted output Key: ${result.outputKey} (size: ${result.size} bytes)`);

      const outputBuffer = await getFileBuffer(result.outputKey);
      
      if (expectSuccess) {
        if (outputBuffer && outputBuffer.length > 0) {
          console.log('   - Result: SUCCESS (Output file is valid)');
          passedTests++;
        } else {
          throw new Error('Output buffer is empty');
        }
      } else {
        throw new Error('Expected conversion to fail, but it succeeded');
      }

      // Clean up
      if (result.outputKey) {
        await deleteFile(result.outputKey);
      }
    } catch (err) {
      if (!expectSuccess) {
        console.log(`   - Result: SUCCESS (Failed as expected with error: "${err.message}")`);
        passedTests++;
      } else {
        console.error('   - Result: FAILED ->', err.message);
        failedTests++;
      }
    } finally {
      if (inputKey) {
        try {
          await deleteFile(inputKey);
        } catch {}
      }
    }
  }

  // Define Mock Files
  const mockPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
  const mockTxt = Buffer.from('Hello world! This is a test document.');
  const mockWav = Buffer.from('UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=', 'base64');
  const mockZip = Buffer.from('UEsDBAoAAAAAAAC2klQAAAAAAAAAAAAAAAAGABwAdGVzdC50eHRVVAkAA2R98mVkffJldXgLAAEE9QEAAAQUAAAAUEsBAh4DCgAAAAAAAC2klQAAAAAAAAAAAAAAAAGAGQAAAAAAAAAAAAAAAAB0ZXN0LnR4dFVUBQADZH3yZXV4CwABBPUBQAAEFAAAAFBLBQYAAAAAAQABAE4AAAA6AAAAAAA=', 'base64');
  const mockSvg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="red"/></svg>');
  const mockDxf = Buffer.from('0\nSECTION\n2\nHEADER\n0\nENDSEC\n0\nEOF');
  const mockFont = Buffer.from('OTTO\x00\x01\x00\x00');

  // Run all 11 category tests
  
  // 1. Documents
  await testConversion('Documents', mockTxt, 'test.txt', 'txt', 'pdf', 'text/plain');

  // 2. Images
  await testConversion('Images', mockPng, 'test.png', 'png', 'jpg', 'image/png');

  // 3. Audio
  await testConversion('Audio', mockWav, 'test.wav', 'wav', 'mp3', 'audio/wav');

  // 4. Video
  await testConversion('Video', mockMp4, 'test.mp4', 'mp4', 'mkv', 'video/mp4');

  // 5. Spreadsheets
  await testConversion('Spreadsheets', mockTxt, 'test.csv', 'csv', 'xlsx', 'text/csv');

  // 6. Slides
  await testConversion('Slides', mockZip, 'test.pptx', 'pptx', 'pdf', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');

  // 7. E-books
  await testConversion('E-books', mockZip, 'test.epub', 'epub', 'pdf', 'application/epub+zip');

  // 8. Archives
  await testConversion('Archives', mockZip, 'test.zip', 'zip', 'tar', 'application/zip');

  // 9. Vector (Using SVG -> EPS which LibreOffice handles beautifully)
  await testConversion('Vector', mockSvg, 'test.svg', 'svg', 'eps', 'image/svg+xml');

  // 10. CAD (CAD conversions like DXF->STL are currently not supported in backend - verifying error boundaries)
  await testConversion('CAD', mockDxf, 'test.dxf', 'dxf', 'stl', 'image/vnd.dxf', false);

  // 11. Fonts (Fonts are currently not supported - verifying error boundaries)
  await testConversion('Fonts', mockFont, 'test.otf', 'otf', 'ttf', 'font/otf', false);

  console.log('\n======================================');
  console.log(`Tests Run Complete: ${passedTests} passed, ${failedTests} failed.`);
  console.log('======================================');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Execution error:', err);
  process.exit(1);
});
