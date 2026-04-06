// update-image-paths.js
const mongoose = require("mongoose");
const Article = require("./models/article-model");
const Blog = require("./models/blog-model");
const Photo = require("./models/photo");

const IMAGE_MODELS = [
    { model: Article, field: "image" },
    { model: Blog, field: "image" },
    { model: Photo, field: "imageUrl" },
];

const MONGODB_URI = "mongodb://kamrulh1_kamrulhasan:NfMXl$U3DH@127.0.0.1:27017/kamrulh1_kamruldb?authSource=admin"; // 🔁 Replace with your actual DB

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const updatePaths = async () => {
    try {
        for (const { model, field } of IMAGE_MODELS) {
            const docs = await model.find({});
            for (const doc of docs) {
                const imagePath = doc[field];
                if (imagePath && /\.(jpg|jpeg|png)$/i.test(imagePath)) {
                    const updatedImage = imagePath.replace(/\.(jpg|jpeg|png)$/i, ".webp");
                    doc[field] = updatedImage;
                    await doc.save();
                    console.log(`✅ Updated ${model.modelName} ${doc._id}: ${updatedImage}`);
                }
            }
        }

        console.log("🎉 All image paths updated to .webp");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error:", err);
        process.exit(1);
    }
};

updatePaths();
