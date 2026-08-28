import { Product, ProvinceIrradiance, ProjectRecord, MaintenancePackage, ResourceArticle } from '../types';

export const PROVINCES_DATA: Record<string, ProvinceIrradiance> = {
  'Gauteng (Johannesburg / Pretoria)': {
    name: 'Gauteng',
    peakSunHoursPerDay: 5.4,
    avgTariffPerKwhZAR: 3.45,
  },
  'Western Cape (Cape Town / Stellenbosch)': {
    name: 'Western Cape',
    peakSunHoursPerDay: 5.1,
    avgTariffPerKwhZAR: 3.72,
  },
  'KwaZulu-Natal (Durban / North Coast)': {
    name: 'KwaZulu-Natal',
    peakSunHoursPerDay: 4.8,
    avgTariffPerKwhZAR: 3.38,
  },
  'Eastern Cape (Gqeberha / East London)': {
    name: 'Eastern Cape',
    peakSunHoursPerDay: 5.0,
    avgTariffPerKwhZAR: 3.52,
  },
  'Free State (Bloemfontein)': {
    name: 'Free State',
    peakSunHoursPerDay: 5.7,
    avgTariffPerKwhZAR: 3.25,
  },
  'Mpumalanga (Mbombela / Witbank)': {
    name: 'Mpumalanga',
    peakSunHoursPerDay: 5.2,
    avgTariffPerKwhZAR: 3.30,
  },
  'Limpopo (Polokwane)': {
    name: 'Limpopo',
    peakSunHoursPerDay: 5.6,
    avgTariffPerKwhZAR: 3.18,
  },
  'North West (Rustenburg)': {
    name: 'North West',
    peakSunHoursPerDay: 5.5,
    avgTariffPerKwhZAR: 3.28,
  },
  'Northern Cape (Upington / Kimberley)': {
    name: 'Northern Cape',
    peakSunHoursPerDay: 6.2,
    avgTariffPerKwhZAR: 3.15,
  }
};

