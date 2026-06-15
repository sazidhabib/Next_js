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

let sequelize;
let models;

try {
  sequelize = require("./db/database");
  models = require("./models"); // Import models so they are registered before sync
} catch (error) {
  console.error("❌ Failed to load database/models:", error.message);
}

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

  // Serve public folder (for favicon, images, etc.)
  app.use(express.static(path.join(__dirname, "public")));

  // CORS Configuration
  const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:5000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
    credentials: true,
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
  app.use(express.json());

  // Security Headers (CSP)
  app.use((req, res, next) => {
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https: http://localhost:5000 http://127.0.0.1:5000; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' http://localhost:5000 http://127.0.0.1:5000 http://localhost:3000 http://127.0.0.1:3000;",
    );
    next();
  });

  // API Routes
  const apiRouter = require("./router");
  app.use("/api", apiRouter);

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
    let dbConnected = false;
    try {
      if (sequelize) {
        // Ensure the database exists before connecting
        try {
          const mysql2 = require("mysql2/promise");
          const connection = await mysql2.createConnection({
            host: process.env.DB_HOST || "localhost",
            port: process.env.Db_port || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD || "",
          });
          await connection.query(
            `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || "hullotech"}\`;`,
          );
          await connection.end();
          console.log(
            `✅ Database "${process.env.DB_NAME || "hullotech"}" ensured.`,
          );
        } catch (dbCreateError) {
          console.warn(
            "⚠️  Could not auto-create database:",
            dbCreateError.message,
          );
        }

        await sequelize.authenticate();
        console.log("✅ MySQL connection established successfully.");
        dbConnected = true;

        // Sync database to create tables if they don't exist and update existing tables
        await sequelize.sync({ alter: true });
        console.log(
          "✅ Database synchronized (tables created/updated to match model).",
        );

        // Create default admin user if not exists
        const { User, Category, Product } = require("./models");
        const adminExists = await User.findOne({
          where: { email: "admin@hullotech.com" },
        });
        if (!adminExists) {
          await User.create({
            email: "admin@hullotech.com",
            password: "admin123",
            role: "admin",
          });
          console.log(
            "✅ Default admin user created (admin@hullotech.com / admin123)",
          );
        }

        // Seed default categories
        const categoryCount = await Category.count();
        if (categoryCount === 0) {
          const { categories: seedCategories } = require("./db/seedData");
          await Category.bulkCreate(seedCategories);
          console.log("✅ Database seeded with default categories.");
        }

        // Seed default products
        const productCount = await Product.count();
        if (productCount === 0) {
          const { products: seedProducts } = require("./db/seedData");
          await Product.bulkCreate(seedProducts);
          console.log("✅ Database seeded with default products.");
        }
      } else {
        console.warn(
          "⚠️  Sequelize not initialized - running in fallback mock mode.",
        );
      }
    } catch (error) {
      console.error(
        "❌ Database connection failed. Running in fallback mock mode. Error:",
        error.message,
      );
      // Do NOT call process.exit(1) so the server can run with mock fallback data.
    }

    // Use port 5000 if running in standalone (DISABLE_NEXT=true) to avoid conflict with Next.js on port 3000
    const PORT =
      process.env.DISABLE_NEXT === "true" ? 5000 : process.env.PORT || 3000;

    try {
      app.listen(PORT, () =>
        console.log(
          `🚀 ${useNext ? "Unified" : "API"} Server running on port ${PORT}`,
        ),
      );
    } catch (serverError) {
      console.error("❌ Express server failed to start:", serverError.message);
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
