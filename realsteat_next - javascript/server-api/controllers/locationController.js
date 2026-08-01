const pool = require('../config/db');
const path = require('path');
const fs = require('fs');

exports.getAllLocations = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM re_locations ORDER BY name ASC');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getLocationById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM re_locations WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Location not found' });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createLocation = async (req, res) => {
    const { name } = req.body;
    try {
        let image_url = null;
        if (req.file) {
            const serverUrl = process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`;
            image_url = `${serverUrl}/uploads/locations/${req.file.filename}`;
        }
        const [result] = await pool.query(
            'INSERT INTO re_locations (name, image_url) VALUES (?, ?)',
            [name, image_url]
        );
        res.status(201).json({ id: result.insertId, name, image_url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateLocation = async (req, res) => {
    const { name } = req.body;
    try {
        const [existing] = await pool.query('SELECT * FROM re_locations WHERE id = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ message: 'Location not found' });

        let image_url = req.body.image_url || existing[0].image_url;
        if (req.file) {
            const serverUrl = process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`;
            image_url = `${serverUrl}/uploads/locations/${req.file.filename}`;
        }

        await pool.query(
            'UPDATE re_locations SET name = ?, image_url = ? WHERE id = ?',
            [name || existing[0].name, image_url, req.params.id]
        );
        res.status(200).json({ id: req.params.id, name: name || existing[0].name, image_url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteLocation = async (req, res) => {
    try {
        const [existing] = await pool.query('SELECT * FROM re_locations WHERE id = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ message: 'Location not found' });

        await pool.query('DELETE FROM re_locations WHERE id = ?', [req.params.id]);
        res.status(200).json({ message: 'Location deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
