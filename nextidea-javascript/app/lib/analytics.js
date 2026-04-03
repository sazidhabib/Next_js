import { query } from './db';
import { getClientIp } from './middleware';

const ANALYTICS_ENABLED = process.env.ANALYTICS_ENABLED !== 'false';
const IP_ANONYMIZE = process.env.ANALYTICS_IP_ANONYMIZE === 'true';

function anonymizeIp(ip) {
  if (!IP_ANONYMIZE || ip === 'unknown') return ip;
  
  const parts = ip.split('.');
  if (parts.length === 4) {
    parts[3] = '0';
    return parts.join('.');
  }
  
  return ip;
}

export async function trackPageView({ pagePath, pageTitle, referrer, request }) {
  if (!ANALYTICS_ENABLED) return;
  
  try {
    const ip = anonymizeIp(getClientIp(request));
    const userAgent = request.headers.get('user-agent') || '';
    const sessionId = request.cookies.get('session_id')?.value || null;
    
    await query(
      `INSERT INTO page_views (page_path, page_title, referrer, user_agent, ip_address, session_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [pagePath, pageTitle, referrer, userAgent, ip, sessionId]
    );
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}

export async function trackEvent({ eventType, eventData, pagePath, request }) {
  if (!ANALYTICS_ENABLED) return;
  
  try {
    const ip = anonymizeIp(getClientIp(request));
    const sessionId = request.cookies.get('session_id')?.value || null;
    
    await query(
      `INSERT INTO analytics_events (event_type, event_data, page_path, ip_address, session_id)
       VALUES (?, ?, ?, ?, ?)`,
      [eventType, JSON.stringify(eventData || {}), pagePath, ip, sessionId]
    );
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}

export async function getAnalyticsStats(period = '7d', startDate = null, endDate = null) {
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
    
    const pageViews = await query(
      `SELECT COUNT(*) as total FROM page_views ${dateCondition}`,
      params
    );
    
    const uniqueVisitors = await query(
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
        page_views: pageViews[0].total,
        unique_visitors: uniqueVisitors[0].total,
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

export async function getDashboardStats() {
  try {
    const totalPortfolio = await query(
      'SELECT COUNT(*) as total FROM portfolio_items WHERE is_active = TRUE'
    );
    
    const totalSubmissions = await query(
      'SELECT COUNT(*) as total FROM contact_submissions WHERE status = "new"'
    );
    
    const recentSubmissions = await query(
      `SELECT id, name, email, service, created_at
       FROM contact_submissions
       ORDER BY created_at DESC
       LIMIT 5`
    );
    
    const pageViewsToday = await query(
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
        total_portfolio: totalPortfolio[0].total,
        total_submissions: totalSubmissions[0].total,
        recent_submissions: recentSubmissions,
        page_views_today: pageViewsToday[0].total,
        top_categories: topCategories,
      },
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return { success: false, error: 'Failed to retrieve dashboard stats' };
  }
}
