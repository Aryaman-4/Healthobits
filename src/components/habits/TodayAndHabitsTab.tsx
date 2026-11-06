import React, { useState } from 'react';
import {
  Flame,
  Star,
  Check,
  Plus,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Rocket,
  Clock,
  Sparkles,
  Zap,
  Coffee,
  Sun,
  Briefcase,
  Moon
} from 'lucide-react';
import { useGame, getScheduleTypeFromDate } from '../../context/GameContext';
import { BranchId, Habit, ScheduleFilter } from '../../types';
import { BranchIcon } from '../common/BranchIcon';
import { GameGuideCard } from '../guide/GameGuideCard';
import { formatDate, isBranchActiveOnDate } from '../../utils/gameMath';
import { sound } from '../../utils/audio';

export const TodayAndHabitsTab: React.FC = () => {
  const {
    state,
    keystoneModeOnly,
    setKeystoneModeOnly,
    selectedDate,
    setSelectedDate,
    scheduleFilter,
    setActiveStudioModal,
    toggleHabitCompletion,
    shiftConfig
  } = useGame();

  const { habits, branches } = state;

  // Determine active effective day type
  const autoDayType = getScheduleTypeFromDate(selectedDate);
  const effectiveSchedule = scheduleFilter === 'today' ? autoDayType : scheduleFilter;

  // Filter habits according to schedule & keystone mode
  let filteredHabits = habits.filter(h => {
    if (h.scheduleType === 'all') return true;
    return h.scheduleType === effectiveSchedule;
  });

  if (keystoneModeOnly) {
    filteredHabits = filteredHabits.filter(h => h.isKeystone);
  }

  // Date stepper
  const [selectedY, selectedM, selectedD] = selectedDate.split('-').map(Number);
  const selectedDateObj = new Date(selectedY, selectedM - 1, selectedD);
  const isToday = selectedDate === formatDate(new Date());

  const handleStepDay = (step: number) => {
    sound.playTap();
    const nextDate = new Date(selectedDateObj);
    nextDate.setDate(nextDate.getDate() + step);
    setSelectedDate(formatDate(nextDate));
  };

  const handleLaunchHabit = (habit: Habit) => {
    sound.playTap();
    if (habit.launchAction && habit.launchAction !== 'url') {
      setActiveStudioModal(habit.launchAction);
    } else if (habit.launchUrl) {
      window.open(habit.launchUrl, '_blank');
    } else {
      setActiveStudioModal('quickLoot');
    }
  };

  // Group habits by Shift Windows
  // 1. Morning Pre-Shift (Workouts, Calisthenics, Art, Music)
  // 2. Core Work Shift (Water, Expenses, Family Calls, Tech)
  // 3. Night Wind-Down (Reading, Meditation, Journaling)
  const morningHabits = filteredHabits.filter(h =>
    h.branchId === 'body' || h.branchId === 'craft' || h.title.toLowerCase().includes('morning') || h.title.toLowerCase().includes('prep')
  );

  const workShiftHabits = filteredHabits.filter(h =>
    (h.branchId === 'bonds' || h.branchId === 'empire') &&
    !morningHabits.includes(h)
  );

  const nightHabits = filteredHabits.filter(h =>
    !morningHabits.includes(h) && !workShiftHabits.includes(h)
  );

  const branchIds: BranchId[] = ['body', 'mind', 'craft', 'bonds', 'empire'];

  return (
    <div className="max-w-md mx-auto sm:max-w-3xl py-4 sm:py-6 px-3 sm:px-4 space-y-6 pb-20">
      {/* 1. Dismissible Beginner Game Guide Card */}
      <GameGuideCard />

      {/* 2. Top Header & 1-Tap Busy Day Mode Bar */}
      <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-6 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Date Selector */}
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <button
              onClick={() => handleStepDay(-1)}
              className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-200 flex items-center justify-center text-[#777777] active:translate-y-0.5 cursor-pointer transition-all"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="text-center sm:text-left px-2">
              <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                <Calendar size={14} className="text-[#1CB0F6]" />
                <span className="font-black text-sm text-[#3C3C3C]">
                  {selectedDateObj.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
                {isToday && (
                  <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full bg-[#EBF9DC] text-[#58CC02] border border-[#58CC02]">
                    Today
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => handleStepDay(1)}
              className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-200 flex items-center justify-center text-[#777777] active:translate-y-0.5 cursor-pointer transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* 1-Tap Busy Day Mode Toggle Button */}
          <button
            onClick={() => {
              sound.playTap();
              setKeystoneModeOnly(!keystoneModeOnly);
            }}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider cursor-pointer border-2 border-b-4 transition-all active:translate-y-0.5 flex items-center justify-center gap-2 shadow-xs ${
              keystoneModeOnly
                ? 'bg-[#FF4B4B] border-[#EA2B2B] text-white animate-pulse'
                : 'bg-[#FFF9E6] border-[#FFC800] text-[#A17200] hover:bg-[#ffeec2]'
            }`}
          >
            <Star size={15} className={keystoneModeOnly ? 'fill-white' : 'fill-[#FFC800]'} />
            <span>{keystoneModeOnly ? '★ BUSY DAY MODE: ON (5 Keystones)' : '★ Busy Day Mode'}</span>
          </button>
        </div>

        {/* Daily Branch Points Ledger (Max +1 / Branch) */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase text-[#777777] tracking-wider">
              Today's Branch Points (+1 Pt/Day Cap)
            </span>
            <span className="text-[10px] text-[#888888] font-bold">
              {branchIds.filter(bId => isBranchActiveOnDate(bId, habits, selectedDate)).length}/5 Active
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {branchIds.map(bId => {
              const b = branches[bId];
              const isActiveToday = isBranchActiveOnDate(bId, habits, selectedDate);
              return (
                <div
                  key={bId}
                  className={`rounded-2xl border-2 py-2 px-1 text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    isActiveToday
                      ? 'border-b-4 text-white shadow-xs'
                      : 'bg-gray-50 border-gray-200 text-gray-400 opacity-60'
                  }`}
                  style={{
                    backgroundColor: isActiveToday ? b.colorHex : undefined,
                    borderColor: isActiveToday ? b.borderHex : undefined
                  }}
                >
                  <BranchIcon branchId={bId} size={15} />
                  <span className="text-[10px] font-black uppercase leading-none">
                    {isActiveToday ? '+1 PT' : b.name.slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Shift Window 1: Pre-Shift Morning Focus */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#DDF4FF] text-[#1CB0F6] flex items-center justify-center text-sm shadow-xs">
              <Sun size={16} />
            </div>
            <div>
              <h3 className="font-black text-sm text-[#3C3C3C] uppercase tracking-wide">
                {shiftConfig.preShiftWindowLabel || 'Pre-Shift Morning (6:30–11:15 AM)'}
              </h3>
              <p className="text-[10px] text-[#777777] font-semibold">
                High-energy mastery: Acrobatics, Calisthenics & Art
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-gray-100 text-[#777777]">
            {morningHabits.length} habits
          </span>
        </div>

        <div className="space-y-3">
          {morningHabits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              branch={branches[habit.branchId]}
              selectedDate={selectedDate}
              onToggle={() => toggleHabitCompletion(habit.id, selectedDate)}
              onLaunch={() => handleLaunchHabit(habit)}
            />
          ))}
          {morningHabits.length === 0 && (
            <div className="p-4 rounded-2xl bg-white border-2 border-dashed border-gray-200 text-center text-xs text-[#777777]">
              No habits scheduled in this shift window today.
            </div>
          )}
        </div>
      </section>

      {/* 4. Shift Window 2: Core Work Shift */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#FFF5D6] text-[#FFC800] flex items-center justify-center text-sm shadow-xs">
              <Briefcase size={16} />
            </div>
            <div>
              <h3 className="font-black text-sm text-[#3C3C3C] uppercase tracking-wide">
                {shiftConfig.workShiftWindowLabel || 'Core Work Shift (12:00–9:00 PM)'}
              </h3>
              <p className="text-[10px] text-[#777777] font-semibold">
                Sustained energy: Hydration, micro-labs & family check-ins
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-gray-100 text-[#777777]">
            {workShiftHabits.length} habits
          </span>
        </div>

        <div className="space-y-3">
          {workShiftHabits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              branch={branches[habit.branchId]}
              selectedDate={selectedDate}
              onToggle={() => toggleHabitCompletion(habit.id, selectedDate)}
              onLaunch={() => handleLaunchHabit(habit)}
            />
          ))}
          {workShiftHabits.length === 0 && (
            <div className="p-4 rounded-2xl bg-white border-2 border-dashed border-gray-200 text-center text-xs text-[#777777]">
              No habits scheduled in this shift window today.
            </div>
          )}
        </div>
      </section>

      {/* 5. Shift Window 3: Night Wind-Down */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#F3E5FF] text-[#CE82FF] flex items-center justify-center text-sm shadow-xs">
              <Moon size={16} />
            </div>
            <div>
              <h3 className="font-black text-sm text-[#3C3C3C] uppercase tracking-wide">
                {shiftConfig.nightWindDownWindowLabel || 'Night Wind-Down (9:45 PM)'}
              </h3>
              <p className="text-[10px] text-[#777777] font-semibold">
                Calm recovery: Active reading, quotes & meditation
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-gray-100 text-[#777777]">
            {nightHabits.length} habits
          </span>
        </div>

        <div className="space-y-3">
          {nightHabits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              branch={branches[habit.branchId]}
              selectedDate={selectedDate}
              onToggle={() => toggleHabitCompletion(habit.id, selectedDate)}
              onLaunch={() => handleLaunchHabit(habit)}
            />
          ))}
          {nightHabits.length === 0 && (
            <div className="p-4 rounded-2xl bg-white border-2 border-dashed border-gray-200 text-center text-xs text-[#777777]">
              No habits scheduled in this shift window today.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

// Clean, De-cluttered Habit Card (Progressive Disclosure)
interface HabitCardProps {
  habit: Habit;
  branch: any;
  selectedDate: string;
  onToggle: () => void;
  onLaunch: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  branch,
  selectedDate,
  onToggle,
  onLaunch
}) => {
  const isCompleted = habit.completedDates.includes(selectedDate);

  return (
    <div
      className={`bg-white rounded-3xl border-2 transition-all p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-xs ${
        isCompleted
          ? 'border-[#58CC02] border-b-6 bg-[#F8FFF2]'
          : 'border-[#E5E5E5] border-b-5 hover:border-gray-300'
      }`}
    >
      {/* Left: Branch Icon + Title + Branch Pill */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xs shrink-0"
          style={{ backgroundColor: branch?.colorHex || '#1CB0F6' }}
        >
          <BranchIcon branchId={habit.branchId} size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4
              className={`font-black text-xs sm:text-sm leading-tight truncate ${
                isCompleted ? 'line-through text-[#777777]' : 'text-[#3C3C3C]'
              }`}
            >
              {habit.title}
            </h4>
            {habit.isKeystone && (
              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-[#FFF5D6] text-[#A17200] border border-[#FFC800] shrink-0">
                ★ Keystone
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span
              className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: branch?.colorHex || '#1CB0F6' }}
            >
              {branch?.name || habit.branchId}
            </span>

            {habit.subtitle && (
              <span className="text-[11px] text-[#777777] font-semibold truncate hidden sm:inline">
                {habit.subtitle}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Progressive Disclosure Studio Launcher + Checkmark */}
      <div className="flex items-center gap-2 shrink-0">
        {habit.launchAction && habit.launchAction !== 'url' && (
          <button
            onClick={onLaunch}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-gray-100 hover:bg-[#DDF4FF] text-[#777777] hover:text-[#1CB0F6] border border-gray-200 hover:border-[#84D8FF] font-black text-xs uppercase flex items-center gap-1 cursor-pointer active:translate-y-0.5 transition-all"
            title="Open Interactive Tool (Progressive Disclosure)"
          >
            <Rocket size={14} className="text-[#1CB0F6]" />
            <span className="hidden sm:inline">Launch</span>
          </button>
        )}

        {/* 3D Checkmark Button */}
        <button
          onClick={onToggle}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center cursor-pointer transition-all active:translate-y-1 select-none border-2 border-b-4 ${
            isCompleted
              ? 'bg-[#58CC02] border-[#46A302] text-white shadow-md'
              : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-300 hover:text-gray-400'
          }`}
          title={isCompleted ? 'Mark incomplete' : 'Mark completed (+1 Branch Point)'}
        >
          <Check size={24} strokeWidth={isCompleted ? 4 : 3} />
        </button>
      </div>
    </div>
  );
};