export const PRODUCTS_CATALOG: Product[] = [
  {
    id: 'deye-8kw-hybrid',
    name: 'Deye 8kW Single Phase Hybrid Inverter (SUN-8K-SG01LP1)',
    brand: 'Deye',
    category: 'inverters',
    priceZAR: 32450,
    inStock: true,
    stockCount: 14,
    sku: 'DEYE-8K-HYB-01',
    ratingKw: 8.0,
    warrantyYears: 5,
    image: '/hybrid-inverter-deye.jpg',
    summary: 'High-performance low-voltage hybrid inverter with dual MPPTs, smart load output, and seamless UPS-grade auto-switching (under 4ms) for load shedding resilience.',
    specs: [
      { label: 'Continuous Output Power', value: '8,000 W' },
      { label: 'Max PV Input Power', value: '10,400 W' },
      { label: 'Nominal Battery Voltage', value: '48V DC (40V - 60V)' },
      { label: 'Max Charge / Discharge Current', value: '190 A' },
      { label: 'MPPT Trackers', value: '2 Trackers (2+2 strings)' },
      { label: 'UPS Switch Time', value: '< 4 ms' },
      { label: 'IP Protection', value: 'IP65 (Outdoor / Indoor)' },
      { label: 'Communication Ports', value: 'RS485, CAN, Wi-Fi dongle included' }
    ],
    compatibility: ['Freedom Won eTower / LiTE', 'Dyness A48100 / Powerbox', 'Hubble AM-2 / AM-4', 'Pylontech US3000C / US5000'],
    installationAvailable: true,
    installationPriceZAR: 8500,
    faqs: [
      {
        question: 'Can this inverter be expanded in parallel later?',
        answer: 'Yes, up to 16 units can be paralleled on a single-phase or configured for three-phase operation.'
      },
      {
        question: 'Does it support generator auto-start (dry contact)?',
        answer: 'Yes, it features a dedicated dry contact relay and generator input port with intelligent frequency tracking.'
      }
    ]
  },
  {
    id: 'sunsynk-5kw-hybrid',
    name: 'Sunsynk 5kW Parity Hybrid Inverter',
    brand: 'Sunsynk',
    category: 'inverters',
    priceZAR: 24900,
    inStock: true,
    stockCount: 8,
    sku: 'SS-5K-HYB-ZA',
    ratingKw: 5.0,
    warrantyYears: 5,
    image: '/hybrid-inverter-deye.jpg',
    summary: 'The benchmark residential hybrid inverter for South African homes. Exceptional software control, Wi-Fi data logging, and proven reliability.',
    specs: [
      { label: 'Continuous AC Power', value: '5,000 W' },
      { label: 'Peak Backup Power', value: '10,000 W (10s)' },
      { label: 'Battery Compatibility', value: '48V Lead-Acid or LiFePO4' },
      { label: 'Max Efficiency', value: '97.6%' },
      { label: 'Enclosure Rating', value: 'IP65' }
    ],
    compatibility: ['Freedom Won', 'Dyness', 'Pylontech', 'SunSynk Batteries'],
    installationAvailable: true,
    installationPriceZAR: 7500,
    faqs: [
      {
        question: 'Is Sunsynk Connect app included?',
        answer: 'Yes, remote monitoring via Sunsynk Connect on iOS and Android is included out of the box with the Wi-Fi data logger.'
      }
    ]
  },
  {
    id: 'freedom-won-etower-5kwh',
    name: 'Freedom Won eTower LiFePO4 Battery Module (5.12kWh 52V)',
    brand: 'Freedom Won',
    category: 'batteries',
    priceZAR: 26800,
    inStock: true,
    stockCount: 19,
    sku: 'FW-ETOWER-5.12',
    capacityKwh: 5.12,
    warrantyYears: 10,
    image: '/lithium-battery-etower.jpg',
    summary: 'Premium South African engineered lithium iron phosphate (LiFePO4) battery module. Up to 90% DoD, 10-year warranty, and stackable rack architecture.',
    specs: [
      { label: 'Total Energy Capacity', value: '5.12 kWh' },
      { label: 'Usable Capacity @ 90% DoD', value: '4.60 kWh' },
      { label: 'Nominal Voltage', value: '52.0 V (16S)' },
      { label: 'Max Continuous Discharge Current', value: '100 A (5 kW)' },
      { label: 'Cycle Life', value: 'Over 4,000 cycles @ 80% DoD' },
      { label: 'BMS Integration', value: 'Native CAN/RS485 communication with Deye, Sunsynk, Victron' },
      { label: 'Weight', value: '43 kg' }
    ],
    compatibility: ['Deye', 'Sunsynk', 'Victron MultiPlus-II', 'Growatt'],
    installationAvailable: true,
    installationPriceZAR: 3200,
    faqs: [
      {
        question: 'How many eTower modules can be stacked?',
        answer: 'Up to 6 modules can be paralleled without an external hub (up to 30.72 kWh usable storage).'
      }
    ]
  },
  {
    id: 'dyness-bx51100-5kwh',
    name: 'Dyness BX51100 5.12kWh LiFePO4 Lithium Battery',
    brand: 'Dyness',
    category: 'batteries',
    priceZAR: 21950,
    inStock: true,
    stockCount: 22,
    sku: 'DYN-BX51100',
    capacityKwh: 5.12,
    warrantyYears: 10,
    image: '/lithium-battery-etower.jpg',
    summary: 'High-density wall-mounted or rack-mounted LiFePO4 battery pack with intelligent cell-level BMS balancing and rapid charge capabilities.',
    specs: [
      { label: 'Nominal Capacity', value: '5.12 kWh' },
      { label: 'Recommended Charge Current', value: '50 A (0.5C)' },
      { label: 'Max Continuous Discharge', value: '75 A' },
      { label: 'Operating Temp Range', value: '-20°C to 55°C' },
      { label: 'Certifications', value: 'UN38.3, IEC62619, CE' }
    ],
    compatibility: ['Deye', 'Sunsynk', 'GoodWe', 'Solis', 'Victron'],
    installationAvailable: true,
    installationPriceZAR: 3200,
    faqs: []
  },
  {
    id: 'canadian-solar-550w-hiku6',
    name: 'Canadian Solar 550W HiKu6 Mono PERC Solar Panel',
    brand: 'Canadian Solar',
    category: 'solar-panels',
    priceZAR: 2150,
    inStock: true,
    stockCount: 120,
    sku: 'CS-HIKU6-550W',
    ratingKw: 0.55,
    warrantyYears: 25,
    image: '/solar-panel-mono.jpg',
    summary: 'Tier-1 high efficiency monocrystalline module with 144 half-cut cells, multi-busbar technology, and superior performance under high ambient South African temperatures.',
    specs: [
      { label: 'Rated Maximum Power (Pmax)', value: '550 W' },
      { label: 'Module Efficiency', value: '21.5%' },
      { label: 'Optimum Operating Voltage (Vmp)', value: '41.9 V' },
      { label: 'Optimum Operating Current (Imp)', value: '13.13 A' },
      { label: 'Open Circuit Voltage (Voc)', value: '49.8 V' },
      { label: 'Short Circuit Current (Isc)', value: '14.00 A' },
      { label: 'Dimensions', value: '2278 x 1134 x 35 mm' },
      { label: 'Linear Power Output Warranty', value: '25 Years' }
    ],
    compatibility: ['All MPPT Charge Controllers and String Inverters'],
    installationAvailable: true,
    installationPriceZAR: 950,
    faqs: []
  },
  {
    id: 'ja-solar-545w-mono',
    name: 'JA Solar 545W DeepBlue 3.0 Mono PERC Half-Cell Panel',
    brand: 'JA Solar',
    category: 'solar-panels',
    priceZAR: 2050,
    inStock: true,
    stockCount: 85,
    sku: 'JA-545W-JAM72S30',
    ratingKw: 0.545,
    warrantyYears: 25,
    image: '/solar-panel-mono.jpg',
    summary: 'Industry-standard high-yield solar panel engineered with gallium-doped wafers to mitigate LID and provide consistent kilowatt-hour generation year over year.',
    specs: [
      { label: 'Max Output Power', value: '545 W' },
      { label: 'Module Efficiency', value: '21.1%' },
      { label: 'Operating Voltage (Vmp)', value: '41.80 V' },
      { label: 'Weight', value: '28.6 kg' }
    ],
    compatibility: ['Universal Rail and Tile/Corrugated Mounting Kits'],
    installationAvailable: true,
    installationPriceZAR: 950,
    faqs: []
  },
  {
    id: 'complete-kit-essential-5kw',
    name: 'Kinetix Residential Kit: 5kW Hybrid + 5.12kWh Battery + 3.3kWp Solar',
    brand: 'Kinetix Pre-Engineered Systems',
    category: 'complete-kits',
    priceZAR: 86500,
    inStock: true,
    stockCount: 6,
    sku: 'KX-KIT-RES-5KW',
    ratingKw: 5.0,
    capacityKwh: 5.12,
    warrantyYears: 10,
    image: '/battery-inverter-room.jpg',
    summary: 'Pre-matched, pre-fused, turnkey residential setup. Includes 5kW Inverter, 5.12kWh LiFePO4 battery, 6x 550W Canadian Solar panels, DC/AC protection box, and roof mounting kit.',
    specs: [
      { label: 'Inverter Capacity', value: '5.0 kW Continuous' },
      { label: 'Battery Capacity', value: '5.12 kWh (4.6 kWh usable)' },
      { label: 'Solar Generation Capacity', value: '3.3 kWp (6 x 550W panels)' },
      { label: 'Estimated Daily Yield', value: '14 - 18 kWh / day' },
      { label: 'Protection Included', value: 'Type II Surge, 1000V DC Isolators, Dual AC Breakers' }
    ],
    compatibility: ['Single Phase Domestic Distribution Boards'],
    installationAvailable: true,
    installationPriceZAR: 16500,
    faqs: [
      {
        question: 'Does the installation include a Certificate of Compliance (CoC)?',
        answer: 'Yes. When installed by our accredited installation team, a valid supplementary electrical CoC is issued upon commissioning.'
      }
    ]
  },
  {
    id: 'complete-kit-executive-8kw',
    name: 'Kinetix Executive Kit: 8kW Hybrid + 10.24kWh Storage + 5.5kWp Solar',
    brand: 'Kinetix Pre-Engineered Systems',
    category: 'complete-kits',
    priceZAR: 138900,
    inStock: true,
    stockCount: 4,
    sku: 'KX-KIT-EXEC-8KW',
    ratingKw: 8.0,
    capacityKwh: 10.24,
    warrantyYears: 10,
    image: '/hero-solar-home.jpg',
    summary: 'Engineered for larger homes and home offices. Powers high-draw appliances, air conditioning, refrigeration, and geysers through daytime solar generation and heavy night backup.',
    specs: [
      { label: 'Inverter Capacity', value: '8.0 kW Single Phase' },
      { label: 'Battery Capacity', value: '10.24 kWh (Dual 5.12kWh Modules)' },
      { label: 'Solar Generation Capacity', value: '5.5 kWp (10 x 550W Panels)' },
      { label: 'Estimated Daily Yield', value: '25 - 32 kWh / day' }
    ],
    compatibility: ['Single Phase / Split Sub-DB setups'],
    installationAvailable: true,
    installationPriceZAR: 21000,
    faqs: []
  },
  {
    id: 'renusol-tile-mounting-kit',
    name: 'Renusol VarioSole Rail & Bracket Kit (Tile Roof, 6 Panels)',
    brand: 'Renusol',
    category: 'mounting-equipment',
    priceZAR: 4850,
    inStock: true,
    stockCount: 30,
    sku: 'REN-VS-TILE-6P',
    warrantyYears: 10,
    image: '/solar-installer-roof.jpg',
    summary: 'Corrosion-resistant anodized aluminium mounting system with stainless steel roof hooks engineered for South African wind load conditions (SANS 10160).',
    specs: [
      { label: 'Material', value: 'EN AW-6063 T6 Aluminium & 1.4301 Stainless Steel' },
      { label: 'Wind Load Rating', value: 'Up to 140 km/h' },
      { label: 'Roof Type', value: 'Concrete / Slate Tile' }
    ],
    compatibility: ['Standard 30mm - 40mm framed solar panels'],
    installationAvailable: true,
    installationPriceZAR: 2400,
    faqs: []
  },
  {
    id: 'surge-protection-ac-dc-box',
    name: 'Kinetix Pre-Wired AC/DC Solar Combiner & Surge Protection Enclosure',
    brand: 'Kinetix Electrical',
    category: 'protection-accessories',
    priceZAR: 6950,
    inStock: true,
    stockCount: 15,
    sku: 'KX-PROT-2IN-1OUT',
    warrantyYears: 5,
    image: '/solar-protection-panel.jpg',
    summary: 'SABS/IEC compliant protection panel with integrated Type II DC and AC surge arrestors, 1000V DC fused isolators, and manual bypass switch.',
    specs: [
      { label: 'DC Voltage Rating', value: '1000 V DC' },
      { label: 'AC Surge Protection', value: 'Class II (20-40kA)' },
      { label: 'Bypass Switch', value: '63A 4-Pole Manual Changeover' },
      { label: 'Enclosure Rating', value: 'IP65 UV Stabilised' }
    ],
    compatibility: ['Universal 5kW - 12kW Inverters'],
    installationAvailable: true,
    installationPriceZAR: 2800,
    faqs: []
  }
];

