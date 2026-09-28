import React from 'react';

interface IconProps {
  className?: string;
}

// =============================================================================
// 1. PANELS: Realistic Monocrystalline Solar PV Module with Glass Reflection & Sun
// =============================================================================
export const PanelsIcon: React.FC<IconProps> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="pnl-frame" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#64748B" />
        <stop offset="50%" stopColor="#334155" />
        <stop offset="100%" stopColor="#1E293B" />
      </linearGradient>
      <linearGradient id="pnl-wafer" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0B192C" />
        <stop offset="50%" stopColor="#0E335E" />
        <stop offset="100%" stopColor="#041833" />
      </linearGradient>
      <linearGradient id="pnl-sheen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.28" />
        <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.05" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="pnl-sun" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="40%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Realistic Aluminum Outer Frame */}
    <rect x="8" y="10" width="64" height="60" rx="3" fill="url(#pnl-frame)" stroke="#94A3B8" strokeWidth="1.2" />
    
    {/* Inner Silicon Substrate */}
    <rect x="11" y="13" width="58" height="54" rx="2" fill="#030712" />

    {/* 8 Monocrystalline Solar Cells Matrix */}
    {/* Row 1 */}
    <rect x="13" y="15" width="12" height="24" rx="1.5" fill="url(#pnl-wafer)" stroke="#1E293B" strokeWidth="0.6" />
    <rect x="27" y="15" width="12" height="24" rx="1.5" fill="url(#pnl-wafer)" stroke="#1E293B" strokeWidth="0.6" />
    <rect x="41" y="15" width="12" height="24" rx="1.5" fill="url(#pnl-wafer)" stroke="#1E293B" strokeWidth="0.6" />
    <rect x="55" y="15" width="12" height="24" rx="1.5" fill="url(#pnl-wafer)" stroke="#1E293B" strokeWidth="0.6" />
    {/* Row 2 */}
    <rect x="13" y="41" width="12" height="24" rx="1.5" fill="url(#pnl-wafer)" stroke="#1E293B" strokeWidth="0.6" />
    <rect x="27" y="41" width="12" height="24" rx="1.5" fill="url(#pnl-wafer)" stroke="#1E293B" strokeWidth="0.6" />
    <rect x="41" y="41" width="12" height="24" rx="1.5" fill="url(#pnl-wafer)" stroke="#1E293B" strokeWidth="0.6" />
    <rect x="55" y="41" width="12" height="24" rx="1.5" fill="url(#pnl-wafer)" stroke="#1E293B" strokeWidth="0.6" />

    {/* Silver Busbars & Conductive Ribbons */}
    <line x1="19" y1="15" x2="19" y2="65" stroke="#E2E8F0" strokeWidth="0.8" strokeOpacity="0.85" />
    <line x1="33" y1="15" x2="33" y2="65" stroke="#E2E8F0" strokeWidth="0.8" strokeOpacity="0.85" />
    <line x1="47" y1="15" x2="47" y2="65" stroke="#E2E8F0" strokeWidth="0.8" strokeOpacity="0.85" />
    <line x1="61" y1="15" x2="61" y2="65" stroke="#E2E8F0" strokeWidth="0.8" strokeOpacity="0.85" />
    <line x1="13" y1="40" x2="67" y2="40" stroke="#94A3B8" strokeWidth="1" strokeOpacity="0.7" />

    {/* Micro-grid finger conductors */}
    <line x1="13" y1="21" x2="67" y2="21" stroke="#38BDF8" strokeWidth="0.4" strokeOpacity="0.4" />
    <line x1="13" y1="27" x2="67" y2="27" stroke="#38BDF8" strokeWidth="0.4" strokeOpacity="0.4" />
    <line x1="13" y1="33" x2="67" y2="33" stroke="#38BDF8" strokeWidth="0.4" strokeOpacity="0.4" />
    <line x1="13" y1="47" x2="67" y2="47" stroke="#38BDF8" strokeWidth="0.4" strokeOpacity="0.4" />
    <line x1="13" y1="53" x2="67" y2="53" stroke="#38BDF8" strokeWidth="0.4" strokeOpacity="0.4" />
    <line x1="13" y1="59" x2="67" y2="59" stroke="#38BDF8" strokeWidth="0.4" strokeOpacity="0.4" />

    {/* Tempered Glass Specular Glare */}
    <polygon points="11,13 46,13 11,54" fill="url(#pnl-sheen)" />

    {/* Sun Flare in Corner */}
    <circle cx="68" cy="12" r="10" fill="url(#pnl-sun)" />
    <circle cx="68" cy="12" r="4.5" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.2" />
    <path d="M68 3v3M68 18v3M59 12h3M74 12h3M61.5 5.5l2 2M72.5 16.5l2 2M61.5 18.5l2-2M72.5 7.5l2-2" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// =============================================================================
