// controllers/tag-controller.js
const Tag = require("../models/tag-model");
const fs = require("fs");
const path = require("path");
const { Sequelize } = require('sequelize');
const { Op } = require("sequelize");

// ✅ Create Tag
const createTag = async (req, res) => {
    try {

        console.log('=== CREATE TAG CONTROLLER ===');
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        console.log('Request files:', req.files);
        const {
            name,
            slug,
            tagTitle,
            tagDescription,
            metaTitle,
            metaDescription,
            metaKeywords,
            status
        } = req.body;

        console.log('Parsed fields:', {
            name, slug, tagTitle, tagDescription, metaTitle, metaDescription, metaKeywords, status
        });

        const parsedStatus = status === "true" || status === true;

        if (!name || !slug) {
            return res.status(400).json({ message: "Name and Slug are required" });
        }

        // Check if slug already exists
        const existingSlug = await Tag.findOne({
            where: { slug }
        });

        if (existingSlug) {
            return res.status(409).json({ message: "A tag with this slug already exists." });
        }

        // Check if name already exists (case insensitive)
        const existingName = await Tag.findOne({
            where: Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('name')),
                '=',
                name.toLowerCase()
            )
        });

        if (existingName) {
            return res.status(409).json({ message: "A tag with this name already exists." });
        }

        const imagePath = req.file ? req.file.filename : null;

        console.log('Image path to save:', imagePath);

        const newTag = await Tag.create({
            name,
            slug: slug.toLowerCase(),
            tagTitle,
            tagDescription,
            image: imagePath,
            metaTitle,
            metaDescription,
            metaKeywords,
            status: parsedStatus,
        });

        res.status(201).json({
            message: "Tag Created Successfully",
            tag: newTag
        });
    } catch (error) {
        console.error("Create Tag Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ Get All Tags
const getAllTags = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', status } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = {};

        // Search functionality
        if (search) {
            whereClause = {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { slug: { [Op.like]: `%${search}%` } },
                    { tagTitle: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        // Filter by status
        if (status !== undefined) {
            whereClause.status = status === 'true';
        }

        const { count, rows } = await Tag.findAndCountAll({
            where: whereClause,
            order: [["createdAt", "DESC"]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            tags: rows,
            totalCount: count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            hasNext: page * limit < count,
            hasPrev: page > 1
        });
    } catch (error) {
        console.error("Get All Tags Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ Get Single Tag
const getTag = async (req, res) => {
    try {
        const tag = await Tag.findByPk(req.params.id);

        if (!tag) {
            return res.status(404).json({ message: "Tag Not Found" });
        }

        res.status(200).json(tag);
    } catch (error) {
        console.error("Get Tag Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ Update Tag
const updateTag = async (req, res) => {
    try {
        const {
            name,
            slug,
            tagTitle,
            tagDescription,
            metaTitle,
            metaDescription,
            metaKeywords,
            status
        } = req.body;

        const parsedStatus = status === "true" || status === true;

        const existingTag = await Tag.findByPk(req.params.id);
        if (!existingTag) {
            return res.status(404).json({ message: "Tag Not Found" });
        }

        // Check if slug already exists (excluding current tag)
        if (slug && slug !== existingTag.slug) {
            const duplicateSlug = await Tag.findOne({
                where: {
                    slug: slug.toLowerCase(),
                    id: { [Op.ne]: req.params.id }
                }
            });

            if (duplicateSlug) {
                return res.status(409).json({ message: "Another tag with this slug already exists." });
            }
        }

        // Check if name already exists (excluding current tag)
        if (name && name !== existingTag.name) {
            const duplicateName = await Tag.findOne({
                where: {
                    [Op.and]: [
                        Sequelize.where(
                            Sequelize.fn('LOWER', Sequelize.col('name')),
                            '=',
                            name.toLowerCase()
                        ),
                        { id: { [Op.ne]: req.params.id } }
                    ]
                }
            });

            if (duplicateName) {
                return res.status(409).json({ message: "Another tag with this name already exists." });
            }
        }

        // Delete old image if new one is uploaded
        if (req.file && existingTag.image) {
            const oldImagePath = path.join(__dirname, "..", "uploads", "tags", existingTag.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        const updateData = {
            name: name || existingTag.name,
            slug: slug ? slug.toLowerCase() : existingTag.slug,
            tagTitle: tagTitle !== undefined ? tagTitle : existingTag.tagTitle,
            tagDescription: tagDescription !== undefined ? tagDescription : existingTag.tagDescription,
            metaTitle: metaTitle !== undefined ? metaTitle : existingTag.metaTitle,
            metaDescription: metaDescription !== undefined ? metaDescription : existingTag.metaDescription,
            metaKeywords: metaKeywords !== undefined ? metaKeywords : existingTag.metaKeywords,
            status: parsedStatus,
        };

        // Only update image if a new one is uploaded
        if (req.file) {
            updateData.image = req.file.filename;
        }

        const updatedTag = await existingTag.update(updateData);

        res.status(200).json({
            message: "Tag Updated Successfully",
            tag: updatedTag
        });
    } catch (error) {
        console.error("Update Tag Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ Delete Tag
const deleteTag = async (req, res) => {
    try {
        const tag = await Tag.findByPk(req.params.id);
        if (!tag) {
            return res.status(404).json({ message: "Tag Not Found" });
        }

        // Delete associated image
        if (tag.image) {
            const imagePath = path.join(__dirname, "..", "uploads", "tags", tag.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await tag.destroy();
        res.status(200).json({ message: "Tag Deleted Successfully" });
    } catch (error) {
        console.error("Delete Tag Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ Bulk Delete Tags
const bulkDeleteTags = async (req, res) => {
    try {
        const { tagIds } = req.body;

        if (!tagIds || !Array.isArray(tagIds) || tagIds.length === 0) {
            return res.status(400).json({ message: "Tag IDs are required" });
        }

        const tags = await Tag.findAll({
            where: { id: tagIds }
        });

        // Delete images for all tags
        for (const tag of tags) {
            if (tag.image) {
                const imagePath = path.join(__dirname, "..", "uploads", "tags", tag.image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
        }

        await Tag.destroy({
            where: { id: tagIds }
        });

        res.status(200).json({
            message: `${tagIds.length} tag(s) deleted successfully`
        });
    } catch (error) {
        console.error("Bulk Delete Tags Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = {
    createTag,
    getAllTags,
    getTag,
    updateTag,
    deleteTag,
    bulkDeleteTags
};