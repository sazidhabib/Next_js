const { getDashboardStats, getAnalyticsStats } = require('../utils/analytics-utils');

const getDashboard = async (req, res) => {
    try {
        const stats = await getDashboardStats();
        if (!stats.success) {
            return res.status(500).json(stats);
        }
        
        // Include user info in dashboard response as expected by frontend layout
        stats.data.user = {
            userId: req.user.userId,
            username: req.user.username,
            role: req.user.role
        };

        return res.json(stats);
    } catch (error) {
        console.error('Dashboard Controller Error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

const getAnalytics = async (req, res) => {
    try {
        const { period, startDate, endDate } = req.query;
        const stats = await getAnalyticsStats(period || '7d', startDate, endDate);
        
        if (!stats.success) {
            return res.status(500).json(stats);
        }
        
        return res.json(stats);
    } catch (error) {
        console.error('Analytics Controller Error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

module.exports = {
    getDashboard,
    getAnalytics
};