// 2. PV INVERTERS: Wall-Mounted Hybrid Inverter with LCD Screen & Telemetry
// =============================================================================
export const PvInvertersIcon: React.FC<IconProps> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="inv-chassis" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#334155" />
        <stop offset="40%" stopColor="#1E293B" />
        <stop offset="100%" stopColor="#0F172A" />
      </linearGradient>
      <linearGradient id="inv-screen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#032535" />
        <stop offset="100%" stopColor="#02141F" />
      </linearGradient>
    </defs>

    {/* Cooling Heat-Sink Fins on Left and Right */}
    <rect x="14" y="16" width="3" height="42" rx="1" fill="#475569" />
    <rect x="14" y="22" width="4" height="2" fill="#1E293B" />
    <rect x="14" y="30" width="4" height="2" fill="#1E293B" />
    <rect x="14" y="38" width="4" height="2" fill="#1E293B" />
    <rect x="14" y="46" width="4" height="2" fill="#1E293B" />

    <rect x="63" y="16" width="3" height="42" rx="1" fill="#475569" />
    <rect x="62" y="22" width="4" height="2" fill="#1E293B" />
    <rect x="62" y="30" width="4" height="2" fill="#1E293B" />
    <rect x="62" y="38" width="4" height="2" fill="#1E293B" />
    <rect x="62" y="46" width="4" height="2" fill="#1E293B" />

    {/* Main Inverter Chassis Body */}
    <rect x="18" y="10" width="44" height="54" rx="5" fill="url(#inv-chassis)" stroke="#64748B" strokeWidth="1.5" />
    
    {/* Beveled Front Fascia */}
    <rect x="22" y="14" width="36" height="46" rx="3.5" fill="#0B101B" stroke="#1E2530" />

    {/* Illuminated LCD Display Screen */}
    <rect x="25" y="18" width="30" height="20" rx="2.5" fill="url(#inv-screen)" stroke="#00D2FF" strokeWidth="1" />
    
    {/* Live Telemetry Display Readout */}
    <text x="40" y="27" fill="#00D2FF" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle">5.0 kW</text>
    {/* Sine Wave */}
    <path d="M29 33 Q32 29 35 33 T41 33 T47 33 T51 33" stroke="#00D2FF" strokeWidth="1.2" fill="none" strokeLinecap="round" />

    {/* Status Cluster LEDs */}
    <circle cx="31" cy="42" r="2" fill="#10B981" />
    <circle cx="40" cy="42" r="2" fill="#00D2FF" />
    <circle cx="49" cy="42" r="2" fill="#F59E0B" />

    {/* DC Isolator Switch Knob */}
    <circle cx="40" cy="51" r="4" fill="#1E293B" stroke="#94A3B8" strokeWidth="1" />
    <rect x="39" y="48" width="2" height="6" rx="1" fill="#EF4444" />

    {/* Bottom Heavy-Duty Cable Glands */}
    <rect x="24" y="64" width="5" height="5" rx="1.5" fill="#64748B" stroke="#475569" />
    <rect x="33" y="64" width="5" height="5" rx="1.5" fill="#64748B" stroke="#475569" />
    <rect x="42" y="64" width="5" height="5" rx="1.5" fill="#64748B" stroke="#475569" />
    <rect x="51" y="64" width="5" height="5" rx="1.5" fill="#64748B" stroke="#475569" />
  </svg>
);

// =============================================================================
// 3. STORAGE SYSTEMS: High-Voltage LiFePO4 Lithium Battery Module
// =============================================================================
export const StorageSystemsIcon: React.FC<IconProps> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="bat-chassis" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1E293B" />
        <stop offset="60%" stopColor="#0F172A" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
    </defs>

    {/* Heavy-Duty Copper Terminal Posts */}
    <rect x="22" y="7" width="9" height="5" rx="1.5" fill="#EF4444" stroke="#DC2626" />
    <rect x="25" y="4" width="3" height="3" fill="#B91C1C" />
    <text x="26.5" y="11" fill="white" fontSize="4.5" fontWeight="bold" textAnchor="middle">+</text>

    <rect x="49" y="7" width="9" height="5" rx="1.5" fill="#0F172A" stroke="#00D2FF" strokeWidth="1" />
    <rect x="52" y="4" width="3" height="3" fill="#00D2FF" />
    <text x="53.5" y="11" fill="#00D2FF" fontSize="5" fontWeight="bold" textAnchor="middle">−</text>

    {/* Battery Rack Chassis */}
    <rect x="14" y="12" width="52" height="56" rx="5" fill="url(#bat-chassis)" stroke="#475569" strokeWidth="1.5" />
    
    {/* Front Brushed Faceplate */}
    <rect x="17" y="15" width="46" height="50" rx="3" fill="#090D16" stroke="#1E2530" />

    {/* LiFePO4 Stenciled Brand Plate */}
    <rect x="21" y="20" width="38" height="12" rx="2" fill="#0F172A" stroke="#334155" strokeWidth="0.8" />
    <text x="40" y="28" fill="#F8FAFC" fontSize="7" fontFamily="sans-serif" fontWeight="900" letterSpacing="1" textAnchor="middle">LiFePO4</text>

    {/* Capacity Spec Subtitle */}
    <text x="40" y="38" fill="#00D2FF" fontSize="4.5" fontFamily="monospace" textAnchor="middle">51.2V // 10.24 kWh</text>

    {/* State of Charge (SoC) Multi-Segment Fuel Gauge */}
    <rect x="21" y="43" width="38" height="6" rx="2" fill="#030712" stroke="#1E293B" />
    <rect x="23" y="44.5" width="6" height="3" rx="0.8" fill="#10B981" />
    <rect x="30" y="44.5" width="6" height="3" rx="0.8" fill="#10B981" />
    <rect x="37" y="44.5" width="6" height="3" rx="0.8" fill="#10B981" />
    <rect x="44" y="44.5" width="6" height="3" rx="0.8" fill="#10B981" />
    <rect x="51" y="44.5" width="6" height="3" rx="0.8" fill="#00D2FF" />

    {/* Illuminated Power Switch */}
    <circle cx="26" cy="56" r="3.5" fill="#0F172A" stroke="#00D2FF" strokeWidth="1.2" />
    <circle cx="26" cy="56" r="1.5" fill="#00D2FF" />

    {/* Dual RJ45 CAN/RS485 Comms Ports */}
    <rect x="36" y="53" width="7" height="6" rx="1" fill="#0B132B" stroke="#64748B" strokeWidth="0.8" />
    <rect x="46" y="53" width="7" height="6" rx="1" fill="#0B132B" stroke="#64748B" strokeWidth="0.8" />
  </svg>
);

