-- Seed Data for Next Idea Solutions
-- Run this after init-db.sql to populate with initial data

USE nextidea;

-- Insert default admin user (password: Admin@12345 - change after first login)
-- Password hash generated with bcryptjs, 12 rounds
INSERT INTO users (username, email, password_hash, role, is_active) VALUES
('admin', 'admin@nextideasolution.com', '$2b$12$MA027GcExCkV4/vPNOHrXe4m7YvqZlPq.oKXjmBhcg3SuEd5O7Y.m', 'admin', TRUE),
('editor', 'editor@nextideasolution.com', '$2b$12$MA027GcExCkV4/vPNOHrXe4m7YvqZlPq.oKXjmBhcg3SuEd5O7Y.m', 'editor', TRUE)
ON DUPLICATE KEY UPDATE password_hash='$2b$12$MA027GcExCkV4/vPNOHrXe4m7YvqZlPq.oKXjmBhcg3SuEd5O7Y.m';

-- Insert default categories
INSERT INTO categories (title, slug, description, sort_order, is_active) VALUES
('Digital Media Buying', 'digital-media-buying', 'Strategic media planning and buying services', 1, TRUE),
('Social Media Marketing', 'social-media-marketing', 'Comprehensive social media management and marketing', 2, TRUE),
('Creative Concept & Execution', 'creative-concept-execution', 'Creative campaign development and execution', 3, TRUE),
('Web Design & Development', 'web-design-development', 'Custom website design and development', 4, TRUE),
('Brand Identity', 'brand-identity', 'Complete brand identity design and strategy', 5, TRUE),
('SEO', 'seo', 'Search engine optimization services', 6, TRUE),
('Video Production & Photography', 'video-production-photography', 'Professional video and photography services', 7, TRUE),
('Event and Activation', 'event-and-activation', 'Event planning and brand activation', 8, TRUE),
('Design & Printing', 'design-printing', 'Print design and production services', 9, TRUE),
('Digital PR', 'digital-pr', 'Digital public relations services', 10, TRUE)
ON DUPLICATE KEY UPDATE title=title;

-- Insert default site settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
('site_name', 'Next Idea Solutions', 'string', 'Website name'),
('site_description', 'Digital Advertising Agency in Bangladesh', 'string', 'Website description'),
('contact_email', 'support@nextideasolution.com', 'string', 'Contact email address'),
('contact_phone', '+8801714787250', 'string', 'Contact phone number'),
('address', 'House# 14 (2nd Floor), Road# 04, block# A, Section# 11, Mirpur, Dhaka, Bangladesh', 'string', 'Office address'),
('items_per_page', '10', 'number', 'Default items per page for pagination'),
('analytics_enabled', 'true', 'boolean', 'Enable analytics tracking')
ON DUPLICATE KEY UPDATE setting_key=setting_key;

-- Insert sample portfolio items
INSERT INTO portfolio_items (title, slug, description, category_id, client_name, client_website, featured, project_date) VALUES
('E-commerce Platform Redesign', 'ecommerce-redesign', 'A complete overhaul of a major fashion retailer''s online presence, focusing on user experience and conversion optimization.', 4, 'FashionHub', 'https://example.com', TRUE, '2023-10-15'),
('Social Media Campaign: Summer Fest', 'summer-fest-campaign', 'Comprehensive social media strategy and execution for a city-wide music festival, resulting in 200% engagement growth.', 2, 'City Events', '#', TRUE, '2023-06-20'),
('Brand Identity for Tech Startup', 'tech-brand-identity', 'Developing a modern, scalable brand identity for a disruptive AI startup, including logo, color palette, and brand guidelines.', 5, 'AI Pulse', 'https://aipulse.tech', FALSE, '2023-11-05'),
('Real Estate Digital Marketing', 'real-estate-marketing', 'Data-driven lead generation campaign for a luxury real estate development project, achieving 5x ROI.', 1, 'Elite Properties', '#', TRUE, '2024-01-12')
ON DUPLICATE KEY UPDATE title=title;

-- Insert portfolio images
INSERT INTO portfolio_images (portfolio_item_id, image_url, alt_text, sort_order, is_primary) VALUES
(1, 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80', 'E-commerce Redesign', 1, TRUE),
(2, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', 'Summer Fest Campaign', 1, TRUE),
(3, 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80', 'Tech Brand Identity', 1, TRUE),
(4, 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80', 'Real Estate Marketing', 1, TRUE)
ON DUPLICATE KEY UPDATE image_url=image_url;

-- Insert portfolio technologies
INSERT INTO portfolio_technologies (portfolio_item_id, technology) VALUES
(1, 'Next.js'), (1, 'Tailwind CSS'), (1, 'Node.js'),
(2, 'Facebook Ads'), (2, 'Instagram Marketing'),
(3, 'Adobe Illustrator'), (3, 'Figma'),
(4, 'Google Ads'), (4, 'Real Estate Funnels')
ON DUPLICATE KEY UPDATE technology=technology;

