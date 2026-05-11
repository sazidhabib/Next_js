const { query } = require('../config/database');

const ANALYTICS_ENABLED = process.env.ANALYTICS_ENABLED !== 'false';
const IP_ANONYMIZE = process.env.ANALYTICS_IP_ANONYMIZE === 'true';

function anonymizeIp(ip) {
  if (!IP_ANONYMIZE || !ip || ip === 'unknown') return ip;
  
  const parts = ip.split('.');
  if (parts.length === 4) {
    parts[3] = '0';
    return parts.join('.');
  }
  
  return ip;
}

async function getDashboardStats() {
  try {
    const totalPortfolioResult = await query(
      'SELECT COUNT(*) as total FROM portfolio_items WHERE is_active = TRUE'
    );
    
    const totalSubmissionsResult = await query(
      'SELECT COUNT(*) as total FROM contact_submissions WHERE status = "new"'
    );
    
    const recentSubmissions = await query(
      `SELECT id, name, email, service, created_at
       FROM contact_submissions
       ORDER BY created_at DESC
       LIMIT 5`
    );
    
    const pageViewsTodayResult = await query(
      'SELECT COUNT(*) as total FROM page_views WHERE DATE(viewed_at) = CURDATE()'
    );
    
    const topCategories = await query(
      `SELECT c.title, COUNT(pi.id) as count
       FROM categories c
       LEFT JOIN portfolio_items pi ON c.id = pi.category_id AND pi.is_active = TRUE
       GROUP BY c.id, c.title
       ORDER BY count DESC
       LIMIT 5`
    );
    
    return {
      success: true,
      data: {
        total_portfolio: Number(totalPortfolioResult[0].total),
        total_submissions: Number(totalSubmissionsResult[0].total),
        recent_submissions: recentSubmissions,
        page_views_today: Number(pageViewsTodayResult[0].total),
        top_categories: topCategories,
      },
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return { success: false, error: 'Failed to retrieve dashboard stats' };
  }
}

async function getAnalyticsStats(period = '7d', startDate = null, endDate = null) {
  try {
    let dateCondition = '';
    let params = [];
    
    if (startDate && endDate) {
      dateCondition = 'WHERE viewed_at BETWEEN ? AND ?';
      params = [startDate, endDate];
    } else {
      const days = parseInt(period.replace('d', ''), 10);
      dateCondition = 'WHERE viewed_at >= DATE_SUB(NOW(), INTERVAL ? DAY)';
      params = [days];
    }
    
    const pageViewsResult = await query(
      `SELECT COUNT(*) as total FROM page_views ${dateCondition}`,
      params
    );
    
    const uniqueVisitorsResult = await query(
      `SELECT COUNT(DISTINCT ip_address) as total FROM page_views ${dateCondition}`,
      params
    );
    
    const topPages = await query(
      `SELECT page_path, page_title, COUNT(*) as views
       FROM page_views
       ${dateCondition}
       GROUP BY page_path, page_title
       ORDER BY views DESC
       LIMIT 10`,
      params
    );
    
    const events = await query(
      `SELECT event_type, COUNT(*) as count
       FROM analytics_events
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY event_type
       ORDER BY count DESC`,
      [parseInt(period.replace('d', ''), 10)]
    );
    
    const pageViewsByDay = await query(
      `SELECT DATE(viewed_at) as date, COUNT(*) as views
       FROM page_views
       ${dateCondition}
       GROUP BY DATE(viewed_at)
       ORDER BY date ASC`,
      params
    );
    
    return {
      success: true,
      data: {
        page_views: Number(pageViewsResult[0].total),
        unique_visitors: Number(uniqueVisitorsResult[0].total),
        top_pages: topPages,
        events: events,
        page_views_by_day: pageViewsByDay,
      },
    };
  } catch (error) {
    console.error('Error getting analytics stats:', error);
    return { success: false, error: 'Failed to retrieve analytics' };
  }
}

module.exports = {
  getDashboardStats,
  getAnalyticsStats,
  anonymizeIp
};