// =============================================================================
// 4. COMPLETE KITS: Cohesive Solar Panel + Inverter + Battery Ecosystem
// =============================================================================
export const CompleteKitsIcon: React.FC<IconProps> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="kit-wire" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#00D2FF" />
        <stop offset="100%" stopColor="#10B981" />
      </linearGradient>
    </defs>

    {/* Solar PV Panel (Left) */}
    <polygon points="8,48 30,48 26,18 11,18" fill="#0E335E" stroke="#94A3B8" strokeWidth="1.2" />
    <line x1="18" y1="18" x2="20" y2="48" stroke="#E2E8F0" strokeWidth="0.8" />
    <line x1="9" y1="33" x2="28" y2="33" stroke="#60A5FA" strokeWidth="0.6" />

    {/* Hybrid Inverter (Top Right) */}
    <rect x="36" y="12" width="22" height="28" rx="3" fill="#1E293B" stroke="#64748B" strokeWidth="1.2" />
    <rect x="40" y="16" width="14" height="10" rx="1.5" fill="#021E2C" stroke="#00D2FF" strokeWidth="0.8" />
    <circle cx="47" cy="33" r="2.5" fill="#0F172A" stroke="#EF4444" />

    {/* LiFePO4 Storage Unit (Bottom Right) */}
    <rect x="34" y="46" width="38" height="24" rx="3.5" fill="#0F172A" stroke="#475569" strokeWidth="1.2" />
    <text x="53" y="55" fill="#F8FAFC" fontSize="5" fontWeight="bold" textAnchor="middle">LiFePO4</text>
    <rect x="38" y="58" width="30" height="4" rx="1" fill="#020617" />
    <rect x="40" y="59" width="6" height="2" fill="#10B981" />
    <rect x="48" y="59" width="6" height="2" fill="#10B981" />
    <rect x="56" y="59" width="6" height="2" fill="#00D2FF" />

    {/* Energetic Interconnecting Flow Conduits */}
    <path d="M26 36 H36" stroke="url(#kit-wire)" strokeWidth="2" strokeDasharray="3 2" />
    <path d="M47 40 V46" stroke="url(#kit-wire)" strokeWidth="2" strokeDasharray="3 2" />

    {/* Turnkey Gold Verified Checkmark Badge */}
    <circle cx="68" cy="18" r="8" fill="#F59E0B" stroke="#FEF3C7" strokeWidth="1.5" />
    <path d="M64 18 L67 21 L72 15" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// =============================================================================
// 5. MOUNTING: Heavy-Duty Extruded Aluminum Rail & Roof Bracket Clamp
// =============================================================================
export const MountingIcon: React.FC<IconProps> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="mnt-alu" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#94A3B8" />
        <stop offset="50%" stopColor="#CBD5E1" />
        <stop offset="100%" stopColor="#64748B" />
      </linearGradient>
      <linearGradient id="mnt-dark" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="100%" stopColor="#1E293B" />
      </linearGradient>
    </defs>

    {/* Extruded Aluminum Solar Mounting Rail Profile */}
    <path d="M12 40 L68 22 L68 34 L12 52 Z" fill="url(#mnt-alu)" stroke="#CBD5E1" strokeWidth="1.2" />
    <path d="M12 52 L68 34 L68 42 L12 60 Z" fill="url(#mnt-dark)" stroke="#475569" strokeWidth="1" />
    
    {/* Internal T-Bolt Slot Channel */}
    <path d="M16 43 L64 27 L64 30 L16 46 Z" fill="#0F172A" />

    {/* Stainless Steel Roof Hook & Clamp */}
    <path d="M34 16 H48 V26 H42 V38 H34 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.2" />
    <rect x="32" y="12" width="18" height="6" rx="1.5" fill="#CBD5E1" stroke="#64748B" />

    {/* Allen Socket Cap Bolt */}
    <circle cx="41" cy="15" r="2.5" fill="#475569" />
    <polygon points="41,13.5 42.5,14.3 42.5,15.7 41,16.5 39.5,15.7 39.5,14.3" fill="#0F172A" />

    {/* Heavy Structural Roof Base Tile Bracket */}
    <path d="M22 56 L36 44 L44 52 L30 64 H16 Z" fill="#334155" stroke="#64748B" strokeWidth="1.2" />
    <circle cx="24" cy="60" r="2.2" fill="#CBD5E1" stroke="#0F172A" />
    <circle cx="34" cy="54" r="2.2" fill="#CBD5E1" stroke="#0F172A" />
  </svg>
);

