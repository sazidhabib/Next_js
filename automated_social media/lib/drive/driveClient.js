import crypto from "crypto";

const DRIVE_API_BASE = "https://www.googleapis.com/drive/v3";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive";

const MEDIA_EXTENSIONS = new Set([
  ".mp4",
  ".mov",
  ".m4v",
  ".webm",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
]);

const TEXT_EXTENSIONS = new Set([".txt", ".md", ".json"]);

let cachedToken = null;
let cachedTokenExpiresAt = 0;

function base64UrlEncode(input) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input, "utf8");
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function getServiceAccountCredentials() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      const parsed = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
      if (parsed.client_email && parsed.private_key) {
        return {
          clientEmail: parsed.client_email,
          privateKey: parsed.private_key.replace(/\\n/g, "\n"),
        };
      }
    } catch (err) {
      throw new Error(`Invalid GOOGLE_SERVICE_ACCOUNT_JSON: ${err.message}`);
    }
  }

  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!clientEmail || !rawKey) {
    throw new Error(
      "Missing Google Service Account credentials. Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY (or GOOGLE_SERVICE_ACCOUNT_JSON)."
    );
  }

  return {
    clientEmail,
    privateKey: rawKey.replace(/\\n/g, "\n"),
  };
}

/**
 * Generates and caches an OAuth2 access token using a Google Service Account JWT.
 */
export async function getDriveAccessToken() {
  if (cachedToken && Date.now() < cachedTokenExpiresAt - 120_000) {
    return cachedToken;
  }

  const { clientEmail, privateKey } = getServiceAccountCredentials();
  const nowSec = Math.floor(Date.now() / 1000);

  const header = base64UrlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64UrlEncode(
    JSON.stringify({
      iss: clientEmail,
      scope: DRIVE_SCOPE,
      aud: TOKEN_URL,
      iat: nowSec,
      exp: nowSec + 3600,
    })
  );

  const unsignedJwt = `${header}.${payload}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsignedJwt);
  signer.end();
  const signature = base64UrlEncode(signer.sign(privateKey));
  const assertion = `${unsignedJwt}.${signature}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google Service Account auth failed: ${errText}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  cachedTokenExpiresAt = Date.now() + (data.expires_in || 3600) * 1000;
  return cachedToken;
}

function getExtension(filename = "") {
  const idx = filename.lastIndexOf(".");
  return idx >= 0 ? filename.slice(idx).toLowerCase() : "";
}

function getBaseName(filename = "") {
  const idx = filename.lastIndexOf(".");
  return idx >= 0 ? filename.slice(0, idx) : filename;
}

/**
 * Lists files inside a Google Drive folder sorted oldest-first.
 */
export async function listQueueFiles(folderId, pageSize = 50) {
  if (!folderId) {
    throw new Error("Google Drive folder ID is not configured.");
  }

  const token = await getDriveAccessToken();
  const query = `'${folderId}' in parents and trashed = false and mimeType != 'application/vnd.google-apps.folder'`;
  const params = new URLSearchParams({
    q: query,
    orderBy: "createdTime asc",
    pageSize: String(pageSize),
    fields: "files(id,name,mimeType,size,createdTime,parents)",
    supportsAllDrives: "true",
    includeItemsFromAllDrives: "true",
  });

  const res = await fetch(`${DRIVE_API_BASE}/files?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to list Google Drive folder ${folderId}: ${errText}`);
  }

  const data = await res.json();
  return data.files || [];
}

/**
 * Downloads a Google Drive file's raw bytes as a Buffer.
 */
