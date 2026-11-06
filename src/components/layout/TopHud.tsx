import React from 'react';
import { Flame, Gift, Star, HelpCircle, ChevronDown } from 'lucide-react';
import { useGame, getScheduleTypeFromDate } from '../../context/GameContext';
import { sound } from '../../utils/audio';

export const TopHud: React.FC = () => {
  const {
    state,
    overallLevel,
    totalPendingChests,
    keystoneStreakDays,
    scheduleFilter,
    selectedDate,
    setActiveTab,
    setIsShiftSwitcherOpen,
    setIsCharacterGuideModalOpen
  } = useGame();

  const { character } = state;
  const autoDay = getScheduleTypeFromDate(selectedDate);
  const effectiveDay = scheduleFilter === 'today' ? autoDay : scheduleFilter;

  // Format Center Badge Label
  const getDayModeBadge = () => {
    switch (effectiveDay) {
      case 'mwf':
        return { label: '⚡ MWF Tech Shift', bg: 'bg-[#DDF4FF]', border: 'border-[#1CB0F6]', text: 'text-[#1CB0F6]' };
      case 'tts':
        return { label: '🎨 Tue-Thu Art Shift', bg: 'bg-[#FFF5D6]', border: 'border-[#FFC800]', text: 'text-[#A17200]' };
      case 'sunday':
        return { label: '👑 Weekend Off', bg: 'bg-[#F3E5FF]', border: 'border-[#CE82FF]', text: 'text-[#A560E8]' };
      default:
        return { label: `📅 Today (${autoDay.toUpperCase()})`, bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-[#3C3C3C]' };
    }
  };

  const badge = getDayModeBadge();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-[#E5E5E5] px-3 sm:px-6 py-2 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* ELEMENT 1 (LEFT): Compact Character Pill */}
        <button
          onClick={() => {
            sound.playTap();
            setIsCharacterGuideModalOpen(true);
          }}
          className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-2xl bg-gray-50 hover:bg-[#DDF4FF]/40 border-2 border-gray-200 hover:border-[#1CB0F6] cursor-pointer transition-all active:translate-y-0.5 shadow-2xs group shrink-0"
          title="Open Character Sheet & Game Guide"
        >
          {/* Avatar Icon */}
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-sm sm:text-base border border-black/10 shadow-xs"
            style={{ backgroundColor: character.avatarBg }}
          >
            {character.avatarSeed === 'knight' ? '🛡️' : character.avatarSeed === 'wizard' ? '🧙' : '👑'}
          </div>

          {/* Level Shield & Guide Badge */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5 text-xs font-black text-[#3C3C3C]">
              <span className="text-[10px] text-[#A17200] font-black uppercase">LVL</span>
              <span className="text-xs sm:text-sm">{overallLevel}</span>
            </div>

            <div className="w-5 h-5 rounded-full bg-[#DDF4FF] text-[#1CB0F6] flex items-center justify-center text-[10px] font-black group-hover:scale-110 transition-transform">
              ?
            </div>
          </div>
        </button>

        {/* ELEMENT 2 (CENTER): Current Day Mode Badge (Tap opens Shift Switcher) */}
        <button
          onClick={() => {
            sound.playTap();
            setIsShiftSwitcherOpen(true);
          }}
          className={`px-3 py-1 sm:py-1.5 rounded-2xl border-2 text-xs font-black uppercase tracking-wider cursor-pointer active:translate-y-0.5 transition-all shadow-2xs flex items-center gap-1.5 truncate max-w-[170px] sm:max-w-none ${badge.bg} ${badge.border} ${badge.text}`}
          title="Tap to change active Shift Mode"
        >
          <span className="truncate">{badge.label}</span>
          <ChevronDown size={13} className="shrink-0 opacity-70" />
        </button>

        {/* ELEMENT 3 (RIGHT): Keystone Streak & Unopened Loot Chest Badge */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Keystone Streak */}
          <button
            onClick={() => {
              sound.playTap();
              setActiveTab('today');
            }}
            className={`flex items-center gap-1 px-2.5 py-1 sm:py-1.5 rounded-2xl border-2 border-b-3 cursor-pointer active:translate-y-0.5 transition-all shadow-2xs ${
              keystoneStreakDays > 0
                ? 'bg-[#FFF2E6] border-[#FF9600] text-[#D85E00]'
                : 'bg-gray-50 border-gray-200 text-gray-400'
            }`}
            title="Keystone Habit Streak (Consecutive days)"
          >
            <Flame
              size={15}
              className={keystoneStreakDays > 0 ? 'text-[#FF7A00] fill-[#FF9600] animate-bounce-soft' : 'text-gray-400'}
            />
            <span className="text-xs sm:text-sm font-black leading-none">{keystoneStreakDays}</span>
          </button>

          {/* Unopened Chest Badge */}
          <button
            onClick={() => {
              sound.playTap();
              setActiveTab('vault');
            }}
            className={`flex items-center gap-1 px-2.5 py-1 sm:py-1.5 rounded-2xl border-2 border-b-3 cursor-pointer active:translate-y-0.5 transition-all shadow-2xs ${
              totalPendingChests > 0
                ? 'bg-[#EBF9DC] border-[#58CC02] text-[#347A01] animate-pulse'
                : 'bg-white border-gray-200 text-gray-400'
            }`}
            title={`${totalPendingChests} Unopened Loot Chest(s)`}
          >
            <Gift
              size={15}
              className={totalPendingChests > 0 ? 'text-[#58CC02] fill-[#D7FFB8]' : 'text-gray-400'}
            />
            <span className="text-xs sm:text-sm font-black leading-none">{totalPendingChests}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
