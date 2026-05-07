// Custom standalone server for cPanel deployment
// This file runs the Next.js standalone server with low memory settings

const { createServer } = require("http");
const path = require("path");
const next = require("next");

const dev = false;
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = parseInt(process.env.PORT, 10) || 3000;

// Force garbage collection more aggressively
if (global.gc) {
  setInterval(() => {
    global.gc();
  }, 60000); // Run GC every 60 seconds
}

const app = next({ dev, hostname, port, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Use the WHATWG URL API instead of deprecated url.parse()
      const parsedUrl = new URL(req.url, `http://${hostname}:${port}`);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  })
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> Memory usage: ${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`);
    });
});
