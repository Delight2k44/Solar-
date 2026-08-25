-- =========================================================================
-- KINETIX ENERGY TECHNOLOGIES — RELATIONAL SQL DATABASE SCHEMA
-- Compatible with PostgreSQL, SQLite, and MySQL (WordPress/WooCommerce)
-- =========================================================================

-- 1. USERS & AUTHENTICATION TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'customer', -- 'customer', 'admin', 'technician'
    phone VARCHAR(64),
    company VARCHAR(255),
    address VARCHAR(255),
    city VARCHAR(128) DEFAULT 'Johannesburg',
    province VARCHAR(64) DEFAULT 'Gauteng',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- 2. PRODUCTS & HARDWARE CATALOG (ATUM / WooCommerce Schema)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(128) NOT NULL,
    category VARCHAR(64) NOT NULL, -- 'inverters', 'batteries', 'solar-panels', 'complete-kits', 'mounting-equipment', 'protection-accessories'
    price_zar DECIMAL(12, 2) NOT NULL,
    stock_count INT NOT NULL DEFAULT 0,
    in_stock BOOLEAN NOT NULL DEFAULT TRUE,
    sku VARCHAR(64) UNIQUE NOT NULL,
    rating_kw DECIMAL(5, 2),
    capacity_kwh DECIMAL(5, 2),
    warranty_years INT DEFAULT 5,
    image_url VARCHAR(512) NOT NULL,
    summary TEXT NOT NULL,
    specs_json JSON,
    compatibility_json JSON,
    installation_available BOOLEAN DEFAULT TRUE,
    installation_price_zar DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id),
    total_equipment_zar DECIMAL(12, 2) NOT NULL,
    total_installation_zar DECIMAL(12, 2) DEFAULT 0,
    total_order_zar DECIMAL(12, 2) NOT NULL,
    installation_included BOOLEAN DEFAULT FALSE,
    payment_method VARCHAR(64) DEFAULT 'EFT Bank Transfer',
    payment_status VARCHAR(32) DEFAULT 'pending', -- 'pending', 'paid', 'financed'
    order_status VARCHAR(32) DEFAULT 'processing', -- 'processing', 'scheduled', 'completed', 'cancelled'
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(128) NOT NULL,
    contact_phone VARCHAR(64) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(64) NOT NULL REFERENCES products(id),
    quantity INT NOT NULL DEFAULT 1,
    unit_price_zar DECIMAL(12, 2) NOT NULL,
    installation_selected BOOLEAN DEFAULT FALSE,
    installation_fee_zar DECIMAL(10, 2) DEFAULT 0
);

