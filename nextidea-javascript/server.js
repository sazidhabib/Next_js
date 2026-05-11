const express = require('express');
const next = require('next');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT, 10) || 3000;

const nextApp = next({ dev, hostname, port });
const handle = nextApp.getRequestHandler();

const { query } = require('./config/database');

nextApp.prepare().then(() => {
    const app = express();

    // Middleware
    app.use(cors({
        origin: true,
        credentials: true
    }));
    app.use(cookieParser());

    // Body Parsers - Only for API routes to avoid interfering with Next.js stream
    // IMPORTANT: Skip for /api/upload as Next.js needs the raw stream for formidable/multipart
    app.use('/api', (req, res, next) => {
        if (req.path === '/upload' || req.path.startsWith('/admin/upload')) return next();
        express.json()(req, res, next);
    });
    app.use('/api', (req, res, next) => {
        if (req.path === '/upload' || req.path.startsWith('/admin/upload')) return next();
        express.urlencoded({ extended: true })(req, res, next);
    });

    // Serve static files from the public directory
    const publicPath = path.join(process.cwd(), 'public');
    app.use(express.static(publicPath));
    // Explicitly serve uploads folder just in case
    app.use('/uploads', express.static(path.join(publicPath, 'uploads')));

    // Security Headers
    app.use((req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        next();
    });

    // API Routes
    app.use('/api/auth', require('./router/auth-router'));
    app.use('/api/portfolio', require('./router/portfolio-router'));
    app.use('/api/categories', require('./router/category-router'));
    app.use('/api/settings', require('./router/settings-router').publicRouter);
    app.use('/api/admin', require('./router/admin-router'));
    app.use('/api/admin/settings', require('./router/settings-router').adminRouter);
    app.use('/api/admin/services', require('./router/service-router'));
    app.use('/api/admin/users', require('./router/user-router'));
    app.use('/api/analytics', require('./router/analytics-router'));
    app.use('/api/contact', require('./router/contact-router'));
    app.use('/api/db-init', require('./router/db-router'));

    // Next.js Request Handler (Catch-all)
    app.all('*', (req, res) => {
        return handle(req, res);
    });

    // Start Server
    const startServer = async () => {
        try {
            // Test DB Connection
            await query('SELECT 1');
            console.log('✅ MySQL connection established successfully.');

            app.listen(port, (err) => {
                if (err) throw err;
                console.log(`🚀 Unified Server running on http://${hostname}:${port}`);
                console.log(`   Mode: ${dev ? 'development' : 'production'}`);
            });
        } catch (error) {
            console.error('❌ Server startup failed:', error);
            process.exit(1);
        }
    };

    startServer();
});
