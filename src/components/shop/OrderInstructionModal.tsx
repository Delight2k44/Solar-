import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag,
  Layers,
  FileText,
  Send,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  MousePointerClick,
  Boxes,
  ShieldCheck,
  Zap,
  Printer,
  Cloud
} from 'lucide-react';

interface OrderInstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  referenceNo?: string;
  projectDescription?: string;
}

interface StepItem {
  id: number;
  title: string;
  shortLabel: string;
  icon: React.ElementType;
  badge: string;
  description: string;
  keyPoints: string[];
}

const STEPS: StepItem[] = [
  {
    id: 1,
    title: 'Browse Hardware & Add Products',
    shortLabel: '1. Add Products',
    icon: ShoppingBag,
    badge: 'CATALOG BROWSING // STEP 01',
    description:
      'Explore verified Tier-1 solar panels, hybrid inverters, and lithium storage batteries. Adjust your required quantities and click the "+ Add to Quote" button on any hardware item.',
    keyPoints: [
      'Browse by technical category: Panels, Inverters, Batteries, Mounting, etc.',
      'Configure custom unit quantities [ - ] [ qty ] [ + ] per item.',
      'Live warehouse availability and wholesale trade pricing (ZAR) per watt-peak.'
    ]
  },
  {
    id: 2,
    title: 'Monitor Live Quotation Deck',
    shortLabel: '2. Live Quote Deck',
    icon: Layers,
    badge: 'REAL-TIME TRACKING // STEP 02',
    description:
      'As you add products from the catalog, the persistent top Quotation Deck dynamically calculates line items, quantities, and net trade totals in real-time.',
    keyPoints: [
      'Top sticky banner keeps your active reference number & description visible.',
      'Real-time aggregation of line items, total units, and subtotal ex VAT.',
      'Discard or edit items at any point without losing catalog position.'
    ]
  },
  {
    id: 3,
    title: 'Generate Official Quotation Report',
    shortLabel: '3. Official Report',
    icon: FileText,
    badge: 'LETTERHEAD BILL OF MATERIALS // STEP 03',
    description:
      'Click "Generate Quotation Report" to inspect your official SegenSolar Pty quotation. Review full VAT calculations (15%), c/Wp metrics, and download or print.',
    keyPoints: [
      'Complete bill of materials breakdown with part numbers and serial specs.',
      'Financial summary: Net Subtotal, 15% South African VAT, and Gross Total.',
      'Cloud sync: Save quote directly to Firebase Firestore or export to PDF/Print.'
    ]
  },
  {
    id: 4,
    title: 'Dispatch Order to Procurement',
    shortLabel: '4. Place Order',
    icon: Send,
    badge: 'FULFILLMENT DISPATCH // STEP 04',
    description:
      'When you are ready to proceed, submit the quotation into your trade checkout cart. Reserve warehouse inventory allocation and finalize tracked delivery.',
    keyPoints: [
      'Single-click dispatch transfers all BOM line items directly into trade cart.',
      'Complies with SANS 10142-1-2 CoC standards for grid-tied solar.',
      'Quotes remain securely saved in your account until you choose to complete.'
    ]
  }
];