-- 5. INSTALLATION PROJECTS (Milestone Tracking & CoC)
CREATE TABLE IF NOT EXISTS installation_projects (
    id VARCHAR(64) PRIMARY KEY, -- e.g. 'KX-9042'
    order_id VARCHAR(64) REFERENCES orders(id),
    user_id VARCHAR(64) NOT NULL REFERENCES users(id),
    client_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    system_summary TEXT NOT NULL,
    current_stage_index INT NOT NULL DEFAULT 0, -- 0 to 5
    assigned_technician_name VARCHAR(255) DEFAULT 'Lead Electrical Technician [Assigned]',
    assigned_technician_cert VARCHAR(255) DEFAULT 'Department of Labour Registered Installation Electrician (IE)',
    assigned_technician_contact VARCHAR(128) DEFAULT '[Dispatch Contact Placeholder]',
    target_installation_date VARCHAR(64),
    coc_issued BOOLEAN DEFAULT FALSE,
    coc_certificate_number VARCHAR(128),
    coc_document_url VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. PROJECT MILESTONES TABLE
CREATE TABLE IF NOT EXISTS project_milestones (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES installation_projects(id) ON DELETE CASCADE,
    stage_index INT NOT NULL,
    stage_key VARCHAR(64) NOT NULL, -- 'order-received', 'equipment-prep', 'install-scheduled', 'install-progress', 'commissioned', 'completed'
    title VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    stage_date VARCHAR(64),
    is_completed BOOLEAN DEFAULT FALSE,
    is_current BOOLEAN DEFAULT FALSE
);

-- 7. MAINTENANCE SLAS & SERVICE TICKETS
CREATE TABLE IF NOT EXISTS maintenance_tickets (
    id VARCHAR(64) PRIMARY KEY, -- e.g. 'KX-SRV-4821'
    user_id VARCHAR(64) REFERENCES users(id),
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(64) NOT NULL,
    site_address VARCHAR(255) NOT NULL,
    city VARCHAR(128) NOT NULL,
    tier VARCHAR(64) NOT NULL, -- 'Essential', 'Performance', 'Complete'
    inverter_brand VARCHAR(128) NOT NULL,
    system_age VARCHAR(64),
    primary_reason VARCHAR(255) NOT NULL,
    issue_details TEXT,
    status VARCHAR(32) DEFAULT 'pending', -- 'pending', 'dispatched', 'in_progress', 'resolved'
    assigned_technician VARCHAR(255),
    scheduled_date VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. LEADS & SIZING QUOTATIONS
CREATE TABLE IF NOT EXISTS leads_quotes (
    id VARCHAR(64) PRIMARY KEY, -- e.g. 'KX-Q-849201'
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(64) NOT NULL,
    suburb VARCHAR(128) NOT NULL,
    province VARCHAR(64) NOT NULL,
    property_type VARCHAR(128) NOT NULL,
    monthly_bill_zar DECIMAL(10, 2) NOT NULL,
    recommended_inverter_kw DECIMAL(5, 2),
    recommended_battery_kwh DECIMAL(5, 2),
    recommended_solar_kwp DECIMAL(5, 2),
    roof_type VARCHAR(128),
    status VARCHAR(32) DEFAULT 'new', -- 'new', 'contacted', 'quoted', 'won', 'lost'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. DYNAMIC SITE CONTENT & MEDIA SETTINGS (Full Admin CMS Control)
CREATE TABLE IF NOT EXISTS site_content (
    content_key VARCHAR(128) PRIMARY KEY,
    section_name VARCHAR(64) NOT NULL,
    title VARCHAR(255),
    subtitle TEXT,
    image_url VARCHAR(512),
    button_text VARCHAR(64),
    button_link VARCHAR(128),
    meta_json JSON,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- SEED DATA INITIALIZATION
-- =========================================================================

-- Seed Users
INSERT INTO users (id, name, email, password_hash, role, phone, company, address, city, province) VALUES
('usr-admin-01', 'Chief Engineering Director', 'admin@kinetixenergy.co.za', 'admin123', 'admin', '+27 11 800 4500', 'Kinetix Energy Technologies', 'Sandton City Office Tower', 'Sandton', 'Gauteng'),
('usr-client-01', 'Bryanston Residential Client', 'client@bryanston.co.za', 'client123', 'customer', '+27 82 456 7890', 'Private Residence', '14 Protea Avenue', 'Bryanston', 'Gauteng'),
('usr-client-02', 'Camps Bay Studio Owner', 'owner@campsbaystudio.co.za', 'client123', 'customer', '+27 83 123 9988', 'Camps Bay Studios', '22 Victoria Road', 'Camps Bay', 'Western Cape')
ON CONFLICT (id) DO NOTHING;

-- Seed Dynamic CMS Site Content
INSERT INTO site_content (content_key, section_name, title, subtitle, image_url, button_text, button_link) VALUES
('hero_main', 'hero', 'Engineered for South African Realities.', 'Turnkey residential and commercial solar installations, Tier-1 equipment sales, and lifetime preventative maintenance with certified SANS 10142-1-2 CoC compliance.', '/hero-solar-home.jpg', 'Get a Solar Quote', 'configurator'),
('solution_residential', 'solutions', 'Residential Solar Solutions', 'Eliminate loadshedding anxiety and cut escalating municipal tariffs with quiet, intelligent hybrid microgrids.', '/hero-solar-home.jpg', 'Request a Quote', 'solar'),
('solution_commercial', 'solutions', 'Commercial & Industrial 3-Phase', 'Operational cost reduction, generator fuel savings, and SARS Section 12B accelerated depreciation allowance.', '/commercial-solar-sa.jpg', 'Request Assessment', 'solar'),
('solution_agricultural', 'solutions', 'Agricultural & Vineyard Microgrids', 'Off-grid agrivoltaics and cold-storage protection for wine estates, packhouses, and irrigation stations.', '/solar-farm-agricultural.jpg', 'View Agri Systems', 'solar'),
('solution_upgrades', 'solutions', 'System Upgrades & DB Rewiring', 'Safely expand existing inverters with secondary lithium batteries, additional solar strings, and CoC re-issuance.', '/electrician-wiring-db.jpg', 'Book Upgrade', 'solar')
ON CONFLICT (content_key) DO NOTHING;
