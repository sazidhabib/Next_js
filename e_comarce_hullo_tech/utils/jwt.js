const crypto = require('crypto');

const getSecret = () => process.env.JWT_SECRET || 'fallback_secret_key';

/**
 * Native implementation of signing a JWT-like token.
 * Generates a valid HS256 base64url-encoded JWT.
 */
const signToken = (payload, options = {}) => {
  const secret = getSecret();
  
  // Standard header
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  // Base64url encode helper
  const base64url = (str) => {
    return Buffer.from(str)
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  };

  const encodedHeader = base64url(JSON.stringify(header));
  
  // Add expiration time to payload if needed (default 30 days)
  const finalPayload = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60)
  };
  
  const encodedPayload = base64url(JSON.stringify(finalPayload));
  
  // Sign header + payload using HMAC-SHA256
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
    
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

/**
 * Native implementation of verifying a JWT token.
 * Parses and validates expiration and signature.
 */
const verifyToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [encodedHeader, encodedPayload, signature] = parts;
    const secret = getSecret();
    
    // Recalculate signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
      
    if (signature !== expectedSignature) {
      return null;
    }
    
    // Decode payload
    const payloadStr = Buffer.from(encodedPayload, 'base64').toString('utf8');
    const payload = JSON.parse(payloadStr);
    
    // Check expiration
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return null; // Expired
    }
    
    return payload;
  } catch (error) {
    return null;
  }
};

module.exports = {
  sign: signToken,
  verify: verifyToken
};
