const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const initDb = require("./config/initDb");

// Initialize Database
initDb();

// CORS Configuration - MUST BE AT THE TOP
const corsOptions = {
  origin: [
    "https://photocard.nextideasolution.com",
    "http://localhost:5173", // for local development
  ],
  credentials: true, // important for cookies/sessions
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// CORS Middleware - MUST BE BEFORE ANY OTHER MIDDLEWARE
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options("*", cors(corsOptions)); // This handles all OPTIONS requests

// Other Middleware
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.get("/uploads", express.static("uploads"));
app.use("/uploads", express.static(require("path").join(__dirname, "uploads")));

// Test Route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Import Routes
const frameRoutes = require("./routes/frameRoutes");
const userRoutes = require("./routes/userRoutes");
const settingRoutes = require("./routes/settingRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

// Use Routes
app.use("/api/frames", frameRoutes);
app.use("/api/users", userRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/categories", categoryRoutes);

// ✅ CRITICAL: Catch-all route for React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
