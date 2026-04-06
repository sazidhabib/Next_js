import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const sanitizeFilename = (filename) => {
    return filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
};

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
    limits: { fileSize: 2 * 1024 * 1024 },
});

const convertToWebp = (subdir = "") => async (req, res, next) => {
    try {
        const uploadDir = subdir ? path.join("public/uploads", subdir) : "public/uploads";

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        if (req.file) {
            const originalName = path.parse(req.file.originalname).name;
            const sanitizedOriginalName = sanitizeFilename(originalName);
            const filename = `${sanitizedOriginalName}-${Date.now()}.webp`;
            const outputPath = path.join(uploadDir, filename);

            await sharp(req.file.buffer)
                .webp({ quality: 80 })
                .toFile(outputPath);

            req.file.filename = filename;
            req.file.path = outputPath;
            req.file.originalname = filename;
        }

        else if (req.files) {
            const processedFiles = [];
            const filesToProcess = Array.isArray(req.files) ? req.files : 
                                 Object.values(req.files).flat();

            for (const file of filesToProcess) {
                const originalName = path.parse(file.originalname).name;
                const sanitizedOriginalName = sanitizeFilename(originalName);
                const filename = `${sanitizedOriginalName}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}.webp`;
                const outputPath = path.join(uploadDir, filename);

                await sharp(file.buffer)
                    .webp({ quality: 80 })
                    .toFile(outputPath);

                file.filename = filename;
                file.path = outputPath;
                file.originalname = filename;

                processedFiles.push(file);
            }

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

export { upload, convertToWebp };