export const SAMPLE_PROJECT_RECORDS: Record<string, ProjectRecord> = {
  'VX-9042': {
    orderId: 'VX-9042',
    customerName: 'Bryanston Residential Client',
    location: 'Bryanston, Johannesburg',
    systemSummary: '8kW Deye Hybrid Inverter + 10.24kWh Freedom Won Battery + 10x 550W Canadian Solar Panels',
    currentStageIndex: 3, // Installation in Progress
    stages: [
      {
        id: 0,
        key: 'order-received',
        title: 'ORDER RECEIVED',
        description: 'Engineering review completed, components allocated from warehouse.',
        date: '2026-08-14',
        completed: true,
        current: false
      },
      {
        id: 1,
        key: 'equipment-prep',
        title: 'EQUIPMENT PREPARING',
        description: 'Pre-assembly and firmware bench-testing of inverter & BMS units.',
        date: '2026-08-17',
        completed: true,
        current: false
      },
      {
        id: 2,
        key: 'install-scheduled',
        title: 'INSTALLATION SCHEDULED',
        description: 'Site access confirmed, certified installation team allocated.',
        date: '2026-08-22',
        completed: true,
        current: false
      },
      {
        id: 3,
        key: 'install-progress',
        title: 'INSTALLATION IN PROGRESS',
        description: 'DC cable containment, roof rail mounting, and inverter/DB integration underway.',
        date: '2026-08-24',
        completed: false,
        current: true
      },
      {
        id: 4,
        key: 'commissioned',
        title: 'SYSTEM COMMISSIONED',
        description: 'Multi-point safety inspection, grid synchronization, and Wi-Fi data telemetry activation.',
        completed: false,
        current: false
      },
      {
        id: 5,
        key: 'completed',
        title: 'COMPLETED & HANDOVER',
        description: 'Official Certificate of Compliance (CoC) issued, client portal handover completed.',
        completed: false,
        current: false
      }
    ],
    assignedTechnician: {
      name: 'Lead Electrical Technician [Assigned]',
      leadCert: 'Department of Labour Registered Installation Electrician (IE)',
      contactPlaceholder: '[Technician Dispatch Contact Placeholder]'
    },
    installationDate: '24 Aug 2026',
    documents: [
      { name: 'Detailed System Engineering Proposal.pdf', type: 'diagram', date: '12 Aug 2026', size: '2.4 MB' },
      { name: 'Tax Invoice & Proof of Payment (Deposit).pdf', type: 'invoice', date: '14 Aug 2026', size: '420 KB' },
      { name: 'Freedom Won Manufacturer Warranty Registration.pdf', type: 'warranty', date: 'Pending Handover', size: '1.1 MB' }
    ]
  },
  'VX-8105': {
    orderId: 'VX-8105',
    customerName: 'Camps Bay Commercial Studio',
    location: 'Camps Bay, Cape Town',
    systemSummary: '12kW Sunsynk 3-Phase + 15kWh Dyness Rack Storage + 16x 545W JA Solar',
    currentStageIndex: 5, // Completed
    stages: [
      { id: 0, key: 'order-received', title: 'ORDER RECEIVED', description: 'System approved & deposit verified.', date: '2026-07-02', completed: true, current: false },
      { id: 1, key: 'equipment-prep', title: 'EQUIPMENT PREPARING', description: 'Components quality audited.', date: '2026-07-05', completed: true, current: false },
      { id: 2, key: 'install-scheduled', title: 'INSTALLATION SCHEDULED', description: 'City of Cape Town SSEG application submitted.', date: '2026-07-09', completed: true, current: false },
      { id: 3, key: 'install-progress', title: 'INSTALLATION IN PROGRESS', description: 'Roof arrays and sub-DB cabling completed.', date: '2026-07-14', completed: true, current: false },
      { id: 4, key: 'commissioned', title: 'SYSTEM COMMISSIONED', description: 'Zero-export & battery discharge parameters calibrated.', date: '2026-07-16', completed: true, current: false },
      { id: 5, key: 'completed', title: 'COMPLETED & HANDOVER', description: 'Full CoC certificate & handover dossier handed to client.', date: '2026-07-17', completed: true, current: true }
    ],
    assignedTechnician: {
      name: 'Senior Master Electrician [Assigned]',
      leadCert: 'ECASA Accredited Master Electrician',
      contactPlaceholder: '[Technician Dispatch Contact Placeholder]'
    },
    installationDate: '14-16 Jul 2026',
    documents: [
      { name: 'Supplementary Electrical CoC (Certificate of Compliance).pdf', type: 'coc', date: '17 Jul 2026', size: '1.8 MB' },
      { name: 'Final Commissioning & Handover Report.pdf', type: 'warranty', date: '17 Jul 2026', size: '3.1 MB' },
      { name: 'Final Paid Tax Invoice.pdf', type: 'invoice', date: '17 Jul 2026', size: '480 KB' }
    ]
  }
};

