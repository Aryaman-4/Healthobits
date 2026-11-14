import React from 'react';
import {
  Anchor,
  RotateCcw,
  Calendar,
  BarChart2,
  Clock,
  User,
  HelpCircle
} from 'lucide-react';
import { useAttackMode } from '../../context/AttackModeContext';
import { CREED_MANTRAS } from '../../data/attackModeSeed';

export const HeaderCreedBanner: React.FC = () => {
  const {
    state,
    setActiveTab,
    toggleAnchorMode,
    nextCreed,
    openOnboarding,
    metrics
  } = useAttackMode();

  const currentCreed = CREED_MANTRAS[state.activeCreedIndex];
  const { slaSummary } = metrics;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-xs font-sans">
      {/* 1. Persistent Logical Creed Banner */}
      <div className="bg-[#0F172A] text-white px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] uppercase font-bold tracking-wider shrink-0 border border-blue-400/30">
            CREED
          </span>
          <p className="font-medium text-slate-200 truncate italic text-xs sm:text-sm">
            "{currentCreed}"
          </p>
        </div>

        <button
          onClick={nextCreed}
          className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-[11px] font-semibold border border-slate-700 cursor-pointer"
          title="Rotate to next logical creed"
        >
          <RotateCcw size={12} />
          <span className="hidden sm:inline">Rotate Mantra</span>
        </button>
      </div>

      {/* 2. Primary Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & Guide Pill */}
        <div className="flex items-center justify-between md:justify-start gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-black text-base shadow-xs">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-black text-base sm:text-lg tracking-tight text-slate-900 leading-none">
                  ATTACK MODE
                </h1>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 border border-blue-200 uppercase">
                  D1 SYNC
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                Logical Execution & Section System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            {/* Guide Button on Mobile */}
            <button
              onClick={openOnboarding}
              className="p-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold"
              title="How to play / Onboarding"
            >
              <HelpCircle size={16} />
            </button>

            {/* Anchor Mode on Mobile */}
            <button
              onClick={toggleAnchorMode}
              className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider border-2 ${
                state.anchorModeActive
                  ? 'bg-amber-500 border-amber-600 text-white animate-pulse'
                  : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              ⚓
            </button>
          </div>
        </div>

        {/* 4 Top-Level Tabs */}
        <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('sections')}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              state.activeTab === 'sections'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar size={13} className={state.activeTab === 'sections' ? 'text-blue-600' : 'text-slate-400'} />
            <span>Sections & Days</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              state.activeTab === 'stats'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart2 size={13} className={state.activeTab === 'stats' ? 'text-emerald-600' : 'text-slate-400'} />
            <span>4-Week Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('sla')}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              state.activeTab === 'sla'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock size={13} className={state.activeTab === 'sla' ? 'text-red-600' : 'text-slate-400'} />
            <span>Deadline SLA</span>
            {slaSummary.p1Active > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white font-mono text-[9px] font-bold animate-pulse">
                {slaSummary.p1Active} P1
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              state.activeTab === 'account'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User size={13} className={state.activeTab === 'account' ? 'text-purple-600' : 'text-slate-400'} />
            <span>Account</span>
          </button>
        </nav>

        {/* Right Desktop Controls (Guide + Anchor Mode) */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            onClick={openOnboarding}
            className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all active:translate-y-0.5"
            title="Beginner Guide & Tutorial"
          >
            <HelpCircle size={14} />
            <span>How it Works</span>
          </button>

          <button
            onClick={toggleAnchorMode}
            className={`px-3 py-2 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border-2 border-b-4 active:border-b-2 active:translate-y-0.5 ${
              state.anchorModeActive
                ? 'bg-amber-500 border-amber-600 text-white shadow-xs animate-pulse'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
            title="Anchor Mode: pauses daily quota for chaotic travel days"
          >
            <Anchor size={14} />
            <span>{state.anchorModeActive ? 'ANCHOR: ON' : 'Anchor'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
