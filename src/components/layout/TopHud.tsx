import React from 'react';
import { Flame, Gift, Star, Volume2, VolumeX, Printer, RotateCcw, Sparkles, ShoppingBag } from 'lucide-react';
import { useGame } from '../../context/GameContext';

interface TopHudProps {
  onOpenPrintModal: () => void;
}

export const TopHud: React.FC<TopHudProps> = ({ onOpenPrintModal }) => {
  const {
    state,
    overallLevel,
    totalPendingChests,
    keystoneStreakDays,
    soundEnabled,
    toggleSound,
    resetAllDemoData,
    setActiveTab,
    setActiveStudioModal
  } = useGame();

  const { character } = state;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-[#E5E5E5] px-4 py-2.5 sm:px-6 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Character Avatar & Fun Class Badge */}
        <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group" onClick={() => setActiveTab('character')}>
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg border-2 border-b-4 shadow-sm group-hover:scale-105 transition-transform"
            style={{ backgroundColor: character.avatarBg, borderColor: '#33333333' }}
          >
            {character.avatarSeed === 'knight' ? '🛡️' : character.avatarSeed === 'wizard' ? '🧙' : '👑'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-[#3C3C3C] text-sm sm:text-base leading-tight group-hover:text-[#1CB0F6] transition-colors">
                {character.name}
              </span>
              <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full bg-[#DDF4FF] text-[#1CB0F6] border border-[#84D8FF] tracking-wide">
                Season 1
              </span>
            </div>
            <div className="text-xs text-[#777777] font-semibold flex items-center gap-1 truncate max-w-[140px] sm:max-w-xs">
              <Sparkles size={11} className="text-[#FFC800] shrink-0" />
              <span className="truncate">{character.classTitle}</span>
            </div>
          </div>
        </div>

        {/* Center / Right: RPG Stats HUD & Quick-Loot */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick-Loot Bag Pill Button */}
          <button
            onClick={() => setActiveStudioModal('quickLoot')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#FFF5D6] border-2 border-[#FFC800] border-b-4 text-[#A17200] font-black text-xs uppercase tracking-wider cursor-pointer hover:bg-[#ffeec2] active:translate-y-0.5 transition-all shadow-xs"
            title="Open Quick-Loot Bag (Expenses, 10s Clips, Anki Export & CRM)"
          >
            <ShoppingBag size={15} />
            <span className="hidden sm:inline">Quick-Loot</span>
          </button>

          {/* Overall Level Shield */}
          <div
            onClick={() => setActiveTab('skillTree')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-b from-[#FFF9E6] to-[#FFF0B8] border-2 border-[#FFC800] border-b-4 shadow-sm cursor-pointer active:translate-y-0.5 transition-transform"
            title="Total Character Level (Sum of 5 Attributes)"
          >
            <Star size={16} className="text-[#E5A400] fill-[#FFC800]" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1">
              <span className="text-[10px] uppercase font-black text-[#A17200] leading-none">LVL</span>
              <span className="text-sm sm:text-base font-black text-[#3C3C3C] leading-none">{overallLevel}</span>
            </div>
          </div>

          {/* Active Keystone Streak */}
          <div
            onClick={() => setActiveTab('today')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border-2 border-b-4 shadow-sm cursor-pointer active:translate-y-0.5 transition-transform ${
              keystoneStreakDays > 0
                ? 'bg-[#FFF2E6] border-[#FF9600] text-[#D85E00]'
                : 'bg-gray-100 border-gray-300 text-gray-500'
            }`}
            title="Keystone Habit Streak (Consecutive days)"
          >
            <Flame
              size={18}
              className={`${keystoneStreakDays > 0 ? 'text-[#FF7A00] fill-[#FF9600] animate-bounce-soft' : 'text-gray-400'}`}
            />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1">
              <span className="text-sm sm:text-base font-black leading-none">{keystoneStreakDays}</span>
              <span className="text-[10px] font-bold uppercase hidden sm:inline leading-none">Streak</span>
            </div>
          </div>

          {/* Unopened Loot Chest Counter */}
          <button
            onClick={() => setActiveTab('vault')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border-2 border-b-4 cursor-pointer select-none transition-transform active:translate-y-0.5 ${
              totalPendingChests > 0
                ? 'bg-[#EBF9DC] border-[#58CC02] text-[#347A01] animate-pulse'
                : 'bg-white border-[#E5E5E5] text-[#777777]'
            }`}
            title={`${totalPendingChests} Unopened Loot Chest(s)`}
          >
            <Gift
              size={17}
              className={totalPendingChests > 0 ? 'text-[#58CC02] fill-[#D7FFB8]' : 'text-gray-400'}
            />
            <span className="text-sm sm:text-base font-black leading-none">{totalPendingChests}</span>
            {totalPendingChests > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#FF4B4B] animate-ping" />
            )}
          </button>

          {/* Utility Action Buttons */}
          <div className="flex items-center gap-1 pl-1 border-l border-gray-200">
            {/* Pocket Booklet Print */}
            <button
              onClick={onOpenPrintModal}
              className="p-2 rounded-xl text-[#777777] hover:text-[#1CB0F6] hover:bg-[#DDF4FF] border border-transparent hover:border-[#84D8FF] transition-all cursor-pointer"
              title="Print My Pocket Notebook Insert (French-Fold Zine)"
            >
              <Printer size={18} />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl text-[#777777] hover:text-[#58CC02] hover:bg-[#D7FFB8] border border-transparent hover:border-[#58CC02] transition-all cursor-pointer"
              title={soundEnabled ? 'Sound is ON (Click to mute)' : 'Sound is OFF (Click to unmute)'}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} className="text-red-400" />}
            </button>

            {/* Demo Reset */}
            <button
              onClick={resetAllDemoData}
              className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all cursor-pointer hidden md:block"
              title="Reset Demo Playground Data"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
