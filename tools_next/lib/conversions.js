import { exec } from 'child_process'
import { promisify } from 'util'
import { writeFile, readFile, unlink, mkdtemp } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'
import archiver from 'archiver'
import unzipper from 'unzipper'
import { getFileBuffer, uploadFile } from './storage'

const execAsync = promisify(exec)

const IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'tiff', 'tif', 'bmp', 'svg', 'ico', 'heic', 'heif', 'psd', 'raw']
const AUDIO_FORMATS = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma', 'opus', 'aiff', 'amr']
const VIDEO_FORMATS = ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm', '3gp', 'mpeg', 'mpg', 'm4v', 'ogv', 'ts', 'vob']
const DOCUMENT_FORMATS = ['pdf', 'docx', 'doc', 'odt', 'rtf', 'txt', 'html', 'md', 'epub']
const ARCHIVE_FORMATS = ['zip', 'tar', 'gz', 'bz2', '7z', 'rar']

function getCategory(format) {
  if (IMAGE_FORMATS.includes(format)) return 'image'
  if (AUDIO_FORMATS.includes(format)) return 'audio'
  if (VIDEO_FORMATS.includes(format)) return 'video'
  if (DOCUMENT_FORMATS.includes(format)) return 'document'
  if (ARCHIVE_FORMATS.includes(format)) return 'archive'
  return 'unknown'
}

function getMimeType(format) {
  const mimes = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif',
    webp: 'image/webp', avif: 'image/avif', tiff: 'image/tiff', tif: 'image/tiff',
    bmp: 'image/bmp', svg: 'image/svg+xml', ico: 'image/x-icon', heic: 'image/heic',
    heif: 'image/heif', psd: 'image/vnd.adobe.photoshop',
    mp3: 'audio/mpeg', wav: 'audio/wav', flac: 'audio/flac', aac: 'audio/aac',
    ogg: 'audio/ogg', m4a: 'audio/mp4', wma: 'audio/x-ms-wma', opus: 'audio/opus',
    mp4: 'video/mp4', avi: 'video/x-msvideo', mkv: 'video/x-matroska',
    mov: 'video/quicktime', wmv: 'video/x-ms-wmv', flv: 'video/x-flv',
    webm: 'video/webm', pdf: 'application/pdf', txt: 'text/plain',
    html: 'text/html', md: 'text/markdown', zip: 'application/zip',
    tar: 'application/x-tar', gz: 'application/gzip',
  }
  return mimes[format] || 'application/octet-stream'
}

async function convertWithSharp(inputBuffer, fromFormat, toFormat) {
  let pipeline = sharp(inputBuffer)

  const formatOptions = {
    jpeg: { quality: 90 },
    jpg: { quality: 90 },
    png: { compressionLevel: 6 },
    webp: { quality: 85 },
    avif: { quality: 80 },
    tiff: { quality: 90 },
    tif: { quality: 90 },
  }

  const outputFormat = toFormat === 'jpg' ? 'jpeg' : toFormat
  pipeline = pipeline.toFormat(outputFormat, formatOptions[toFormat] || {})
  return pipeline.toBuffer()
}

async function convertWithFfmpeg(inputBuffer, fromFormat, toFormat, tmpDir) {
  const inputPath = join(tmpDir, `input.${fromFormat}`)
  const outputPath = join(tmpDir, `output.${toFormat}`)

  await writeFile(inputPath, inputBuffer)

  const isAudio = AUDIO_FORMATS.includes(toFormat)
  const isVideo = VIDEO_FORMATS.includes(toFormat)

  let cmd = `ffmpeg -y -i "${inputPath}"`

  if (isAudio) {
    const audioCodecs = {
      mp3: '-codec:a libmp3lame -b:a 192k',
      wav: '-codec:a pcm_s16le',
      flac: '-codec:a flac',
      aac: '-codec:a aac -b:a 192k',
      ogg: '-codec:a libvorbis',
      m4a: '-codec:a aac',
      opus: '-codec:a libopus',
    }
    cmd += ` ${audioCodecs[toFormat] || ''} -vn "${outputPath}"`
  } else if (isVideo) {
    cmd += ` -codec:v libx264 -preset fast -crf 23 -codec:a aac -b:a 128k "${outputPath}"`
  } else {
    cmd += ` "${outputPath}"`
  }

  await execAsync(cmd, { timeout: 120000 })
  return await readFile(outputPath)
}

