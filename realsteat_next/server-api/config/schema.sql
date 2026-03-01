CREATE TABLE IF NOT EXISTS re_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS re_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    parent_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES re_categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS re_projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url TEXT,
    images TEXT,
    video_url VARCHAR(500),
    category_id INT,
    category VARCHAR(255), 
    description TEXT,
    location VARCHAR(500),
    price VARCHAR(255),
    bedrooms INT,
    bathrooms INT,
    sqft INT,
    floors INT,
    amenities TEXT,
    is_popular BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES re_categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS re_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    site_name VARCHAR(255) DEFAULT 'PRESIDENT PROPERTIES',
    logo_url TEXT,
    favicon_url TEXT,
    support_email VARCHAR(255),
    helpline_number VARCHAR(50) DEFAULT '01880578893',
    footer_text VARCHAR(255) DEFAULT '© 2026 PRESIDENT PROPERTIES. All rights reserved.',
    site_description TEXT,
    facebook_url VARCHAR(255),
    youtube_url VARCHAR(255),
    website_url VARCHAR(255),
    address_text TEXT,
    hero_frame_id INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hero_frame_id) REFERENCES re_projects(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS re_menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category_id INT DEFAULT NULL,
    url VARCHAR(255) DEFAULT NULL,
    parent_id INT DEFAULT NULL,
    item_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES re_categories(id) ON DELETE SET NULL,
    FOREIGN KEY (parent_id) REFERENCES re_menu_items(id) ON DELETE SET NULL
);

-- Initial Settings
INSERT INTO re_settings (id, site_name) VALUES (1, 'PRESIDENT PROPERTIES') ON DUPLICATE KEY UPDATE site_name = site_name;
