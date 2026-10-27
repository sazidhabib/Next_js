import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'hrms_enterprise_secret_key_2026_x98f_secure!';

/**
 * Creates an HMAC-SHA256 signed JWT token.
 * @param {object} payload - Session data (e.g. { uid, role })
 * @param {number} expiresInSeconds - Default 7 days (604800s)
 * @returns {string} Signed JWT string (header.payload.signature)
 */
export function createSessionToken(payload, expiresInSeconds = 7 * 86400) {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(unsignedToken)
    .digest('base64url');

  return `${unsignedToken}.${signature}`;
}

/**
 * Verifies and decodes an HMAC-SHA256 signed JWT token.
 * Returns decoded payload if valid and unexpired; returns null if invalid, tampered, or expired.
 * @param {string} token
 * @returns {object|null}
 */
export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  try {
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(unsignedToken)
      .digest('base64url');

    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (sigBuffer.length !== expectedBuffer.length) {
      return null;
    }

    if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return null;
    }

    const payloadJson = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
    const payload = JSON.parse(payloadJson);

    // Check expiration
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
      return null;
    }

    return payload;
  } catch (err) {
    return null;
  }
}
