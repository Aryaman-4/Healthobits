import React, { useState } from 'react';
import {
  Shield,
  Sparkles,
  Key,
  Mail,
  Lock,
  User,
  Check,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Database,
  Zap
} from 'lucide-react';
import { useAttackMode } from '../../context/AttackModeContext';
import { sound } from '../../utils/audio';

export const AuthScreen: React.FC = () => {
  const { loginUser, registerUser, loginAsGuest } = useAttackMode();

  const [mode, setMode] = useState<'welcome' | 'login' | 'register'>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('Aryan');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const result = await loginUser(email, password, name);
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Login failed. Please verify credentials.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const result = await registerUser(email, password, name);
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl border-2 border-[#E2E8F0] border-b-6 p-6 sm:p-8 shadow-xl space-y-6">
        {/* Header Hero */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-[#0F172A] text-white flex items-center justify-center text-3xl shadow-md mx-auto">
            ⚡
          </div>

          <div>
            <h1 className="font-black text-2xl text-slate-900 tracking-tight">
              ATTACK MODE
            </h1>
            <p className="font-bold text-xs uppercase tracking-wider text-blue-600 mt-0.5">
              Logical Execution & Section System
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
            <Database size={12} className="text-emerald-600" />
            <span>Cloudflare D1 Database Persistence</span>
          </div>

          <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">
            Log in once, and your 7-day Section System and 4-week monthly scores sync across your phone and laptop.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* MODE 1: WELCOME SCREEN */}
        {mode === 'welcome' && (
          <div className="space-y-3 pt-2">
            <button
              onClick={() => {
                sound.playTap();
                setMode('register');
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider border-2 border-b-4 border-blue-800 active:border-b-2 active:translate-y-0.5 cursor-pointer transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Sparkles size={16} />
              <span>[🚀 GET STARTED (NEW ACCOUNT)]</span>
            </button>

            <button
              onClick={() => {
                sound.playTap();
                setMode('login');
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-black text-xs uppercase tracking-wider border-2 border-b-4 border-slate-300 active:border-b-2 active:translate-y-0.5 cursor-pointer transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Key size={16} className="text-slate-500" />
              <span>[🔑 I ALREADY HAVE AN ACCOUNT (LOG IN)]</span>
            </button>

            <div className="pt-2 text-center">
              <button
                onClick={() => {
                  sound.playTap();
                  loginAsGuest();
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                ⚡ Continue as Guest (Instant Local Demo) ➔
              </button>
            </div>
          </div>
        )}

        {/* MODE 2: LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 pt-1">
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider border-2 border-b-4 border-blue-800 active:border-b-2 active:translate-y-0.5 cursor-pointer transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {isLoading ? <span>Authenticating...</span> : <span>Log In to Attack Mode</span>}
            </button>

            <div className="flex items-center justify-between text-xs font-bold text-slate-500 pt-2">
              <button
                type="button"
                onClick={() => setMode('welcome')}
                className="hover:underline cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Create Account ➔
              </button>
            </div>
          </form>
        )}

        {/* MODE 3: REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 pt-1">
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                  Your Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Aryan"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                  Password (6+ chars)
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider border-2 border-b-4 border-emerald-800 active:border-b-2 active:translate-y-0.5 cursor-pointer transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {isLoading ? <span>Creating Account...</span> : <span>Create Account & Start</span>}
            </button>

            <div className="flex items-center justify-between text-xs font-bold text-slate-500 pt-2">
              <button
                type="button"
                onClick={() => setMode('welcome')}
                className="hover:underline cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Log In Instead ➔
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
