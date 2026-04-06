const express = require("express");
const next = require("next");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const sequelize = require("./db/database");
const errorMiddleware = require("./middlewares/error-middleware");

nextApp.prepare().then(() => {
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
            "http://pathakbondhu.com"
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
        credentials: true,
        optionsSuccessStatus: 200
    };
    app.use(cors(corsOptions));
    app.use(express.json());

    // Security Headers (CSP) - Important for Custom Servers
    app.use((req, res, next) => {
        res.setHeader(
            "Content-Security-Policy",
            "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com https://pathakbondhu.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://pathakbondhu.com; frame-src 'self' https://www.google.com https://www.youtube.com https://youtube.com;"
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
    const newsRouter = require('./router/news-router');

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

    // Error Handling Middleware (Keep before Next.js handler)
    app.use(errorMiddleware);

    // Next.js Request Handler (Catch-all)
    app.all(/(.*)/, (req, res) => {
        return handle(req, res);
    });

    // Start server
    const startServer = async () => {
        try {
            await sequelize.authenticate();
            console.log("✅ MySQL connection established successfully.");

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
            app.listen(PORT, () => console.log(`🚀 Unified Server running on port ${PORT}`));
        } catch (error) {
            console.error("❌ Server startup failed:", error);
            process.exit(1);
        }
    };

    startServer();
});