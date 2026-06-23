
const { Album } = require('../models/index');

exports.createAlbum = async (req, res, next) => {
    try {
        const { name } = req.body;

        // Check for duplicate
        const existing = await Album.findOne({ where: { name: name.trim() } });
        if (existing) {
            return res.status(409).json({ message: 'Album name already exists' });
        }

        const album = await Album.create({ name: name.trim() });
        res.status(201).json(album);
    } catch (error) {
        next(error);
    }
};

exports.getAllAlbums = async (req, res, next) => {
    try {
        const albums = await Album.findAll();
        res.status(200).json(albums);
    } catch (error) {
        next(error);
    }
};

exports.updateAlbum = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [updated] = await Album.update(req.body, {
            where: { id: id },
            individualHooks: true
        });

        if (updated === 0) {
            return res.status(404).json({ message: 'Album not found' });
        }

        const updatedAlbum = await Album.findByPk(id);
        res.status(200).json(updatedAlbum);
    } catch (error) {
        next(error);
    }
};

exports.deleteAlbum = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await Album.destroy({
            where: { id: id }
        });

        if (deleted === 0) {
            return res.status(404).json({ message: 'Album not found' });
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};