import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
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
  Phone, 
  MapPin, 
  ShoppingBag,
  Zap,
  Award
} from 'lucide-react';

interface LoginPageProps {
  setCurrentRoute: (route: string) => void;
  onSuccessRedirect?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ 
  setCurrentRoute,
  onSuccessRedirect = 'portal'
}) => {
  const { 
    login, 
    register, 
    loginWithGoogle, 
    loginWithApple, 
    loginWithFacebook, 
    isAuthenticated, 
    currentUser, 
    isAdmin 
  } = useAuth();
  const { items: cartItems, setIsCartOpen } = useCart();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  // Login Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | 'facebook' | null>(null);

  // Register Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCity, setRegCity] = useState('Johannesburg');
  const [regPassword, setRegPassword] = useState('');

  const handleSocialSuccess = () => {
    if (cartItems.length > 0) {
      setCurrentRoute('shop');
      setTimeout(() => setIsCartOpen(true), 300);
    } else {
      setCurrentRoute(onSuccessRedirect);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        const emailLower = email.trim().toLowerCase();
        if (emailLower === 'delightchetter@gmail.com' || emailLower.includes('admin')) {
          setCurrentRoute('admin');
        } else if (cartItems.length > 0) {
          setCurrentRoute('shop');
          setTimeout(() => setIsCartOpen(true), 300);
        } else {
          setCurrentRoute(onSuccessRedirect);
        }
      } else {
        setErrorMsg(res.message || 'Invalid email or password.');
      }
    } catch {
      setErrorMsg('Failed to sign in. Please check your credentials and try again.');
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
        password: regPassword,
        city: regCity
      });

      if (res.success) {
        if (cartItems.length > 0) {
          setCurrentRoute('shop');
          setTimeout(() => setIsCartOpen(true), 300);
        } else {
          setCurrentRoute(onSuccessRedirect);
        }
      } else {
        setErrorMsg(res.message || 'Failed to create account.');
      }
    } catch {
      setErrorMsg('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg('');
    setSocialLoading('google');
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        handleSocialSuccess();
      } else if (res.message) {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg('Google authentication encountered an issue.');
    } finally {
      setSocialLoading(null);
    }
  };

  const handleAppleAuth = async () => {
    setErrorMsg('');
    setSocialLoading('apple');
    try {
      const res = await loginWithApple();
      if (res.success) {
        handleSocialSuccess();
      } else if (res.message) {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg('Apple authentication encountered an issue.');
    } finally {
      setSocialLoading(null);
    }
  };

  const handleFacebookAuth = async () => {
    setErrorMsg('');
    setSocialLoading('facebook');
    try {
      const res = await loginWithFacebook();
      if (res.success) {
        handleSocialSuccess();
      } else if (res.message) {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg('Facebook authentication encountered an issue.');
    } finally {
      setSocialLoading(null);
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
          <p className="text-xs text-[#9EADA5] font-mono">{currentUser.email}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          {isAdmin ? (
            <button
              onClick={() => setCurrentRoute('admin')}
              className="py-2.5 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-mono font-bold text-xs uppercase rounded transition-colors"
            >
              Admin Dashboard
            </button>
          ) : (
            <button
              onClick={() => setCurrentRoute('portal')}
              className="py-2.5 bg-[#1B4D3E] hover:bg-[#286D58] text-white font-mono font-bold text-xs uppercase rounded transition-colors"
            >
              My Energy Portal
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Cart items notice — shown when user was redirected from checkout */}
      {cartItems.length > 0 && (
        <div className="mb-6 p-4 bg-[#D97706]/10 border border-[#D97706]/40 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#D97706]/20 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5 text-[#D97706]" />
          </div>
          <div>
            <span className="text-sm font-bold text-white block">You have {cartItems.length} item{cartItems.length > 1 ? 's' : ''} in your cart</span>
            <span className="text-xs text-[#9EADA5]">Sign in or create an account to complete your purchase. Your cart is saved.</span>
          </div>
        </div>
      )}

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
                Log in to your private account to track turnkey installation milestones, view live inverter telemetry, download electrical CoCs, and manage warranty coverage.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-3.5 pt-2 text-xs font-mono text-[#9EADA5]">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Live Project Milestone & Dispatch Tracking</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Official SANS 10142-1-2 Electrical CoC Vault</span>
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

          {/* Compliance & Security Guarantee Box */}
          <div className="p-4 bg-[#0E1311] border border-[#24302A] rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#10B981] font-bold uppercase">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Enterprise Grade Security</span>
            </div>
            <p className="text-[11px] text-[#9EADA5] leading-relaxed">
              Protected by 256-Bit SSL Secured Enterprise Authentication, encrypted with 256-bit SSL protocols, and compliant with POPIA regulations.
            </p>
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
            </div>

            {errorMsg && (
              <div className="p-3 mb-6 bg-red-950/40 border border-red-800/60 rounded text-xs text-red-200 font-mono">
                {errorMsg}
              </div>
            )}

            {/* Social Authentication Buttons (Google, Apple, Facebook) */}
            <div className="space-y-2.5 mb-6">
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={socialLoading !== null}
                className="w-full py-2.5 px-4 bg-[#0E1311] hover:bg-[#1A221E] border border-[#24302A] hover:border-[#3A4D43] text-white rounded-xl text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-3 shadow-sm"
              >
                {socialLoading === 'google' ? (
                  <span className="w-4 h-4 rounded-full border-2 border-[#10B981] border-t-transparent animate-spin" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleAppleAuth}
                  disabled={socialLoading !== null}
                  className="py-2.5 px-3 bg-[#0E1311] hover:bg-[#1A221E] border border-[#24302A] hover:border-[#3A4D43] text-white rounded-xl text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  {socialLoading === 'apple' ? (
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <svg className="w-4 h-4 fill-current text-white shrink-0" viewBox="0 0 170 170">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.59-7.71-11.66-14-5.65-8.8-10.15-18.7-13.49-29.7-3.35-11.01-5.02-21.72-5.02-32.14 0-14.58 3.8-26.83 11.41-36.75 7.6-9.92 17.2-15.01 28.79-15.28 4.58 0 9.8 1.17 15.65 3.51 5.86 2.34 9.72 3.56 11.59 3.66 1.41-.1 5.38-1.39 11.9-3.86 6.52-2.47 11.9-3.56 16.14-3.27 12.84 1.04 23.01 6.09 30.5 15.15-11.31 6.86-16.85 16.31-16.63 28.34.22 9.57 3.86 17.51 10.93 23.82 7.07 6.31 15.44 9.9 25.13 10.77-2.18 6.53-4.68 12.94-7.52 19.23zM119.22 33.15c0-7.29 2.5-14.03 7.51-20.22 5.01-6.19 11.21-10.11 18.6-11.76.65 1.52.98 3.15.98 4.9 0 7.4-2.72 14.3-8.16 20.7-5.44 6.41-11.96 10.22-19.57 11.42-.43-1.63-.66-3.31-.66-5.04z" />
                    </svg>
                  )}
                  <span>Apple</span>
                </button>

                <button
                  type="button"
                  onClick={handleFacebookAuth}
                  disabled={socialLoading !== null}
                  className="py-2.5 px-3 bg-[#0E1311] hover:bg-[#1A221E] border border-[#24302A] hover:border-[#3A4D43] text-white rounded-xl text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  {socialLoading === 'facebook' ? (
                    <span className="w-4 h-4 rounded-full border-2 border-[#1877F2] border-t-transparent animate-spin" />
                  ) : (
                    <svg className="w-4 h-4 fill-[#1877F2] shrink-0" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  )}
                  <span>Facebook</span>
                </button>
              </div>
            </div>

            {/* Visual Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#24302A]"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#141A17] px-3 font-mono text-[#6B7B73] text-[10px]">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* TAB 1: LOGIN */}
            {tab === 'login' && (
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
                      placeholder="e.g. client@domain.co.za"
                      className="w-full bg-[#0E1311] border border-[#24302A] rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-white focus:border-[#286D58]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#9EADA5] mb-1">
                    Password *
                  </label>
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
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-lg font-mono font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 bg-[#1B4D3E] hover:bg-[#286D58] text-white"
                  >
                    <span>{loading ? 'Signing In...' : 'Sign In to Portal'}</span>
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
              Secured by 256-Bit SSL Encryption • SABS & POPIA Data Compliance
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
