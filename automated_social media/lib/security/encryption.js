import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const DEFAULT_KEY = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

function getKey() {
  const envKey = process.env.ENCRYPTION_KEY || DEFAULT_KEY;
  return Buffer.from(envKey.slice(0, 64), "hex");
}

/**
 * Encrypts a plain text string using AES-256-GCM.
 * @param {string} text - The plain text string (e.g. OAuth token)
 * @returns {string} - Formatted as iv:authTag:encryptedData (hex encoded)
 */
export function encryptToken(text) {
  if (!text) return null;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypts an AES-256-GCM encrypted string.
 * @param {string} encryptedString - Formatted as iv:authTag:encryptedData
 * @returns {string} - Decrypted plain text string
 */
export function decryptToken(encryptedString) {
  if (!encryptedString) return null;

  try {
    const parts = encryptedString.split(":");
    if (parts.length !== 3) {
      // Return as-is if not in encrypted format (fallback safety)
      return encryptedString;
    }

    const [ivHex, authTagHex, encryptedData] = parts;
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Token decryption error:", error.message);
    return null;
  }
}
