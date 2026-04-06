// controllers/author-controller.js
const Author = require("../models/author-model");
const fs = require("fs");
const path = require("path");
const { Sequelize } = require('sequelize');
const { Op } = require("sequelize");

// ✅ Create Author
const createAuthor = async (req, res) => {
    try {
        console.log('=== CREATE AUTHOR CONTROLLER ===');
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        console.log('Request files:', req.files);

        const {
            name,
            description,
            websiteLink,
            isSpecialAuthor
        } = req.body;

        console.log('Parsed fields:', {
            name, description, websiteLink, isSpecialAuthor
        });

        const parsedIsSpecialAuthor = isSpecialAuthor === "true" || isSpecialAuthor === true;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        // Check if name already exists (case insensitive)
        const existingName = await Author.findOne({
            where: Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('name')),
                '=',
                name.toLowerCase()
            )
        });

        if (existingName) {
            return res.status(409).json({ message: "An author with this name already exists." });
        }

        const imagePath = req.file ? req.file.filename : null;

        console.log('Image path to save:', imagePath);

        const newAuthor = await Author.create({
            name,
            description,
            image: imagePath,
            websiteLink,
            isSpecialAuthor: parsedIsSpecialAuthor,
        });

        res.status(201).json({
            message: "Author Created Successfully",
            author: newAuthor
        });
    } catch (error) {
        console.error("Create Author Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ Get All Authors
const getAllAuthors = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', isSpecialAuthor } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = {};

        // Search functionality
        if (search) {
            whereClause = {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { description: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        // Filter by special author
        if (isSpecialAuthor !== undefined) {
            whereClause.isSpecialAuthor = isSpecialAuthor === 'true';
        }

        const { count, rows } = await Author.findAndCountAll({
            where: whereClause,
            order: [["createdAt", "DESC"]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            authors: rows,
            totalCount: count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            hasNext: page * limit < count,
            hasPrev: page > 1
        });
    } catch (error) {
        console.error("Get All Authors Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ Get Single Author
const getAuthor = async (req, res) => {
    try {
        const author = await Author.findByPk(req.params.id);

        if (!author) {
            return res.status(404).json({ message: "Author Not Found" });
        }

        res.status(200).json(author);
    } catch (error) {
        console.error("Get Author Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ Update Author
const updateAuthor = async (req, res) => {
    try {
        const {
            name,
            description,
            websiteLink,
            isSpecialAuthor
        } = req.body;

        const parsedIsSpecialAuthor = isSpecialAuthor === "true" || isSpecialAuthor === true;

        const existingAuthor = await Author.findByPk(req.params.id);
        if (!existingAuthor) {
            return res.status(404).json({ message: "Author Not Found" });
        }

        // Check if name already exists (excluding current author)
        if (name && name !== existingAuthor.name) {
            const duplicateName = await Author.findOne({
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
                return res.status(409).json({ message: "Another author with this name already exists." });
            }
        }

        // Delete old image if new one is uploaded
        if (req.file && existingAuthor.image) {
            const oldImagePath = path.join(__dirname, "..", "uploads", "authors", existingAuthor.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        const updateData = {
            name: name || existingAuthor.name,
            description: description !== undefined ? description : existingAuthor.description,
            websiteLink: websiteLink !== undefined ? websiteLink : existingAuthor.websiteLink,
            isSpecialAuthor: parsedIsSpecialAuthor,
        };

        // Only update image if a new one is uploaded
        if (req.file) {
            updateData.image = req.file.filename;
        }

        const updatedAuthor = await existingAuthor.update(updateData);

        res.status(200).json({
            message: "Author Updated Successfully",
            author: updatedAuthor
        });
    } catch (error) {
        console.error("Update Author Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ Delete Author
const deleteAuthor = async (req, res) => {
    try {
        const author = await Author.findByPk(req.params.id);
        if (!author) {
            return res.status(404).json({ message: "Author Not Found" });
        }

        // Delete associated image
        if (author.image) {
            const imagePath = path.join(__dirname, "..", "uploads", "authors", author.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await author.destroy();
        res.status(200).json({ message: "Author Deleted Successfully" });
    } catch (error) {
        console.error("Delete Author Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ Bulk Delete Authors
const bulkDeleteAuthors = async (req, res) => {
    try {
        const { authorIds } = req.body;

        if (!authorIds || !Array.isArray(authorIds) || authorIds.length === 0) {
            return res.status(400).json({ message: "Author IDs are required" });
        }

        const authors = await Author.findAll({
            where: { id: authorIds }
        });

        // Delete images for all authors
        for (const author of authors) {
            if (author.image) {
                const imagePath = path.join(__dirname, "..", "uploads", "authors", author.image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
        }

        await Author.destroy({
            where: { id: authorIds }
        });

        res.status(200).json({
            message: `${authorIds.length} author(s) deleted successfully`
        });
    } catch (error) {
        console.error("Bulk Delete Authors Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = {
    createAuthor,
    getAllAuthors,
    getAuthor,
    updateAuthor,
    deleteAuthor,
    bulkDeleteAuthors
};