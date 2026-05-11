const { query, getConnection } = require('../config/database');
const { validateInput, portfolioSchema, generateSlug, paginate } = require('../utils/validation-utils');

const getPortfolioItems = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const categoryId = req.query.category_id;
        const search = req.query.search;
        const featured = req.query.featured;

        const offset = (page - 1) * limit;

        let whereConditions = ['pi.is_active = TRUE'];
        let params = [];

        if (categoryId) {
            whereConditions.push('pi.category_id = ?');
            params.push(categoryId);
        }

        if (search) {
            whereConditions.push('(pi.title LIKE ? OR pi.description LIKE ? OR pi.client_name LIKE ?)');
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        if (featured !== undefined && featured !== null) {
            whereConditions.push('pi.featured = ?');
            params.push(featured === 'true' ? 1 : 0);
        }

        const whereClause = whereConditions.join(' AND ');

        const countResult = await query(
            `SELECT COUNT(*) as total FROM portfolio_items pi WHERE ${whereClause}`,
            params
        );
        const total = Number(countResult[0].total);

        const items = await query(
            `SELECT pi.id, pi.title, pi.slug, pi.description, pi.client_name, pi.client_website as demo_link,
              pi.project_date, pi.featured, pi.meta_title,
              c.title as category_name, c.slug as category_slug,
              (SELECT image_url FROM portfolio_images WHERE portfolio_item_id = pi.id ORDER BY is_primary DESC, sort_order ASC LIMIT 1) as image
       FROM portfolio_items pi
       LEFT JOIN categories c ON pi.category_id = c.id
       WHERE ${whereClause}
       ORDER BY pi.featured DESC, pi.created_at DESC
       LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );

        const itemsWithDetails = await Promise.all(
            items.map(async (item) => {
                const images = await query(
                    'SELECT id, image_url, alt_text, sort_order, is_primary FROM portfolio_images WHERE portfolio_item_id = ? ORDER BY sort_order ASC',
                    [item.id]
                );

                const technologies = await query(
                    'SELECT technology FROM portfolio_technologies WHERE portfolio_item_id = ?',
                    [item.id]
                );

                return {
                    ...item,
                    images,
                    tools: technologies.map((t) => t.technology).join(', '),
                    technologies: technologies.map((t) => t.technology),
                };
            })
        );

        const paginated = paginate(itemsWithDetails, page, limit, total);

        return res.json({
            success: true,
            data: {
                demos: paginated.items,
                pagination: paginated.pagination,
            },
        });
    } catch (error) {
        console.error('Portfolio GET Error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

const createPortfolioItem = async (req, res) => {
    let connection;
    try {
        const validation = validateInput(req.body, portfolioSchema);

        if (!validation.valid) {
            return res.status(400).json({ success: false, error: 'Validation failed', details: validation.errors });
        }

        const data = validation.value;
        const slug = generateSlug(data.title);

        connection = await getConnection();
        await connection.beginTransaction();

        const [result] = await connection.execute(
            'INSERT INTO portfolio_items (title, slug, description, category_id, client_name, client_website, project_date, completion_date, featured, is_active, meta_title, meta_description, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                data.title,
                slug,
                data.description || null,
                data.category_id || null,
                data.client_name || null,
                data.client_website || null,
                data.project_date || null,
                data.completion_date || null,
                data.featured ? 1 : 0,
                data.is_active ? 1 : 0,
                data.meta_title || null,
                data.meta_description || null,
                req.user.userId,
            ]
        );

        const portfolioId = result.insertId;

        if (data.images && data.images.length > 0) {
            for (let i = 0; i < data.images.length; i++) {
                const img = data.images[i];
                await connection.execute(
                    'INSERT INTO portfolio_images (portfolio_item_id, image_url, alt_text, sort_order, is_primary) VALUES (?, ?, ?, ?, ?)',
                    [portfolioId, img.url, img.alt_text || null, img.sort_order || i, img.is_primary ? 1 : 0]
                );
            }
        }

        if (data.technologies && data.technologies.length > 0) {
            for (const tech of data.technologies) {
                await connection.execute(
                    'INSERT INTO portfolio_technologies (portfolio_item_id, technology) VALUES (?, ?)',
                    [portfolioId, tech]
                );
            }
        }

        await connection.commit();

        const [newItem] = await connection.execute(
            'SELECT * FROM portfolio_items WHERE id = ?',
            [portfolioId]
        );

        return res.status(201).json({ success: true, data: { portfolio_item: newItem[0] } });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Portfolio POST Error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    getPortfolioItems,
    createPortfolioItem
};
