const express = require("express");
const next = require("next");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const dev = process.env.NODE_ENV !== "production";
const useNext = process.env.DISABLE_NEXT !== "true";

let nextApp;
let handle;

if (useNext) {
    nextApp = next({ dev });
    handle = nextApp.getRequestHandler();
}

const sequelize = require("./db/database");
const errorMiddleware = require("./middlewares/error-middleware");

const setupExpress = () => {
    const app = express();

    // Ensure "uploads" folder exists
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }

    app.use("/uploads", express.static(path.join(__dirname, "uploads")));
    app.use("/images", express.static(path.join(__dirname, "uploads")));

    // CORS Configuration (Updated for Production)
    const corsOptions = {
        origin: [
            "http://localhost:3000",
            "http://localhost:5000",
            "https://pathakbondhu.com",
            "http://pathakbondhu.com",
            "https://pathokbonddhu.kamrulhasan.info",
            "http://pathokbonddhu.kamrulhasan.info"
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
        credentials: true,
        optionsSuccessStatus: 200
    };
    app.use(cors(corsOptions));
    app.use(express.json({ limit: '10mb' }));

    // Security Headers (CSP) - Important for Custom Servers
    app.use((req, res, next) => {
        res.setHeader(
            "Content-Security-Policy",
            "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com https://pathakbondhu.com https://pathokbonddho.kamrulhasan.info https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https: http://localhost:5000 http://127.0.0.1:5000; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' http://localhost:5000 http://127.0.0.1:5000 http://localhost:3000 http://127.0.0.1:3000 https://pathakbondhu.com https://pathokbonddho.kamrulhasan.info https://www.google-analytics.com https://ssl.google-analytics.com https://www.googletagmanager.com; frame-src 'self' https://www.google.com https://www.youtube.com https://youtube.com;"
        );
        next();
    });

    // Import Routers
    const tagRoutes = require("./router/tag-router");
    const authorRoutes = require('./router/author-router');
    const adRouter = require('./router/ad-router');
    const designRoutes = require('./router/design-router');
    const imageRegistryRoutes = require('./router/imageRegistryRoutes');
    const menuRoutes = require('./router/menu-routes');
    const newsRouter = require("./router/news-router");
    const photocardRouter = require("./router/photocard-router");

    // API Routes
    app.use("/api/menus", menuRoutes);
    app.use("/api/auth", require("./router/auth-router"));
    app.use("/api/about", require("./router/about-router"));
    app.use("/api/layout", require("./router/layoutRouters"));
    app.use('/api/tags', tagRoutes);
    app.use('/api/authors', authorRoutes);
    app.use('/api/ads', adRouter);
    app.use('/api/designs', designRoutes);
    app.use("/api/news", newsRouter);
    app.use("/api/users", require("./router/user-router"));
    app.use("/api", require("./router/photoRoutes"));
    app.use("/api/images", require("./router/imageRoutes"));
    app.use('/api/image-registry', imageRegistryRoutes);
    app.use("/api/photocards", photocardRouter);

    // Ensure public photocards uploads directory exists
    const photocardDir = path.join(__dirname, "uploads", "photocards");
    if (!fs.existsSync(photocardDir)) {
        fs.mkdirSync(photocardDir, { recursive: true });
    }

    // Public photocard upload endpoint
    app.post("/api/public/photocard", async (req, res) => {
        try {
            const { image, type, action } = req.body;
            if (!image) {
                return res.status(400).json({ message: "Image data is required" });
            }

            const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, "base64");

            const filename = `photocard-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.png`;
            const filePath = path.join(photocardDir, filename);

            fs.writeFileSync(filePath, buffer);

            const fileUrl = `/uploads/photocards/${filename}`;

            // Save to database
            const { PhotocardImage } = require("./models");
            if (PhotocardImage) {
                await PhotocardImage.create({
                    imageUrl: fileUrl,
                    photocardType: type || "unknown",
                    action: action || "download"
                });
            }

            res.status(200).json({ url: fileUrl });
        } catch (error) {
            console.error("Public photocard upload error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    });

    // Error Handling Middleware (Keep before Next.js handler)
    app.use(errorMiddleware);

    // Next.js Request Handler (Catch-all)
    if (useNext) {
        app.all(/(.*)/, (req, res) => {
            return handle(req, res);
        });
    }

    // Start server
    const startServer = async () => {
        try {
            await sequelize.authenticate();
            console.log("✅ MySQL connection established successfully.");

            // Auto-migration: add popup ad columns if missing
            try {
                const [cols] = await sequelize.query("SHOW COLUMNS FROM ads LIKE 'popupAutoCloseSeconds'");
                if (cols.length === 0) {
                    await sequelize.query("ALTER TABLE ads ADD COLUMN popupAutoCloseSeconds INT NULL DEFAULT NULL");
                    console.log("✅ Added column: popupAutoCloseSeconds");
                }
            } catch (e) { /* table might not exist yet, ignore */ }
            try {
                const [cols] = await sequelize.query("SHOW COLUMNS FROM ads LIKE 'popupMaxShowCount'");
                if (cols.length === 0) {
                    await sequelize.query("ALTER TABLE ads ADD COLUMN popupMaxShowCount INT NULL DEFAULT NULL");
                    console.log("✅ Added column: popupMaxShowCount");
                }
            } catch (e) { /* table might not exist yet, ignore */ }
            try {
                const [cols] = await sequelize.query("SHOW COLUMNS FROM ads LIKE 'mobileImage'");
                if (cols.length === 0) {
                    await sequelize.query("ALTER TABLE ads ADD COLUMN mobileImage VARCHAR(255) NULL DEFAULT NULL");
                    console.log("✅ Added column: mobileImage");
                }
            } catch (e) { /* table might not exist yet, ignore */ }

            // Auto-migration: create photocard_statistics table if it doesn't exist
            try {
                await sequelize.query(`
                    CREATE TABLE IF NOT EXISTS photocard_statistics (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        type VARCHAR(255) NOT NULL UNIQUE,
                        name VARCHAR(255) NOT NULL,
                        downloadCount INT DEFAULT 0,
                        shareCount INT DEFAULT 0,
                        createdAt DATETIME NOT NULL,
                        updatedAt DATETIME NOT NULL
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                `);
                console.log("✅ Checked/Created table: photocard_statistics");

                // Initialize the 3 default photocard types if they don't exist
                const [records] = await sequelize.query("SELECT COUNT(*) as count FROM photocard_statistics");
                if (records[0].count === 0) {
                    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
                    await sequelize.query(`
                        INSERT INTO photocard_statistics (type, name, downloadCount, shareCount, createdAt, updatedAt)
                        VALUES 
                        ('pathokbonddho-photocard', 'পাঠকবন্ধু ফটোকার্ড', 0, 0, '${now}', '${now}'),
                        ('ajp-photocard', 'আজকের পত্রিকা ফটোকার্ড', 0, 0, '${now}', '${now}'),
                        ('ajp-profile', 'প্রোফাইল পিকচার', 0, 0, '${now}', '${now}')
                    `);
                    console.log("✅ Seeded default photocard statistic records");
                }
            } catch (e) {
                console.error("❌ Error setting up photocard_statistics:", e);
            }

            // Auto-migration: create photocard_images table if it doesn't exist
            try {
                await sequelize.query(`
                    CREATE TABLE IF NOT EXISTS photocard_images (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        imageUrl VARCHAR(255) NOT NULL,
                        photocardType VARCHAR(255) NOT NULL,
                        action VARCHAR(50) NOT NULL DEFAULT 'download',
                        createdAt DATETIME NOT NULL,
                        updatedAt DATETIME NOT NULL
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                `);
                console.log("✅ Checked/Created table: photocard_images");
            } catch (e) {
                console.error("❌ Error setting up photocard_images:", e);
            }

            const { Page, PageSection, Row, Column } = require("./models");

            // Safe sync logic
            if (process.env.NODE_ENV === 'production') {
                console.log("✅ Production environment: Using migrations only");
                // Check if our layout tables exist, create only if missing
                const [tables] = await sequelize.query("SHOW TABLES");
                const tableNames = tables.map(t => Object.values(t)[0]);
                const layoutTables = ['pages', 'page_sections', 'rows', 'columns', 'abouts'];
                const missingTables = layoutTables.filter(table => !tableNames.includes(table));

                if (missingTables.length > 0) {
                    await sequelize.sync();
                }
            } else {
                console.log("🔄 Development mode: Sync disabled (use migrations).");
            }

            const PORT = process.env.PORT || 5000;
            app.listen(PORT, () => console.log(`🚀 ${useNext ? 'Unified' : 'API'} Server running on port ${PORT}`));
        } catch (error) {
            console.error("❌ Server startup failed:", error);
            process.exit(1);
        }
    };

    startServer();
};

if (useNext) {
    nextApp.prepare().then(() => {
        setupExpress();
    });
} else {
    setupExpress();
}