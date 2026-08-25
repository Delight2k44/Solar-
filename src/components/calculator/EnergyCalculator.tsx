import React, { useState } from 'react';
import { PROVINCES_DATA } from '../../data/mockData';
import { EstimateDisclaimer, IncentiveDisclaimer } from '../common/EstimateDisclaimer';
import { 
  Calculator, 
  Sun, 
  Battery, 
  DollarSign, 
  TrendingUp, 
  Zap, 
  HelpCircle, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Layers,
  MapPin,
  Compass,
  Clock,
  CheckCircle2,
  FileCheck
} from 'lucide-react';

interface EnergyCalculatorProps {
  onQuoteTrigger?: () => void;
}

export const EnergyCalculator: React.FC<EnergyCalculatorProps> = ({ onQuoteTrigger }) => {
  const [selectedProvince, setSelectedProvince] = useState<string>('Gauteng (Johannesburg / Pretoria)');
  const [monthlyBillZAR, setMonthlyBillZAR] = useState<number>(4500);
  const [roofOrientation, setRoofOrientation] = useState<'north' | 'northeast_northwest' | 'east_west' | 'flat'>('north');
  const [backupHours, setBackupHours] = useState<number>(4);
  const [financingTermMonths, setFinancingTermMonths] = useState<number>(60);

  const provinceInfo = PROVINCES_DATA[selectedProvince] || PROVINCES_DATA['Gauteng (Johannesburg / Pretoria)'];

  // Calculations
  const tariffPerKwh = provinceInfo.avgTariffPerKwhZAR;
  const estimatedMonthlyKwh = monthlyBillZAR / tariffPerKwh;
  const estimatedDailyKwh = estimatedMonthlyKwh / 30;

  // Roof orientation derating factor
  let orientationFactor = 1.0;
  if (roofOrientation === 'northeast_northwest') orientationFactor = 0.95;
  if (roofOrientation === 'east_west') orientationFactor = 0.88;
  if (roofOrientation === 'flat') orientationFactor = 0.92;

  const effectivePeakSunHours = provinceInfo.peakSunHoursPerDay * orientationFactor;

  // Solar sizing to offset ~80% of daily consumption
  const targetDailySolarKwh = estimatedDailyKwh * 0.80;
  const systemEfficiency = 0.82; // Inverter, cable, temperature losses
  const requiredSolarKwp = Number((targetDailySolarKwh / (effectivePeakSunHours * systemEfficiency)).toFixed(2));
  const panelCount = Math.ceil((requiredSolarKwp * 1000) / 550);

  // Inverter sizing
  let inverterKva = 5;
  if (requiredSolarKwp > 4.5) inverterKva = 8;
  if (requiredSolarKwp > 8.0) inverterKva = 12;
  if (requiredSolarKwp > 14.0) inverterKva = 20;

  // Battery sizing based on desired backup hours
  const baseLoadKw = Math.max(0.6, (estimatedDailyKwh / 24) * 1.1);
  const rawBatteryKwh = baseLoadKw * backupHours;
  const recommendedBatteryKwh = Number((rawBatteryKwh / 0.85).toFixed(1));

  // Turnkey Cost Model (ZAR)
  let estimatedSystemCostZAR = 85000;
  if (inverterKva === 5) estimatedSystemCostZAR = 89000 + (panelCount * 2200);
  else if (inverterKva === 8) estimatedSystemCostZAR = 132000 + (panelCount * 2200);
  else if (inverterKva === 12) estimatedSystemCostZAR = 188000 + (panelCount * 2200);
  else estimatedSystemCostZAR = 280000 + (panelCount * 2200);

  if (recommendedBatteryKwh > 5.5 && recommendedBatteryKwh <= 11) {
    estimatedSystemCostZAR += 24000;
  } else if (recommendedBatteryKwh > 11) {
    estimatedSystemCostZAR += 48000;
  }

  // Monthly Savings & Payback
  const estimatedMonthlySavingsZAR = Math.round(monthlyBillZAR * 0.76);
  const estimatedAnnualSavingsZAR = estimatedMonthlySavingsZAR * 12;
  const paybackYears = Number((estimatedSystemCostZAR / estimatedAnnualSavingsZAR).toFixed(1));
  const annualGenerationKwh = Math.round(requiredSolarKwp * effectivePeakSunHours * 365 * systemEfficiency);
  const co2TonnesPerYear = Number(((annualGenerationKwh * 0.95) / 1000).toFixed(1));

  // Asset Financing Estimation (~11.75% prime)
  const annualInterestRate = 0.1175;
  const monthlyRate = annualInterestRate / 12;
  const monthlyFinancingZAR = Math.round(
    (estimatedSystemCostZAR * monthlyRate * Math.pow(1 + monthlyRate, financingTermMonths)) /
    (Math.pow(1 + monthlyRate, financingTermMonths) - 1)
  );

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Visual Header with Real Engineering Background */}
      <div className="relative rounded-2xl overflow-hidden border border-[#24302A] bg-[#141A17] p-8 sm:p-12 shadow-2xl">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src="/cad-solar-audit.jpg"
            alt="Solar CAD Engineering Design"
            className="w-full h-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141A17] via-[#141A17]/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0E1311]/90 border border-[#286D58] rounded text-[11px] font-mono tracking-widest text-[#286D58] font-bold uppercase">
            <Calculator className="w-3.5 h-3.5" />
            <span>South African Solar ROI & Financial Sizing Engine</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
            Energy Sizing & Payback Calculator
          </h1>

          <p className="text-xs sm:text-sm text-[#9EADA5] leading-relaxed">
            Model your property's solar PV generation, lithium storage capacity, monthly Eskom bill savings, and asset financing terms based on verified regional irradiation data across South Africa.
          </p>
        </div>
      </div>

      {/* Visual 3-Card Interactive Sizing Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#141A17] border border-[#24302A] rounded-xl overflow-hidden group hover:border-[#31423A] transition-all shadow-md">
          <div className="aspect-16/9 overflow-hidden relative bg-[#0E1311]">
            <img
              src="/solar-installer-roof.jpg"
              alt="Solar panel roof array installation"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute top-2.5 left-2.5 bg-[#0E1311]/90 border border-[#24302A] px-2 py-0.5 rounded text-[10px] font-mono text-white uppercase font-bold">
              01 • Solar PV Array
            </span>
          </div>
          <div className="p-4 space-y-1">
            <h4 className="text-sm font-bold text-white uppercase">Calculated PV Capacity</h4>
            <p className="text-xs text-[#286D58] font-mono font-bold">{requiredSolarKwp} kWp ({panelCount}x 550W Panels)</p>
            <p className="text-[11px] text-[#9EADA5]">Daily Solar Yield: ~{Math.round(requiredSolarKwp * effectivePeakSunHours * systemEfficiency)} kWh/day</p>
          </div>
        </div>

        <div className="bg-[#141A17] border border-[#24302A] rounded-xl overflow-hidden group hover:border-[#31423A] transition-all shadow-md">
          <div className="aspect-16/9 overflow-hidden relative bg-[#0E1311]">
            <img
              src="/battery-inverter-room.jpg"
              alt="Lithium battery power room"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute top-2.5 left-2.5 bg-[#0E1311]/90 border border-[#24302A] px-2 py-0.5 rounded text-[10px] font-mono text-white uppercase font-bold">
              02 • Hybrid Power Room
            </span>
          </div>
          <div className="p-4 space-y-1">
            <h4 className="text-sm font-bold text-white uppercase">Inverter & Storage</h4>
            <p className="text-xs text-[#D97706] font-mono font-bold">{inverterKva}kW Hybrid Inverter + {recommendedBatteryKwh}kWh Storage</p>
            <p className="text-[11px] text-[#9EADA5]">Provides {backupHours} Hours Outage Autonomy</p>
          </div>
        </div>

        <div className="bg-[#141A17] border border-[#24302A] rounded-xl overflow-hidden group hover:border-[#31423A] transition-all shadow-md">
          <div className="aspect-16/9 overflow-hidden relative bg-[#0E1311]">
            <img
              src="/homeowner-app-dashboard.jpg"
              alt="Homeowner energy savings tracking"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute top-2.5 left-2.5 bg-[#0E1311]/90 border border-[#24302A] px-2 py-0.5 rounded text-[10px] font-mono text-white uppercase font-bold">
              03 • Financial Return
            </span>
          </div>
          <div className="p-4 space-y-1">
            <h4 className="text-sm font-bold text-white uppercase">Payback & Monthly Savings</h4>
            <p className="text-xs text-[#10B981] font-mono font-bold">R {estimatedMonthlySavingsZAR.toLocaleString()} / mo Savings</p>
            <p className="text-[11px] text-[#9EADA5]">Estimated Break-Even: {paybackYears} Years</p>
          </div>
        </div>
      </div>

      {/* Main Interactive Calculator Engine */}
      <div className="bg-[#0E1311] border border-[#24302A] rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Interactive Sliders & Inputs */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white border-b border-[#1B2420] pb-2 flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#286D58]" />
              <span>01. Property & Consumption Inputs</span>
            </h3>

            {/* Province Selector */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1.5 flex items-center justify-between">
                <span>Province / Metro Region</span>
                <span className="text-[#286D58] font-bold">{provinceInfo.peakSunHoursPerDay} Peak Sun Hrs/Day</span>
              </label>
              <select
                value={selectedProvince}
                onChange={e => setSelectedProvince(e.target.value)}
                className="w-full bg-[#141A17] border border-[#24302A] rounded-lg px-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
              >
                {Object.keys(PROVINCES_DATA).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Monthly Spend Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono uppercase text-[#9EADA5]">
                  Average Monthly Electricity Bill (ZAR)
                </label>
                <span className="text-base font-mono font-extrabold text-[#D97706]">
                  R {monthlyBillZAR.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="1500"
                max="30000"
                step="500"
                value={monthlyBillZAR}
                onChange={e => setMonthlyBillZAR(Number(e.target.value))}
                className="w-full h-2 bg-[#141A17] rounded-lg appearance-none cursor-pointer accent-[#286D58]"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#6B7B73] mt-1">
                <span>R 1,500</span>
                <span>Est: {Math.round(estimatedMonthlyKwh)} kWh/month</span>
                <span>R 30,000+</span>
              </div>
            </div>

            {/* Roof Orientation */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-2">
                Roof Orientation & Solar Pitch
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {[
                  { id: 'north', label: 'True North (100% Yield)' },
                  { id: 'northeast_northwest', label: 'NE / NW (95% Yield)' },
                  { id: 'east_west', label: 'East / West (88% Yield)' },
                  { id: 'flat', label: 'Flat Roof / Tilt Brackets (92%)' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRoofOrientation(item.id as any)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      roofOrientation === item.id
                        ? 'bg-[#1B4D3E] border-[#286D58] text-white font-bold'
                        : 'bg-[#141A17] border-[#24302A] text-[#9EADA5] hover:border-[#31423A]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Outage Backup Hours Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono uppercase text-[#9EADA5]">
                  Desired Night & Loadshedding Backup Duration
                </label>
                <span className="text-sm font-mono font-bold text-white">
                  {backupHours} Hours
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="12"
                step="1"
                value={backupHours}
                onChange={e => setBackupHours(Number(e.target.value))}
                className="w-full h-2 bg-[#141A17] rounded-lg appearance-none cursor-pointer accent-[#286D58]"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#6B7B73] mt-1">
                <span>2 hrs (Essential Loads)</span>
                <span>6 hrs (Overnight)</span>
                <span>12 hrs (Off-Grid)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Calculated Sizing & Payback Matrix */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white border-b border-[#1B2420] pb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D97706]" />
              <span>02. Recommended Hardware Sizing & ROI</span>
            </h3>

            {/* Hardware Specification Grid */}
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-4 bg-[#141A17] border border-[#24302A] rounded-xl space-y-1">
                <span className="text-[10px] text-[#6B7B73] uppercase block">Inverter Sizing</span>
                <span className="text-lg font-bold text-white">{inverterKva}.0 kW</span>
                <span className="text-[10px] text-[#286D58] block">Hybrid Low-Voltage</span>
              </div>

              <div className="p-4 bg-[#141A17] border border-[#24302A] rounded-xl space-y-1">
                <span className="text-[10px] text-[#6B7B73] uppercase block">LiFePO4 Storage</span>
                <span className="text-lg font-bold text-white">{recommendedBatteryKwh} kWh</span>
                <span className="text-[10px] text-[#286D58] block">85% Depth of Discharge</span>
              </div>

              <div className="p-4 bg-[#141A17] border border-[#24302A] rounded-xl space-y-1">
                <span className="text-[10px] text-[#6B7B73] uppercase block">Solar Array Size</span>
                <span className="text-lg font-bold text-white">{requiredSolarKwp} kWp</span>
                <span className="text-[10px] text-[#286D58] block">{panelCount}x 550W Mono PERC</span>
              </div>

              <div className="p-4 bg-[#141A17] border border-[#24302A] rounded-xl space-y-1">
                <span className="text-[10px] text-[#6B7B73] uppercase block">Annual Generation</span>
                <span className="text-lg font-bold text-white">{annualGenerationKwh.toLocaleString()}</span>
                <span className="text-[10px] text-[#10B981] block">kWh / Year Yield</span>
              </div>
            </div>

            {/* Financial Summary Box */}
            <div className="p-5 bg-[#141A17] border border-[#24302A] rounded-xl space-y-4 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-[#24302A] pb-3">
                <span className="text-[#9EADA5]">Estimated Turnkey Installation:</span>
                <span className="text-base font-extrabold text-white">R {estimatedSystemCostZAR.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center text-[#10B981]">
                <span>Estimated Monthly Electricity Savings:</span>
                <span className="font-bold">R {estimatedMonthlySavingsZAR.toLocaleString()} / mo</span>
              </div>

              <div className="flex justify-between items-center text-white">
                <span>Estimated Payback Horizon:</span>
                <span className="font-bold text-[#D97706]">{paybackYears} Years</span>
              </div>

              <div className="flex justify-between items-center text-[#9EADA5] pt-2 border-t border-[#24302A]">
                <span>5-Year Asset Finance Repayment:</span>
                <span className="text-white font-bold">~R {monthlyFinancingZAR.toLocaleString()} / mo</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onQuoteTrigger}
                className="w-full py-4 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>Request Formal Proposal for this Sizing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mandatory Engineering Disclaimers */}
        <div className="pt-6 border-t border-[#1B2420]">
          <EstimateDisclaimer />
          <div className="mt-4">
            <IncentiveDisclaimer />
          </div>
        </div>
      </div>
    </div>
  );
};
