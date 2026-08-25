# KINETIX ENERGY — WORDPRESS & WOOCOMMERCE DEPLOYMENT GUIDE

This package provides the complete, production-ready WordPress child theme and SQL database schema for **Kinetix Energy Technologies**.

---

## 1. Drag & Drop WordPress Theme Installation

1. Copy or upload the `wordpress-theme/` folder into your WordPress root directory:
   ```
   wp-content/themes/kinetix-energy/
   ```
2. In your WordPress Admin Dashboard, navigate to **Appearance → Themes** and click **Activate** on **Kinetix Energy**.
3. (Optional) Set parent theme to [Kadence WP (Free)](https://wordpress.org/themes/kadence/) or [Astra (Free)](https://wordpress.org/themes/astra/).

---

## 2. SQL Database Import (phpMyAdmin / MySQL CLI)

A complete MySQL relational database schema and seed data is provided in [`database-schema.sql`](./database-schema.sql).

### Import via phpMyAdmin:
1. Open your database in phpMyAdmin.
2. Click the **Import** tab.
3. Choose `wordpress-theme/database-schema.sql` and click **Go**.

### Import via Terminal / WP-CLI:
```bash
mysql -u wp_user -p wp_database < database-schema.sql
# Or with WP-CLI:
wp db import database-schema.sql
```

This creates and populates:
- `wp_kinetix_projects` (Milestone tracker, DoL electrician assignments, CoC certificates)
- `wp_kinetix_milestones` (Stages 00 to 05 tracking data)
- `wp_kinetix_maintenance` (Service SLAs & diagnostic tickets)
- `wp_kinetix_site_content` (Live CMS content & media settings)

---

## 3. Recommended Free Plugins Stack

All website objectives are fully satisfied using **100% free plugins**:

| Feature / Objective | Free Plugin | Configuration |
|---|---|---|
| **eCommerce & Solar Hardware** | **WooCommerce** (Free) | Direct hardware sales, ZAR currency (`R`), PayFast/Ozow/EFT gateway. |
| **Solar Configurator & Sizing Forms** | **Forminator** (Free) + **Calculated Fields Form** | Multi-step sizing wizard with real-time monthly spend slider and kVA/kWh formula calculations. |
| **Bundle Builder** | **Custom Product Boxes for WooCommerce** (Free) | Turnkey inverter + battery + panel package bundles. |
| **Installation Booking & Dispatch** | **Simply Schedule Appointments** (Free) or **BookingPress** | Google Calendar integration, site survey scheduling, electrician dispatch. |
| **Real-Time Inventory Sync** | **ATUM Inventory Management for WooCommerce** (Free) | Inverter and LiFePO4 battery batch tracking, warehouse stock counts, low stock alerts. |
| **Customer Portal & Documents** | **WP Customer Area** or **Client Portal Plugin** (Free) | Secure client login, project tracking view, CoC PDF downloads, warranty dossiers. |
| **Maintenance Subscriptions** | **WooCommerce Subscriptions (Lite)** + **Forminator** | Essential, Performance, and Complete preventative maintenance SLA tiers. |
| **Live Assistant Chatbot** | **Tidio Live Chat** (Free AI bot) | Customer instant chat and pre-sales solar qualification. |
| **SEO & OpenGraph Schema** | **Rank Math SEO** (Free) | SABS 10142 compliance tags, South African local business schema, rich snippets. |
| **Security & Firewall** | **Wordfence Security** (Free) | 2FA authentication, rate limiting, and brute-force firewall. |

---

## 4. Custom Post Types & REST API Endpoints

Registered in `functions.php`:
1. `kinetix_project` (`/tracking/`):
   - `_current_stage`: Stage index 0 (Order Received) to 5 (CoC Handover).
   - `_assigned_technician`: Lead Installation Electrician name and registration.
   - `_coc_document`: Uploaded supplementary electrical Certificate of Compliance PDF.
2. `kinetix_maintenance` (`/maintenance-sla/`):
   - Service SLA tier and scheduled diagnostic visits.

### REST API Endpoints:
- `POST /wp-json/kinetix/v1/calculate-solar` — Sizing calculation endpoint.
- `GET /wp-json/kinetix/v1/project-status?ref=KX-9042` — Real-time milestone tracker endpoint.