async function convertDocument(inputBuffer, fromFormat, toFormat, tmpDir) {
  const inputPath = join(tmpDir, `input.${fromFormat}`)
  const outputPath = join(tmpDir, `output.${toFormat}`)

  await writeFile(inputPath, inputBuffer)

  if (toFormat === 'pdf') {
    await execAsync(`libreoffice --headless --convert-to pdf --outdir "${tmpDir}" "${inputPath}"`, { timeout: 120000 })
  } else if (fromFormat === 'pdf') {
    const convType = toFormat === 'docx' ? 'docx' : toFormat === 'txt' ? 'txt' : toFormat
    await execAsync(`libreoffice --headless --convert-to ${convType} --outdir "${tmpDir}" "${inputPath}"`, { timeout: 120000 })
  } else {
    await execAsync(`libreoffice --headless --convert-to ${toFormat} --outdir "${tmpDir}" "${inputPath}"`, { timeout: 120000 })
  }

  const possibleOutputs = [
    join(tmpDir, `output.${toFormat}`),
    join(tmpDir, `input.${toFormat}`),
  ]

  for (const p of possibleOutputs) {
    try {
      return await readFile(p)
    } catch {}
  }

  throw new Error('Document conversion failed: output file not found')
}

async function convertArchive(inputBuffer, fromFormat, toFormat, tmpDir) {
  if (fromFormat === 'zip' && toFormat === 'tar') {
    const inputPath = join(tmpDir, 'input.zip')
    await writeFile(inputPath, inputBuffer)
    const extractPath = join(tmpDir, 'extracted')
    await unzipper.Open.file(inputPath).then((d) => d.extract({ path: extractPath, concurrency: 5 }))
    const outputPath = join(tmpDir, 'output.tar')
    await execAsync(`tar -cf "${outputPath}" -C "${extractPath}" .`, { timeout: 60000 })
    return await readFile(outputPath)
  }

  throw new Error(`Archive conversion from ${fromFormat} to ${toFormat} not yet supported`)
}

export async function convertFile(inputKey, fromFormat, toFormat, options = {}) {
  const tmpDir = await mkdtemp(join(tmpdir(), 'convert-'))
  const inputBuffer = await getFileBuffer(inputKey)

  try {
    let outputBuffer
    const fromCat = getCategory(fromFormat)
    const toCat = getCategory(toFormat)

    if (fromCat === 'image' && toCat === 'image') {
      outputBuffer = await convertWithSharp(inputBuffer, fromFormat, toFormat)
    } else if (
      (fromCat === 'audio' || fromCat === 'video') &&
      (toCat === 'audio' || toCat === 'video')
    ) {
      outputBuffer = await convertWithFfmpeg(inputBuffer, fromFormat, toFormat, tmpDir)
    } else if (fromCat === 'document' || toCat === 'document') {
      outputBuffer = await convertDocument(inputBuffer, fromFormat, toFormat, tmpDir)
    } else {
      throw new Error(`Conversion from ${fromFormat} to ${toFormat} is not supported`)
    }

    const mimeType = getMimeType(toFormat)
    const { key: outputKey, size } = await uploadFile(
      outputBuffer,
      `output.${toFormat}`,
      mimeType
    )

    return { outputKey, size, mimeType }
  } finally {
    try {
      const { readdirSync, rmSync } = await import('fs')
      const files = readdirSync(tmpDir)
      for (const file of files) {
        rmSync(join(tmpDir, file), { recursive: true })
      }
      rmSync(tmpDir, { recursive: true })
    } catch {}
  }
}

export function getConversionEngine(fromFormat, toFormat) {
  const fromCat = getCategory(fromFormat)
  const toCat = getCategory(toFormat)

  if (fromCat === 'image' && toCat === 'image') return 'sharp'
  if (fromCat === 'audio' || fromCat === 'video' || toCat === 'audio' || toCat === 'video') return 'ffmpeg'
  if (fromCat === 'document' || toCat === 'document') return 'libreoffice'
  return 'unsupported'
}