export const OrderInstructionModal: React.FC<OrderInstructionModalProps> = ({
  isOpen,
  onClose,
  onProceed,
  referenceNo = 'KiPV07912',
  projectDescription = 'Group_Project'
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [simulatedClick, setSimulatedClick] = useState(false);

  const STEP_DURATION_MS = 5000;
  const TICK_MS = 50;

  // Auto-play progress loop
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + (TICK_MS / STEP_DURATION_MS) * 100;
        if (next >= 100) {
          setCurrentStep(curr => (curr % 4) + 1);
          return 0;
        }
        return next;
      });
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  // Reset progress when step changes manually
  const goToStep = (stepId: number) => {
    setCurrentStep(stepId);
    setProgress(0);
  };

  // Click animation effect in Step 1 simulation
  useEffect(() => {
    if (currentStep === 1) {
      const timeout = setTimeout(() => {
        setSimulatedClick(true);
        setTimeout(() => setSimulatedClick(false), 1200);
      }, 1800);
      return () => clearTimeout(timeout);
    }
  }, [currentStep, progress]);

  const handleProceedClick = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem('kinetix_hide_order_guide', 'true');
      } catch {
        // ignore storage errors
      }
    }
    onProceed();
  };

  if (!isOpen) return null;

  const currentStepData = STEPS[currentStep - 1];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0A0D14] border border-[#00D2FF]/40 rounded-3xl w-full max-w-4xl shadow-[0_0_50px_rgba(0,210,255,0.25)] flex flex-col overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-6 border-b border-[#1E2530] bg-gradient-to-r from-[#0D1117] via-[#0A0D14] to-[#0D1117] flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00D2FF]/10 text-[#00D2FF] border border-[#00D2FF]/30 tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF] animate-pulse" />
                HOW TO PLACE AN ORDER // INTERACTIVE GUIDE
              </span>
              <span className="text-xs font-mono text-[#64748B] hidden sm:inline">•</span>
              <span className="text-xs font-mono text-[#94A3B8] hidden sm:inline">
                Quote Ref: <strong className="text-white">{referenceNo}</strong>
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Order Workflow & Quotation Instructions</span>
              <Sparkles className="w-5 h-5 text-[#00D2FF]" />
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#94A3B8] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Close Tutorial"
          >
            ✕
          </button>
        </div>

        {/* Global Auto-Play Progress Bar */}
        <div className="w-full bg-[#1E2530] h-1 relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Navigation Step Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-[#1E2530] bg-[#07090E]">
          {STEPS.map(step => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => goToStep(step.id)}
                className={`p-3 sm:p-4 text-left transition-all border-b-2 flex items-center gap-2.5 cursor-pointer relative ${
                  isActive
                    ? 'border-[#00D2FF] bg-[#00D2FF]/5 text-white'
                    : 'border-transparent text-[#64748B] hover:text-[#94A3B8] hover:bg-white/[0.02]'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? 'bg-[#00D2FF] text-black shadow-[0_0_10px_rgba(0,210,255,0.5)]'
                      : 'bg-white/5 text-[#94A3B8]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#64748B]">
                    Step 0{step.id}
                  </div>
                  <div className="text-xs font-bold truncate">
                    {step.shortLabel.split('. ')[1]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Content Area: Left Explanation & Right Animated Visual Mockup */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0A0D14] items-center">
          
          {/* Left Column: Instructions & Key Steps */}
          <div className="lg:col-span-6 space-y-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-[#00D2FF] font-semibold tracking-wider uppercase">
                {currentStepData.badge}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {currentStepData.title}
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed pt-1">
                {currentStepData.description}
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              {currentStepData.keyPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#0D1117] border border-[#1E2530] text-xs text-[#CBD5E1]"
                >
                  <div className="w-5 h-5 rounded-full bg-[#00D2FF]/20 text-[#00D2FF] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="leading-snug">{point}</span>
                </div>
              ))}
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-2 pt-2 text-xs font-mono text-[#64748B]">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#CBD5E1] transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-[#00D2FF]" /> : <Play className="w-3.5 h-3.5 text-[#00D2FF]" />}
                <span>{isPlaying ? 'Pause Guide' : 'Resume Auto-Play'}</span>
              </button>
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setProgress(0);
                  setIsPlaying(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#CBD5E1] transition-colors cursor-pointer"
                title="Restart Tutorial from Step 1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart</span>
              </button>
            </div>
          </div>

          {/* Right Column: Animated Interactive Simulation Screen */}
          <div className="lg:col-span-6">
            <div className="bg-[#05070A] border border-[#1E2530] rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden min-h-[320px] flex flex-col justify-center">
              
              {/* Subtle tech background grid pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1E253015_1px,transparent_1px),linear-gradient(to_bottom,#1E253015_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

              {/* STEP 1 ANIMATED SIMULATION */}
              {currentStep === 1 && (
                <div className="space-y-4 relative z-10 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center justify-between border-b border-[#1E2530] pb-2 text-[10px] font-mono text-[#64748B]">
                    <span>SIMULATED HARDWARE CATALOG ROW</span>
                    <span className="text-[#00D2FF]">TIER-1 STOCK ACTIVE</span>
                  </div>

                  <div className="bg-[#0D1117] border border-[#1E2530] hover:border-[#00D2FF]/40 rounded-2xl p-3.5 space-y-3 shadow-lg transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E2530] to-[#0A0D14] flex items-center justify-center text-xl border border-white/10 shrink-0">
                        ☀️
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-[#00D2FF] uppercase font-bold">Cinco Solar</span>
                          <span className="text-[9px] font-mono text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded">666 In Stock</span>
                        </div>
                        <div className="text-xs font-bold text-white truncate">
                          Cinco 50W 36 Cell Poly Solar Panel
                        </div>
                        <div className="text-[10px] font-mono text-[#64748B]">
                          SKU: CNCC50P-36 • 510 x 695mm
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold text-white font-mono">R 364,50</div>
                        <div className="text-[9px] font-mono text-[#64748B]">(R7,29/Wp)</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-3 relative">
                      <div className="flex items-center gap-1 bg-[#05070A] border border-[#1E2530] rounded-lg px-2 py-1 text-xs font-mono text-white">
                        <span className="text-[#64748B]">-</span>
                        <span className="px-2 font-bold text-[#00D2FF]">10</span>
                        <span className="text-[#64748B]">+</span>
                      </div>

                      <div className="relative">
                        <button
                          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                            simulatedClick
                              ? 'bg-[#10B981] text-black scale-95 shadow-[0_0_20px_rgba(16,185,129,0.8)]'
                              : 'bg-[#00D2FF] text-black shadow-[0_0_15px_rgba(0,210,255,0.4)]'
                          }`}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{simulatedClick ? 'Added to Quote!' : '+ Add to Quote'}</span>
                        </button>

                        {/* Animated Hand Cursor */}
                        <div
                          className={`absolute -bottom-3 -right-2 transition-all duration-700 pointer-events-none ${
                            simulatedClick ? 'scale-90 translate-x-0' : '-translate-x-3 translate-y-3'
                          }`}
                        >
                          <MousePointerClick className="w-6 h-6 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] animate-bounce" />
                        </div>

                        {/* Rising "+10 Added" Sparkle Badge */}
                        {simulatedClick && (
                          <div className="absolute -top-7 right-0 bg-[#10B981] text-black font-mono font-black text-[10px] px-2 py-0.5 rounded-full animate-out fade-out slide-out-to-top-4 duration-1000 shadow-lg">
                            +10 Units Added!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono text-[#38BDF8] flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 shrink-0" />
                    <span>Click [+ Add to Quote] on any product to append to your active BOM.</span>
                  </div>
                </div>
              )}

              {/* STEP 2 ANIMATED SIMULATION */}
              {currentStep === 2 && (
                <div className="space-y-4 relative z-10 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center justify-between border-b border-[#1E2530] pb-2 text-[10px] font-mono text-[#64748B]">
                    <span>SIMULATED STICKY TOP QUOTE DECK</span>
                    <span className="text-[#10B981]">ACTIVE BUFFER</span>
                  </div>

                  <div className="bg-[#0D1117] border-2 border-[#00D2FF]/60 rounded-2xl p-4 space-y-3 shadow-[0_0_25px_rgba(0,210,255,0.25)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#00D2FF] animate-ping" />
                        <span className="text-[10px] font-mono text-[#00D2FF] font-bold uppercase tracking-wider">
                          ACTIVE PROJECT BUILDER
                        </span>
                      </div>
                      <span className="text-[10px] font-mono bg-white/10 text-white px-2 py-0.5 rounded">
                        Ref: {referenceNo}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-left">
                      <div className="p-2 rounded-lg bg-[#05070A] border border-[#1E2530]">
                        <div className="text-[9px] font-mono text-[#64748B] uppercase">Project Title</div>
                        <div className="text-xs font-bold text-[#00D2FF] truncate font-mono">
                          {projectDescription}
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-[#05070A] border border-[#1E2530]">
                        <div className="text-[9px] font-mono text-[#64748B] uppercase">Line Items</div>
                        <div className="text-xs font-bold text-white font-mono flex items-center gap-1">
                          <Boxes className="w-3 h-3 text-[#10B981]" />
                          <span>3 Items (24 Units)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-white/5">
                      <div>
                        <div className="text-[9px] font-mono text-[#64748B]">Net Subtotal (ex VAT)</div>
                        <div className="text-sm font-black text-white font-mono">
                          R 28,450.00
                        </div>
                      </div>
                      <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] text-black font-mono font-bold text-[10px] uppercase shadow-[0_0_15px_rgba(0,210,255,0.4)] animate-pulse">
                        View Report →
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#00D2FF]/10 border border-[#00D2FF]/30 text-[11px] font-mono text-[#00D2FF] flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 shrink-0" />
                    <span>The Quote Deck sticks to the top of your screen as you browse the catalog.</span>
                  </div>
                </div>
              )}

              {/* STEP 3 ANIMATED SIMULATION */}
              {currentStep === 3 && (
                <div className="space-y-4 relative z-10 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center justify-between border-b border-[#1E2530] pb-2 text-[10px] font-mono text-[#64748B]">
                    <span>SIMULATED OFFICIAL QUOTATION REPORT</span>
                    <span className="text-[#00D2FF]">SEGENSOLAR PTY</span>
                  </div>

                  <div className="bg-[#0D1117] border border-[#1E2530] rounded-2xl p-4 space-y-2.5 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div>
                        <div className="text-xs font-black text-white uppercase tracking-wider">
                          SegenSolar Pty Quotation
                        </div>
                        <div className="text-[10px] font-mono text-[#94A3B8]">
                          Doc: {referenceNo} • Account: KINESP002
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="p-1 rounded bg-white/5 text-[#00D2FF]"><Printer className="w-3 h-3" /></span>
                        <span className="p-1 rounded bg-white/5 text-[#10B981]"><Cloud className="w-3 h-3" /></span>
                      </div>
                    </div>

                    <div className="space-y-1 text-[10px] font-mono">
                      <div className="flex justify-between text-[#94A3B8]">
                        <span>Total Net (ex VAT):</span>
                        <span className="text-white font-bold">R 28,450.00</span>
                      </div>
                      <div className="flex justify-between text-[#94A3B8]">
                        <span>15% South African VAT:</span>
                        <span className="text-white font-bold">R 4,267.50</span>
                      </div>
                      <div className="flex justify-between text-white font-bold pt-1 border-t border-white/10 text-xs">
                        <span>Gross Quotation Total:</span>
                        <span className="text-[#10B981]">R 32,717.50</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-2">
                      <div className="text-[9px] font-mono text-[#64748B]">
                        14-Day Price Lock Guarantee
                      </div>
                      <div className="px-2.5 py-1 rounded bg-white/10 text-[#CBD5E1] text-[10px] font-mono font-bold">
                        Print / PDF Ready
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-300 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span>Includes complete legal terms, 15% VAT, and automated c/Wp calculations.</span>
                  </div>
                </div>
              )}

              {/* STEP 4 ANIMATED SIMULATION */}
              {currentStep === 4 && (
                <div className="space-y-4 relative z-10 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center justify-between border-b border-[#1E2530] pb-2 text-[10px] font-mono text-[#64748B]">
                    <span>SIMULATED PROCUREMENT DISPATCH</span>
                    <span className="text-[#10B981]">READY FOR CHECKOUT</span>
                  </div>

                  <div className="bg-[#0D1117] border border-[#10B981]/50 rounded-2xl p-4 space-y-3 shadow-[0_0_25px_rgba(16,185,129,0.2)] text-center">
                    <div className="w-12 h-12 rounded-full bg-[#10B981]/20 border border-[#10B981] flex items-center justify-center mx-auto text-[#10B981]">
                      <ShieldCheck className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                        Hardware Reserved & Allocated
                      </div>
                      <div className="text-[10px] text-[#94A3B8]">
                        Quote items transferred directly to your Trade Cart buffer for SANS 10142-1-2 CoC verification.
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-[#05070A] border border-[#1E2530] flex items-center justify-around text-[10px] font-mono text-[#CBD5E1]">
                      <span>✓ Warehouse Reserved</span>
                      <span>✓ Tracked Freight</span>
                      <span>✓ CoC Compliant</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-[11px] font-mono text-purple-300 flex items-center gap-2">
                    <Send className="w-3.5 h-3.5 shrink-0" />
                    <span>Submit your order when ready, or keep prospective quotes saved in Firebase.</span>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Bottom Actions & Controls */}
        <div className="p-4 sm:p-6 border-t border-[#1E2530] bg-[#07090E] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="flex items-center gap-2 text-xs font-mono text-[#64748B] cursor-pointer hover:text-[#94A3B8]">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={e => setDontShowAgain(e.target.checked)}
                className="rounded border-[#1E2530] bg-[#05070A] text-[#00D2FF] focus:ring-0 cursor-pointer"
              />
              <span>Don't show this guide automatically next time</span>
            </label>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {/* Step navigation buttons */}
            {currentStep > 1 && (
              <button
                onClick={() => goToStep(currentStep - 1)}
                className="px-3.5 py-2.5 rounded-xl border border-[#1E2530] hover:border-white/20 text-[#CBD5E1] text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Prev Step</span>
              </button>
            )}

            {currentStep < 4 ? (
              <button
                onClick={() => goToStep(currentStep + 1)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : null}

            {/* Main CTA */}
            <button
              onClick={handleProceedClick}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] hover:brightness-110 text-black font-mono font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,210,255,0.4)] flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Start Adding Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
