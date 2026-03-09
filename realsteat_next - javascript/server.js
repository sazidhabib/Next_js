const express = require("express");
const next = require("next");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const PORT = process.env.PORT || 5000;

// Import Backend Logic
const initDb = require("./server-api/config/initDb");
const frameRoutes = require("./server-api/routes/frameRoutes");
const userRoutes = require("./server-api/routes/userRoutes");
const settingRoutes = require("./server-api/routes/settingRoutes");
const categoryRoutes = require("./server-api/routes/categoryRoutes");
const menuRoutes = require("./server-api/routes/menuRoutes");

nextApp.prepare().then(() => {
    const app = express();

    // Initialize Database
    initDb();

    // CORS Configuration
    const corsOptions = {
        origin: [
            "http://localhost:3000",
            "http://localhost:5000",
            "https://presidentpropertiesltd.com",
            "https://www.presidentpropertiesltd.com",
            "https://president.deshprobaho.com",
            "http://presidentpropertiesltd.com",
            "http://www.presidentpropertiesltd.com",
            "http://president.deshprobaho.com"
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
        optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
    };

    app.use(cors(corsOptions));


    // Middleware
    app.use(express.json());

    // Security Headers (CSP) - Required for Custom Server
    app.use((req, res, next) => {
        const origin = req.headers.origin;
        const allowedOrigins = corsOptions.origin;
        
        if (allowedOrigins.includes(origin)) {
            res.setHeader("Access-Control-Allow-Origin", origin);
            res.setHeader("Access-Control-Allow-Credentials", "true");
        }

        res.setHeader(
            "Content-Security-Policy",
            "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com https://presidentpropertiesltd.com https://www.presidentpropertiesltd.com https://maps.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://presidentpropertiesltd.com https://www.presidentpropertiesltd.com https://president.deshprobaho.com; frame-src 'self' https://www.google.com https://www.youtube.com https://youtube.com;"
        );
        next();
    });

    // Serve Uploads
    app.use("/uploads", express.static(path.join(__dirname, "server-api/uploads")));

    // Test Route for Backend
    app.get("/api/health", (req, res) => {
        res.send("Backend is running");
    });

    // API Routes
    app.use("/api/frames", frameRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/settings", settingRoutes);
    app.use("/api/categories", categoryRoutes);
    app.use("/api/menu", menuRoutes);

    // Next.js Request Handler (Catch-all)
    app.all(/(.*)/, (req, res) => {
        return handle(req, res);
    });

    app.listen(PORT, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${PORT}`);
    });
});
