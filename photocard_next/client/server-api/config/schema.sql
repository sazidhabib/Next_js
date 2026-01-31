CREATE TABLE IF NOT EXISTS ph_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ph_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ph_frames (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url TEXT,
    category_id INT,
    category VARCHAR(255), 
    description TEXT,
    is_popular BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES ph_categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS ph_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    site_name VARCHAR(255) DEFAULT 'Photo Card BD',
    logo_url TEXT,
    favicon_url TEXT,
    contact_email VARCHAR(255),
    helpline_number VARCHAR(50) DEFAULT '01880578893',
    footer_text VARCHAR(255) DEFAULT '© 2026 Photo Card BD. All rights reserved.',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Initial Settings
INSERT INTO ph_settings (id, site_name) VALUES (1, 'Photo Card BD') ON DUPLICATE KEY UPDATE site_name = site_name;
