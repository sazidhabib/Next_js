const { query } = require('../config/database');

const getServices = async (req, res) => {
    try {
        const services = await query("SELECT * FROM services ORDER BY created_at DESC");
        return res.json({ success: true, data: services });
    } catch (error) {
        console.error("Fetch services error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const services = await query("SELECT * FROM services WHERE id = ?", [id]);
        
        if (services.length === 0) {
            return res.status(404).json({ success: false, error: "Service not found" });
        }

        return res.json({ success: true, data: services[0] });
    } catch (error) {
        console.error("Fetch service error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

const createService = async (req, res) => {
    try {
        const { 
            title, slug, tagline, hero_image, hero_icon, 
            about_title, about_description, about_image,
            features_title, features_items, 
            process_title, process_steps,
            related_services,
            meta_title, meta_description, is_active 
        } = req.body;

        const result = await query(
            `INSERT INTO services (
                title, slug, tagline, hero_image, hero_icon, 
                about_title, about_description, about_image,
                features_title, features_items, 
                process_title, process_steps,
                related_services,
                meta_title, meta_description, is_active
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title, slug, tagline, hero_image, hero_icon, 
                about_title, about_description, about_image,
                features_title, JSON.stringify(features_items || []), 
                process_title, JSON.stringify(process_steps || []),
                JSON.stringify(related_services || []),
                meta_title, meta_description, is_active ? 1 : 0
            ]
        );

        return res.status(201).json({ success: true, data: { id: result.insertId } });
    } catch (error) {
        console.error("Create service error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            title, slug, tagline, hero_image, hero_icon, 
            about_title, about_description, about_image,
            features_title, features_items, 
            process_title, process_steps,
            related_services,
            meta_title, meta_description, is_active 
        } = req.body;

        await query(
            `UPDATE services SET 
                title = ?, slug = ?, tagline = ?, hero_image = ?, hero_icon = ?, 
                about_title = ?, about_description = ?, about_image = ?,
                features_title = ?, features_items = ?, 
                process_title = ?, process_steps = ?,
                related_services = ?,
                meta_title = ?, meta_description = ?, is_active = ?
            WHERE id = ?`,
            [
                title, slug, tagline, hero_image, hero_icon, 
                about_title, about_description, about_image,
                features_title, JSON.stringify(features_items || []), 
                process_title, JSON.stringify(process_steps || []),
                JSON.stringify(related_services || []),
                meta_title, meta_description, is_active ? 1 : 0,
                id
            ]
        );

        return res.json({ success: true, message: "Service updated successfully" });
    } catch (error) {
        console.error("Update service error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        await query("DELETE FROM services WHERE id = ?", [id]);
        return res.json({ success: true, message: "Service deleted successfully" });
    } catch (error) {
        console.error("Delete service error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService
};
