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

