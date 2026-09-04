require("dotenv").config();
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const rawPort = process.env.PORT || 3000;
const port = !isNaN(rawPort) ? parseInt(rawPort, 10) : rawPort;

const app = next({ dev, hostname, port: typeof port === "number" ? port : 3000 });
const handle = app.getRequestHandler();

// Helper to determine allowed origins
function getAllowedOrigins() {
  const defaultPort = typeof port === "number" ? port : 3000;
  const allowed = new Set([
    `http://localhost:${defaultPort}`,
    `http://127.0.0.1:${defaultPort}`,
    `http://${hostname}:${defaultPort}`,
  ]);

  if (process.env.NEXT_PUBLIC_APP_URL) {
    try {
      const url = new URL(process.env.NEXT_PUBLIC_APP_URL);
      allowed.add(url.origin);
    } catch {
      // ignore invalid URL
    }
  }

  if (process.env.ALLOWED_ORIGINS) {
    process.env.ALLOWED_ORIGINS.split(",")
      .map((o) => o.trim())
      .filter(Boolean)
      .forEach((origin) => {
        try {
          const url = new URL(origin);
          allowed.add(url.origin);
        } catch {
          allowed.add(origin);
        }
      });
  }

  return allowed;
}

function isOriginAllowed(origin, reqHost) {
  if (!origin) return true; // Direct / same-origin navigation without Origin header

  const allowedOrigins = getAllowedOrigins();
  if (allowedOrigins.has(origin)) return true;

  // Check against current request host header (same-origin with http/https)
  if (reqHost) {
    if (origin === `http://${reqHost}` || origin === `https://${reqHost}`) {
      return true;
    }
  }

  return false;
}

async function startServer() {
  try {
    // Automatically check and sync database tables, columns, and initial data
    const { ensureDatabaseReady } = await import("./lib/initDb.mjs");
    await ensureDatabaseReady({ verbose: true, autoSeedIfEmpty: true });
  } catch (dbErr) {
    console.warn("⚠️ [Database Init Notice]:", dbErr.message);
  }

  await app.prepare();

  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const origin = req.headers.origin;
      const host = req.headers.host;
      const pathname = parsedUrl.pathname || "";
      const isApiRoute = pathname.includes("/api/") || pathname.endsWith("/api");

      // Handle Cross-Origin Requests
      if (origin) {
        const allowed = isOriginAllowed(origin, host);

        if (allowed) {
          res.setHeader("Access-Control-Allow-Origin", origin);
          res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
          res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");
          res.setHeader("Access-Control-Allow-Credentials", "true");
          res.setHeader("Vary", "Origin");

          // Handle Preflight OPTIONS Request
          if (req.method === "OPTIONS") {
            res.statusCode = 204;
            res.end();
            return;
          }
        } else {
          // Block unauthorized cross-origin access to API routes
          if (isApiRoute || req.method === "OPTIONS") {
            res.statusCode = 403;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Forbidden: Cross-origin access denied" }));
            return;
          }
        }
      }

      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling request:", req.url, err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  });

  server.once("error", (err) => {
    console.error("Server error:", err);
    process.exit(1);
  });

  // Support cPanel CloudLinux Passenger or standalone port listening
  if (typeof PhusionPassenger !== "undefined" || port === "passenger") {
    server.listen("passenger");
    console.log("> Next.js App running on Phusion Passenger");
  } else {
    server.listen(port, () => {
      console.log(`> Next.js App ready on http://${hostname}:${port}`);
    });
  }
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
