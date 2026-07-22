const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const roleController = require('../controllers/role-controller');

// All role routes require authentication
router.use(authMiddleware);

// Middleware to restrict access to superadmins only
const superadminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'superadmin') {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Only superadmins can manage roles." });
    }
};

router.use(superadminOnly);

// GET /api/roles — List all roles
router.get('/', roleController.getAllRoles);

// GET /api/roles/:id — Get a single role
router.get('/:id', roleController.getRoleById);

// POST /api/roles — Create new role
router.post('/', roleController.createRole);

// PUT /api/roles/:id — Update role
router.put('/:id', roleController.updateRole);

// DELETE /api/roles/:id — Delete role
router.delete('/:id', roleController.deleteRole);

module.exports = router;