// =============================================================================
// 6. PROTECTION: Type II DC Surge Protection Device (SPD) + DC Breaker
// =============================================================================
export const ProtectionIcon: React.FC<IconProps> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* DIN Enclosure */}
    <rect x="16" y="10" width="48" height="60" rx="4" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
    
    {/* Module Split: Breaker on Left, SPD on Right */}
    <line x1="40" y1="10" x2="40" y2="70" stroke="#0F172A" strokeWidth="2" />

    {/* Left Pole: 1000V DC Breaker Toggle */}
    <rect x="22" y="24" width="12" height="24" rx="2" fill="#0F172A" stroke="#475569" />
    <rect x="24" y="26" width="8" height="12" rx="1.5" fill="#DC2626" />
    <text x="28" y="34" fill="white" fontSize="4.5" fontWeight="bold" textAnchor="middle">ON</text>

    {/* Right Pole: Surge Protective Cartridge with Health Window */}
    <rect x="44" y="18" width="16" height="34" rx="2" fill="#0F172A" stroke="#475569" />
    
    {/* Green Healthy Status Window */}
    <rect x="47" y="24" width="10" height="7" rx="1" fill="#10B981" stroke="#059669" strokeWidth="0.8" />
    <text x="52" y="29.5" fill="white" fontSize="4" fontWeight="bold" textAnchor="middle">OK</text>

    {/* High Voltage Lightning Hazard Emblem */}
    <path d="M53 34 L49 42 H53 L51 49 L57 40 H53 L55 34 Z" fill="#F59E0B" />

    {/* Screw Terminals */}
    <circle cx="28" cy="16" r="3" fill="#334155" stroke="#94A3B8" />
    <line x1="26" y1="16" x2="30" y2="16" stroke="#E2E8F0" strokeWidth="0.8" />
    <circle cx="52" cy="16" r="3" fill="#334155" stroke="#94A3B8" />
    <line x1="50" y1="16" x2="54" y2="16" stroke="#E2E8F0" strokeWidth="0.8" />

    <circle cx="28" cy="64" r="3" fill="#334155" stroke="#94A3B8" />
    <line x1="26" y1="64" x2="30" y2="64" stroke="#E2E8F0" strokeWidth="0.8" />
    <circle cx="52" cy="64" r="3" fill="#334155" stroke="#94A3B8" />
    <line x1="50" y1="64" x2="54" y2="64" stroke="#E2E8F0" strokeWidth="0.8" />
  </svg>
);

// =============================================================================
// 7. AC COMPONENTS: Single & 3-Phase Distribution Board & Circuit Breakers
// =============================================================================
export const AcComponentsIcon: React.FC<IconProps> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* DB Enclosure */}
    <rect x="14" y="12" width="52" height="56" rx="5" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
    <rect x="18" y="16" width="44" height="48" rx="3" fill="#0B101B" stroke="#334155" />

    {/* DIN Rail */}
    <line x1="20" y1="36" x2="60" y2="36" stroke="#64748B" strokeWidth="3" />

    {/* Main 63A Dual-Pole Isolator */}
    <rect x="22" y="24" width="10" height="26" rx="2" fill="#0F172A" stroke="#EF4444" strokeWidth="1" />
    <rect x="24" y="28" width="6" height="10" rx="1" fill="#EF4444" />

    {/* RCD Earth Leakage Breaker with Test Button */}
    <rect x="34" y="24" width="12" height="26" rx="2" fill="#0F172A" stroke="#38BDF8" strokeWidth="1" />
    <rect x="36" y="28" width="4" height="10" rx="1" fill="#38BDF8" />
    <circle cx="43" cy="33" r="2" fill="#FBBF24" />

    {/* Individual Circuit Breakers */}
    <rect x="48" y="24" width="6" height="26" rx="1.5" fill="#0F172A" stroke="#94A3B8" />
    <rect x="49" y="28" width="4" height="6" fill="#F8FAFC" />
    <rect x="55" y="24" width="6" height="26" rx="1.5" fill="#0F172A" stroke="#94A3B8" />
    <rect x="56" y="28" width="4" height="6" fill="#F8FAFC" />

    {/* Copper Neutral / Earth Busbar */}
    <rect x="22" y="55" width="36" height="3.5" rx="1" fill="#D97706" />
    <circle cx="26" cy="56.7" r="1" fill="#FEF3C7" />
    <circle cx="32" cy="56.7" r="1" fill="#FEF3C7" />
    <circle cx="38" cy="56.7" r="1" fill="#FEF3C7" />
    <circle cx="44" cy="56.7" r="1" fill="#FEF3C7" />
    <circle cx="50" cy="56.7" r="1" fill="#FEF3C7" />
  </svg>
);

