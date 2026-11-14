import React from 'react';
import { RotateCcw, HelpCircle, Anchor } from 'lucide-react';
import { useAttackMode } from '../../context/AttackModeContext';
import { CREED_MANTRAS } from '../../data/attackModeSeed';

export const HeaderCreedBanner: React.FC = () => {
  const {
    state,
    nextCreed,
    openOnboarding,
    toggleAnchorMode
  } = useAttackMode();

  const currentCreed = CREED_MANTRAS[state.activeCreedIndex];

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 font-sans">
      <div className="max-w-md sm:max-w-4xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 text-xs">
        {/* Creed Text (Subtle, clean, not obnoxious) */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#937485] shrink-0" />
          <p className="font-medium text-slate-600 truncate italic text-[11px] sm:text-xs">
            "{currentCreed}"
          </p>
        </div>

        {/* Minimal Controls on Right */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={nextCreed}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Rotate Creed"
          >
            <RotateCcw size={13} />
          </button>

          <button
            onClick={openOnboarding}
            className="px-2 py-1 rounded-lg text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 text-[11px] font-semibold transition-colors cursor-pointer"
            title="Tutorial"
          >
            Guide
          </button>

          <button
            onClick={toggleAnchorMode}
            className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
              state.anchorModeActive
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 bg-slate-50'
            }`}
            title="Anchor Mode"
          >
            {state.anchorModeActive ? 'Anchor: On' : 'Anchor'}
          </button>
        </div>
      </div>
    </header>
  );
};
