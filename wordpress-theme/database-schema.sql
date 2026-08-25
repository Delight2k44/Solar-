-- =========================================================================
-- KINETIX ENERGY — WORDPRESS & WOOCOMMERCE MYSQL DATABASE EXPORT
-- Ready for phpMyAdmin / MySQL CLI Import into WordPress installations
-- =========================================================================

SET FOREIGN_KEY_CHECKS=0;

-- 1. KINETIX PROJECTS TABLE (WordPress Custom Post / Custom Table)
CREATE TABLE IF NOT EXISTS `wp_kinetix_projects` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_reference` varchar(64) NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `client_name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `system_summary` text NOT NULL,
  `current_stage_index` int(11) NOT NULL DEFAULT 0,
  `technician_name` varchar(255) DEFAULT 'Lead Electrical Technician [Assigned]',
  `technician_cert` varchar(255) DEFAULT 'Department of Labour Registered Installation Electrician (IE)',
  `technician_contact` varchar(128) DEFAULT '[Dispatch Contact Placeholder]',
  `target_date` varchar(64) DEFAULT NULL,
  `coc_number` varchar(128) DEFAULT NULL,
  `coc_document_url` varchar(512) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_ref_idx` (`order_reference`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- 2. KINETIX MILESTONES TABLE
CREATE TABLE IF NOT EXISTS `wp_kinetix_milestones` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) unsigned NOT NULL,
  `stage_index` int(11) NOT NULL,
  `stage_key` varchar(64) NOT NULL,
  `title` varchar(128) NOT NULL,
  `description` text NOT NULL,
  `milestone_date` varchar(64) DEFAULT NULL,
  `is_completed` tinyint(1) NOT NULL DEFAULT 0,
  `is_current` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `project_id_idx` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- 3. KINETIX MAINTENANCE SLAS TABLE
CREATE TABLE IF NOT EXISTS `wp_kinetix_maintenance` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `ticket_reference` varchar(64) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `client_name` varchar(255) NOT NULL,
  `client_email` varchar(255) NOT NULL,
  `client_phone` varchar(64) NOT NULL,
  `site_address` varchar(255) NOT NULL,
  `city` varchar(128) NOT NULL,
  `tier` varchar(64) NOT NULL,
  `inverter_brand` varchar(128) NOT NULL,
  `system_age` varchar(64) DEFAULT NULL,
  `primary_reason` varchar(255) NOT NULL,
  `issue_details` text,
  `status` varchar(32) NOT NULL DEFAULT 'pending',
  `assigned_technician` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ticket_ref_idx` (`ticket_reference`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- 4. KINETIX DYNAMIC CONTENT TABLE
CREATE TABLE IF NOT EXISTS `wp_kinetix_site_content` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `content_key` varchar(128) NOT NULL,
  `section_name` varchar(64) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `subtitle` text,
  `image_url` varchar(512) DEFAULT NULL,
  `button_text` varchar(64) DEFAULT NULL,
  `button_link` varchar(128) DEFAULT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `content_key_idx` (`content_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- Sample Seed Records for WordPress
INSERT INTO `wp_kinetix_projects` (`order_reference`, `user_id`, `client_name`, `location`, `system_summary`, `current_stage_index`, `target_date`, `coc_number`)
VALUES 
('KX-9042', 1, 'Bryanston Residential Client', 'Bryanston, Johannesburg', '8kW Deye Hybrid Inverter + 10.24kWh Freedom Won Battery + 10x 550W Canadian Solar Panels', 3, '24 Aug 2026', 'PENDING-COC-9042'),
('KX-8105', 2, 'Camps Bay Commercial Studio', 'Camps Bay, Cape Town', '12kW Sunsynk 3-Phase + 15kWh Dyness Rack Storage + 16x 545W JA Solar', 5, '14-16 Jul 2026', 'COC-ZA-WC-8105-2026')
ON DUPLICATE KEY UPDATE `system_summary`=VALUES(`system_summary`);

SET FOREIGN_KEY_CHECKS=1;
