// controllers/design-controller.js
const Design = require("../models/design-model");
const { Sequelize } = require('sequelize');
const { Op } = require("sequelize");

// ✅ Create Design
const createDesign = async (req, res) => {
    try {
        console.log('=== CREATE DESIGN CONTROLLER ===');
        console.log('Request body:', req.body);

        const {
            design_name,
            design_status,
            design_data,
            description,
            slug
        } = req.body;

        console.log('Parsed fields:', {
            design_name, design_status, design_data, description, slug
        });

        const parsedStatus = design_status === "true" || design_status === true;

        if (!design_name || !slug) {
            return res.status(400).json({ message: "Design name and Slug are required" });
        }

        // Check if slug already exists
        const existingSlug = await Design.findOne({
            where: { slug }
        });

        if (existingSlug) {
            return res.status(409).json({ message: "A design with this slug already exists." });
        }

        // Check if design_name already exists (case insensitive)
        const existingName = await Design.findOne({
            where: Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('design_name')),
                '=',
                design_name.toLowerCase()
            )
        });

        if (existingName) {
            return res.status(409).json({ message: "A design with this name already exists." });
        }

        // Parse design_data if it's a string
        let parsedDesignData = design_data;
        if (typeof design_data === 'string') {
            try {
                parsedDesignData = JSON.parse(design_data);
            } catch (error) {
                console.log('Design data is not valid JSON, storing as string');
            }
        }

        const newDesign = await Design.create({
            design_name,
            slug: slug.toLowerCase(),
            design_status: parsedStatus,
            design_data: parsedDesignData,
            description
        });

        res.status(201).json({
            message: "Design Created Successfully",
            design: newDesign
        });
    } catch (error) {
        console.error("Create Design Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ Get All Designs
const getAllDesigns = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', design_status } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = {};

        // Search functionality
        if (search) {
            whereClause = {
                [Op.or]: [
                    { design_name: { [Op.like]: `%${search}%` } },
                    { slug: { [Op.like]: `%${search}%` } },
                    { description: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        // Filter by design_status - FIXED: Handle boolean conversion properly
        if (design_status !== undefined && design_status !== '') {
            whereClause.design_status = design_status === 'true' || design_status === true || design_status === 1;
        }

        console.log('🔍 Backend Query - whereClause:', JSON.stringify(whereClause, null, 2));


        const { count, rows } = await Design.findAndCountAll({
            where: whereClause,
            order: [["createdAt", "DESC"]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            designs: rows,
            totalCount: count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            hasNext: page * limit < count,
            hasPrev: page > 1
        });
    } catch (error) {
        console.error("Get All Designs Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ Get Single Design
const getDesign = async (req, res) => {
    try {
        const design = await Design.findByPk(req.params.id);

        if (!design) {
            return res.status(404).json({ message: "Design Not Found" });
        }

        res.status(200).json(design);
    } catch (error) {
        console.error("Get Design Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ Get Design by Slug
const getDesignBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const design = await Design.findOne({
            where: { slug: slug.toLowerCase(), design_status: true }
        });

        if (!design) {
            return res.status(404).json({ message: "Design Not Found" });
        }

        res.status(200).json(design);
    } catch (error) {
        console.error("Get Design By Slug Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ Update Design
const updateDesign = async (req, res) => {
    try {
        const {
            design_name,
            design_status,
            design_data,
            description,
            slug
        } = req.body;

        const parsedStatus = design_status === "true" || design_status === true;

        const existingDesign = await Design.findByPk(req.params.id);
        if (!existingDesign) {
            return res.status(404).json({ message: "Design Not Found" });
        }

        // Check if slug already exists (excluding current design)
        if (slug && slug !== existingDesign.slug) {
            const duplicateSlug = await Design.findOne({
                where: {
                    slug: slug.toLowerCase(),
                    id: { [Op.ne]: req.params.id }
                }
            });

            if (duplicateSlug) {
                return res.status(409).json({ message: "Another design with this slug already exists." });
            }
        }

        // Check if design_name already exists (excluding current design)
        if (design_name && design_name !== existingDesign.design_name) {
            const duplicateName = await Design.findOne({
                where: {
                    [Op.and]: [
                        Sequelize.where(
                            Sequelize.fn('LOWER', Sequelize.col('design_name')),
                            '=',
                            design_name.toLowerCase()
                        ),
                        { id: { [Op.ne]: req.params.id } }
                    ]
                }
            });

            if (duplicateName) {
                return res.status(409).json({ message: "Another design with this name already exists." });
            }
        }

        // Parse design_data if it's a string
        let parsedDesignData = design_data;
        if (typeof design_data === 'string') {
            try {
                parsedDesignData = JSON.parse(design_data);
            } catch (error) {
                console.log('Design data is not valid JSON, storing as string');
            }
        }

        const updateData = {
            design_name: design_name || existingDesign.design_name,
            slug: slug ? slug.toLowerCase() : existingDesign.slug,
            design_status: parsedStatus,
            description: description !== undefined ? description : existingDesign.description,
        };

        // Only update design_data if provided
        if (design_data !== undefined) {
            updateData.design_data = parsedDesignData;
        }

        const updatedDesign = await existingDesign.update(updateData);

        res.status(200).json({
            message: "Design Updated Successfully",
            design: updatedDesign
        });
    } catch (error) {
        console.error("Update Design Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// Add this to your design-controller.js - Temporary debug endpoint
const debugDesigns = async (req, res) => {
    try {
        console.log('=== DEBUG DESIGNS ===');

        // Direct database query to see all designs
        const allDesigns = await Design.findAll({
            raw: true // Get plain objects
        });

        console.log('All designs from database:', allDesigns);
        console.log('Total designs:', allDesigns.length);

        // Check the query that's being used in getAllDesigns
        const { page = 1, limit = 10, search = '', design_status } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = {};

        if (search) {
            whereClause = {
                [Op.or]: [
                    { design_name: { [Op.like]: `%${search}%` } },
                    { slug: { [Op.like]: `%${search}%` } },
                    { description: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        if (design_status !== undefined) {
            whereClause.design_status = design_status === 'true';
        }

        console.log('Query parameters:', { page, limit, search, design_status, offset });
        console.log('Where clause:', whereClause);

        const { count, rows } = await Design.findAndCountAll({
            where: whereClause,
            order: [["createdAt", "DESC"]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        console.log('Query result - count:', count, 'rows:', rows.length);
        console.log('=== END DEBUG ===');

        res.status(200).json({
            designs: rows,
            totalCount: count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            hasNext: page * limit < count,
            hasPrev: page > 1,
            debug: {
                allDesignsCount: allDesigns.length,
                queryUsed: whereClause
            }
        });
    } catch (error) {
        console.error("Debug Designs Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ Delete Design
const deleteDesign = async (req, res) => {
    try {
        const design = await Design.findByPk(req.params.id);
        if (!design) {
            return res.status(404).json({ message: "Design Not Found" });
        }

        await design.destroy();
        res.status(200).json({ message: "Design Deleted Successfully" });
    } catch (error) {
        console.error("Delete Design Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ Bulk Delete Designs
const bulkDeleteDesigns = async (req, res) => {
    try {
        const { designIds } = req.body;

        if (!designIds || !Array.isArray(designIds) || designIds.length === 0) {
            return res.status(400).json({ message: "Design IDs are required" });
        }

        await Design.destroy({
            where: { id: designIds }
        });

        res.status(200).json({
            message: `${designIds.length} design(s) deleted successfully`
        });
    } catch (error) {
        console.error("Bulk Delete Designs Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = {
    createDesign,
    getAllDesigns,
    getDesign,
    getDesignBySlug,
    updateDesign,
    deleteDesign,
    bulkDeleteDesigns,
    debugDesigns
};