export const MAINTENANCE_PACKAGES: MaintenancePackage[] = [
  {
    id: 'essential',
    name: 'Essential Care',
    tier: 'Essential',
    tagline: 'Routine preventative checkups for residential peace of mind.',
    description: 'Annual multi-point safety inspection and basic diagnostics to ensure your solar PV panels, isolators, and inverter are running safely and within design limits.',
    idealFor: 'Residential systems (3kW – 8kW) under 3 years old.',
    slaResponse: 'Standard booking within 5 business days',
    features: [
      'Comprehensive 28-point electrical connection inspection',
      'Inverter error log review and basic firmware update',
      'Battery state of charge (SoC) balance assessment',
      'Thermal scan of DC/AC breakers and isolators to prevent hot spots',
      'Physical inspection of roof mounts, clamps, and earthing bonding',
      'Written safety and performance check summary'
    ]
  },
  {
    id: 'performance',
    name: 'Performance Optimiser',
    tier: 'Performance',
    tagline: 'Deep diagnostics and panel cleaning to maximize kWh yield.',
    description: 'Comprehensive semi-annual inspection with string voltage testing, panel de-soiling, detailed battery cell health analysis, and string efficiency optimization.',
    idealFor: 'High-consumption homes and small commercial properties.',
    slaResponse: 'Priority scheduling within 48 hours',
    features: [
      'Everything included in Essential Care',
      'De-ionized solar panel surface cleaning (up to 20 panels)',
      'String Voc and Isc multi-meter verification against standard test conditions',
      'Inverter MPPT tracking calibration & grid parameter audit',
      'Battery internal resistance & cell degradation report',
      'Remote monitoring connection verification & alerting reset',
      '15% discount on out-of-warranty replacement components'
    ]
  },
  {
    id: 'complete',
    name: 'Complete Industrial & Commercial SLA',
    tier: 'Complete',
    tagline: 'Continuous monitoring, priority dispatch, and full lifecycle support.',
    description: 'All-inclusive enterprise care package tailored for mission-critical commercial sites, agricultural pumps, and multi-inverter estates.',
    idealFor: 'Commercial buildings, manufacturing, and large estates.',
    slaResponse: 'Guaranteed technician dispatch within 4 hours for critical faults',
    features: [
      'Everything in Performance Optimiser (Quarterly cadence)',
      'Active weekly telemetry monitoring and proactive fault detection',
      'Dedicated standby inverter and battery module reserve',
      'Full annual statutory electrical re-certification audit',
      'Priority emergency callout with 4-hour SLA on critical outages',
      'Dedicated energy engineering account manager'
    ]
  }
];

