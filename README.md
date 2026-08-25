# Kinetix Energy — Smart Energy Platform

**Kinetix Energy** is a production-grade, engineering-focused renewable energy platform built for South African realities. It features turnkey solar solutions, certified SANS 10142-1-2 CoC installation workflows, direct eCommerce hardware sales, real-time ATUM-style inventory management, interactive sizing calculators, an end-to-end customer account portal with live project milestone tracking (`KX-9042`), an SQL database architecture, and an executive CMS Admin Control Panel.

---

## ⚡ Key Platform Capabilities

### 1. 👥 User Authentication & Customer Portal
- **Customer Sign In & Registration**: Secure account creation, order tracking, and telemetry access.
- **1-Click Demo Accounts**:
  - `client@bryanston.co.za` (Password: `client123`) — Loads client installation `KX-9042` with live milestone tracking.
  - `admin@kinetixenergy.co.za` (Password: `admin123`) — Opens the executive CMS Admin Dashboard.
- **Active System Overview**: 8kW Single Phase Inverter + 10.24kWh LiFePO4 Battery + 5.5kWp Solar Array.
- **Milestone Tracker (6 Engineering Stages)**: Real-time status from *Order Received* to *DoL Installation Electrician Handover*.
- **Live Inverter Telemetry**: Real-time solar yield, battery State of Charge (92%), and load consumption metrics.
- **Compliance Documents Vault**: 1-click downloads for Supplementary Electrical Certificate of Compliance (CoC), Single-Line Diagrams (SLD), and 10-year manufacturer warranty certificates.

### 2. ⚡ Executive CMS Admin Control Panel (`/admin`)
- **Visual Media & Copywriting Manager**: Edit homepage hero headlines, subtitles, and switch photos with live preview.
- **Product Catalog & Stock Management**: Add new solar hardware SKUs, update ZAR pricing (`R`), and manage warehouse inventory levels.
- **Project Logistics & Milestone Dispatcher**: Advance or rewind project stages (0 to 5), reassign electricians, and update CoC numbers.
- **Preventative Care & Maintenance SLA Queue**: Manage service tickets (*Pending*, *Dispatched*, *In Progress*, *Resolved*).
- **Sizing Leads Inbox**: Review and manage quotation requests from the 3-step sizing configurator.

### 3. 🗄️ Relational SQL Database Architecture
- **ANSI SQL Relational Schema** (`src/data/schema.sql`): PostgreSQL, SQLite, and MySQL compatible.
- **WordPress MySQL Import File** (`wordpress-theme/database-schema.sql`): Ready for direct phpMyAdmin or WP-CLI import.
- **Relational Tables**:
  - `users` — Customer authentication and administrative roles.
  - `products` — Hardware catalog, specs, and warehouse inventory counts.
  - `orders` & `order_items` — Placed customer orders with turnkey installation add-ons.
  - `installation_projects` & `project_milestones` — 6-stage engineering tracking pipeline.
  - `maintenance_tickets` — Preventative care SLAs and diagnostic service tickets.
  - `leads_quotes` — Sizing inquiries from configurators.
  - `site_content` — Dynamic CMS headlines, subtitles, and visual media settings.

### 4. 📦 Drop-and-Drag WordPress Child Theme (`wordpress-theme/`)
- Drop directly into `wp-content/themes/kinetix-energy`.
- Integrates with 100% free plugins:
  - **Kadence WP / Astra** (Free Parent Theme)
  - **WooCommerce** (eCommerce Catalog & ZAR Checkout)
  - **Forminator + Calculated Fields Form** (Interactive Sizing Wizard)
  - **ATUM Inventory Management** (Real-Time Stock & Warehouse Tracking)
  - **Simply Schedule Appointments** (Site Survey Booking & Electrician Scheduling)
  - **WP Customer Area** (Client Account & Documents Vault)
  - **Tidio** (Live Virtual Assistant Chatbot)
  - **Rank Math SEO & Wordfence Security** (SANS 10142 Schema & Security)

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons
- **State Management**: Reactive React Context (`AuthContext`, `DataContext`, `CartContext`, `ThemeContext`)
- **Database**: Relational SQL Schema & LocalStorage Database Sync
- **WordPress Compatibility**: Complete Child Theme + MySQL database schema dump
- **Compliance Standards**: SANS 10142-1-2, SSEG Municipal Grid Interconnection, SARS Section 12B

---

## 🚀 Quick Start (Development)

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Build for production
npm run build
```

---

## 📂 Project Structure

```
├── public/                     # High-definition architectural & hardware photos
├── src/
│   ├── components/
│   │   ├── calculator/         # Solar ROI & Payback Calculator
│   │   ├── cart/               # Equipment Cart Drawer & Turnkey Add-on
│   │   ├── common/             # Header, Footer, Modals, Disclaimers
│   │   ├── configurator/       # 5-Step Solar Sizing Wizard
│   │   ├── forms/              # Sizing, Commercial, Booking & SLA Forms
│   │   ├── portal/             # Customer Account, Telemetry & CoC Vault
│   │   ├── shop/               # Product Cards & Detail Modal
│   │   └── tracking/           # 6-Stage Milestone Project Tracker
│   ├── context/
│   │   ├── AuthContext.tsx     # Session management & demo logins
│   │   ├── CartContext.tsx     # Cart state & installation pricing
│   │   ├── DataContext.tsx     # Reactive SQL database & CMS mutations
│   │   └── ThemeContext.tsx    # Dark & Light theme switcher
│   ├── data/
│   │   ├── mockData.ts         # Initial hardware catalog & project mocks
│   │   └── schema.sql          # Relational SQL schema & seed records
│   ├── pages/                  # Route views (Home, Solar, Shop, Admin, etc.)
│   ├── types.ts                # TypeScript interfaces & definitions
│   ├── App.tsx                 # Main application router
│   └── main.tsx                # Context providers & mount
├── wordpress-theme/            # Complete WordPress child theme & MySQL import
├── DESIGN.md                   # Anti-AI design tokens & architectural specs
└── package.json
```

---

## 📜 License
© 2026 Kinetix Energy Technologies (Pty) Ltd. All rights reserved.
