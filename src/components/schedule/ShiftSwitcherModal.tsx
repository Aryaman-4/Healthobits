import React from 'react';
import { X, Zap, Palette, Crown, Calendar, Check, Clock } from 'lucide-react';
import { useGame, getScheduleTypeFromDate } from '../../context/GameContext';
import { ScheduleFilter } from '../../types';
import { sound } from '../../utils/audio';

interface ShiftSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShiftSwitcherModal: React.FC<ShiftSwitcherModalProps> = ({ isOpen, onClose }) => {
  const {
    scheduleFilter,
    setScheduleFilter,
    selectedDate,
    shiftConfig,
    setActiveTab
  } = useGame();

  if (!isOpen) return null;

  const autoDayType = getScheduleTypeFromDate(selectedDate);

  const handleSelect = (filter: ScheduleFilter) => {
    sound.playTap();
    setScheduleFilter(filter);
    onClose();
  };

  const modes: { id: ScheduleFilter; title: string; subtitle: string; icon: string; badge: string; color: string }[] = [
    {
      id: 'today',
      title: `Today's Auto Shift (${autoDayType.toUpperCase()})`,
      subtitle: 'Automatically syncs to today\'s calendar schedule',
      icon: '📅',
      badge: 'AUTO',
      color: 'border-gray-300 bg-gray-50'
    },
    {
      id: 'mwf',
      title: '⚡ MWF Tech & Cloud Shift',
      subtitle: 'Deep focus on Cloud architecture, Python agents & calisthenics',
      icon: '⚡',
      badge: 'TECH CORE',
      color: 'border-[#1CB0F6] bg-[#DDF4FF]/40'
    },
    {
      id: 'tts',
      title: '🎨 Tue-Thu Art & Music Shift',
      subtitle: 'Creative mastery: Bansuri flute alankars & fineliner illustrations',
      icon: '🎨',
      badge: 'ART STUDIO',
      color: 'border-[#FFC800] bg-[#FFF5D6]/40'
    },
    {
      id: 'sunday',
      title: '👑 Weekend Empire Reset',
      subtitle: 'Weekly finances, family video calls & Sunday link preparation',
      icon: '👑',
      badge: 'WEEK OFF',
      color: 'border-[#CE82FF] bg-[#F3E5FF]/40'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-8 max-w-md w-full shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF5D6] border-2 border-[#FFC800] flex items-center justify-center text-xl shrink-0">
              ⚡
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-[#3C3C3C]">
                Switch Day Shift Mode
              </h3>
              <p className="text-[11px] sm:text-xs text-[#777777] font-semibold">
                Work Hours: {shiftConfig.workStartTime} – {shiftConfig.workEndTime}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-[#777777] hover:text-[#3C3C3C] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Options */}
        <div className="p-4 space-y-3">
          {modes.map(mode => {
            const isSelected = scheduleFilter === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => handleSelect(mode.id)}
                className={`w-full p-3.5 rounded-2xl border-2 text-left flex items-center justify-between gap-3 transition-all cursor-pointer active:translate-y-0.5 ${
                  isSelected
                    ? `${mode.color} border-b-4 shadow-sm ring-2 ring-blue-400/30`
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl shrink-0">{mode.icon}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs sm:text-sm text-[#3C3C3C] truncate">
                        {mode.title}
                      </span>
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-white/80 border border-gray-200 text-[#777777] shrink-0">
                        {mode.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#777777] font-medium truncate mt-0.5">
                      {mode.subtitle}
                    </p>
                  </div>
                </div>

                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-[#58CC02] text-white flex items-center justify-center shrink-0">
                    <Check size={14} strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Link to Customize Hours */}
        <div className="p-3.5 bg-gray-50 border-t-2 border-gray-100 flex items-center justify-between text-xs">
          <span className="text-[#777777] font-semibold">Need to adjust work hours?</span>
          <button
            onClick={() => {
              onClose();
              setActiveTab('settings');
            }}
            className="font-black text-[#1CB0F6] hover:underline cursor-pointer"
          >
            Edit in Settings ➔
          </button>
        </div>
      </div>
    </div>
  );
};