export const RESOURCE_ARTICLES: ResourceArticle[] = [
  {
    id: 'guide-hybrid-vs-offgrid',
    title: 'Hybrid vs Off-Grid vs Grid-Tied Inverters in South Africa',
    category: 'Buying Guides',
    readTime: '6 min read',
    date: 'August 2026',
    excerpt: 'Understanding the technical differences between grid-tied, hybrid, and standalone off-grid inverter topologies under South African municipal SSEG regulations.',
    tags: ['Inverters', 'SSEG', 'South Africa'],
    content: `When designing a solar energy system for a South African home or commercial property, selecting the correct inverter architecture is the most fundamental engineering decision.

### 1. Hybrid Inverters (The Modern Standard)
Hybrid inverters (such as Deye, Sunsynk, or Victron MultiPlus-II) simultaneously manage solar PV input, AC grid power, generator input, and battery storage. During normal operation, the inverter blends solar and grid power to feed household loads while charging batteries. During grid load shedding or unplanned outages, the internal transfer switch disconnects from the grid in less than 20 milliseconds (often under 4ms), powering essential circuits without dropping sensitive electronics or Wi-Fi.

### 2. Grid-Tied Inverters (Pure Solar Offset)
Grid-tied inverters do not connect to batteries. They convert solar panel DC electricity directly into AC power synchronized with the municipal grid. However, due to anti-islanding safety regulations (SANS 10142-1-2), a standard grid-tied inverter immediately shuts down when the grid fails, meaning it provides zero power during load shedding unless coupled with a specialized AC microgrid.

### 3. Off-Grid Inverters
Off-grid systems are fully disconnected from Eskom or municipal power. They require larger battery banks and generator backup to cover prolonged overcast weather periods in winter.`
  },
  {
    id: 'guide-sseg-city-of-cape-town',
    title: 'Municipal SSEG Regulations: Johannesburg, Cape Town & Tshwane',
    category: 'Guides',
    readTime: '8 min read',
    date: 'August 2026',
    excerpt: 'A clear overview of Small-Scale Embedded Generation (SSEG) compliance, bi-directional meters, and feed-in tariff policies in major South African metros.',
    tags: ['SSEG', 'Regulations', 'Compliance'],
    content: `South African municipalities have introduced structured frameworks for Small-Scale Embedded Generation (SSEG). 

### Key Regulatory Requirements:
1. **NRS 097-2-1 Inverter Compliance**: Your inverter must be on the municipality's approved equipment list (e.g. City of Cape Town Approved Inverter List).
2. **Type II Surge Protection & AC Isolator**: Physical disconnection points accessible to municipal emergency personnel.
3. **Supplementary Certificate of Compliance (CoC)**: Signed by a certified Department of Labour Installation Electrician (IE).
4. **Bi-Directional Smart Metering**: If you plan to export excess energy for credit, a compliant 4-quadrant smart meter must be commissioned.`
  },
  {
    id: 'guide-section-12b-tax-incentive',
    title: 'Tax Incentives: SARS Section 12B & Renewable Asset Depreciation',
    category: 'Energy Tips',
    readTime: '5 min read',
    date: 'July 2026',
    excerpt: 'How commercial entities and property owners in South Africa can utilize Section 12B accelerated depreciation to reduce taxable income.',
    tags: ['Finance', 'Tax', 'Commercial'],
    content: `Under Section 12B of the South African Income Tax Act, businesses investing in solar photovoltaic equipment can claim an accelerated capital depreciation allowance against taxable income.

- **Systems under 1MW**: 100% deduction in year one for qualifying installations.
- **Cash Flow Impact**: Substantially accelerates the project payback period for commercial entities from ~5 years down to ~3 years when factoring in company income tax deductions.

*Disclaimer: Tax laws are subject to legislative amendment. Businesses should consult their registered SARS tax practitioner.*`
  },
  {
    id: 'glossary-solar-engineering',
    title: 'The South African Solar & Electrical Engineering Glossary',
    category: 'Glossary',
    readTime: '7 min read',
    date: 'August 2026',
    excerpt: 'Key technical terms demystified: kVA vs kW, Depth of Discharge (DoD), C-Rating, MPPT, SANS 10142, and CoC.',
    tags: ['Glossary', 'Engineering'],
    content: `### Essential Technical Definitions:

- **kW (Kilowatt)**: Real power actively consumed or generated.
- **kVA (Kilovolt-Ampere)**: Apparent power (combining real and reactive power). Inverters are rated in kVA; for power factor 1.0, 1 kVA = 1 kW.
- **kWh (Kilowatt-Hour)**: The total quantity of energy consumed or stored over time (e.g. running a 1,000W geyser for 1 hour consumes 1 kWh).
- **DoD (Depth of Discharge)**: The percentage of battery capacity that can be discharged safely. Modern LiFePO4 batteries allow 80% to 90% DoD without premature degradation.
- **C-Rating**: The rate at which a battery can be charged or discharged relative to its total capacity. A 1C rated 5kWh battery can deliver a full 5kW continuously; a 0.5C battery can deliver 2.5kW continuously.
- **MPPT (Maximum Power Point Tracking)**: An intelligent electronic circuit in the inverter that continuously optimizes the electrical operating point of the solar panels to extract peak power under varying sunlight and temperature conditions.
- **CoC (Certificate of Compliance)**: The legal electrical safety document required by the South African Occupational Health and Safety Act (OHSA) confirming an installation complies with SANS 10142 standards.`
  }
];

