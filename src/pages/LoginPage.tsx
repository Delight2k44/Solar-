import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  Sun, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Sparkles,
  Phone,
  MapPin,
  Building2
} from 'lucide-react';

interface LoginPageProps {
  setCurrentRoute: (route: string) => void;
  onSuccessRedirect?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ 
  setCurrentRoute,
  onSuccessRedirect = 'portal'
}) => {
  const { login, register, loginWithDemo, isAuthenticated, currentUser, isAdmin } = useAuth();
  const [tab, setTab] = useState<'login' | 'register' | 'admin'>('login');
  
  // Login Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Register Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCity, setRegCity] = useState('Johannesburg');
  const [regPassword, setRegPassword] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        if (email.toLowerCase().includes('admin')) {
          setCurrentRoute('admin');
        } else {
          setCurrentRoute(onSuccessRedirect);
        }
      } else {
        setErrorMsg(res.message || 'Invalid credentials.');
      }
    } catch {
      setErrorMsg('Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await register({
        name: regName,
        email: regEmail,
        phone: regPhone,
        city: regCity
      });

      if (res.success) {
        setCurrentRoute(onSuccessRedirect);
      }
    } catch {
      setErrorMsg('Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = (role: 'customer' | 'admin') => {
    loginWithDemo(role);
    if (role === 'admin') {
      setCurrentRoute('admin');
    } else {
      setCurrentRoute(onSuccessRedirect);
    }
  };

  if (isAuthenticated && currentUser) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-[#141A17] border border-[#24302A] rounded-2xl text-center space-y-5 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-[#10B981]/20 border border-[#10B981] flex items-center justify-center mx-auto text-[#10B981]">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#286D58] font-bold">Currently Signed In</span>
          <h3 className="text-xl font-bold text-white uppercase">{currentUser.name}</h3>
          <p className="text-xs text-[#9EADA5] font-mono">{currentUser.email} • Role: <strong className="text-white uppercase">{currentUser.role}</strong></p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          {isAdmin ? (
            <button
              onClick={() => setCurrentRoute('admin')}
              className="py-2.5 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-mono font-bold text-xs uppercase rounded transition-colors"
            >
              Go to Admin Panel
            </button>
          ) : (
            <button
              onClick={() => setCurrentRoute('portal')}
              className="py-2.5 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-mono font-bold text-xs uppercase rounded transition-colors"
            >
              Go to Portal
            </button>
          )}

          <button
            onClick={() => setCurrentRoute('home')}
            className="py-2.5 bg-[#0E1311] hover:bg-[#1A221E] border border-[#24302A] text-white font-mono text-xs uppercase rounded transition-colors"
          >
            Return to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Brand & Security Overview */}
        <div className="lg:col-span-5 bg-[#141A17] border border-[#24302A] rounded-2xl p-8 flex flex-col justify-between space-y-8 relative overflow-hidden">
          <div className="space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#1B4D3E] border border-[#286D58] flex items-center justify-center text-white font-bold">
                <Sun className="w-4 h-4" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-white uppercase">
                KINETIX <span className="font-light text-[#9EADA5]">ENERGY</span>
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white uppercase tracking-tight">
                Customer Energy Portal & Order Dispatch
              </h2>
              <p className="text-xs text-[#9EADA5] leading-relaxed">
                Log in to track installation milestones, view live inverter telemetry, download supplementary electrical CoCs, and manage warranty coverage.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-3 pt-2 text-xs font-mono text-[#9EADA5]">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Live Project Milestone Tracking (KX-9042)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>SANS 10142 Electrical CoC PDF Downloads</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Tier-1 10-Year Battery Warranty Registration</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Real-Time Inverter & LiFePO4 Telemetry</span>
              </div>
            </div>
          </div>

          {/* Quick Demo Logins Box */}
          <div className="p-4 bg-[#0E1311] border border-[#286D58]/40 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#286D58] font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant 1-Click Demo Accounts</span>
            </div>
            <p className="text-[11px] text-[#9EADA5]">
              Test user order tracking or the executive admin CMS control dashboard immediately:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleDemoClick('customer')}
                className="p-2 bg-[#141A17] hover:bg-[#1B2420] border border-[#24302A] text-white rounded text-left text-[11px] font-mono transition-colors"
              >
                <span className="text-[#10B981] font-bold block">👤 Client Demo</span>
                <span className="text-[10px] text-[#6B7B73]">Track order KX-9042</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoClick('admin')}
                className="p-2 bg-[#1B4D3E]/30 hover:bg-[#1B4D3E]/50 border border-[#286D58] text-white rounded text-left text-[11px] font-mono transition-colors"
              >
                <span className="text-[#D97706] font-bold block">⚡ Admin CMS Demo</span>
                <span className="text-[10px] text-[#9EADA5]">Control site content & stock</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Authentication Card */}
        <div className="lg:col-span-7 bg-[#141A17] border border-[#24302A] rounded-2xl p-6 sm:p-10 shadow-2xl flex flex-col justify-between">
          <div>
            {/* Tabs */}
            <div className="flex border-b border-[#24302A] mb-8">
              <button
                type="button"
                onClick={() => { setTab('login'); setErrorMsg(''); }}
                className={`flex-1 py-3 text-xs font-mono font-bold uppercase tracking-wider transition-colors border-b-2 ${
                  tab === 'login'
                    ? 'border-[#286D58] text-white bg-[#0E1311]/50'
                    : 'border-transparent text-[#6B7B73] hover:text-[#9EADA5]'
                }`}
              >
                Customer Sign In
              </button>

              <button
                type="button"
                onClick={() => { setTab('register'); setErrorMsg(''); }}
                className={`flex-1 py-3 text-xs font-mono font-bold uppercase tracking-wider transition-colors border-b-2 ${
                  tab === 'register'
                    ? 'border-[#286D58] text-white bg-[#0E1311]/50'
                    : 'border-transparent text-[#6B7B73] hover:text-[#9EADA5]'
                }`}
              >
                Create Account
              </button>

              <button
                type="button"
                onClick={() => { setTab('admin'); setErrorMsg(''); setEmail('admin@kinetixenergy.co.za'); }}
                className={`flex-1 py-3 text-xs font-mono font-bold uppercase tracking-wider transition-colors border-b-2 ${
                  tab === 'admin'
                    ? 'border-[#D97706] text-white bg-[#0E1311]/50'
                    : 'border-transparent text-[#6B7B73] hover:text-[#9EADA5]'
                }`}
              >
                Admin Access
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 mb-6 bg-red-950/40 border border-red-800/60 rounded text-xs text-red-200 font-mono">
                {errorMsg}
              </div>
            )}

            {/* TAB 1: LOGIN (CUSTOMER / ADMIN) */}
            {(tab === 'login' || tab === 'admin') && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#6B7B73] absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder={tab === 'admin' ? 'admin@kinetixenergy.co.za' : 'client@domain.co.za'}
                      className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-mono uppercase text-[#9EADA5]">
                      Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => setPassword('client123')}
                      className="text-[10px] font-mono text-[#286D58] hover:underline"
                    >
                      Fill Demo Password
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#6B7B73] absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg pl-10 pr-10 py-2.5 text-xs text-white focus:border-[#286D58]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-[#6B7B73] hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3.5 rounded-lg font-mono font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                      tab === 'admin'
                        ? 'bg-[#D97706] hover:bg-[#B45309] text-black font-extrabold'
                        : 'bg-[#1B4D3E] hover:bg-[#286D58] text-white'
                    }`}
                  >
                    <span>{loading ? 'Authenticating...' : tab === 'admin' ? 'Authenticate Administrator' : 'Sign In to Portal'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: REGISTER */}
            {tab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Full Name & Surname *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#6B7B73] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      placeholder="e.g. Johan Van Wyk"
                      className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#6B7B73] absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={e => setRegEmail(e.target.value)}
                        placeholder="johan@domain.co.za"
                        className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Phone / WhatsApp *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#6B7B73] absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={e => setRegPhone(e.target.value)}
                        placeholder="+27 82 000 0000"
                        className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">City / Region *</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-[#6B7B73] absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={regCity}
                        onChange={e => setRegCity(e.target.value)}
                        placeholder="e.g. Johannesburg / Pretoria"
                        className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">Create Password *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#6B7B73] absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={e => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#1B4D3E] hover:bg-[#286D58] text-white rounded-lg font-mono font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    <span>{loading ? 'Creating Account...' : 'Complete Customer Registration'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-[#1B2420] text-center">
            <span className="text-[11px] font-mono text-[#6B7B73]">
              Protected by 256-bit encryption • SABS & POPIA Data Compliance
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
