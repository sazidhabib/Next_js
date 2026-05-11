const express = require('express');
const router = express.Router();
const { trackPageView, trackEvent } = require('../utils/analytics-utils');

router.post('/page-views', async (req, res) => {
    try {
        const { pagePath, pageTitle, referrer } = req.body;
        if (!pagePath) {
            return res.status(400).json({ success: false, error: 'pagePath is required' });
        }
        await trackPageView({ pagePath, pageTitle, referrer, req });
        return res.json({ success: true });
    } catch (error) {
        console.error('Page view tracking error:', error);
        return res.json({ success: true }); // Always return success for tracking
    }
});

router.post('/events', async (req, res) => {
    try {
        const { eventType, eventData, pagePath } = req.body;
        if (!eventType) {
            return res.status(400).json({ success: false, error: 'eventType is required' });
        }
        await trackEvent({ eventType, eventData, pagePath, req });
        return res.json({ success: true });
    } catch (error) {
        console.error('Event tracking error:', error);
        return res.json({ success: true });
    }
});

module.exports = router;