export async function downloadFileBuffer(fileId) {
  const token = await getDriveAccessToken();
  const res = await fetch(
    `${DRIVE_API_BASE}/files/${encodeURIComponent(fileId)}?alt=media&supportsAllDrives=true`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to download Google Drive file ${fileId}: ${errText}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Parses an optional sidecar caption file (.txt, .md, or .json).
 */
function parseSidecarContent(rawText, ext) {
  if (!rawText) return { text: "", title: "", hashtags: [] };

  if (ext === ".json") {
    try {
      const parsed = JSON.parse(rawText);
      return {
        title: parsed.title || "",
        text: parsed.description || parsed.caption || parsed.text || "",
        hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : [],
        topic: parsed.topic || "",
      };
    } catch {
      return { text: rawText.trim(), title: "", hashtags: [] };
    }
  }

  // Plain text / markdown: optional first line "Title: ..."
  const lines = rawText.trim().split(/\r?\n/);
  let title = "";
  let bodyLines = lines;

  if (lines[0] && /^title\s*:/i.test(lines[0])) {
    title = lines[0].replace(/^title\s*:/i, "").trim();
    bodyLines = lines.slice(1);
  }

  return {
    title,
    text: bodyLines.join("\n").trim(),
    hashtags: [],
  };
}

/**
 * Picks the next unposted item from a Drive Queue folder.
 * Supports:
 * - "text" mode: picks oldest .txt/.md/.json file
 * - "reel" / "image" mode: picks oldest video/image file + optional matching sidecar caption file
 */
export async function pickNextQueueItem(queueFolderId, mode = "image", alreadyPostedIds = new Set()) {
  const files = await listQueueFiles(queueFolderId);
  if (files.length === 0) return null;

  const isTextMode = mode === "text";

  const candidates = files.filter((file) => {
    if (alreadyPostedIds.has(file.id)) return false;
    const ext = getExtension(file.name);
    const mime = file.mimeType || "";

    if (isTextMode) {
      return TEXT_EXTENSIONS.has(ext) || mime.startsWith("text/") || mime === "application/json";
    }
    if (mode === "reel") {
      return mime.startsWith("video/") || ext === ".mp4" || ext === ".mov" || ext === ".m4v" || ext === ".webm";
    }
    // image mode
    return mime.startsWith("image/") || [".jpg", ".jpeg", ".png", ".webp"].includes(ext);
  });

  if (candidates.length === 0) return null;

  const primaryFile = candidates[0];
  const primaryExt = getExtension(primaryFile.name);
  const primaryBase = getBaseName(primaryFile.name);

  if (isTextMode) {
    const buf = await downloadFileBuffer(primaryFile.id);
    const parsed = parseSidecarContent(buf.toString("utf8"), primaryExt);
    return {
      primaryFile,
      sidecarFile: null,
      mediaBuffer: null,
      mediaMimeType: null,
      mediaType: "text",
      sidecarData: parsed,
    };
  }

  // Look for matching sidecar (.txt, .md, .json) with the same base name
  const sidecarFile = files.find((f) => {
    if (f.id === primaryFile.id) return false;
    const ext = getExtension(f.name);
    return TEXT_EXTENSIONS.has(ext) && getBaseName(f.name) === primaryBase;
  });

  let sidecarData = { title: "", text: "", hashtags: [] };
  if (sidecarFile) {
    const sidecarBuf = await downloadFileBuffer(sidecarFile.id);
    sidecarData = parseSidecarContent(sidecarBuf.toString("utf8"), getExtension(sidecarFile.name));
  }

  const mediaBuffer = await downloadFileBuffer(primaryFile.id);
  const isVideo =
    (primaryFile.mimeType || "").startsWith("video/") ||
    [".mp4", ".mov", ".m4v", ".webm"].includes(primaryExt);

  return {
    primaryFile,
    sidecarFile: sidecarFile || null,
    mediaBuffer,
    mediaMimeType: primaryFile.mimeType || (isVideo ? "video/mp4" : "image/jpeg"),
    mediaType: isVideo ? "video" : "image",
    sidecarData,
  };
}

/**
 * Moves a file in Google Drive from Queue/ to Posted/.
 */
export async function moveFileToPosted(fileId, fromFolderId, toFolderId) {
  if (!fileId || !toFolderId) return null;

  const token = await getDriveAccessToken();
  const params = new URLSearchParams({
    addParents: toFolderId,
    supportsAllDrives: "true",
    fields: "id,name,parents",
  });
  if (fromFolderId) {
    params.set("removeParents", fromFolderId);
  }

  const res = await fetch(
    `${DRIVE_API_BASE}/files/${encodeURIComponent(fileId)}?${params.toString()}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to move Drive file ${fileId} to Posted folder: ${errText}`);
  }

  return await res.json();
}
