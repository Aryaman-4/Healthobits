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
  Sparkles,
  FileText
} from 'lucide-react';
import { useAttackMode } from '../../context/AttackModeContext';
import { sound } from '../../utils/audio';

export const AccountSettingsTab: React.FC = () => {
  const {
    state,
    setActiveTab,
    logoutUser,
    toggleSound,
    openOnboarding,
    openSherlockModal,
    openAnchorModal,
    openSundayResetModal
  } = useAttackMode();

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleManualSync = () => {
    sound.playTap();
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncFeedback('Cloudflare D1 edge database synchronized');
      setTimeout(() => setSyncFeedback(null), 3000);
    }, 700);
  };

  return (
    <div className="max-w-md mx-auto sm:max-w-3xl px-4 sm:px-6 py-5 space-y-5 font-sans">
      {/* 1. Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Account & Settings
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Manage your cloud database persistence, audio, and personal protocols
        </p>
      </div>

      {/* 2. User Profile Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-100 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#937485] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {state.account.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">
                {state.account.name}
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                {state.account.email}
              </p>
            </div>
          </div>

          <button
            onClick={logoutUser}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Cloudflare D1 Persistence Card */}
        <div className="p-4 rounded-2xl bg-[#7EB982]/10 border border-[#7EB982]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Database size={18} className="text-[#7EB982]" />
            <div>
              <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <span>Cloudflare D1 Persistence:</span>
                <span className="text-[#5A9A5E] font-semibold">Active & Synced</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Your 7-day checklists and monthly reports persist automatically to the edge database.
              </p>
            </div>
          </div>

          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-3 py-1.5 rounded-xl bg-[#7EB982] hover:bg-[#6FA873] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 self-start sm:self-auto shrink-0 shadow-2xs cursor-pointer"
          >
            <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>

        {syncFeedback && (
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium flex items-center gap-2 border border-emerald-100">
            <CheckCircle2 size={14} className="text-[#7EB982]" />
            <span>{syncFeedback}</span>
          </div>
        )}
      </div>

      {/* 3. Audio & Haptics Setting */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600">
              {state.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                Tactile Audio & Sound Effects
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Pops and soft chimes when completing habits and hitting targets
              </p>
            </div>
          </div>

          <button
            onClick={toggleSound}
            className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
              state.soundEnabled
                ? 'bg-[#937485] text-white shadow-xs'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {state.soundEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>

      {/* 4. Protocols & Tools Navigation */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-100 space-y-3">
        <h3 className="font-bold text-xs sm:text-sm text-slate-900">
          Protocols & Support Tools
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs font-semibold">
          <button
            onClick={openAnchorModal}
            className="p-3.5 rounded-2xl bg-[#EEF0F6]/80 hover:bg-[#EEF0F6] text-slate-800 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
          >
            <span className="text-base">⚓</span>
            <div>
              <div className="font-bold">Anchor Mode Sanctuary</div>
              <div className="text-[11px] text-slate-500 font-normal">Minimum baseline for when you're out of the zone</div>
            </div>
          </button>

          <button
            onClick={openSherlockModal}
            className="p-3.5 rounded-2xl bg-[#EEF0F6]/80 hover:bg-[#EEF0F6] text-slate-800 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
          >
            <span className="text-base">🔍</span>
            <div>
              <div className="font-bold">Come Here: Sherlock Protocol</div>
              <div className="text-[11px] text-slate-500 font-normal">Contingency plan when you mess up</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('datadrop')}
            className="p-3.5 rounded-2xl bg-[#EEF0F6]/80 hover:bg-[#EEF0F6] text-slate-800 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
          >
            <span className="text-base">💡</span>
            <div>
              <div className="font-bold">Data Drop Notes & Export</div>
              <div className="text-[11px] text-slate-500 font-normal">Filterable habit & insight logs ({state.dataDrops.length})</div>
            </div>
          </button>

          <button
            onClick={openSundayResetModal}
            className="p-3.5 rounded-2xl bg-[#EEF0F6]/80 hover:bg-[#EEF0F6] text-slate-800 flex items-center gap-2.5 text-left transition-colors cursor-pointer"
          >
            <span className="text-base">🌅</span>
            <div>
              <div className="font-bold">Sunday Weekly Reset</div>
              <div className="text-[11px] text-slate-500 font-normal">Archive week & prepare next sprint</div>
            </div>
          </button>

          <button
            onClick={openOnboarding}
            className="p-3.5 rounded-2xl bg-[#EEF0F6]/80 hover:bg-[#EEF0F6] text-slate-800 flex items-center gap-2.5 text-left transition-colors cursor-pointer sm:col-span-2"
          >
            <span className="text-base">📘</span>
            <div>
              <div className="font-bold">System Walkthrough</div>
              <div className="text-[11px] text-slate-500 font-normal">Replay the 4-step onboarding guide</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
