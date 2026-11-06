import React, { useState } from 'react';
import { Shield, Sparkles, Key, Mail, Lock, User, Check, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';

interface AuthScreenProps {
  onSuccess?: () => void;
  isModal?: boolean;
  onClose?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess, isModal = false, onClose }) => {
  const { loginUser, registerUser, setIsOnboardingOpen } = useGame();

  const [mode, setMode] = useState<'welcome' | 'login' | 'register'>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [characterName, setCharacterName] = useState('Aryan');
  const [characterClass, setCharacterClass] = useState('Cloud-Native Polymath');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const result = await loginUser({ email, password, rememberMe });
    setIsLoading(false);

    if (result.success) {
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } else {
      setErrorMessage(result.error || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const result = await registerUser({
      email,
      password,
      characterName,
      characterClass,
      rememberMe
    });
    setIsLoading(false);

    if (result.success) {
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } else {
      setErrorMessage(result.error || 'Registration failed.');
    }
  };

  const content = (
    <div className="max-w-md w-full mx-auto p-4 sm:p-6 flex flex-col justify-center min-h-[500px]">
      {/* Visual Hero */}
      <div className="text-center space-y-3 mb-6">
        <div className="relative inline-block">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-b from-[#58CC02] to-[#46A302] border-4 border-b-8 border-[#347A01] flex items-center justify-center text-5xl sm:text-6xl shadow-xl animate-bounce-soft mx-auto">
            🛡️
          </div>
          <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-2xl bg-[#FFC800] border-2 border-b-4 border-[#E5A400] flex items-center justify-center text-lg shadow-md transform rotate-12">
            ⭐
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="font-black text-2xl sm:text-3xl text-[#3C3C3C] tracking-tight">
            POLYMATH QUEST
          </h1>
          <p className="font-extrabold text-xs sm:text-sm text-[#1CB0F6] uppercase tracking-wide">
            Level up your real life—one habit at a time.
          </p>
        </div>

        <p className="text-xs text-[#777777] max-w-xs mx-auto">
          Connected to Cloudflare D1 edge database with real-time sync across mobile and desktop.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-2xl bg-[#FFDFE0] border-2 border-[#FF4B4B] text-[#EA2B2B] text-xs font-bold flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Mode 1: Welcome Screen with Two 3D Buttons */}
      {mode === 'welcome' && (
        <div className="space-y-3.5">
          {/* Primary 3D Button 1: Get Started */}
          <button
            onClick={() => {
              sound.playTap();
              setMode('register');
            }}
            className="w-full py-4 px-6 rounded-2xl bg-[#58CC02] border-2 border-b-6 border-[#46A302] hover:bg-[#4EBC00] text-white font-black text-sm sm:text-base uppercase tracking-wider cursor-pointer active:translate-y-1 active:border-b-2 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <span>🚀 GET STARTED (NEW PLAYER)</span>
          </button>

          {/* Primary 3D Button 2: Log In */}
          <button
            onClick={() => {
              sound.playTap();
              setMode('login');
            }}
            className="w-full py-4 px-6 rounded-2xl bg-white border-2 border-b-6 border-gray-300 hover:bg-gray-50 text-[#1CB0F6] font-black text-sm sm:text-base uppercase tracking-wider cursor-pointer active:translate-y-1 active:border-b-2 transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>🔑 I ALREADY HAVE AN ACCOUNT (LOG IN)</span>
          </button>

          {/* Demo Mode / Guest Option */}
          <div className="pt-4 text-center">
            <button
              onClick={() => {
                sound.playTap();
                if (onClose) onClose();
                if (onSuccess) onSuccess();
              }}
              className="text-xs font-bold text-[#777777] hover:text-[#1CB0F6] underline cursor-pointer"
            >
              Or explore demo mode as guest adventurer ➔
            </button>
          </div>
        </div>
      )}

      {/* Mode 2: Login Form */}
      {mode === 'login' && (
        <form onSubmit={handleLoginSubmit} className="space-y-3.5 bg-white p-5 rounded-3xl border-2 border-[#E5E5E5] border-b-6 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="font-black text-base text-[#3C3C3C]">Account Log In</h3>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#DDF4FF] text-[#1CB0F6]">
              Cloudflare D1
            </span>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-black uppercase text-[#777777]">
              Email Address
            </label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#1CB0F6] focus-within:bg-white">
              <Mail size={15} className="text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="aryan.quest@polymath.dev"
                className="w-full text-xs font-semibold text-[#3C3C3C] outline-none bg-transparent"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-black uppercase text-[#777777]">
              Password
            </label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#1CB0F6] focus-within:bg-white">
              <Lock size={15} className="text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs font-semibold text-[#3C3C3C] outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Remember Me on this device */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs font-semibold text-[#555555] cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="rounded text-[#1CB0F6] focus:ring-0 w-4 h-4"
              />
              <span>Remember me on this device</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-2xl bg-[#1CB0F6] border-2 border-b-4 border-[#1899D6] hover:bg-[#1899D6] text-white font-black text-xs sm:text-sm uppercase tracking-wider cursor-pointer active:translate-y-0.5 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <span>Logging in...</span> : <span>Log In To Quest</span>}
          </button>

          <div className="pt-2 text-center text-xs">
            <button
              type="button"
              onClick={() => {
                sound.playTap();
                setMode('register');
              }}
              className="text-[#777777] hover:text-[#1CB0F6] font-bold"
            >
              Don't have an account? <span className="text-[#1CB0F6] underline">Sign up here</span>
            </button>
          </div>
        </form>
      )}

      {/* Mode 3: Sign Up (Register) Form */}
      {mode === 'register' && (
        <form onSubmit={handleRegisterSubmit} className="space-y-3.5 bg-white p-5 rounded-3xl border-2 border-[#E5E5E5] border-b-6 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="font-black text-base text-[#3C3C3C]">New Player Registration</h3>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#EBF9DC] text-[#58CC02]">
              Season 1
            </span>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-black uppercase text-[#777777]">
              Character Name
            </label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#1CB0F6] focus-within:bg-white">
              <User size={15} className="text-gray-400" />
              <input
                type="text"
                required
                value={characterName}
                onChange={e => setCharacterName(e.target.value)}
                placeholder="e.g. Aryan"
                className="w-full text-xs font-semibold text-[#3C3C3C] outline-none bg-transparent"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-black uppercase text-[#777777]">
              Email Address
            </label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#1CB0F6] focus-within:bg-white">
              <Mail size={15} className="text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full text-xs font-semibold text-[#3C3C3C] outline-none bg-transparent"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-black uppercase text-[#777777]">
              Create Password
            </label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-[#1CB0F6] focus-within:bg-white">
              <Lock size={15} className="text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full text-xs font-semibold text-[#3C3C3C] outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs font-semibold text-[#555555] cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="rounded text-[#58CC02] focus:ring-0 w-4 h-4"
              />
              <span>Remember me on this device</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-2xl bg-[#58CC02] border-2 border-b-4 border-[#46A302] hover:bg-[#4EBC00] text-white font-black text-xs sm:text-sm uppercase tracking-wider cursor-pointer active:translate-y-0.5 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <span>Creating Hero...</span> : <span>Create Account & Start Quest ➔</span>}
          </button>

          <div className="pt-2 text-center text-xs">
            <button
              type="button"
              onClick={() => {
                sound.playTap();
                setMode('login');
              }}
              className="text-[#777777] hover:text-[#1CB0F6] font-bold"
            >
              Already registered? <span className="text-[#1CB0F6] underline">Log in here</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3">
        <div className="bg-[#F7F7F7] rounded-3xl border-2 border-[#E5E5E5] border-b-8 max-w-lg w-full relative shadow-2xl overflow-hidden animate-scale-up">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#777777] hover:text-[#3C3C3C] cursor-pointer z-10"
            >
              ✕
            </button>
          )}
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center p-3 sm:p-6 font-fredoka">
      {content}
    </div>
  );
};