// =============================================================================
// 8. BALANCE OF SYSTEM: Combiner Box & Ceramic 1000V DC Fuses
// =============================================================================
export const BalanceOfSystemIcon: React.FC<IconProps> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* IP65 Combiner Box Enclosure */}
    <rect x="15" y="12" width="50" height="56" rx="5" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
    <rect x="19" y="16" width="42" height="48" rx="3" fill="#090D16" stroke="#334155" />

    {/* Dual 1000V DC Ceramic Cartridge Fuses */}
    <rect x="25" y="22" width="10" height="34" rx="2" fill="#F8FAFC" stroke="#CBD5E1" />
    <rect x="25" y="22" width="10" height="7" rx="1" fill="#D97706" />
    <rect x="25" y="49" width="10" height="7" rx="1" fill="#D97706" />
    <line x1="30" y1="32" x2="30" y2="46" stroke="#94A3B8" strokeWidth="1.5" />

    <rect x="38" y="22" width="10" height="34" rx="2" fill="#F8FAFC" stroke="#CBD5E1" />
    <rect x="38" y="22" width="10" height="7" rx="1" fill="#D97706" />
    <rect x="38" y="49" width="10" height="7" rx="1" fill="#D97706" />
    <line x1="43" y1="32" x2="43" y2="46" stroke="#94A3B8" strokeWidth="1.5" />

    {/* Heavy Brass Grounding Bar */}
    <rect x="51" y="22" width="5" height="34" rx="1" fill="#F59E0B" stroke="#D97706" />
    <circle cx="53.5" cy="28" r="1.5" fill="#451A03" />
    <circle cx="53.5" cy="36" r="1.5" fill="#451A03" />
    <circle cx="53.5" cy="44" r="1.5" fill="#451A03" />

    {/* SABS 10142 Standard Shield */}
    <circle cx="64" cy="18" r="7" fill="#00D2FF" opacity="0.2" stroke="#00D2FF" strokeWidth="1" />
    <path d="M64 14 L68 16 V19 C68 22 64 24 64 24 C64 24 60 22 60 19 V16 Z" fill="#00D2FF" />
  </svg>
);

// =============================================================================
// 9. CABLES & LEADS: Red & Black Solar PV Cables with MC4 Connectors
// =============================================================================
export const CablesIcon: React.FC<IconProps> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Red Positive Solar Cable */}
    <path d="M22 68 V38 C22 28 32 20 42 20 H52" stroke="#DC2626" strokeWidth="6" strokeLinecap="round" />
    
    {/* Black Negative Solar Cable */}
    <path d="M28 68 V42 C28 34 36 28 44 28 H58" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
    <path d="M28 68 V42 C28 34 36 28 44 28 H58" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" strokeLinecap="round" />

    {/* MC4 Solar Male Connector Assembly */}
    <rect x="48" y="16" width="16" height="8" rx="2" fill="#0F172A" stroke="#64748B" strokeWidth="1.2" />
    <line x1="53" y1="16" x2="53" y2="24" stroke="#334155" strokeWidth="1.5" />
    <line x1="58" y1="16" x2="58" y2="24" stroke="#334155" strokeWidth="1.5" />
    <rect x="64" y="18" width="6" height="4" rx="1" fill="#D97706" />

    {/* MC4 Solar Female Connector Assembly */}
    <rect x="54" y="24" width="18" height="8" rx="2" fill="#0F172A" stroke="#64748B" strokeWidth="1.2" />
    <line x1="60" y1="24" x2="60" y2="32" stroke="#334155" strokeWidth="1.5" />
    <line x1="66" y1="24" x2="66" y2="32" stroke="#334155" strokeWidth="1.5" />

    {/* Exposed Pure Copper Stranded Core at Cable Tip */}
    <path d="M19 68 H25" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M25 68 H31" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