export const FAQS_DATA = [
  {
    id: 'faq-1',
    category: 'Installation & Technical',
    question: 'How does the solar installation process work from start to finish?',
    answer: 'Our process follows 8 engineering stages: Initial energy audit & usage modeling, physical roof and distribution board site assessment, tailored CAD system design, quote approval, installation scheduling, physical installation (roof arrays, cabling, inverter mounting), multi-point safety testing & commissioning, and final Certificate of Compliance (CoC) handover.'
  },
  {
    id: 'faq-2',
    category: 'Pricing & Value',
    question: 'How much does a complete solar system cost in South Africa?',
    answer: 'Costs vary according to energy requirements. A high-quality residential entry system (5kW Inverter + 5.12kWh LiFePO4 Battery + ~3.3kWp Solar Panels) typically ranges between R85,000 and R110,000 fully installed with CoC. Larger executive setups (8kW Inverter + 10kWh Battery + 5.5kWp Solar) range between R135,000 and R175,000. Commercial 3-phase systems are custom-engineered based on peak kVA demand.'
  },
  {
    id: 'faq-3',
    category: 'Installation & Technical',
    question: 'How long does a residential solar installation take on site?',
    answer: 'The physical on-site installation for a standard home system typically takes 2 to 3 days. Day 1 focuses on roof rail mounting and panel cabling. Day 2 handles inverter/battery positioning and distribution board changeover. Day 3 is dedicated to system commissioning, polarity/impedance safety checks, and client portal walkthrough.'
  },
  {
    id: 'faq-4',
    category: 'Batteries & Storage',
    question: 'Do I need batteries, or can I install solar panels only?',
    answer: 'Grid-tied solar without batteries will lower daytime electricity bills but will shut down automatically during load shedding due to safety anti-islanding regulations. If your priority is uninterrupted power during Eskom outages, a hybrid inverter paired with a LiFePO4 battery is required.'
  },
  {
    id: 'faq-5',
    category: 'Loadshedding & Grid',
    question: 'Can my solar system run heavy appliances during load shedding?',
    answer: 'Yes, provided the system is sized correctly. Critical loads (lights, Wi-Fi, refrigeration, computers, TVs, security) run seamlessly on standard 5kW systems. Heavy resistive loads (such as geysers, ovens, and large air conditioning units) are either managed via smart relays or powered during sunlight hours when solar generation exceeds demand.'
  },
  {
    id: 'faq-6',
    category: 'Lifespan & Warranty',
    question: 'How long do solar panels and lithium batteries last?',
    answer: 'Tier-1 monocrystalline solar panels carry a 25-year linear performance warranty and typically operate for 30+ years. Modern Lithium Iron Phosphate (LiFePO4) batteries carry a 10-year manufacturer warranty and provide 4,000 to 6,000 charge cycles, which equates to 12 to 15+ years of daily cycling.'
  },
  {
    id: 'faq-7',
    category: 'Maintenance & Service',
    question: 'How often does a solar system require maintenance and inspection?',
    answer: 'We recommend an annual electrical connection check, torque verification on isolators, and thermal scan of switchgear. Solar panels should be cleaned 1 to 2 times a year depending on dust and bird activity to maintain peak optical efficiency.'
  },
  {
    id: 'faq-8',
    category: 'Upgrades & Scalability',
    question: 'Can I upgrade my solar system in stages in the future?',
    answer: 'Yes. All our recommended hybrid inverters (Deye, Sunsynk, Victron) support modular expansion. You can start with a 5kW or 8kW hybrid inverter and a single 5kWh battery module, then add additional solar panels or second and third battery modules as your energy needs expand.'
  },
  {
    id: 'faq-9',
    category: 'Shop & Equipment',
    question: 'Can I purchase solar equipment without installation?',
    answer: 'Yes. Our online equipment store offers direct sales to accredited installers, contractors, and DIY property owners who have their own certified electrician. All products carry standard manufacturer warranties.'
  },
  {
    id: 'faq-10',
    category: 'Finance & Payment',
    question: 'Do you offer solar financing or rent-to-own options?',
    answer: 'We work with leading South African asset finance providers and major banking institutions who offer solar asset financing over 36, 48, or 60 months. Financing approvals and final interest rates depend on the individual client or business credit assessment.'
  },
  {
    id: 'faq-11',
    category: 'Logistics & Delivery',
    question: 'How does equipment delivery and site logistics work across South Africa?',
    answer: 'Equipment orders are dispatched via tracked courier freight directly to your site or held for scheduled installation by our technical team. Fragile items like solar panels and lithium batteries are crated and insured during transit.'
  },
  {
    id: 'faq-12',
    category: 'Project Tracking',
    question: 'How do I track my solar project or equipment order?',
    answer: 'You can enter your unique Project or Order Reference (e.g. KX-9042) into our Project Tracking tool or Customer Portal to view live milestone updates, technician assignments, scheduled dates, and compliance documentation in real time.'
  }
];
