const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");


// Helper function to sanitize filenames
const sanitizeFilename = (filename) => {
    return filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
};

// Use memory storage for in-memory file processing
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only .jpg, .jpeg, and .png formats allowed!"), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, //2MB limit
});


// Middleware to convert uploaded image to WebP - WITH SUBDIRECTORY SUPPORT
const convertToWebp = (subdir = "") => async (req, res, next) => {
    try {
        const uploadDir = subdir ? path.join("uploads", subdir) : "uploads";

        // Ensure target directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Handle single file uploads
        if (req.file) {
            const originalName = path.parse(req.file.originalname).name;
            const sanitizedOriginalName = sanitizeFilename(originalName);
            const filename = `${sanitizedOriginalName}-${Date.now()}.webp`;
            const outputPath = path.join(uploadDir, filename);

            // Convert buffer to webp using sharp
            await sharp(req.file.buffer)
                .webp({ quality: 80 })
                .toFile(outputPath);

            // Attach file info for controller use
            req.file.filename = filename;
            req.file.path = outputPath;
            req.file.originalname = filename;
        }

        // Handle multiple file uploads
        else if (req.files) {
            const processedFiles = [];
            const filesToProcess = Array.isArray(req.files) ? req.files : 
                                 Object.values(req.files).flat();

            for (const file of filesToProcess) {
                const originalName = path.parse(file.originalname).name;
                const sanitizedOriginalName = sanitizeFilename(originalName);
                const filename = `${sanitizedOriginalName}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}.webp`;
                const outputPath = path.join(uploadDir, filename);

                // Convert buffer to webp using sharp
                await sharp(file.buffer)
                    .webp({ quality: 80 })
                    .toFile(outputPath);

                // Attach file info for controller use
                file.filename = filename;
                file.path = outputPath;
                file.originalname = filename;

                processedFiles.push(file);
            }

            // Restore structure for upload.fields() if applicable
            if (!Array.isArray(req.files)) {
                const groupedFiles = {};
                processedFiles.forEach(file => {
                    const fieldName = file.fieldname;
                    if (!groupedFiles[fieldName]) groupedFiles[fieldName] = [];
                    groupedFiles[fieldName].push(file);
                });
                req.files = groupedFiles;
            } else {
                req.files = processedFiles;
            }
        }

        next();
    } catch (err) {
        console.error("Image conversion failed:", err);
        next(err);
    }
};

module.exports = { upload, convertToWebp };