// =============================================================================
// 10. SWITCHES & ISOLATORS: Rotary DC/AC Isolator with Red Handle & Yellow Plate
// =============================================================================
export const SwitchesIcon: React.FC<IconProps> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* IP66 Industrial Box Enclosure */}
    <rect x="14" y="12" width="52" height="56" rx="6" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
    
    {/* Corner Sealing Screws */}
    <circle cx="18" cy="16" r="2" fill="#94A3B8" />
    <circle cx="62" cy="16" r="2" fill="#94A3B8" />
    <circle cx="18" cy="64" r="2" fill="#94A3B8" />
    <circle cx="62" cy="64" r="2" fill="#94A3B8" />

    {/* High-Vis Yellow Faceplate */}
    <rect x="20" y="18" width="40" height="44" rx="3.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1.2" />

    {/* Position Markings */}
    <text x="27" y="42" fill="#000000" fontSize="5.5" fontWeight="900" fontFamily="sans-serif">OFF</text>
    <text x="40" y="27" fill="#000000" fontSize="5.5" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">ON</text>

    {/* Rotary Knob Base Dial */}
    <circle cx="40" cy="40" r="13" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
    
    {/* Red Ergonomic Rotary Handle */}
    <rect x="36" y="24" width="8" height="24" rx="3" fill="#DC2626" stroke="#B91C1C" strokeWidth="1" />
    <circle cx="40" cy="40" r="3" fill="#991B1B" />
    
    {/* Padlock Lockout Hole */}
    <circle cx="40" cy="30" r="1.8" fill="#FBBF24" />
  </svg>
);

// =============================================================================
// 11. ENERGY MANAGEMENT: Smart Home Gateway with Dynamic Telemetry Flow
// =============================================================================
export const EnergyManagementIcon: React.FC<IconProps> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Smart Home Energy Gateway Console */}
    <rect x="16" y="14" width="48" height="52" rx="6" fill="#0F172A" stroke="#00D2FF" strokeWidth="1.5" />
    <rect x="20" y="18" width="40" height="34" rx="3" fill="#041E28" stroke="#0284C7" />

    {/* Dynamic Power Graph */}
    <path d="M24 38 L30 32 L36 40 L44 26 L52 34 L56 30" stroke="#00D2FF" strokeWidth="2" fill="none" strokeLinecap="round" />
    <circle cx="44" cy="26" r="2.5" fill="#10B981" />

    {/* Telemetry Indicator Waves */}
    <path d="M40 10 Q40 6 46 6" stroke="#00D2FF" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M40 8 Q40 4 50 4" stroke="#00D2FF" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />

    {/* Current Transformer (CT) Clamp */}
    <rect x="22" y="56" width="16" height="6" rx="2" fill="#334155" stroke="#94A3B8" />
    <circle cx="30" cy="59" r="1.5" fill="#00D2FF" />

    {/* Status Glow */}
    <circle cx="48" cy="59" r="2" fill="#10B981" />
    <circle cx="55" cy="59" r="2" fill="#38BDF8" />
  </svg>
);

// =============================================================================
// 12. GENERATOR ATS: Automatic Transfer Switch with Dual Grid/Genset Source
// =============================================================================
export const GeneratorIntegrationIcon: React.FC<IconProps> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* ATS Heavy Industrial Case */}
    <rect x="14" y="12" width="52" height="56" rx="5" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
    
    {/* Dual Source Indicators */}
    <rect x="18" y="16" width="20" height="14" rx="2" fill="#0F172A" stroke="#10B981" strokeWidth="1" />
    <circle cx="23" cy="23" r="2" fill="#10B981" />
    <text x="28" y="25" fill="#10B981" fontSize="4.5" fontWeight="bold" fontFamily="monospace">GRID</text>

    <rect x="42" y="16" width="20" height="14" rx="2" fill="#0F172A" stroke="#F59E0B" strokeWidth="1" />
    <circle cx="47" cy="23" r="2" fill="#F59E0B" />
    <text x="52" y="25" fill="#F59E0B" fontSize="4.5" fontWeight="bold" fontFamily="monospace">GEN</text>

    {/* Heavy Motorized Changeover Switch Linkage */}
    <rect x="22" y="34" width="36" height="18" rx="3" fill="#090D16" stroke="#334155" />
    <circle cx="40" cy="43" r="6" fill="#334155" stroke="#94A3B8" strokeWidth="1.2" />
    <path d="M37 43 L32 38 M43 43 L48 48" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />

    {/* Auto-Start Dry Contact Terminals */}
    <rect x="24" y="56" width="32" height="6" rx="1.5" fill="#030712" stroke="#475569" />
    <circle cx="28" cy="59" r="1.5" fill="#D97706" />
    <circle cx="34" cy="59" r="1.5" fill="#D97706" />
    <circle cx="40" cy="59" r="1.5" fill="#D97706" />
    <circle cx="46" cy="59" r="1.5" fill="#D97706" />
    <circle cx="52" cy="59" r="1.5" fill="#D97706" />
  </svg>
);

