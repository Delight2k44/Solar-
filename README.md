# ⚡ Kinetix Energy — Enterprise Solar & Storage Platform

[![Production Live](https://img.shields.io/badge/Production-kinetixes.com-00D2FF?style=for-the-badge&logo=google-chrome&logoColor=black)](https://kinetixes.com)
[![Hostinger Hosted](https://img.shields.io/badge/Hosting-Hostinger%20Cloud-673DE6?style=for-the-badge&logo=hostinger&logoColor=white)](https://hpanel.hostinger.com)
[![PayFast Integrated](https://img.shields.io/badge/Payment-PayFast%20by%20DPO-FF0044?style=for-the-badge)](https://payfast.co.za)
[![Resend Verified](https://img.shields.io/badge/Emails-Resend%20API-black?style=for-the-badge&logo=resend&logoColor=white)](https://resend.com)
[![WhatsApp Support](https://img.shields.io/badge/WhatsApp-078%20780%208569-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/27787808569)

**Kinetix Energy** (Kinetix Energy Technologies (Pty) Ltd) is a production-grade, engineering-focused renewable energy and microgrid platform built for the South African commercial and residential market.

Featuring a Starlink-grade cinematic dark interface, certified SANS 10142-1-2 CoC installation workflows, direct eCommerce hardware sales, Section 12B SARS Tax Write-Off calculators, PayFast payment gateway integration, live The Courier Guy (TCG) parcel tracking, and real-time Resend transactional email routing.

---

## 🌐 Live Production URL
* **Domain**: [https://kinetixes.com](https://kinetixes.com)
* **Status**: Running live on Hostinger with active SSL & Global Edge CDN.
* **Headquarters**: Sandton City Office Tower, 5th Floor, Sandhurst, Johannesburg, 2196.

---

## ⚡ Key Platform Capabilities

### 1. 💳 South African Payment Gateways
* **PayFast by DPO**: Integrated all-in-one South African gateway supporting:
  * Visa & Mastercard (3D Secure 2.0)
  * Instant EFT across all South African banks (FNB, Standard Bank, Capitec, ABSA, Nedbank, Investec, TymeBank)
  * Capitec Pay & Mobicred installment finance
  * Masterpass & Zapper QR payments
* **Real-time Order Processing**: Instant settlement confirmation, Firebase order persistence, and automatic tax invoice generation.

### 2. 🚚 The Courier Guy (TCG) & RAM Freight Telemetry
* **Live Parcel Tracking (`ProjectTracker.tsx`)**:
  * Real-time search by Kinetix Order Reference or **The Courier Guy Waybill** (`TCG-ZA-...`).
  * Direct 1-click button linking into **The Courier Guy Live Tracking Portal**.
  * Logistics hub telemetry (Kempton Park SuperHub, Gauteng) with countdown timers.
* **6-Stage Turnkey Installation Pipeline**: From warehouse allocation and 1000V DC bench testing to DoL Master Electrician SANS CoC commissioning.

### 3. 📧 Real-Time Email Notifications & Templates (Resend API)
* **Automated Lead Alerts**: Every quote, commercial audit, and contact message dispatches instant rich HTML notifications directly to `form@kinetixes.com`.
* **Published Resend Templates**:
  * `order-confirmation` — Official tax invoice with itemized hardware and tracking link.
  * `solar-quote-proposal` — Residential system recommendation (kW Inverter, kWh LiFePO4, kWp Solar panels) and savings calculation.
  * `commercial-audit-proposal` — Industrial 50kW+ microgrid assessment with Section 12B tax modeling.

### 4. 🏢 Commercial & Industrial Microgrid Hub (`/business`)
* **50kW / 150kW / 500kW+ Sizing**: Engineered high-voltage 3-phase microgrid tiers for factories, cold storage, and office parks.
* **SARS Section 12B Tax Calculator**: Real-time modeling of the 125% Year 1 capital depreciation tax deduction.
* **Top Navigation Switch**: Seamless segmented `[ Personal | Business ]` mode toggle.

### 5. 📱 iPhone 15 Pro & Mobile First UI
* Streamlined mobile header displaying the crisp `KINETIX` wordmark and drawer menu.
* Responsive hero background imagery (`object-[center_35%]`) for optimal mobile rendering.
* Floating **WhatsApp Support Widget** connected to **`078 780 8569`** (`+27 78 780 8569`).

### 6. 🛡️ Pure Production State (Zero Mock Data)
* All tracking and portal views run against real Firebase and user orders.
* Zero hardcoded sample data or simulation delays.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript, Vite |
| **Styling & Theme** | Tailwind CSS v4, Grok Dark Theme, Lucide Icons |
| **Fonts** | Plus Jakarta Sans (Headings/Body) & JetBrains Mono (Specs/Data) |
| **Database & Auth** | Google Firebase (`kinetixs-d9c35`) & LocalStorage Sync |
| **Payment Gateway** | PayFast by DPO (South Africa) |
| **Email Engine** | Resend API (`resend.com`) |
| **Freight Partner** | The Courier Guy (TCG) & RAM Specialized Logistics |
| **Production Server** | Hostinger Apache Web Server with `.htaccess` SPA rewriting |

---

## 🚀 Quick Start (Development)

```bash
# 1. Clone the repository
git clone https://github.com/Delight2k44/Solar-.git
cd Solar-

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Build for production
npm run build
```

---

## 📦 Deployment to Hostinger

1. Run the build command:
   ```bash
   npm run build
   ```
2. Create the deployment package:
   ```bash
   python scratch/create_deploy_zip.py
   ```
3. Upload `hostinger-deploy.zip` to Hostinger File Manager in `public_html` and click **Extract**.
4. The `.htaccess` file ensures smooth client-side routing on Apache servers.

---

## 🔒 Security & Compliance
* **SANS 10142-1-2**: South African National Standard for embedded generation installations.
* **SARB & PCI-DSS**: Compliant 3D Secure 2.0 payment processing via PayFast.
* **POPIA**: South African Protection of Personal Information Act compliant data storage.

---

## 📞 Support & Contacts
* **Live Website**: [https://kinetixes.com](https://kinetixes.com)
* **WhatsApp Hotline**: [+27 78 780 8569](https://wa.me/27787808569) (078 780 8569)
* **Administrative Email**: `delightchetter@gmail.com`
* **Headquarters**: Sandton City Office Tower, 5th Floor, Sandhurst, Johannesburg, South Africa
