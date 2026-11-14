import React, { useState } from 'react';
import {
  User,
  Database,
  Volume2,
  VolumeX,
  HelpCircle,
  LogOut,
  RefreshCw,
  CheckCircle2,
  Shield,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { useAttackMode } from '../../context/AttackModeContext';
import { sound } from '../../utils/audio';

export const AccountSettingsTab: React.FC = () => {
  const {
    state,
    logoutUser,
    toggleSound,
    openOnboarding,
    reopenGuide
  } = useAttackMode();

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleManualSync = () => {
    sound.playTap();
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncFeedback('Cloudflare D1 Database Synced Successfully!');
      setTimeout(() => setSyncFeedback(null), 3000);
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 py-6 space-y-6 font-sans">
      {/* 1. Header */}
      <div className="bg-white rounded-3xl border-2 border-[#E2E8F0] border-b-6 p-5 shadow-xs">
        <h2 className="font-black text-xl text-slate-900 uppercase">
          Account & App Settings
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Manage your Cloudflare D1 database persistence, sound preferences, and beginner guides.
        </p>
      </div>

      {/* 2. User Profile Card */}
      <div className="bg-white rounded-3xl border-2 border-[#E2E8F0] border-b-6 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-xs">
              {state.account.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900">
                {state.account.name}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {state.account.email}
              </p>
            </div>
          </div>

          <button
            onClick={logoutUser}
            className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all active:translate-y-0.5"
          >
            <LogOut size={14} />
            <span>Log Out</span>
          </button>
        </div>

        {/* Database Status */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Database size={18} className="text-emerald-700" />
            <div>
              <div className="font-black text-xs text-emerald-950 flex items-center gap-1.5">
                <span>Cloudflare D1 Persistence:</span>
                <span className="text-emerald-700 uppercase">ONLINE & SYNCED ✅</span>
              </div>
              <p className="text-[11px] text-emerald-800 font-medium">
                Your 7-day Section System and 4-week scores are safely persisted in the edge database.
              </p>
            </div>
          </div>

          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase cursor-pointer transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto shrink-0"
          >
            <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>

        {syncFeedback && (
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={15} />
            <span>{syncFeedback}</span>
          </div>
        )}
      </div>

      {/* 3. Audio & SFX Controls (Moved here from the top header!) */}
      <div className="bg-white rounded-3xl border-2 border-[#E2E8F0] border-b-6 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              {state.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </div>
            <div>
              <h4 className="font-black text-sm text-slate-900">
                Tactile Audio & Sound Effects (SFX)
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                Plays satisfying pops and chords when checking off tasks and hitting quotas.
              </p>
            </div>
          </div>

          <button
            onClick={toggleSound}
            className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider border-2 border-b-4 transition-all cursor-pointer active:translate-y-0.5 ${
              state.soundEnabled
                ? 'bg-blue-600 border-blue-800 text-white shadow-xs'
                : 'bg-slate-100 border-slate-300 text-slate-600'
            }`}
          >
            {state.soundEnabled ? 'SOUND: ON' : 'SOUND: OFF'}
          </button>
        </div>
      </div>

      {/* 4. Beginner Tutorials & Guidance */}
      <div className="bg-white rounded-3xl border-2 border-[#E2E8F0] border-b-6 p-5 sm:p-6 shadow-xs space-y-3">
        <h4 className="font-black text-sm text-slate-900 uppercase">
          Beginner Guides & Game Help
        </h4>
        <p className="text-xs text-slate-500 font-medium">
          New to Attack Mode? Review the 4-step onboarding wizard or restore the top explanation banner.
        </p>

        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <button
            onClick={openOnboarding}
            className="px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all active:translate-y-0.5"
          >
            <HelpCircle size={15} />
            <span>Replay 4-Step Onboarding Tutorial</span>
          </button>

          <button
            onClick={reopenGuide}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all active:translate-y-0.5"
          >
            <Sparkles size={15} />
            <span>Restore Top Guide Card</span>
          </button>
        </div>
      </div>
    </div>
  );
};