// =============================================================================
// 13. POWER METERS: Bi-Directional Smart Energy Meter with Digital LCD
// =============================================================================
export const PowerManagementIcon: React.FC<IconProps> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* DIN Rail Smart Meter Enclosure */}
    <rect x="18" y="10" width="44" height="60" rx="4" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
    
    {/* Backlit LCD Screen */}
    <rect x="23" y="16" width="34" height="24" rx="2.5" fill="#041E28" stroke="#00D2FF" strokeWidth="1.2" />
    <text x="40" y="27" fill="#00D2FF" fontSize="7.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">4.82</text>
    <text x="40" y="35" fill="#38BDF8" fontSize="4.5" fontFamily="monospace" textAnchor="middle">kWh  ⇄  NET</text>

    {/* Pulse LED Diode */}
    <circle cx="27" cy="46" r="2.2" fill="#EF4444" stroke="#DC2626" />
    <text x="32" y="47.5" fill="#94A3B8" fontSize="3.5" fontFamily="sans-serif">1000 imp/kWh</text>

    {/* Calibration Keypad Buttons */}
    <rect x="26" y="52" width="7" height="6" rx="1.5" fill="#334155" stroke="#64748B" />
    <text x="29.5" y="56.5" fill="white" fontSize="4" fontWeight="bold" textAnchor="middle">▲</text>
    <rect x="36" y="52" width="7" height="6" rx="1.5" fill="#334155" stroke="#64748B" />
    <text x="39.5" y="56.5" fill="white" fontSize="4" fontWeight="bold" textAnchor="middle">▼</text>
    <rect x="46" y="52" width="7" height="6" rx="1.5" fill="#0284C7" stroke="#38BDF8" />
    <text x="49.5" y="56.5" fill="white" fontSize="3.5" fontWeight="bold" textAnchor="middle">OK</text>

    {/* Tamper Seal Wire Lug */}
    <circle cx="40" cy="64" r="1.5" fill="#D97706" />
  </svg>
);

// =============================================================================
// 14. MONITORING DISPLAYS: Color Touchscreen Energy Monitor Console
// =============================================================================
export const DisplayIcon: React.FC<IconProps> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Ultra-Thin Tablet Bezel */}
    <rect x="12" y="14" width="56" height="52" rx="6" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />
    
    {/* High-Resolution Glass Display */}
    <rect x="15" y="17" width="50" height="46" rx="4" fill="#030712" />

    {/* Battery Circle Gauge */}
    <circle cx="28" cy="32" r="8" stroke="#1E293B" strokeWidth="2.5" />
    <circle cx="28" cy="32" r="8" stroke="#10B981" strokeWidth="2.5" strokeDasharray="40 10" />
    <text x="28" y="34.5" fill="white" fontSize="4.5" fontWeight="bold" textAnchor="middle">98%</text>

    {/* Solar Generation Curve */}
    <path d="M40 38 Q48 22 58 38" stroke="#F59E0B" strokeWidth="2" fill="none" strokeLinecap="round" />
    <text x="49" y="44" fill="#F59E0B" fontSize="4" fontFamily="monospace" textAnchor="middle">4.2 kW</text>

    {/* Status Bar */}
    <line x1="18" y1="52" x2="62" y2="52" stroke="#1E2530" strokeWidth="1" />
    <rect x="54" y="22" width="1.5" height="2" fill="#00D2FF" />
    <rect x="56.5" y="20.5" width="1.5" height="3.5" fill="#00D2FF" />
    <rect x="59" y="19" width="1.5" height="5" fill="#00D2FF" />
  </svg>
);

// =============================================================================
// 15. ACCESSORIES: Communication Dongle, BMS Leads & Rail Splices
// =============================================================================
export const AccessoriesIcon: React.FC<IconProps> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* USB Wi-Fi Logger Stick */}
    <rect x="22" y="16" width="14" height="28" rx="2.5" fill="#0F172A" stroke="#00D2FF" strokeWidth="1.2" />
    <rect x="25" y="10" width="8" height="6" rx="1" fill="#D97706" />
    <circle cx="29" cy="36" r="1.5" fill="#00D2FF" />

    {/* Heavy Copper Battery Terminal Crimp Lug */}
    <path d="M44 48 C44 42 50 38 56 38 C62 38 68 42 68 48 C68 53 64 56 60 58 V68 H52 V58 C48 56 44 53 44 48 Z" fill="#D97706" stroke="#B45309" strokeWidth="1" />
    <circle cx="56" cy="48" r="4" fill="#0F172A" />

    {/* Microchip / Smart Controller Motif */}
    <rect x="18" y="52" width="16" height="14" rx="2" fill="#1E293B" stroke="#64748B" />
    <line x1="15" y1="56" x2="18" y2="56" stroke="#CBD5E1" strokeWidth="1.2" />
    <line x1="15" y1="62" x2="18" y2="62" stroke="#CBD5E1" strokeWidth="1.2" />
    <line x1="34" y1="56" x2="37" y2="56" stroke="#CBD5E1" strokeWidth="1.2" />
    <line x1="34" y1="62" x2="37" y2="62" stroke="#CBD5E1" strokeWidth="1.2" />
  </svg>
);

