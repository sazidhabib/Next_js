import crypto from 'crypto';

const SECRET = process.env.NEXTAUTH_SECRET || 'super-secret-jwt-key-foodordering-2026';

export function encryptSession(data) {
  const payload = Buffer.from(JSON.stringify(data)).toString('base64');
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(payload)
    .digest('hex');
  return `${payload}.${signature}`;
}

export function decryptSession(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  
  const expectedSignature = crypto
    .createHmac('sha256', SECRET)
    .update(payload)
    .digest('hex');
    
  if (signature !== expectedSignature) {
    return null;
  }
  
  try {
    return JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
  } catch (e) {
    return null;
  }
}
