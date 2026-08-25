import React, { useState } from 'react';
import { PROVINCES_DATA } from '../../data/mockData';
import { EstimateDisclaimer, IncentiveDisclaimer } from '../common/EstimateDisclaimer';
import { Calculator, Sun, Battery, DollarSign, TrendingUp, Zap, HelpCircle, ShieldCheck, ArrowRight } from 'lucide-react';

interface EnergyCalculatorProps {
  onQuoteTrigger?: () => void;
}

export const EnergyCalculator: React.FC<EnergyCalculatorProps> = ({ onQuoteTrigger }) => {
  const [selectedProvince, setSelectedProvince] = useState<string>('Gauteng (Johannesburg / Pretoria)');
  const [monthlyBillZAR, setMonthlyBillZAR] = useState<number>(4500);
  const [roofOrientation, setRoofOrientation] = useState<'north' | 'northeast_northwest' | 'east_west' | 'flat'>('north');
  const [backupHours, setBackupHours] = useState<number>(4);
  const [financingTermMonths, setFinancingTermMonths] = useState<number>(60);
  const [annualTariffIncreasePercent, setAnnualTariffIncreasePercent] = useState<number>(12); // Average NERSA increase

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
  // Average base load per hour during outage
  const baseLoadKw = Math.max(0.6, (estimatedDailyKwh / 24) * 1.1);
  const rawBatteryKwh = baseLoadKw * backupHours;
  // Account for 85% DoD
  const recommendedBatteryKwh = Number((rawBatteryKwh / 0.85).toFixed(1));

  // Turnkey Cost Model (ZAR)
  let estimatedSystemCostZAR = 85000;
  if (inverterKva === 5) estimatedSystemCostZAR = 89000 + (panelCount * 2200);
  else if (inverterKva === 8) estimatedSystemCostZAR = 132000 + (panelCount * 2200);
  else if (inverterKva === 12) estimatedSystemCostZAR = 188000 + (panelCount * 2200);
  else estimatedSystemCostZAR = 280000 + (panelCount * 2200);

  if (recommendedBatteryKwh > 5.5 && recommendedBatteryKwh <= 11) {
    estimatedSystemCostZAR += 24000; // Extra 5kWh module
  } else if (recommendedBatteryKwh > 11) {
    estimatedSystemCostZAR += 48000; // Dual extra modules
  }

  // Monthly Savings & Payback
  const estimatedMonthlySavingsZAR = Math.round(monthlyBillZAR * 0.76);
  const estimatedAnnualSavingsZAR = estimatedMonthlySavingsZAR * 12;
  const paybackYears = Number((estimatedSystemCostZAR / estimatedAnnualSavingsZAR).toFixed(1));
  const annualGenerationKwh = Math.round(requiredSolarKwp * effectivePeakSunHours * 365 * systemEfficiency);
  const co2TonnesPerYear = Number(((annualGenerationKwh * 0.95) / 1000).toFixed(1));

  // Asset Financing Estimation:
  // Typical interest rate ~ Prime (11.75%)
  const annualInterestRate = 0.1175;
  const monthlyRate = annualInterestRate / 12;
  const monthlyFinancingZAR = Math.round(
    (estimatedSystemCostZAR * monthlyRate * Math.pow(1 + monthlyRate, financingTermMonths)) /
    (Math.pow(1 + monthlyRate, financingTermMonths) - 1)
  );

  const netMonthlyCost = monthlyFinancingZAR - estimatedMonthlySavingsZAR;

  return (
    <div className="bg-[#0E1311] border border-[#24302A] rounded-lg p-6 sm:p-8 max-w-5xl mx-auto text-[#E6ECE8] shadow-2xl">
      {/* Title & Introduction */}
      <div className="border-b border-[#24302A] pb-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-[#1B4D3E] text-white rounded border border-[#286D58]">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#286D58] font-bold">
              South African Solar Engineering & Financial Model
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
              Energy & Payback Calculator
            </h2>
          </div>
        </div>
        <p className="text-xs text-[#9EADA5] leading-relaxed max-w-3xl">
          Model your property's solar PV generation, battery storage capacity, electricity bill savings, and estimated asset financing terms using South African regional irradiation data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Inputs */}
        <div className="lg:col-span-6 space-y-6">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white border-b border-[#1B2420] pb-2">
            01. Property & Consumption Inputs
          </h3>

          {/* Province Selector */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1.5">
              Select Province / Metro Region
            </label>
            <select
              value={selectedProvince}
              onChange={e => setSelectedProvince(e.target.value)}
              className="w-full bg-[#141A17] border border-[#24302A] rounded px-3 py-2.5 text-xs text-white focus:border-[#286D58]"
            >
              {Object.keys(PROVINCES_DATA).map(prov => (
                <option key={prov} value={prov}>
                  {prov} ({PROVINCES_DATA[prov].peakSunHoursPerDay} hrs peak sun / day)
                </option>
              ))}
            </select>
          </div>

          {/* Monthly Bill Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono uppercase text-[#9EADA5]">
                Current Monthly Eskom / Municipal Bill
              </label>
              <span className="font-mono text-sm font-bold text-white bg-[#141A17] px-2.5 py-1 rounded border border-[#24302A]">
                R {monthlyBillZAR.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={1500}
              max={30000}
              step={250}
              value={monthlyBillZAR}
              onChange={e => setMonthlyBillZAR(Number(e.target.value))}
              className="w-full h-2 bg-[#1A221E] rounded-lg appearance-none cursor-pointer accent-[#1B4D3E]"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#6B7B73] mt-1.5">
              <span>R 1,500</span>
              <span>~{Math.round(estimatedMonthlyKwh)} kWh/month</span>
              <span>R 30,000+</span>
            </div>
          </div>

          {/* Roof Orientation */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-2">
              Primary Roof Pitch Orientation
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'north', label: 'North Facing (100% Optimal)' },
                { id: 'northeast_northwest', label: 'North-East / North-West (95%)' },
                { id: 'east_west', label: 'East-West Split (88%)' },
                { id: 'flat', label: 'Flat Roof / Tilt Brackets (92%)' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRoofOrientation(item.id as any)}
                  className={`p-2.5 rounded text-left border transition-colors ${
                    roofOrientation === item.id 
                      ? 'bg-[#1B4D3E] text-white border-[#286D58]' 
                      : 'bg-[#141A17] text-[#9EADA5] border-[#24302A] hover:border-[#31423A]'
                  }`}
                >
                  <span className="block font-medium text-[11px]">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Backup Duration Hours */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-2">
              Target Outage / Loadshedding Backup Duration
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[2, 4, 8, 12].map(hrs => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => setBackupHours(hrs)}
                  className={`py-2 rounded font-mono text-xs font-semibold border ${
                    backupHours === hrs 
                      ? 'bg-[#1B4D3E] text-white border-[#286D58]' 
                      : 'bg-[#141A17] text-[#9EADA5] border-[#24302A]'
                  }`}
                >
                  {hrs} Hours
                </button>
              ))}
            </div>
          </div>

          {/* Financing Term */}
          <div>
            <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-2">
              Asset Finance Term Horizon
            </label>
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              {[36, 48, 60].map(term => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setFinancingTermMonths(term)}
                  className={`py-2 rounded border text-center font-semibold ${
                    financingTermMonths === term 
                      ? 'bg-[#1B4D3E] text-white border-[#286D58]' 
                      : 'bg-[#141A17] text-[#9EADA5] border-[#24302A]'
                  }`}
                >
                  {term} Months
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sizing & Financial Model Outputs */}
        <div className="lg:col-span-6 space-y-6">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white border-b border-[#1B2420] pb-2">
            02. Sizing & Financial Yield Projections
          </h3>

          {/* Technical Sizing Cards */}
          <div className="grid grid-cols-2 gap-3 font-mono">
            <div className="p-3.5 bg-[#141A17] border border-[#24302A] rounded">
              <span className="text-[10px] uppercase text-[#6B7B73] block">Recommended Solar PV</span>
              <span className="text-base font-bold text-white">{requiredSolarKwp} kWp</span>
              <span className="text-[10px] text-[#9EADA5] block mt-0.5">({panelCount}x 550W Tier-1 Panels)</span>
            </div>

            <div className="p-3.5 bg-[#141A17] border border-[#24302A] rounded">
              <span className="text-[10px] uppercase text-[#6B7B73] block">Recommended Storage</span>
              <span className="text-base font-bold text-white">{recommendedBatteryKwh} kWh</span>
              <span className="text-[10px] text-[#9EADA5] block mt-0.5">(LiFePO4 @ 85% DoD)</span>
            </div>

            <div className="p-3.5 bg-[#141A17] border border-[#24302A] rounded">
              <span className="text-[10px] uppercase text-[#6B7B73] block">Hybrid Inverter Size</span>
              <span className="text-base font-bold text-white">{inverterKva} kVA</span>
              <span className="text-[10px] text-[#9EADA5] block mt-0.5">Pure Sine Wave IP65</span>
            </div>

            <div className="p-3.5 bg-[#141A17] border border-[#24302A] rounded">
              <span className="text-[10px] uppercase text-[#6B7B73] block">Annual Clean Generation</span>
              <span className="text-base font-bold text-[#10B981]">{annualGenerationKwh.toLocaleString()} kWh</span>
              <span className="text-[10px] text-[#9EADA5] block mt-0.5">({co2TonnesPerYear}t CO2 offset/yr)</span>
            </div>
          </div>

          {/* Financial Summary Box */}
          <div className="p-5 bg-[#141A17] border border-[#286D58]/70 rounded-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#24302A] pb-3">
              <span className="text-xs font-mono uppercase text-[#9EADA5]">Estimated Turnkey Cost:</span>
              <span className="text-xl font-mono font-extrabold text-[#D97706]">
                R {estimatedSystemCostZAR.toLocaleString()}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-[#9EADA5]">
                <span>Est. Monthly Electricity Offset:</span>
                <span className="text-[#10B981] font-bold">~R {estimatedMonthlySavingsZAR.toLocaleString()} / mo</span>
              </div>
              <div className="flex justify-between text-[#9EADA5]">
                <span>Est. Asset Financing Repayment ({financingTermMonths} mo):</span>
                <span className="text-white font-bold">~R {monthlyFinancingZAR.toLocaleString()} / mo</span>
              </div>
              <div className="flex justify-between text-[#9EADA5] pt-2 border-t border-[#1B2420]">
                <span>Estimated Payback Horizon:</span>
                <span className="text-white font-bold">{paybackYears} Years</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onQuoteTrigger}
                className="w-full py-3 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-mono font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2 transition-colors"
              >
                <span>Request Quotation for this Configuration</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Disclaimers */}
          <EstimateDisclaimer variant="inline" />
        </div>
      </div>

      {/* Tax Incentives & Regulatory Information */}
      <div className="mt-8 pt-6 border-t border-[#24302A]">
        <IncentiveDisclaimer />
      </div>
    </div>
  );
};
