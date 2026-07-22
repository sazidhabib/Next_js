const checkPermission = (section, action) => {
    return (req, res, next) => {
        // If not authenticated, reject
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: No user session" });
        }

        // Superadmins can bypass all permission checks
        if (req.user.role === 'superadmin') {
            return next();
        }

        // Check if user has permission
        const permissions = req.user.permissions;
        if (permissions && permissions[section] && permissions[section][action]) {
            return next();
        }

        return res.status(403).json({ 
            message: `Access denied. You do not have permission to ${action} in ${section}.` 
        });
    };
};

module.exports = checkPermission;
