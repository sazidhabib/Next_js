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
    location_details VARCHAR(500) DEFAULT NULL,
    price VARCHAR(255),
    bedrooms INT,
    bathrooms INT,
    sqft INT,
    floors VARCHAR(255) DEFAULT NULL,
    amenities TEXT,
    latitude DECIMAL(10, 8) DEFAULT NULL,
    longitude DECIMAL(11, 8) DEFAULT NULL,
    land_area VARCHAR(255) DEFAULT NULL,
    land_orientation VARCHAR(255) DEFAULT NULL,
    front_road VARCHAR(255) DEFAULT NULL,
    num_units VARCHAR(255) DEFAULT NULL,
    unit_size VARCHAR(255) DEFAULT NULL,
    num_basements VARCHAR(255) DEFAULT NULL,
    car_parking VARCHAR(255) DEFAULT NULL,
    is_popular BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES re_categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS re_properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url TEXT,
    images TEXT,
    video_url VARCHAR(500),
    category_id INT,
    category VARCHAR(255), 
    description TEXT,
    location VARCHAR(500),
    location_details VARCHAR(500) DEFAULT NULL,
    price VARCHAR(255),
    bedrooms INT,
    bathrooms INT,
    sqft INT,
    floors VARCHAR(255) DEFAULT NULL,
    amenities TEXT,
    latitude DECIMAL(10, 8) DEFAULT NULL,
    longitude DECIMAL(11, 8) DEFAULT NULL,
    land_area VARCHAR(255) DEFAULT NULL,
    land_orientation VARCHAR(255) DEFAULT NULL,
    front_road VARCHAR(255) DEFAULT NULL,
    num_units VARCHAR(255) DEFAULT NULL,
    unit_size VARCHAR(255) DEFAULT NULL,
    num_basements VARCHAR(255) DEFAULT NULL,
    car_parking VARCHAR(255) DEFAULT NULL,
    is_popular BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'pending', 'inactive', 'rejected', 'trash') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT DEFAULT NULL,
    view_count INT DEFAULT 0,
    use_count INT DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES re_categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS re_locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image_url TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS re_amenities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon_url TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS re_settings;
SET FOREIGN_KEY_CHECKS=1;

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
    hero_title TEXT,
    hero_description TEXT,
    hero_images LONGTEXT,
    instagram_url VARCHAR(255),
    x_url VARCHAR(255),
    hotline_number VARCHAR(255),
    secondary_email VARCHAR(255),
    business_hours TEXT,
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

CREATE TABLE IF NOT EXISTS re_pages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_key VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500),
    subtitle TEXT,
    content TEXT,
    image_url VARCHAR(500),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS re_testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    review TEXT NOT NULL,
    rating INT DEFAULT 5,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Settings
INSERT INTO re_settings (id, site_name) VALUES (1, 'PRESIDENT PROPERTIES') ON DUPLICATE KEY UPDATE site_name = site_name;