// =============================================================================
// 16. TOOLS: MC4 Ratchet Crimper & Professional Digital Multimeter
// =============================================================================
export const ToolsIcon: React.FC<IconProps> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Crossed Professional Solar Tools */}
    <path d="M22 18 L34 30 L48 16 L54 22 L40 36 L52 48 L46 54 L34 42 L22 54 L16 48 L28 36 L16 24 Z" fill="#1E293B" stroke="#00D2FF" strokeWidth="1.2" />
    <circle cx="34" cy="36" r="3" fill="#64748B" />

    <rect x="42" y="32" width="24" height="36" rx="4" fill="#F59E0B" stroke="#D97706" strokeWidth="1.2" />
    <rect x="46" y="36" width="16" height="10" rx="1.5" fill="#041E28" stroke="#38BDF8" />
    <text x="54" y="43" fill="#38BDF8" fontSize="4.5" fontFamily="monospace" textAnchor="middle">1000V</text>
    <circle cx="54" cy="54" r="4" fill="#0F172A" stroke="#64748B" />
  </svg>
);

// =============================================================================
// 17. WARNING LABELS: Official SANS 10142 PV Hazard Warning Decal
// =============================================================================
export const LabelsIcon: React.FC<IconProps> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M40 12 L70 64 H10 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="2" strokeLinejoin="round" />
    <path d="M40 18 L64 60 H16 Z" fill="#FBBF24" />

    {/* Bold Black Lightning Strike Symbol */}
    <path d="M41 24 L32 38 H41 L37 54 L49 36 H40 L44 24 Z" fill="#000000" />

    {/* Peel-and-Stick 3D Curled Corner */}
    <path d="M62 64 L70 64 L70 56 Z" fill="#CBD5E1" stroke="#94A3B8" />
    <polygon points="62,64 70,56 62,56" fill="#F8FAFC" />
  </svg>
);

// =============================================================================
// 18. SPECIAL OFFERS: Metallic Promotional Crest & Solar Discount Bundle
// =============================================================================
export const SpecialOffersIcon: React.FC<IconProps> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <polygon points="40,10 66,24 66,56 40,70 14,56 14,24" fill="#0F172A" stroke="#00D2FF" strokeWidth="2" />
    <polygon points="40,14 62,26 62,54 40,66 18,54 18,26" fill="#1E293B" stroke="#334155" />

    <path d="M40 22 L44 32 L54 36 L44 40 L40 50 L36 40 L26 36 L36 32 Z" fill="#F59E0B" stroke="#FEF3C7" strokeWidth="1.2" />

    <circle cx="56" cy="24" r="8" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
    <text x="56" y="27" fill="white" fontSize="7" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">%</text>
  </svg>
);

// =============================================================================
// 19. CLEARANCE PRODUCTS: Industrial Clearance Tag with Slashed Price Tag
// =============================================================================
export const ClearanceProductsIcon: React.FC<IconProps> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M16 38 L38 16 H64 V42 L42 64 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
    <path d="M22 38 L40 20 H60 V38 L42 56 Z" fill="#991B1B" />

    <circle cx="54" cy="26" r="3.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
    <circle cx="54" cy="26" r="1.5" fill="#0F172A" />

    <text x="36" y="42" fill="white" fontSize="7" fontWeight="900" fontFamily="monospace" transform="rotate(-45 36 42)">SALE</text>
  </svg>
);

// =============================================================================
// 20. DISCONTINUED PRODUCTS: Industrial Archive Hardware Vault
// =============================================================================
export const DiscontinuedProductsIcon: React.FC<IconProps> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="16" y="20" width="48" height="44" rx="4" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
    
    <circle cx="18" cy="22" r="3.5" fill="#94A3B8" />
    <circle cx="62" cy="22" r="3.5" fill="#94A3B8" />
    <circle cx="18" cy="62" r="3.5" fill="#94A3B8" />
    <circle cx="62" cy="62" r="3.5" fill="#94A3B8" />

    <rect x="20" y="34" width="40" height="12" fill="#F59E0B" stroke="#000000" strokeWidth="0.8" />
    <path d="M22 34 L28 46 M32 34 L38 46 M42 34 L48 46 M52 34 L58 46" stroke="#000000" strokeWidth="2.5" />

    <rect x="34" y="52" width="12" height="4" rx="2" fill="#0F172A" stroke="#94A3B8" />
  </svg>
);

// =============================================================================
// 21. RECENTLY VIEWED: Tactical Telemetry Lens & Optic Crosshair
// =============================================================================
export const RecentlyViewedIcon: React.FC<IconProps> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="14" y="14" width="52" height="52" rx="4" fill="#0F172A" stroke="#1E293B" />
    <line x1="14" y1="40" x2="66" y2="40" stroke="#1E2530" strokeWidth="1" strokeDasharray="2 2" />
    <line x1="40" y1="14" x2="40" y2="66" stroke="#1E2530" strokeWidth="1" strokeDasharray="2 2" />

    <circle cx="38" cy="38" r="16" fill="#0284C7" fillOpacity="0.2" stroke="#E2E8F0" strokeWidth="3" />
    <circle cx="38" cy="38" r="13" stroke="#00D2FF" strokeWidth="1" strokeDasharray="4 2" />

    <path d="M28 30 A12 12 0 0 1 44 26" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

    <line x1="50" y1="50" x2="66" y2="66" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
    <line x1="50" y1="50" x2="66" y2="66" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
