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
      { label: 'IP Protection', value: 'IP65 (Outdoor / Indoor)' }
    ],
    compatibility: ['Freedom Won eTower / LiTE', 'Dyness A48100 / Powerbox', 'Hubble AM-2 / AM-4', 'Pylontech US3000C / US5000'],
    installationAvailable: true,
    installationPriceZAR: 8500,
    faqs: []
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
    faqs: []
  },
  // =========================================================================
  // OFFICIAL SEGEN SOLAR PV INVERTERS & ACCESSORIES (Solis Catalog)
  // =========================================================================
  {
    id: 'solis-s1-upgrader-usb',
    name: 'S1 USB Firmware Upgrade Stick',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 635.43,
    inStock: true,
    stockCount: 4,
    etaStock: '4 In Stock • No More Stock Available (Clearance)',
    sku: 'SOL-S1-UPGRADER-USB',
    warrantyYears: 2,
    image: '/cad-solar-audit.jpg',
    summary: 'Solis official S1 USB field firmware upgrade tool. Enables direct offline MCU firmware programming on-site for certified installers.',
    specs: [
      { label: 'Device Type', value: 'Firmware Upgrade Tool' },
      { label: 'Interface', value: 'USB 2.0 / RS485' },
      { label: 'Compatibility', value: 'Solis S5 & S6 Inverter Series' }
    ],
    compatibility: ['Solis S5 Series', 'Solis S6 Series'],
    installationAvailable: false,
    faqs: []
  },
  {
    id: 'solis-usb-firm-upg',
    name: 'USB Firmware Upgrade Stick 4-PIN COM Connector',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 683.71,
    inStock: true,
    stockCount: 1,
    etaStock: '1 In Stock • No More Stock Available',
    sku: 'SOL-USB-FIRM-UPG',
    warrantyYears: 2,
    image: '/cad-solar-audit.jpg',
    summary: 'Dedicated 4-PIN COM port firmware flashing tool for Solis commercial and residential hybrid inverters.',
    specs: [
      { label: 'Port Type', value: '4-PIN COM Terminal' },
      { label: 'Application', value: 'DSP & HMI Firmware Update' }
    ],
    compatibility: ['All Solis COM-port Inverters'],
    installationAvailable: false,
    faqs: []
  },
  {
    id: 'solis-war-10y-2-5-8-0',
    name: 'Warranty Ext. of 5 years (Total 10y) for 2.5 to 8.0kW',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 1115.89,
    inStock: true,
    stockCount: 999,
    etaStock: 'Order Online (Immediate Certificate Registration)',
    sku: 'SOL-WAR-10Y-2.5-8.0',
    warrantyYears: 10,
    image: '/solar-protection-panel.jpg',
    summary: 'Official Solis factory warranty extension adding 5 additional years (10 years total) for single-phase inverters from 2.5kW to 8.0kW.',
    specs: [
      { label: 'Coverage Duration', value: '10 Years Total (+5 Years Extended)' },
      { label: 'Supported Capacity', value: '2.5kW to 8.0kW Models' }
    ],
    compatibility: ['Solis 2.5kW - 8.0kW Inverters'],
    installationAvailable: false,
    faqs: []
  },
  {
    id: 'solis-war-10y-s6-eh1p5k',
    name: 'Warranty Ext. of 5 years (Total 10y) for S6 Pro 5kW Hybrid',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 1115.89,
    inStock: true,
    stockCount: 999,
    etaStock: 'Order Online (Immediate Certificate Registration)',
    sku: 'SOL-WAR-10Y-S6-EH1P5K',
    warrantyYears: 10,
    image: '/solar-protection-panel.jpg',
    summary: 'Official Solis 10-year warranty extension pack specifically for S6 Pro 5kW Hybrid Inverter series.',
    specs: [
      { label: 'Coverage Duration', value: '10 Years Total' },
      { label: 'Model', value: 'Solis S6 Pro 5kW Hybrid' }
    ],
    compatibility: ['Solis S6 Pro 5kW Hybrid'],
    installationAvailable: false,
    faqs: []
  },
  {
    id: 'solis-war-10y-s6-eh1p6k',
    name: 'Warranty Ext. of 5 years (Total 10y) for S6 Pro 6kW Hybrid',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 1115.89,
    inStock: true,
    stockCount: 999,
    etaStock: 'Order Online (Immediate Certificate Registration)',
    sku: 'SOL-WAR-10Y-S6-EH1P6K',
    warrantyYears: 10,
    image: '/solar-protection-panel.jpg',
    summary: 'Official Solis 10-year warranty extension pack specifically for S6 Pro 6kW Hybrid Inverter series.',
    specs: [
      { label: 'Coverage Duration', value: '10 Years Total' },
      { label: 'Model', value: 'Solis S6 Pro 6kW Hybrid' }
    ],
    compatibility: ['Solis S6 Pro 6kW Hybrid'],
    installationAvailable: false,
    faqs: []
  },
  {
    id: 'solis-war-10y-3-20k',
    name: 'Warranty Ext. of 5 years (Total 10y) for 3-20kW',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 1580.85,
    inStock: true,
    stockCount: 999,
    etaStock: 'Order Online (Immediate Certificate Registration)',
    sku: 'SOL-WAR-10Y-3-20K',
    warrantyYears: 10,
    image: '/solar-protection-panel.jpg',
    summary: 'Factory warranty extension package covering Solis 3-Phase inverters from 3kW up to 20kW capacity.',
    specs: [
      { label: 'Coverage Duration', value: '10 Years Total' },
      { label: 'Power Range', value: '3kW - 20kW' }
    ],
    compatibility: ['Solis 3kW to 20kW Inverters'],
    installationAvailable: false,
    faqs: []
  },
  {
    id: 'solis-war-10y-rhi',
    name: 'Warranty Ext. of 5 years (Total 10y) for S5 or 5G RHI Hybrid and RAI AC coupled',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 1580.85,
    inStock: true,
    stockCount: 999,
    etaStock: 'Order Online (Immediate Certificate Registration)',
    sku: 'SOL-WAR-10Y-RHI',
    warrantyYears: 10,
    image: '/solar-protection-panel.jpg',
    summary: 'Comprehensive 10-year extended warranty certificate for Solis S5/5G RHI hybrid and RAI AC coupled battery inverters.',
    specs: [
      { label: 'Coverage Duration', value: '10 Years Total' },
      { label: 'Hardware', value: 'RHI Hybrid & RAI AC Coupled' }
    ],
    compatibility: ['Solis S5 RHI', 'Solis 5G RHI', 'Solis RAI AC Coupled'],
    installationAvailable: false,
    faqs: []
  },
  {
    id: 'solis-war-10y-s6-eh1p8k',
    name: 'Warranty Ext. of 5 years (Total 10y) for S6 Pro 8kW Hybrid',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 1859.82,
    inStock: true,
    stockCount: 999,
    etaStock: 'Order Online (Immediate Certificate Registration)',
    sku: 'SOL-WAR-10Y-S6-EH1P8K',
    warrantyYears: 10,
    image: '/solar-protection-panel.jpg',
    summary: 'Extended 10-year warranty registration for Solis S6 Pro 8kW Hybrid Inverter.',
    specs: [
      { label: 'Coverage Duration', value: '10 Years Total' },
      { label: 'Model', value: 'Solis S6 Pro 8kW Hybrid' }
    ],
    compatibility: ['Solis S6 Pro 8kW Hybrid'],
    installationAvailable: false,
    faqs: []
  },
  {
    id: 'solis-war-10y-s6-eh1p12k',
    name: 'Warranty Ext. of 5 years (Total 10y) for S6 1PH 12kW Hybrid',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 2343.37,
    inStock: true,
    stockCount: 999,
    etaStock: 'Order Online (Immediate Certificate Registration)',
    sku: 'SOL-WAR-10Y-S6-EH1P12K',
    warrantyYears: 10,
    image: '/solar-protection-panel.jpg',
    summary: 'Official 10-year factory warranty extension for heavy residential Solis S6 Single Phase 12kW Hybrid Inverters.',
    specs: [
      { label: 'Coverage Duration', value: '10 Years Total' },
      { label: 'Model', value: 'Solis S6 1PH 12kW Hybrid' }
    ],
    compatibility: ['Solis S6 1PH 12kW Hybrid'],
    installationAvailable: false,
    faqs: []
  },
  {
    id: 'solis-war-10y-s6-eh3p12k',
    name: 'Warranty Ext. of 5 years (Total 10y) for S6 3PH 12kW Hybrid',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 4128.79,
    inStock: true,
    stockCount: 999,
    etaStock: 'Order Online (Immediate Certificate Registration)',
    sku: 'SOL-WAR-10Y-S6-EH3P12K',
    warrantyYears: 10,
    image: '/solar-protection-panel.jpg',
    summary: 'Extended 10-year warranty protection for Solis S6 3-Phase 12kW Hybrid Inverters.',
    specs: [
      { label: 'Coverage Duration', value: '10 Years Total' },
      { label: 'Phase', value: '3-Phase 400V' }
    ],
    compatibility: ['Solis S6 3PH 12kW Hybrid'],
    installationAvailable: false,
    faqs: []
  },
  {
    id: 'solis-war-10y-25-40k-s5',
    name: 'Warranty Ext. of 5 years (Total 10y) for 25, 30, 36 & 40kW S5 and S6',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 4463.56,
    inStock: true,
    stockCount: 999,
    etaStock: 'Order Online (Immediate Certificate Registration)',
    sku: 'SOL-WAR-10Y-25-40K-S5',
    warrantyYears: 10,
    image: '/solar-protection-panel.jpg',
    summary: 'Commercial 10-year extended warranty covering Solis 25kW, 30kW, 36kW, and 40kW S5 and S6 series.',
    specs: [
      { label: 'Coverage Duration', value: '10 Years Total' },
      { label: 'Applicable Range', value: '25kW - 40kW Commercial' }
    ],
    compatibility: ['Solis S5/S6 25kW-40kW'],
    installationAvailable: false,
    faqs: []
  },
  {
    id: 'solis-war-10y-s6-eh3p15k',
    name: 'Warranty Ext. of 5 years (Total 10y) for S6 3PH 15kW Hybrid',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 4463.56,
    inStock: true,
    stockCount: 999,
    etaStock: 'Order Online (Immediate Certificate Registration)',
    sku: 'SOL-WAR-10Y-S6-EH3P15K',
    warrantyYears: 10,
    image: '/solar-protection-panel.jpg',
    summary: 'Extended 10-year factory warranty coverage for Solis S6 3-Phase 15kW Hybrid commercial inverters.',
    specs: [
      { label: 'Coverage Duration', value: '10 Years Total' },
      { label: 'Model', value: 'S6 3PH 15kW Hybrid' }
    ],
    compatibility: ['Solis S6 3PH 15kW Hybrid'],
    installationAvailable: false,
    faqs: []
  },
  {
    id: 'solis-war-10y-eh3p30k',
    name: 'Warranty Ext. of 5 years (Total 10y) for S6 30kW Hybrid Inverter',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 5858.42,
    inStock: true,
    stockCount: 999,
    etaStock: 'Order Online (Immediate Certificate Registration)',
    sku: 'SOL-WAR-10Y-EH3P30K',
    warrantyYears: 10,
    image: '/solar-protection-panel.jpg',
    summary: '10-Year commercial warranty package for Solis S6 30kW high-voltage hybrid battery inverters.',
    specs: [
      { label: 'Coverage Duration', value: '10 Years Total' },
      { label: 'Model', value: 'S6 30kW Hybrid Inverter' }
    ],
    compatibility: ['Solis S6 30kW Hybrid Inverter'],
    installationAvailable: false,
    faqs: []
  },
  {
    id: 'solis-4-6-s6-dt-dc',
    name: 'S6 4.6kW 2MPPT 1PH Inverter - with DC',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 6111.01,
    pricePerWpZAR: 1.328,
    inStock: true,
    stockCount: 32,
    etaStock: '32 In Stock • 6 Due: 01 Oct 2026',
    sku: 'SOL-4.6-S6-DT-DC',
    ratingKw: 4.6,
    warrantyYears: 5,
    image: '/hybrid-inverter-deye.jpg',
    summary: 'Compact residential S6 4.6kW single-phase grid-tied inverter with dual MPPTs, integrated DC disconnect switch, and ultra-high 97.7% peak efficiency.',
    specs: [
      { label: 'Rated AC Output Power', value: '4,600 W' },
      { label: 'Price per Watt', value: 'R 1.328 / W' },
      { label: 'MPPT Trackers', value: '2 MPPTs (1+1 String)' },
      { label: 'Max PV Input Voltage', value: '600 V DC' },
      { label: 'DC Disconnect', value: 'Integrated Rotary DC Switch' },
      { label: 'Protection Rating', value: 'IP66' }
    ],
    compatibility: ['Canadian Solar', 'JA Solar', 'Jinko', 'Trina Modules'],
    installationAvailable: true,
    installationPriceZAR: 6500,
    faqs: []
  },
  {
    id: 'solis-war-10y-50-60k',
    name: 'Warranty Ext. of 5 years (Total 10y) for 50 to 60kW',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 6695.34,
    inStock: true,
    stockCount: 999,
    etaStock: 'Order Online (Immediate Certificate Registration)',
    sku: 'SOL-WAR-10Y-50-60K',
    warrantyYears: 10,
    image: '/solar-protection-panel.jpg',
    summary: 'Commercial 10-year extended warranty for Solis 50kW and 60kW utility solar grid-tied inverters.',
    specs: [
      { label: 'Coverage Duration', value: '10 Years Total' },
      { label: 'Power Range', value: '50kW - 60kW Commercial' }
    ],
    compatibility: ['Solis 50kW / 60kW Inverters'],
    installationAvailable: false,
    faqs: []
  },
  {
    id: 'solis-war-10y-eh3p50k',
    name: 'Warranty Ext. of 5 years (Total 10y) for S6 50kW Hybrid Inverter',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 8157.12,
    inStock: true,
    stockCount: 999,
    etaStock: 'Order Online (Immediate Certificate Registration)',
    sku: 'SOL-WAR-10Y-EH3P50K',
    warrantyYears: 10,
    image: '/solar-protection-panel.jpg',
    summary: 'Factory warranty extension certificate for commercial flagship Solis S6 50kW Hybrid energy storage inverters.',
    specs: [
      { label: 'Coverage Duration', value: '10 Years Total' },
      { label: 'Model', value: 'S6 50kW Hybrid Inverter' }
    ],
    compatibility: ['Solis S6 50kW Hybrid'],
    installationAvailable: false,
    faqs: []
  },
  {
    id: 'solis-war-10y-110k',
    name: 'Warranty Ext. of 5 years (Total 10 years) for 110kW',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 8927.12,
    inStock: true,
    stockCount: 999,
    etaStock: 'Order Online (Immediate Certificate Registration)',
    sku: 'SOL-WAR-10Y-110K',
    warrantyYears: 10,
    image: '/solar-protection-panel.jpg',
    summary: 'Industrial warranty extension providing 10 years total coverage for Solis 110kW utility inverters.',
    specs: [
      { label: 'Coverage Duration', value: '10 Years Total' },
      { label: 'Capacity', value: '110kW Utility Range' }
    ],
    compatibility: ['Solis 110kW Inverters'],
    installationAvailable: false,
    faqs: []
  },
  {
    id: 'solis-war-10y-s6-gc80-110k',
    name: 'Warranty Ext. of 5 years (Total 10y) for S6 GC80 to 110kW',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 8927.12,
    inStock: true,
    stockCount: 999,
    etaStock: 'Order Online (Immediate Certificate Registration)',
    sku: 'SOL-WAR-10Y-S6-GC80-110K',
    warrantyYears: 10,
    image: '/solar-protection-panel.jpg',
    summary: 'Official extended warranty for the new Solis S6 generation GC80kW through GC110kW commercial inverters.',
    specs: [
      { label: 'Coverage Duration', value: '10 Years Total' },
      { label: 'Series', value: 'Solis S6 GC80 - 110kW' }
    ],
    compatibility: ['Solis S6 GC80k - 110kW'],
    installationAvailable: false,
    faqs: []
  },
  {
    id: 'solis-war-10y-s6-gc150k',
    name: 'Warranty Ext. of 5 years (Total 10y) for S6 GC150kW',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 10638.15,
    inStock: true,
    stockCount: 999,
    etaStock: 'Order Online (Immediate Certificate Registration)',
    sku: 'SOL-WAR-10Y-S6-GC150K',
    warrantyYears: 10,
    image: '/solar-protection-panel.jpg',
    summary: '10-Year industrial warranty certificate for the flagship Solis S6 150kW commercial 3-phase grid-tied inverter.',
    specs: [
      { label: 'Coverage Duration', value: '10 Years Total' },
      { label: 'Capacity', value: '150kW Industrial' }
    ],
    compatibility: ['Solis S6 GC150kW'],
    installationAvailable: false,
    faqs: []
  },
  {
    id: 'solis-war-10y-eh3p80k',
    name: 'Warranty Ext. of 5 years (Total 10y) for S6 80kW Hybrid Inverter',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 15957.23,
    inStock: true,
    stockCount: 999,
    etaStock: 'Order Online (Immediate Certificate Registration)',
    sku: 'SOL-WAR-10Y-EH3P80K',
    warrantyYears: 10,
    image: '/solar-protection-panel.jpg',
    summary: 'Extended 10-year warranty coverage for Solis S6 80kW high-voltage commercial energy storage inverters.',
    specs: [
      { label: 'Coverage Duration', value: '10 Years Total' },
      { label: 'Hardware', value: 'S6 80kW Hybrid Inverter' }
    ],
    compatibility: ['Solis S6 80kW Hybrid'],
    installationAvailable: false,
    faqs: []
  },
  {
    id: 'solis-war-15y-eh3p50k',
    name: 'Warranty Ext. of 10 years (Total 15y) for 50kW S6 Hybrid Inverter',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 20756.78,
    inStock: true,
    stockCount: 999,
    etaStock: 'Order Online (Immediate Certificate Registration)',
    sku: 'SOL-WAR-15Y-EH3P50K',
    warrantyYears: 15,
    image: '/solar-protection-panel.jpg',
    summary: 'Ultra-long 15-year total warranty security for Solis 50kW S6 commercial hybrid inverters.',
    specs: [
      { label: 'Coverage Duration', value: '15 Years Total' },
      { label: 'Hardware', value: '50kW S6 Hybrid Inverter' }
    ],
    compatibility: ['Solis 50kW S6 Hybrid'],
    installationAvailable: false,
    faqs: []
  },
  {
    id: 'solis-war-10y-eh3p125k',
    name: 'Warranty Ext. of 5 years (Total 10y) for S6 125kW Hybrid Inverter',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 21759.86,
    inStock: true,
    stockCount: 999,
    etaStock: 'Order Online (Immediate Certificate Registration)',
    sku: 'SOL-WAR-10Y-EH3P125K',
    warrantyYears: 10,
    image: '/solar-protection-panel.jpg',
    summary: 'Official 10-year warranty certificate for the massive Solis S6 125kW commercial hybrid inverter.',
    specs: [
      { label: 'Coverage Duration', value: '10 Years Total' },
      { label: 'Hardware', value: 'S6 125kW Hybrid Inverter' }
    ],
    compatibility: ['Solis S6 125kW Hybrid'],
    installationAvailable: false,
    faqs: []
  },
  {
    id: 'solis-s5-gr3p-20k-dc',
    name: '20kW S5 3 Phase Dual MPPT - DC',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 22595.24,
    pricePerWpZAR: 1.130,
    inStock: true,
    stockCount: 16,
    etaStock: '16 In Stock • No More Stock Available',
    sku: 'SOL-S5-GR3P-20K-DC',
    ratingKw: 20.0,
    warrantyYears: 5,
    image: '/hybrid-inverter-deye.jpg',
    summary: 'High-efficiency 20kW S5 commercial 3-phase grid-tied inverter with dual MPPTs, integrated DC switch, AFCI protection, and 98.7% max efficiency.',
    specs: [
      { label: 'Continuous AC Power', value: '20,000 W' },
      { label: 'Price per Watt', value: 'R 1.130 / W' },
      { label: 'MPPT Trackers', value: '2 MPPT (2+2 Strings)' },
      { label: 'Max DC Input Voltage', value: '1,100 V' },
      { label: 'Protection', value: 'AFCI DC Arc Fault Mitigation' },
      { label: 'IP Rating', value: 'IP66' }
    ],
    compatibility: ['Solis Cloud Monitoring', 'Canadian Solar', 'JA Solar', 'Jinko 600W+'],
    installationAvailable: true,
    installationPriceZAR: 9500,
    faqs: []
  },
  {
    id: 'solis-war-20y-25-40k-s5',
    name: 'Warranty Ext. of 15 years (Total 20y) for 25, 30, 36 & 40kW S5',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 30213.22,
    inStock: true,
    stockCount: 999,
    etaStock: 'Order Online (Immediate Certificate Registration)',
    sku: 'SOL-WAR-20Y-25-40K-S5',
    warrantyYears: 20,
    image: '/solar-protection-panel.jpg',
    summary: 'Ultimate 20-year lifetime warranty protection for Solis commercial 25kW - 40kW S5 series.',
    specs: [
      { label: 'Coverage Duration', value: '20 Years Total Lifetime' },
      { label: 'Series', value: '25kW, 30kW, 36kW & 40kW S5' }
    ],
    compatibility: ['Solis 25kW - 40kW S5'],
    installationAvailable: false,
    faqs: []
  },
  {
    id: 'solis-s6-gc3p30k03-nv-nd',
    name: '30kW S6 3PH Grid-Tied Inverter - 3-MPPT',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 31863.75,
    pricePerWpZAR: 1.062,
    inStock: true,
    stockCount: 5,
    etaStock: 'Stock availability on request! Call us! (Clearance)',
    sku: 'SOL-S6-GC3P30K03-NV-ND',
    ratingKw: 30.0,
    warrantyYears: 5,
    image: '/battery-inverter-room.jpg',
    summary: '30kW S6 commercial 3-phase grid-tied inverter featuring 3 independent MPPT trackers with 16A string current capability, ideal for high-power 600W+ bifacial modules.',
    specs: [
      { label: 'Continuous AC Power', value: '30,000 W' },
      { label: 'Price per Watt', value: 'R 1.062 / W' },
      { label: 'MPPT Trackers', value: '3 MPPTs (2 strings each)' },
      { label: 'Efficiency', value: '98.5%' },
      { label: 'Night Consumption', value: '< 1 W' }
    ],
    compatibility: ['Commercial Roof Top Arrays', 'JA Solar 600W', 'Trina 630W'],
    installationAvailable: true,
    installationPriceZAR: 11000,
    faqs: []
  },
  {
    id: 'solis-s5-gc40k-dc',
    name: '40kW S5 3 Phase Quad MPPT - DC',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 36406.69,
    pricePerWpZAR: 0.910,
    inStock: true,
    stockCount: 1,
    etaStock: '1 In Stock • No More Stock Available',
    sku: 'SOL-S5-GC40K-DC',
    ratingKw: 40.0,
    warrantyYears: 5,
    image: '/battery-inverter-room.jpg',
    summary: 'Industrial 40kW S5 3-phase inverter equipped with 4 independent MPPT trackers and integrated DC switchgear for complex multi-pitch commercial roofs.',
    specs: [
      { label: 'Continuous AC Output', value: '40,000 W' },
      { label: 'Price per Watt', value: 'R 0.910 / W' },
      { label: 'MPPT Trackers', value: '4 MPPTs (8 Strings Total)' },
      { label: 'Max Efficiency', value: '98.7%' }
    ],
    compatibility: ['Agro-Processing Plants', 'Commercial Factory Roofs'],
    installationAvailable: true,
    installationPriceZAR: 12500,
    faqs: []
  },
  {
    id: 'solis-s6-gc3p50k-nv-nd',
    name: '50kW S6 3PH Grid-Tied Inverter - 4-MPPT',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 38219.11,
    pricePerWpZAR: 0.764,
    inStock: true,
    stockCount: 1,
    etaStock: '1 In Stock • 3 Due: 01 Oct 2026',
    sku: 'SOL-S6-GC3P50K-NV-ND',
    ratingKw: 50.0,
    warrantyYears: 5,
    image: '/battery-inverter-room.jpg',
    summary: 'Next-gen S6 50kW commercial inverter with 4 MPPTs, intelligent I-V curve diagnostics, Type II AC/DC surge protection, and 16A string current rating.',
    specs: [
      { label: 'Continuous AC Output', value: '50,000 W' },
      { label: 'Price per Watt', value: 'R 0.764 / W' },
      { label: 'MPPT Count', value: '4 MPPTs (8 Strings)' },
      { label: 'Max DC Voltage', value: '1,100 V DC' },
      { label: 'Grid Tie Certification', value: 'NRS 097-2-1 SABS Approved' }
    ],
    compatibility: ['Commercial SSEG Installations', 'Trina 630W Bifacial', 'Jinko 620W'],
    installationAvailable: true,
    installationPriceZAR: 14500,
    faqs: []
  },
  {
    id: 'solis-s6-gc3p60k-nv-nd',
    name: '60kW S6 3PH Grid-Tied Inverter - 5-MPPT',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 38422.55,
    pricePerWpZAR: 0.640,
    inStock: true,
    stockCount: 3,
    etaStock: '3 In Stock • No More Stock Available',
    sku: 'SOL-S6-GC3P60K-NV-ND',
    ratingKw: 60.0,
    warrantyYears: 5,
    image: '/battery-inverter-room.jpg',
    summary: 'High-power 60kW S6 3-phase grid-tied inverter featuring 5 MPPT trackers with 10 string inputs for maximum layout flexibility.',
    specs: [
      { label: 'Continuous AC Output', value: '60,000 W' },
      { label: 'Price per Watt', value: 'R 0.640 / W' },
      { label: 'MPPT Trackers', value: '5 MPPTs (10 Strings)' },
      { label: 'Max Efficiency', value: '98.7%' }
    ],
    compatibility: ['Large Commercial & Industrial Solar Farms'],
    installationAvailable: true,
    installationPriceZAR: 15500,
    faqs: []
  },
  {
    id: 'solis-war-20y-eh3p50k',
    name: 'Warranty Ext. of 15 years (Total 20y) for 50kW Hybrid Inverter',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 41532.12,
    inStock: true,
    stockCount: 999,
    etaStock: 'Order Online (Immediate Certificate Registration)',
    sku: 'SOL-WAR-20Y-EH3P50K',
    warrantyYears: 20,
    image: '/solar-protection-panel.jpg',
    summary: '20-Year ultimate warranty protection package for Solis 50kW commercial hybrid battery storage inverters.',
    specs: [
      { label: 'Coverage Duration', value: '20 Years Total' },
      { label: 'Equipment', value: '50kW Hybrid Inverter' }
    ],
    compatibility: ['Solis 50kW Hybrid'],
    installationAvailable: false,
    faqs: []
  },
  {
    id: 'solis-s6-gc80k',
    name: 'S6 80kW 3 Phase Grid Tied Inverter with 8x MPPT',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 49564.05,
    pricePerWpZAR: 0.620,
    inStock: true,
    stockCount: 13,
    etaStock: '13 In Stock • No More Stock Available',
    sku: 'SOL-S6-GC80K',
    ratingKw: 80.0,
    warrantyYears: 5,
    image: '/battery-inverter-room.jpg',
    summary: 'Heavy utility S6 80kW 3-phase grid-tied inverter with 8 MPPTs, Type II SPD on both AC and DC, smart string monitoring, and anti-PID technology.',
    specs: [
      { label: 'Nominal AC Output', value: '80,000 W' },
      { label: 'Price per Watt', value: 'R 0.620 / W' },
      { label: 'MPPT Trackers', value: '8 MPPTs (16 Strings)' },
      { label: 'Max Input Voltage', value: '1,100 V DC' },
      { label: 'Cooling', value: 'Intelligent Redundant Fan Cooling' }
    ],
    compatibility: ['Industrial Solar Farms & Large Warehouses'],
    installationAvailable: true,
    installationPriceZAR: 18000,
    faqs: []
  },
  {
    id: 'solis-s6-gc110k',
    name: 'S6 110kW 3 Phase Grid Tied Inverter with 10x MPPT',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 54384.85,
    pricePerWpZAR: 0.494,
    inStock: true,
    stockCount: 51,
    etaStock: '51 In Stock • 6 Due: 01 Oct 2026',
    sku: 'SOL-S6-GC110K',
    ratingKw: 110.0,
    warrantyYears: 5,
    image: '/battery-inverter-room.jpg',
    summary: 'Industry-leading 110kW utility string inverter with 10 independent MPPTs, 98.7% peak efficiency, smart IV curve scanning, and night SVG reactive power compensation.',
    specs: [
      { label: 'Continuous AC Power', value: '110,000 W' },
      { label: 'Price per Watt', value: 'R 0.494 / W' },
      { label: 'MPPT Trackers', value: '10 MPPTs (20 Strings)' },
      { label: 'DC/AC Ratio', value: 'Up to 150%' },
      { label: 'String Current', value: '16 A per string' },
      { label: 'Enclosure Rating', value: 'IP66' }
    ],
    compatibility: ['Utility Scale Ground Mounts', 'Commercial Mega-Rooftops'],
    installationAvailable: true,
    installationPriceZAR: 22000,
    faqs: []
  },
  {
    id: 'solis-110-0-3ph-5g-dc',
    name: '110kW 5G 3 Phase 10x MPPT - DC',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 58852.48,
    pricePerWpZAR: 0.535,
    inStock: true,
    stockCount: 11,
    etaStock: '11 In Stock • No More Stock Available (Clearance)',
    sku: 'SOL-110.0-3PH-5G-DC',
    ratingKw: 110.0,
    warrantyYears: 5,
    image: '/battery-inverter-room.jpg',
    summary: 'Massive 110kW 5G commercial inverter with 10x MPPT string tracking, integrated DC disconnect switch, and IP66 industrial ruggedization.',
    specs: [
      { label: 'Continuous AC Power', value: '110,000 W' },
      { label: 'Price per Watt', value: 'R 0.535 / W' },
      { label: 'MPPT Trackers', value: '10 MPPTs' },
      { label: 'Efficiency', value: '98.7%' }
    ],
    compatibility: ['Industrial Solar Farms'],
    installationAvailable: true,
    installationPriceZAR: 22000,
    faqs: []
  },
  {
    id: 'solis-s6-gc150k',
    name: 'S6 150kW 3 Phase Grid Tied Inverter 7x MPPT',
    brand: 'Solis',
    category: 'inverters',
    priceZAR: 77869.28,
    pricePerWpZAR: 0.519,
    inStock: true,
    stockCount: 13,
    etaStock: '12 Due: 01 Oct 2026 • 1 Due: 06 Oct 2026',
    sku: 'SOL-S6-GC150K',
    ratingKw: 150.0,
    warrantyYears: 5,
    image: '/battery-inverter-room.jpg',
    summary: 'The ultimate commercial powerplant inverter. 150kW continuous AC output, 7 MPPT trackers supporting up to 48A MPPT current, and night-time SVG reactive power support.',
    specs: [
      { label: 'Rated AC Output Power', value: '150,000 W' },
      { label: 'Price per Watt', value: 'R 0.519 / W' },
      { label: 'MPPT Count', value: '7 MPPTs (14 Strings)' },
      { label: 'Max Efficiency', value: '98.8%' },
      { label: 'DC Voltage Range', value: '180V - 1,000V DC' },
      { label: 'Communication', value: 'RS485 / GPRS / Wi-Fi / PLC optional' }
    ],
    compatibility: ['Utility-Scale Commercial Plants', 'Shopping Malls', 'Mining Solar Operations'],
    installationAvailable: true,
    installationPriceZAR: 28000,
    faqs: []
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
  // =========================================================================
  // OFFICIAL SEGEN SOLAR PV PANELS (Supplier Catalog)
  // =========================================================================
  {
    id: 'cinco-50w-cncc50p-36',
    name: 'Cinco 50W 36 Cell Poly Solar Panel Off-Grid',
    brand: 'Cinco Solar',
    category: 'solar-panels',
    priceZAR: 364.50,
    pricePerWpZAR: 7.290,
    dimensions: '510 x 695 mm',
    cellCount: 36,
    inStock: false,
    stockCount: 0,
    etaStock: '666 Due: 03 Nov 2026 (No More Stock Available)',
    sku: 'CNCC50P-36',
    ratingKw: 0.05,
    warrantyYears: 10,
    image: '/solar-panel-mono.jpg',
    summary: 'Compact 50W polycrystalline 36-cell solar panel engineered for 12V off-grid telemetry, electric fencing, CCTV backup, and gate motor battery maintainers.',
    specs: [
      { label: 'Rated Maximum Power (Pmax)', value: '50 W' },
      { label: 'Price per Watt peak', value: 'R 7.290 / Wp' },
      { label: 'Dimensions', value: '510 x 695 mm' },
      { label: 'Cell Technology', value: '36-Cell Polycrystalline' },
      { label: 'System Voltage', value: '12V DC Native' },
      { label: 'Frame', value: 'Anodized Aluminium' }
    ],
    compatibility: ['12V Solar Charge Controllers', 'Victron Energy BlueSolar', 'Gate & Security DB Enclosures'],
    installationAvailable: true,
    installationPriceZAR: 450,
    faqs: []
  },
  {
    id: 'cinco-100w-cncc100p-36',
    name: 'Cinco 100W 36 Cell Poly Solar Panel Off-Grid',
    brand: 'Cinco Solar',
    category: 'solar-panels',
    priceZAR: 677.49,
    pricePerWpZAR: 6.775,
    dimensions: '680 x 995 mm',
    cellCount: 36,
    inStock: true,
    stockCount: 76,
    etaStock: '320 Due: 03 Nov 2026',
    sku: 'CNCC100P-36',
    ratingKw: 0.10,
    warrantyYears: 10,
    image: '/solar-panel-mono.jpg',
    summary: 'Reliable 100W polycrystalline solar module for rural electrification, marine, caravan auxiliary batteries, and remote lighting installations.',
    specs: [
      { label: 'Rated Maximum Power (Pmax)', value: '100 W' },
      { label: 'Price per Watt peak', value: 'R 6.775 / Wp' },
      { label: 'Dimensions', value: '680 x 995 mm' },
      { label: 'Cell Type', value: '36 Poly Cells' },
      { label: 'Junction Box', value: 'IP65 Weatherproof with bypass diodes' }
    ],
    compatibility: ['12V / 24V PWM & MPPT Regulators', 'Lithium & Lead-Acid Off-Grid Banks'],
    installationAvailable: true,
    installationPriceZAR: 450,
    faqs: []
  },
  {
    id: 'cinco-160w-cncc160p-36',
    name: 'Cinco 160W 36 Cell Poly Solar Panel Off-Grid',
    brand: 'Cinco Solar',
    category: 'solar-panels',
    priceZAR: 874.64,
    pricePerWpZAR: 5.466,
    dimensions: '680 x 1480 mm',
    cellCount: 36,
    inStock: true,
    stockCount: 156,
    etaStock: '70 Due: 03 Nov 2026',
    sku: 'CNCC160P-36',
    ratingKw: 0.16,
    warrantyYears: 10,
    image: '/solar-panel-mono.jpg',
    summary: 'High-yield 160W polycrystalline solar module optimized for off-grid cabins, telecom repeater stations, and mobile solar trailers.',
    specs: [
      { label: 'Rated Maximum Power (Pmax)', value: '160 W' },
      { label: 'Price per Watt peak', value: 'R 5.466 / Wp' },
      { label: 'Dimensions', value: '680 x 1480 mm' },
      { label: 'Nominal Operating Voltage', value: '18.2 V' },
      { label: 'Short Circuit Current', value: '9.35 A' }
    ],
    compatibility: ['Victron SmartSolar', 'Microcare MPPTs', '12V / 24V Battery Banks'],
    installationAvailable: true,
    installationPriceZAR: 550,
    faqs: []
  },
  {
    id: 'cinco-200w-cncb200m-64',
    name: 'Cinco 200W 64 Cell Solar Panel Off-Grid',
    brand: 'Cinco Solar',
    category: 'solar-panels',
    priceZAR: 963.04,
    pricePerWpZAR: 4.815,
    dimensions: '808 x 1580 mm',
    cellCount: 64,
    inStock: true,
    stockCount: 54,
    etaStock: '1 Due: 01 Jan 2100',
    sku: 'CNCB200M-64',
    ratingKw: 0.20,
    warrantyYears: 12,
    image: '/solar-panel-mono.jpg',
    summary: 'Premium 200W monocrystalline 64-cell module delivering superior low-light yield and compact footprint for off-grid setups.',
    specs: [
      { label: 'Rated Maximum Power (Pmax)', value: '200 W' },
      { label: 'Price per Watt peak', value: 'R 4.815 / Wp' },
      { label: 'Dimensions', value: '808 x 1580 mm' },
      { label: 'Cell Type', value: '64 Monocrystalline Cells' },
      { label: 'Efficiency', value: '19.8%' }
    ],
    compatibility: ['All Standard 48V / 24V MPPT String Chargers'],
    installationAvailable: true,
    installationPriceZAR: 550,
    faqs: []
  },
  {
    id: 'ja-solar-465w-jam54d',
    name: 'JA Solar 465W N-type Double Glass Monofacial LR Traceable Low Carbon 54 Cell Black Frame MC4',
    brand: 'JA Solar',
    category: 'solar-panels',
    priceZAR: 1245.53,
    pricePerWpZAR: 2.679,
    dimensions: '1134 x 1762 mm',
    cellCount: 54,
    inStock: true,
    stockCount: 81,
    etaStock: '29 Due: 29 Sep 2026',
    sku: 'JAM54D-40-465-LR-TSLC-MC4',
    ratingKw: 0.465,
    warrantyYears: 25,
    image: '/solar-panel-mono.jpg',
    summary: 'Next-generation N-type double glass 465W module featuring sleek black anodized frame, ultra-low carbon traceability, and zero light-induced degradation (LID).',
    specs: [
      { label: 'Rated Maximum Power (Pmax)', value: '465 W' },
      { label: 'Price per Watt peak', value: 'R 2.679 / Wp' },
      { label: 'Dimensions', value: '1134 x 1762 mm' },
      { label: 'Cell Technology', value: 'N-type TOPCon Double Glass' },
      { label: 'Connector Type', value: 'Genuine Stäubli MC4' },
      { label: 'Frame Design', value: 'Black Anodized Architectural Frame' },
      { label: 'Product Warranty', value: '15 Years Materials / 30 Years Linear Power' }
    ],
    compatibility: ['Deye Hybrid Inverters', 'Sunsynk 5kW/8kW', 'Renusol VarioSole Rails'],
    installationAvailable: true,
    installationPriceZAR: 650,
    faqs: []
  },
  {
    id: 'jinko-585w-jkm585n',
    name: 'Jinko 585W Tiger Neo N-Type TOPCon 72 Cell Dual Glass Bifacial Silver Frame JK03M',
    brand: 'Jinko',
    category: 'solar-panels',
    priceZAR: 1421.98,
    pricePerWpZAR: 2.431,
    dimensions: '1134 x 2278 mm',
    cellCount: 72,
    inStock: true,
    stockCount: 61,
    etaStock: 'No More Stock Available (High Velocity)',
    sku: 'JKM585N-72HL4-BDV-SF-JK03M',
    ratingKw: 0.585,
    warrantyYears: 30,
    image: '/solar-panel-mono.jpg',
    summary: 'Tier-1 Tiger Neo 585W bifacial dual glass module powered by N-Type TOPCon cells. Captures up to 25% additional rear-side irradiance on light roofs.',
    specs: [
      { label: 'Rated Maximum Power (Pmax)', value: '585 W' },
      { label: 'Price per Watt peak', value: 'R 2.431 / Wp' },
      { label: 'Dimensions', value: '1134 x 2278 mm' },
      { label: 'Bifaciality Factor', value: '80% ± 5%' },
      { label: 'Module Efficiency', value: '22.65%' },
      { label: 'Connector', value: 'JK03M High-Current Compatible' },
      { label: 'Linear Degradation', value: '0.40% Annual over 30 Years' }
    ],
    compatibility: ['Deye 8kW/12kW', 'Sunsynk 8kW/16kW', 'Commercial 50kW Ground Mounts'],
    installationAvailable: true,
    installationPriceZAR: 750,
    faqs: []
  },
  {
    id: 'ja-solar-600w-jam72d-mc4',
    name: 'JA Solar 600W N-type US TOPCon MBB Traceable Double Glass Bifacial 72 Cell Silver Frame MC4-EVO2',
    brand: 'JA Solar',
    category: 'solar-panels',
    priceZAR: 1475.83,
    pricePerWpZAR: 2.460,
    dimensions: '1134 x 2278 mm',
    cellCount: 72,
    inStock: true,
    stockCount: 1274,
    etaStock: '1,178 Due: 23 Sep 2026',
    sku: 'JAM72D-40-600-MB-TS-F35-MC4',
    ratingKw: 0.60,
    warrantyYears: 30,
    image: '/solar-panel-mono.jpg',
    summary: 'Flagship 600W utility-scale & residential bifacial module. Multi-Busbar (MBB) half-cut cells with genuine MC4-EVO2 connectors for maximum South African irradiance harvest.',
    specs: [
      { label: 'Rated Maximum Power (Pmax)', value: '600 W' },
      { label: 'Price per Watt peak', value: 'R 2.460 / Wp' },
      { label: 'Dimensions', value: '1134 x 2278 mm' },
      { label: 'Cell Type', value: 'N-type TOPCon Double Glass' },
      { label: 'Connector', value: 'MC4-EVO2 Genuine' },
      { label: 'Efficiency', value: '23.2%' },
      { label: 'Temperature Coefficient (Pmax)', value: '-0.30%/°C' }
    ],
    compatibility: ['Deye Inverters', 'Sunsynk Inverters', 'Huawei Commercial Strings', 'Renusol Mounting'],
    installationAvailable: true,
    installationPriceZAR: 750,
    faqs: []
  },
  {
    id: 'ja-solar-600w-jam72d-qc4',
    name: 'JA Solar 600W N-type TOPCon MBB Traceable Double Glass Bifacial 72 Cell Silver Frame QC4',
    brand: 'JA Solar',
    category: 'solar-panels',
    priceZAR: 1476.50,
    pricePerWpZAR: 2.461,
    dimensions: '1134 x 2278 mm',
    cellCount: 72,
    inStock: true,
    stockCount: 3,
    etaStock: 'No More Stock Available',
    sku: 'JAM72D-40-600-MB-TS-QC4',
    ratingKw: 0.60,
    warrantyYears: 30,
    image: '/solar-panel-mono.jpg',
    summary: 'High-power 600W N-type double glass bifacial module with QC4 connectors. Multi-Busbar half-cut cell matrix with heavy mechanical load rating.',
    specs: [
      { label: 'Rated Maximum Power (Pmax)', value: '600 W' },
      { label: 'Price per Watt peak', value: 'R 2.461 / Wp' },
      { label: 'Dimensions', value: '1134 x 2278 mm' },
      { label: 'Connector', value: 'QC4 Compatible' },
      { label: 'Bifacial Dual Glass', value: '2.0mm + 2.0mm Semi-Tempered Glass' }
    ],
    compatibility: ['All String & Central Commercial Inverters'],
    installationAvailable: true,
    installationPriceZAR: 750,
    faqs: []
  },
  {
    id: 'ja-solar-605w-jam72d-mc4',
    name: 'JA Solar 605W N-type TOPCon MBB Traceable Double Glass Bifacial 72 Cell Silver Frame MC4',
    brand: 'JA Solar',
    category: 'solar-panels',
    priceZAR: 1488.14,
    pricePerWpZAR: 2.460,
    dimensions: '1134 x 2333 mm',
    cellCount: 72,
    inStock: true,
    stockCount: 12,
    etaStock: 'No More Stock Available',
    sku: 'JAM72D-40-605-LB-TS-MC4',
    ratingKw: 0.605,
    warrantyYears: 30,
    image: '/solar-panel-mono.jpg',
    summary: 'Premium 605W N-type bifacial module engineered for large commercial rooftops, agro-processing facilities, and high-yield luxury residential arrays.',
    specs: [
      { label: 'Rated Maximum Power (Pmax)', value: '605 W' },
      { label: 'Price per Watt peak', value: 'R 2.460 / Wp' },
      { label: 'Dimensions', value: '1134 x 2333 mm' },
      { label: 'Efficiency', value: '23.4%' },
      { label: 'Connectors', value: 'MC4 Stäubli Standard' }
    ],
    compatibility: ['Deye 12kW / 50kW', 'Sunsynk 8kW / 12kW / 50kW'],
    installationAvailable: true,
    installationPriceZAR: 750,
    faqs: []
  },
  {
    id: 'jinko-590w-jkm590n',
    name: 'Jinko Tiger Neo 590Wp TOPCon N-Type Double Glass Bifacial Modules Silver Frame JK03M Connectors',
    brand: 'Jinko',
    category: 'solar-panels',
    priceZAR: 1491.48,
    pricePerWpZAR: 2.528,
    dimensions: '1134 x 2278 mm',
    cellCount: 72,
    inStock: true,
    stockCount: 313,
    etaStock: 'No More Stock Available',
    sku: 'JKM590N-72HL4-BDV-SF-JK03M',
    ratingKw: 0.59,
    warrantyYears: 30,
    image: '/solar-panel-mono.jpg',
    summary: 'Mass-deployed 590W Tiger Neo module with SMBB technology and hot 2.0mm dual glass design for hail and wind resilience across the Highveld.',
    specs: [
      { label: 'Rated Maximum Power (Pmax)', value: '590 W' },
      { label: 'Price per Watt peak', value: 'R 2.528 / Wp' },
      { label: 'Dimensions', value: '1134 x 2278 mm' },
      { label: 'Technology', value: 'N-Type TOPCon Dual Glass' },
      { label: 'Connectors', value: 'JK03M' }
    ],
    compatibility: ['Sunsynk', 'Deye', 'Growatt', 'GoodWe'],
    installationAvailable: true,
    installationPriceZAR: 750,
    faqs: []
  },
  {
    id: 'ja-solar-610w-jam72d-mc4',
    name: 'JA Solar 610W N-type TOPCon MBB Traceable Double Glass Bifacial 72 Cell Silver Frame MC4',
    brand: 'JA Solar',
    category: 'solar-panels',
    priceZAR: 1533.81,
    pricePerWpZAR: 2.514,
    dimensions: '1134 x 2333 mm',
    cellCount: 72,
    inStock: true,
    stockCount: 108,
    etaStock: 'No More Stock Available',
    sku: 'JAM72D-40-610-LB-TS-MC4',
    ratingKw: 0.61,
    warrantyYears: 30,
    image: '/solar-panel-mono.jpg',
    summary: 'High-density 610W TOPCon bifacial module delivering extraordinary energy output per square meter for space-constrained rooftops.',
    specs: [
      { label: 'Rated Maximum Power (Pmax)', value: '610 W' },
      { label: 'Price per Watt peak', value: 'R 2.514 / Wp' },
      { label: 'Dimensions', value: '1134 x 2333 mm' },
      { label: 'Module Efficiency', value: '23.6%' },
      { label: 'Connectors', value: 'MC4 Standard' }
    ],
    compatibility: ['Commercial 3-Phase Solar Arrays', 'Sunsynk 12kW/16kW', 'Deye 12kW/50kW'],
    installationAvailable: true,
    installationPriceZAR: 800,
    faqs: []
  },
  {
    id: 'jinko-610w-jkm610n',
    name: 'Jinko Tiger Neo 610Wp TOPCon N-Type 66-cell Bifacial Silver Frame modules with JK03M connectors',
    brand: 'Jinko',
    category: 'solar-panels',
    priceZAR: 1540.49,
    pricePerWpZAR: 2.525,
    dimensions: '1134 x 2382 mm',
    cellCount: 66,
    inStock: true,
    stockCount: 1,
    etaStock: 'No More Stock Available',
    sku: 'JKM610N-66HL4M-BDV-SF-JK03M',
    ratingKw: 0.61,
    warrantyYears: 30,
    image: '/solar-panel-mono.jpg',
    summary: 'Optimized 66-cell architecture 610W bifacial module with low open circuit voltage (Voc), allowing more panels per MPPT string.',
    specs: [
      { label: 'Rated Maximum Power (Pmax)', value: '610 W' },
      { label: 'Price per Watt peak', value: 'R 2.525 / Wp' },
      { label: 'Dimensions', value: '1134 x 2382 mm' },
      { label: 'Cell Configuration', value: '66 N-Type Cells' },
      { label: 'Connectors', value: 'JK03M' }
    ],
    compatibility: ['Deye High-Voltage MPPT', 'Sunsynk Commercial Range'],
    installationAvailable: true,
    installationPriceZAR: 800,
    faqs: []
  },
  {
    id: 'jinko-615w-jkm615n',
    name: 'Jinko Tiger Neo 615Wp TOPCon N-Type 66-cell Bifacial Silver Frame modules with JK03M connectors',
    brand: 'Jinko',
    category: 'solar-panels',
    priceZAR: 1553.12,
    pricePerWpZAR: 2.525,
    dimensions: '1134 x 2382 mm',
    cellCount: 66,
    inStock: true,
    stockCount: 2,
    etaStock: 'No More Stock Available',
    sku: 'JKM615N-66HL4M-BDV-SF-JK03M',
    ratingKw: 0.615,
    warrantyYears: 30,
    image: '/solar-panel-mono.jpg',
    summary: '615W Tiger Neo bifacial module offering optimal LCOE and low temperature coefficient for South African summer heat conditions.',
    specs: [
      { label: 'Rated Maximum Power (Pmax)', value: '615 W' },
      { label: 'Price per Watt peak', value: 'R 2.525 / Wp' },
      { label: 'Dimensions', value: '1134 x 2382 mm' },
      { label: 'Efficiency', value: '22.8%' }
    ],
    compatibility: ['All Modern Dual-MPPT Inverters'],
    installationAvailable: true,
    installationPriceZAR: 800,
    faqs: []
  },
  {
    id: 'jinko-620w-jkm620n',
    name: 'Jinko Tiger Neo 620Wp TOPCon N-Type 66-cell Bifacial Silver Frame modules with JK03M connectors',
    brand: 'Jinko',
    category: 'solar-panels',
    priceZAR: 1565.75,
    pricePerWpZAR: 2.525,
    dimensions: '1134 x 2382 mm',
    cellCount: 66,
    inStock: true,
    stockCount: 90,
    etaStock: '3,196 Due: 26 Sep 2026',
    sku: 'JKM620N-66HL4M-BDV-SF-JK03M',
    ratingKw: 0.62,
    warrantyYears: 30,
    image: '/solar-panel-mono.jpg',
    summary: 'Ultra-high power 620W N-Type bifacial module. Large volume availability with incoming container freight scheduled for Johannesburg warehouse.',
    specs: [
      { label: 'Rated Maximum Power (Pmax)', value: '620 W' },
      { label: 'Price per Watt peak', value: 'R 2.525 / Wp' },
      { label: 'Dimensions', value: '1134 x 2382 mm' },
      { label: 'Bifacial Gain', value: 'Up to 25% Additional Yield' },
      { label: 'Mechanical Load', value: '5400 Pa Snow / 2400 Pa Wind' }
    ],
    compatibility: ['Commercial & Industrial Microgrids', 'Residential High-Power Hybrids'],
    installationAvailable: true,
    installationPriceZAR: 800,
    faqs: []
  },
  {
    id: 'jinko-625w-jkm625n',
    name: 'Jinko Tiger Neo 625Wp TOPCon N-Type 66-cell Bifacial Silver Frame modules with JK03M connectors',
    brand: 'Jinko',
    category: 'solar-panels',
    priceZAR: 1578.38,
    pricePerWpZAR: 2.525,
    dimensions: '1134 x 2382 mm',
    cellCount: 66,
    inStock: true,
    stockCount: 2,
    etaStock: 'No More Stock Available',
    sku: 'JKM625N-66HL4M-BDV-SF-JK03M',
    ratingKw: 0.625,
    warrantyYears: 30,
    image: '/solar-panel-mono.jpg',
    summary: 'Record-setting 625W monocrystalline bifacial panel with N-Type TOPCon cells and multi-busbar technology for maximum solar harvest.',
    specs: [
      { label: 'Rated Maximum Power (Pmax)', value: '625 W' },
      { label: 'Price per Watt peak', value: 'R 2.525 / Wp' },
      { label: 'Dimensions', value: '1134 x 2382 mm' },
      { label: 'Module Efficiency', value: '23.1%' },
      { label: 'Connectors', value: 'JK03M' }
    ],
    compatibility: ['Deye Commercial Inverters', 'Sunsynk 50kW'],
    installationAvailable: true,
    installationPriceZAR: 800,
    faqs: []
  },
  {
    id: 'trina-630w-vertex-n',
    name: 'Trina 630W Vertex N-Type i-TOPCon Bifacial Dual Glass Monocrystalline Module',
    brand: 'Trina',
    category: 'solar-panels',
    priceZAR: 1579.26,
    pricePerWpZAR: 2.507,
    dimensions: '1134 x 2382 mm',
    cellCount: 66,
    inStock: true,
    stockCount: 3197,
    etaStock: '3,197 In Stock (Immediate Dispatch)',
    sku: 'TSM66-NEG19RC-20-630',
    ratingKw: 0.63,
    warrantyYears: 30,
    image: '/solar-panel-mono.jpg',
    summary: 'Industry powerhouse 630W Vertex N-Type i-TOPCon module. 210mm wafer technology with dual glass encapsulation, 30-year warranty, and massive 3,197 unit stock on hand.',
    specs: [
      { label: 'Rated Maximum Power (Pmax)', value: '630 W' },
      { label: 'Price per Watt peak', value: 'R 2.507 / Wp' },
      { label: 'Dimensions', value: '1134 x 2382 mm' },
      { label: 'Cell Technology', value: '210mm i-TOPCon Bifacial Dual Glass' },
      { label: 'Module Efficiency', value: '23.3%' },
      { label: 'Operating Voltage (Vmp)', value: '40.6 V' },
      { label: 'Operating Current (Imp)', value: '15.52 A' },
      { label: 'Weight', value: '33.7 kg' },
      { label: 'Linear Power Warranty', value: '30 Years (87.4% Output Guarantee)' }
    ],
    compatibility: ['All Utility & Commercial Inverters', 'Deye 12kW/16kW/50kW', 'Sunsynk 8kW/12kW/16kW/50kW'],
    installationAvailable: true,
    installationPriceZAR: 850,
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
