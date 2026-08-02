const pool = require('../config/db');
const path = require('path');
const fs = require('fs');

exports.getAllAmenities = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM re_amenities ORDER BY name ASC');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAmenityById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM re_amenities WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Amenity not found' });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createAmenity = async (req, res) => {
    const { name } = req.body;
    try {
        let icon_url = null;
        if (req.file) {
            const serverUrl = process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`;
            icon_url = `${serverUrl}/uploads/amenities/${req.file.filename}`;
        }
        const [result] = await pool.query(
            'INSERT INTO re_amenities (name, icon_url) VALUES (?, ?)',
            [name, icon_url]
        );
        res.status(201).json({ id: result.insertId, name, icon_url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateAmenity = async (req, res) => {
    const { name } = req.body;
    try {
        const [existing] = await pool.query('SELECT * FROM re_amenities WHERE id = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ message: 'Amenity not found' });

        let icon_url = req.body.icon_url || existing[0].icon_url;
        if (req.file) {
            const serverUrl = process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`;
            icon_url = `${serverUrl}/uploads/amenities/${req.file.filename}`;
        }

        await pool.query(
            'UPDATE re_amenities SET name = ?, icon_url = ? WHERE id = ?',
            [name || existing[0].name, icon_url, req.params.id]
        );
        res.status(200).json({ id: req.params.id, name: name || existing[0].name, icon_url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteAmenity = async (req, res) => {
    try {
        const [existing] = await pool.query('SELECT * FROM re_amenities WHERE id = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ message: 'Amenity not found' });

        await pool.query('DELETE FROM re_amenities WHERE id = ?', [req.params.id]);
        res.status(200).json({ message: 'Amenity deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
