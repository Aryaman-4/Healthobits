import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  Database,
  ArrowRight
} from 'lucide-react';
import { useAttackMode } from '../../context/AttackModeContext';
import { sound } from '../../utils/audio';

export const AuthScreen: React.FC = () => {
  const { loginUser, registerUser, loginAsGuest } = useAttackMode();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    if (isRegister) {
      const result = await registerUser(email, password, name || 'Aryan');
      setIsLoading(false);
      if (!result.success) {
        setErrorMessage(result.error || 'Failed to create account.');
      }
    } else {
      const result = await loginUser(email, password);
      setIsLoading(false);
      if (!result.success) {
        setErrorMessage(result.error || 'Invalid email or password.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF0F6] flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl p-7 sm:p-9 shadow-sm border border-slate-100 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#937485] text-white flex items-center justify-center font-bold text-lg shadow-sm mx-auto">
            H
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isRegister ? 'Create an account' : 'Welcome back'}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {isRegister
              ? 'Start organizing your weekly system and tracking performance'
              : 'Sign in to access your days, sections, and monthly reports'}
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setIsRegister(false);
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              !isRegister
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setIsRegister(true);
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              isRegister
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium flex items-center gap-2 border border-red-100">
            <AlertCircle size={15} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Aryan"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#937485] focus:ring-1 focus:ring-[#937485] transition-colors"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#937485] focus:ring-1 focus:ring-[#937485] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#937485] focus:ring-1 focus:ring-[#937485] transition-colors"
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-[#937485] hover:bg-[#836475] text-white font-semibold text-xs tracking-wide transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <span>Please wait...</span>
            ) : (
              <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] text-slate-400 uppercase tracking-wider font-medium">
            or
          </span>
        </div>

        {/* Demo login */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              loginAsGuest();
            }}
            className="text-xs font-semibold text-[#937485] hover:text-[#7A5A6D] transition-colors cursor-pointer"
          >
            Explore as Guest Preview →
          </button>
        </div>

        {/* Database indicator */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <Database size={13} className="text-[#7EB982]" />
          <span>Cloudflare D1 edge database sync</span>
        </div>
      </div>
    </div>
  );
};
