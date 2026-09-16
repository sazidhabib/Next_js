import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { getFormat } from './formats.js'

const isLocal = !process.env.STORAGE_ENDPOINT

// S3 Client configuration
const s3 = !isLocal ? new S3Client({
  region: 'auto',
  endpoint: process.env.STORAGE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY || '',
  },
}) : null

const BUCKET = process.env.STORAGE_BUCKET || 'fileconverter'
const PUBLIC_URL = process.env.STORAGE_PUBLIC_URL || ''

// Helper to determine local path
function getLocalPath(key) {
  return path.join(process.cwd(), 'public', key)
}

export async function uploadFile(buffer, filename, contentType) {
  const ext = filename.split('.').pop().toLowerCase()
  const fmtInfo = getFormat(ext)
  const category = fmtInfo ? fmtInfo.category : 'other'
  
  const key = `upload/${category}/${uuidv4()}.${ext}`

  if (isLocal) {
    const fullPath = getLocalPath(key)
    const dir = path.dirname(fullPath)
    if (!existsSync(dir)) {
      await fs.mkdir(dir, { recursive: true })
    }
    await fs.writeFile(fullPath, buffer)
    return { key, size: buffer.length }
  }

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  )

  return { key, size: buffer.length }
}

export async function getDownloadUrl(key, filename) {
  if (isLocal) {
    // For local, return the static URL of the file (served at root of public directory)
    return `/${key}`
  }

  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ResponseContentDisposition: `attachment; filename="${filename}"`,
  })

  const url = await getSignedUrl(s3, command, { expiresIn: 3600 })
  return url
}

export async function getFileBuffer(key) {
  if (isLocal) {
    const fullPath = getLocalPath(key)
    return await fs.readFile(fullPath)
  }

  const response = await s3.send(
    new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  )

  const chunks = []
  for await (const chunk of response.Body) {
    chunks.push(chunk)
  }
  return Buffer.concat(chunks)
}

export async function deleteFile(key) {
  if (isLocal) {
    const fullPath = getLocalPath(key)
    if (existsSync(fullPath)) {
      await fs.unlink(fullPath)
    }
    return
  }

  await s3.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  )
}

export function getPublicUrl(key) {
  if (isLocal) {
    return `/${key}`
  }
  return `${PUBLIC_URL}/${key}`
}
