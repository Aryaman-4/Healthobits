import React from 'react';
import {
  ShieldAlert,
  Anchor,
  RotateCcw,
  Clock,
  Sparkles,
  Zap,
  BarChart2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useAttackMode } from '../../context/AttackModeContext';
import { CREED_MANTRAS } from '../../data/attackModeSeed';

export const HeaderCreedBanner: React.FC = () => {
  const {
    state,
    setActiveTab,
    toggleAnchorMode,
    nextCreed,
    metrics
  } = useAttackMode();

  const currentCreed = CREED_MANTRAS[state.activeCreedIndex];
  const { sdtRatio, slaSummary } = metrics;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-xs">
      {/* 1. Persistent Logical Creed Banner */}
      <div className="bg-[#0F172A] text-white px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] uppercase font-bold tracking-wider shrink-0 border border-blue-400/30">
            LOGICAL CREED
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

      {/* 2. Primary Navigation Bar & Controls */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Logo & Tagline */}
        <div className="flex items-center justify-between sm:justify-start gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0F172A] text-white flex items-center justify-center font-black text-base shadow-xs">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-lg tracking-tight text-slate-900 leading-none">
                  ATTACK MODE
                </h1>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                  SLA OS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Logical Execution & Incident SLA System
              </p>
            </div>
          </div>

          {/* Anchor Mode Toggle (Mobile Position) */}
          <button
            onClick={toggleAnchorMode}
            className={`sm:hidden px-2.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all border-2 ${
              state.anchorModeActive
                ? 'bg-amber-500 border-amber-600 text-white shadow-xs animate-pulse'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Anchor size={14} />
            <span>{state.anchorModeActive ? 'ANCHOR: ON' : 'ANCHOR'}</span>
          </button>
        </div>

        {/* Center: Top-Level Tab Switcher (Strictly 3 Tabs) */}
        <nav className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs font-black tracking-wide uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              state.activeTab === 'today'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar size={14} className={state.activeTab === 'today' ? 'text-blue-600' : 'text-slate-400'} />
            <span>Today</span>
          </button>

          <button
            onClick={() => setActiveTab('sla')}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs font-black tracking-wide uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              state.activeTab === 'sla'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock size={14} className={state.activeTab === 'sla' ? 'text-red-600' : 'text-slate-400'} />
            <span>Deadline SLA</span>
            {slaSummary.p1Active > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white font-mono text-[10px] font-bold animate-pulse">
                {slaSummary.p1Active} P1
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('weekly')}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs font-black tracking-wide uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              state.activeTab === 'weekly'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart2 size={14} className={state.activeTab === 'weekly' ? 'text-emerald-600' : 'text-slate-400'} />
            <span>Weekly & Stats</span>
          </button>
        </nav>

        {/* Right Controls: Anchor Mode Toggle + SDT 70/30 Balance Gauge */}
        <div className="hidden sm:flex items-center gap-3">
          {/* SDT 70/30 Meter */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
            title="Self-Determination Theory Balance (Target: 70% Intrinsic / 30% Extrinsic)"
          >
            <div className="text-[11px] font-bold text-slate-600">
              SDT: <span className="font-mono text-blue-600">{sdtRatio.intrinsicPct}% Int</span> /{' '}
              <span className="font-mono text-amber-600">{sdtRatio.extrinsicPct}% Ext</span>
            </div>
            <div className="w-16 h-2 bg-amber-200 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${sdtRatio.intrinsicPct}%` }}
              />
            </div>
          </div>

          {/* Anchor Mode Toggle (Desktop) */}
          <button
            onClick={toggleAnchorMode}
            className={`px-3 py-2 rounded-lg font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border-2 border-b-4 active:border-b-2 active:translate-y-0.5 ${
              state.anchorModeActive
                ? 'bg-amber-500 border-amber-600 text-white shadow-sm ring-2 ring-amber-300 animate-pulse'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
            title="Anchor Mode: Disables full daily quota and shows only 2-3 psychological survival habits for chaotic or travel days"
          >
            <Anchor size={14} />
            <span>{state.anchorModeActive ? '⚓ ANCHOR: ON' : '⚓ Anchor Mode'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
