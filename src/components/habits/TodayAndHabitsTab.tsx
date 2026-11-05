import React, { useState } from 'react';
import {
  Flame,
  Star,
  Check,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  BookOpen,
  Award,
  ChevronLeft,
  ChevronRight,
  Rocket,
  Edit2,
  ExternalLink,
  Zap,
  Palette,
  Crown,
  Clock
} from 'lucide-react';
import { useGame, getScheduleTypeFromDate } from '../../context/GameContext';
import { BranchId, Habit, ScheduleFilter } from '../../types';
import { BranchIcon } from '../common/BranchIcon';
import { ChunkyButton } from '../common/ChunkyButton';
import {
  calculateHabitStreak,
  formatDate,
  getBranchDaysForMonth,
  getDaysInMonth,
  isBranchActiveOnDate
} from '../../utils/gameMath';

export const TodayAndHabitsTab: React.FC = () => {
  const {
    state,
    keystoneModeOnly,
    setKeystoneModeOnly,
    selectedDate,
    setSelectedDate,
    activeSpread,
    setActiveSpread,
    scheduleFilter,
    setScheduleFilter,
    setActiveStudioModal,
    toggleHabitCompletion,
    addHabit,
    deleteHabit,
    updateHabitLaunchUrl,
    updateMonthlyNotes
  } = useGame();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUrlHabitId, setEditingUrlHabitId] = useState<string | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState('');

  // Add Habit Form
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newBranch, setNewBranch] = useState<BranchId>('body');
  const [newSchedule, setNewSchedule] = useState<'all' | 'mwf' | 'tts' | 'sunday'>('all');
  const [newIsKeystone, setNewIsKeystone] = useState(false);
  const [newLaunchUrl, setNewLaunchUrl] = useState('');

  const { habits, branches, character } = state;
  const currentYearMonth = character.currentYearMonth;
  const totalDays = getDaysInMonth(currentYearMonth);

  // Determine active effective day type
  const autoDayType = getScheduleTypeFromDate(selectedDate);
  const effectiveSchedule = scheduleFilter === 'today' ? autoDayType : scheduleFilter;

  // Filter habits according to Schedule Filter and Keystone Mode
  let displayedHabits = habits.filter(h => {
    if (h.scheduleType === 'all') return true;
    return h.scheduleType === effectiveSchedule;
  });

  if (keystoneModeOnly) {
    displayedHabits = displayedHabits.filter(h => h.isKeystone);
  }

  // Handle Quick Day Stepper
  const [selectedY, selectedM, selectedD] = selectedDate.split('-').map(Number);
  const selectedDateObj = new Date(selectedY, selectedM - 1, selectedD);
  const isToday = selectedDate === formatDate(new Date());

  const handleStepDay = (step: number) => {
    const nextDate = new Date(selectedDateObj);
    nextDate.setDate(nextDate.getDate() + step);
    const formatted = formatDate(nextDate);
    setSelectedDate(formatted);

    const nextDayNum = nextDate.getDate();
    if (nextDayNum <= 15 && activeSpread !== 'first') {
      setActiveSpread('first');
    } else if (nextDayNum > 15 && activeSpread !== 'second') {
      setActiveSpread('second');
    }
  };

  const handleLaunchHabit = (habit: Habit) => {
    if (habit.launchAction && habit.launchAction !== 'url') {
      setActiveStudioModal(habit.launchAction);
    } else if (habit.launchUrl) {
      window.open(habit.launchUrl, '_blank');
    } else {
      // Default to general reading or quickLoot if no specific link
      setActiveStudioModal('quickLoot');
    }
  };

  const handleSaveLaunchUrl = (habitId: string) => {
    if (customUrlInput.trim()) {
      updateHabitLaunchUrl(habitId, customUrlInput.trim());
    }
    setEditingUrlHabitId(null);
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addHabit({
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || undefined,
      branchId: newBranch,
      isKeystone: newIsKeystone,
      scheduleType: newSchedule,
      launchUrl: newLaunchUrl.trim() || undefined,
      launchAction: 'url',
      timeEstimateMinutes: 30
    });
    setNewTitle('');
    setNewSubtitle('');
    setNewLaunchUrl('');
    setIsAddModalOpen(false);
  };

  const spreadDays = activeSpread === 'first'
    ? Array.from({ length: 15 }, (_, i) => i + 1)
    : Array.from({ length: totalDays - 15 }, (_, i) => i + 16);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* 1. Schedule Switcher & Survival Mode Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border-2 border-[#E5E5E5] border-b-6 shadow-sm">
        {/* Schedule Mode Selector Pills */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[#777777]">
            <Zap size={14} className="text-[#FFC800]" />
            <span>Polymath Schedule Engine:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap no-scrollbar">
            <button
              onClick={() => setScheduleFilter('today')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                scheduleFilter === 'today'
                  ? 'bg-[#3C3C3C] text-white shadow-xs'
                  : 'bg-[#F7F7F7] text-[#777777] hover:bg-gray-200'
              }`}
            >
              Today ({autoDayType.toUpperCase()})
            </button>

            <button
              onClick={() => setScheduleFilter('mwf')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                scheduleFilter === 'mwf'
                  ? 'bg-[#1CB0F6] text-white shadow-xs'
                  : 'bg-[#F7F7F7] text-[#777777] hover:bg-gray-200'
              }`}
            >
              <span>⚡ MWF (Tech & Cloud)</span>
            </button>

            <button
              onClick={() => setScheduleFilter('tts')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                scheduleFilter === 'tts'
                  ? 'bg-[#FFC800] text-[#3C3C3C] shadow-xs'
                  : 'bg-[#F7F7F7] text-[#777777] hover:bg-gray-200'
              }`}
            >
              <span>🎨 TTS (Art Studio)</span>
            </button>

            <button
              onClick={() => setScheduleFilter('sunday')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                scheduleFilter === 'sunday'
                  ? 'bg-[#CE82FF] text-white shadow-xs'
                  : 'bg-[#F7F7F7] text-[#777777] hover:bg-gray-200'
              }`}
            >
              <span>👑 Sun (Empire Reset)</span>
            </button>
          </div>
        </div>

        {/* Survival Mode Toggle Button */}
        <button
          onClick={() => setKeystoneModeOnly(!keystoneModeOnly)}
          className={`w-full sm:w-auto px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider cursor-pointer border-2 border-b-4 transition-all active:translate-y-0.5 whitespace-nowrap self-start md:self-auto flex items-center justify-center gap-2 ${
            keystoneModeOnly
              ? 'bg-[#FF4B4B] border-[#EA2B2B] text-white shadow-md animate-pulse'
              : 'bg-[#FFF9E6] border-[#FFC800] text-[#A17200] hover:bg-[#ffeec2]'
          }`}
        >
          <Flame size={16} className={keystoneModeOnly ? 'fill-white' : 'fill-[#FFC800]'} />
          <span>{keystoneModeOnly ? '🔥 SURVIVAL: ON (5 Keystones)' : '🔥 Survival Mode Toggle'}</span>
        </button>
      </div>

      {/* Date Navigator Bar & 1-Point Branch Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-3xl border-2 border-[#E5E5E5] border-b-4">
        {/* Date Selector */}
        <div className="flex items-center justify-between sm:justify-start gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleStepDay(-1)}
              className="w-9 h-9 rounded-xl border-2 border-[#E5E5E5] border-b-4 flex items-center justify-center hover:bg-gray-50 active:translate-y-0.5 cursor-pointer text-[#777777]"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-[#F7F7F7] rounded-xl border-2 border-[#E5E5E5]">
              <Calendar size={16} className="text-[#1CB0F6] shrink-0" />
              <span className="font-extrabold text-xs sm:text-base text-[#3C3C3C] whitespace-nowrap">
                {selectedDateObj.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
              {isToday && (
                <span className="text-[9px] sm:text-[10px] font-black uppercase px-1.5 sm:px-2 py-0.5 rounded-md bg-[#58CC02] text-white shrink-0">
                  Today
                </span>
              )}
            </div>

            <button
              onClick={() => handleStepDay(1)}
              className="w-9 h-9 rounded-xl border-2 border-[#E5E5E5] border-b-4 flex items-center justify-center hover:bg-gray-50 active:translate-y-0.5 cursor-pointer text-[#777777]"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Mobile-only New Habit Button */}
          <div className="sm:hidden">
            <ChunkyButton variant="green" size="sm" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={15} />
              <span>New</span>
            </ChunkyButton>
          </div>
        </div>

        {/* 1-Point Branch Active Day Status */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap no-scrollbar">
          <span className="text-xs font-bold text-[#777777] mr-1 hidden sm:inline shrink-0">Active:</span>
          {(['body', 'mind', 'craft', 'bonds', 'empire'] as BranchId[]).map(bId => {
            const branch = branches[bId];
            const isActiveToday = isBranchActiveOnDate(bId, habits, selectedDate);

            return (
              <div
                key={bId}
                className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-black border transition-all shrink-0 ${
                  isActiveToday
                    ? 'text-white border-transparent shadow-xs'
                    : 'text-gray-400 border-gray-200 bg-gray-50 opacity-60'
                }`}
                style={{ backgroundColor: isActiveToday ? branch.colorHex : undefined }}
                title={`${branch.name}: ${isActiveToday ? '+1 Active Day Earned!' : 'No habits completed yet'}`}
              >
                <BranchIcon branchId={bId} size={12} />
                <span className="capitalize">{branch.name}</span>
                {isActiveToday && <Check size={11} strokeWidth={3} />}
              </div>
            );
          })}
        </div>

        {/* Desktop New Habit Button */}
        <div className="hidden sm:block">
          <ChunkyButton variant="green" size="sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} />
            <span>New Habit</span>
          </ChunkyButton>
        </div>
      </div>

      {/* 2. Today's Quest Board Cards with 5-Second Zero-Friction Launch Buttons */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-lg text-[#3C3C3C] flex items-center gap-2">
            <span>Today&apos;s Quest Board</span>
            <span className="text-xs font-extrabold text-[#777777] bg-white px-2.5 py-0.5 rounded-full border border-gray-200">
              {displayedHabits.filter(h => h.completedDates.includes(selectedDate)).length} / {displayedHabits.length} Complete
            </span>
          </h3>
          <span className="text-xs font-semibold text-[#777777] hidden sm:inline">
            ★ Golden Star = Keystone (7d streak unlocks Common Chest)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedHabits.map(habit => {
            const branch = branches[habit.branchId];
            const isCompleted = habit.completedDates.includes(selectedDate);
            const streak = calculateHabitStreak(habit, selectedDate);

            return (
              <div
                key={habit.id}
                className={`group relative p-5 rounded-3xl border-2 transition-all duration-100 flex flex-col justify-between gap-4 ${
                  isCompleted
                    ? 'bg-white border-[#58CC02] border-b-6 shadow-xs'
                    : 'bg-white border-[#E5E5E5] border-b-6 hover:border-gray-300'
                }`}
              >
                {/* Top Row: Branch Pill, Keystone Star, Schedule Tag */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-white text-[11px] font-black uppercase tracking-wider"
                      style={{ backgroundColor: branch.colorHex }}
                    >
                      <BranchIcon branchId={habit.branchId} size={12} />
                      <span>{branch.name}</span>
                    </span>

                    {habit.isKeystone && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFF5D6] border border-[#FFC800] text-[#A17200] text-[10px] font-black uppercase">
                        ★ Keystone
                      </span>
                    )}

                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md uppercase">
                      {habit.scheduleType}
                    </span>
                  </div>

                  {/* 7-Day Mini-Streak Bar on Keystone habits */}
                  {habit.isKeystone && (
                    <div className="flex items-center gap-1 text-[11px] font-black text-[#FF9600]">
                      <Flame size={13} className="fill-[#FF9600]" />
                      <span>{streak.currentStreak}/7d</span>
                    </div>
                  )}
                </div>

                {/* Habit Title & Subtitle */}
                <div className="space-y-1">
                  <h4 className={`font-black text-base sm:text-lg leading-snug break-words ${
                    isCompleted ? 'text-[#3C3C3C] line-through opacity-70' : 'text-[#3C3C3C]'
                  }`}>
                    {habit.title}
                  </h4>
                  {habit.subtitle && (
                    <p className="text-xs text-[#777777] font-semibold leading-relaxed">
                      {habit.subtitle}
                    </p>
                  )}
                </div>

                {/* Inline Pinned Link Editor */}
                {editingUrlHabitId === habit.id ? (
                  <div className="p-2.5 bg-[#F7F7F7] rounded-xl border border-gray-200 space-y-2">
                    <input
                      type="text"
                      value={customUrlInput}
                      onChange={e => setCustomUrlInput(e.target.value)}
                      placeholder="Paste deep URL (Pinterest, YouTube, GCP, GitHub)..."
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold focus:outline-none"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingUrlHabitId(null)}
                        className="text-xs font-bold text-gray-500 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveLaunchUrl(habit.id)}
                        className="px-2.5 py-1 bg-[#1CB0F6] text-white rounded-lg text-xs font-black cursor-pointer"
                      >
                        Save Link
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* CRITICAL FEATURE: Two Side-by-Side 5-Second Zero-Friction Launch Buttons */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-1.5 sm:gap-2">
                  {/* Left: [🚀 LAUNCH NOW] Button with inline Edit pencil */}
                  <div className="flex items-center gap-1 sm:gap-1.5 flex-1 min-w-0">
                    <button
                      onClick={() => handleLaunchHabit(habit)}
                      className="flex-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-2xl bg-[#DDF4FF] border-2 border-[#84D8FF] border-b-4 text-[#1CB0F6] font-black text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1 sm:gap-1.5 hover:bg-[#caedff] active:translate-y-1 transition-all cursor-pointer truncate"
                      title="Open pinned deep link or interactive studio timer"
                    >
                      <Rocket size={14} className="shrink-0 sm:w-[15px] sm:h-[15px]" />
                      <span className="truncate">
                        {habit.launchAction === 'workout'
                          ? '60m Workout'
                          : habit.launchAction === 'music'
                          ? 'Music Vault'
                          : habit.launchAction === 'reading'
                          ? 'Book Tracker'
                          : habit.launchAction === 'art'
                          ? 'Art Studio'
                          : habit.launchAction === 'career'
                          ? 'Cloud/AI Lab'
                          : habit.launchAction === 'english'
                          ? 'AI Coach'
                          : 'Launch Link'}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingUrlHabitId(habit.id);
                        setCustomUrlInput(habit.launchUrl || '');
                      }}
                      className="p-1.5 sm:p-2 rounded-xl border border-gray-200 text-gray-400 hover:text-[#1CB0F6] hover:bg-gray-50 transition-colors cursor-pointer shrink-0"
                      title="Edit Pinned Deep Link URL"
                    >
                      <Edit2 size={12} className="sm:w-[13px] sm:h-[13px]" />
                    </button>
                  </div>

                  {/* Right: [✓ COMPLETE] Button */}
                  <button
                    onClick={() => toggleHabitCompletion(habit.id, selectedDate)}
                    className={`py-2 sm:py-2.5 px-3 sm:px-4 rounded-2xl font-black text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1 sm:gap-1.5 border-2 border-b-4 transition-all cursor-pointer select-none active:translate-y-1 shrink-0 ${
                      isCompleted
                        ? 'bg-[#58CC02] border-[#46A302] text-white shadow-xs'
                        : 'bg-[#F7F7F7] border-[#E5E5E5] text-[#777777] hover:bg-gray-100 hover:text-[#3C3C3C]'
                    }`}
                  >
                    <Check size={14} strokeWidth={3} className={`sm:w-4 sm:h-4 ${isCompleted ? 'text-white' : 'text-gray-400'}`} />
                    <span>{isCompleted ? 'Done ✓' : 'Complete'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Half-Month Split Calendar Grid (Spread 1: Days 1–15 | Spread 2: Days 16–31) */}
      <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-6 p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-gray-100 pb-3 sm:pb-4">
          <div>
            <h3 className="font-black text-base sm:text-lg text-[#3C3C3C] flex items-center gap-2">
              <span>Monthly Habit Spread</span>
              <span className="text-[10px] sm:text-xs font-black uppercase text-[#1CB0F6] bg-[#DDF4FF] px-2 sm:px-2.5 py-0.5 rounded-full border border-[#84D8FF]">
                {currentYearMonth}
              </span>
            </h3>
            <p className="text-[11px] sm:text-xs text-[#777777] font-semibold mt-0.5">
              Split into 15-day views so the grid never cramps on desktop or mobile.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#F7F7F7] rounded-2xl border-2 border-[#E5E5E5] self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setActiveSpread('first')}
              className={`flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider cursor-pointer transition-all whitespace-nowrap text-center ${
                activeSpread === 'first'
                  ? 'bg-white border-2 border-b-4 border-[#1CB0F6] text-[#1CB0F6] shadow-xs'
                  : 'text-[#777777] hover:text-[#3C3C3C]'
              }`}
            >
              Spread 1 (1–15)
            </button>
            <button
              onClick={() => setActiveSpread('second')}
              className={`flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider cursor-pointer transition-all whitespace-nowrap text-center ${
                activeSpread === 'second'
                  ? 'bg-white border-2 border-b-4 border-[#1CB0F6] text-[#1CB0F6] shadow-xs'
                  : 'text-[#777777] hover:text-[#3C3C3C]'
              }`}
            >
              Spread 2 (16–{totalDays})
            </button>
          </div>
        </div>

        {/* Mobile Swipe Hint */}
        <div className="sm:hidden flex items-center justify-between text-[10px] font-bold text-gray-400 px-1">
          <span>👈 Swipe table horizontally</span>
          <span>Habit pinned on left 📌</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto pb-2 rounded-2xl border border-gray-100 sm:border-0">
          <table className="w-full text-left border-collapse min-w-[620px]">
            <thead>
              <tr className="border-b-2 border-gray-100 text-xs font-black text-[#777777]">
                <th className="py-2.5 px-3 min-w-[150px] sm:min-w-[200px] sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">Habit & Branch</th>
                {spreadDays.map(dayNum => {
                  const dayDateStr = `${currentYearMonth}-${String(dayNum).padStart(2, '0')}`;
                  const isCurrent = dayDateStr === selectedDate;
                  const isRealToday = dayDateStr === formatDate(new Date());

                  return (
                    <th
                      key={dayNum}
                      onClick={() => setSelectedDate(dayDateStr)}
                      className={`py-2 px-1 text-center cursor-pointer select-none rounded-t-xl transition-colors ${
                        isCurrent
                          ? 'bg-[#DDF4FF] text-[#1CB0F6] font-black'
                          : isRealToday
                          ? 'bg-[#EBF9DC] text-[#58CC02] font-black'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-[11px] leading-none">{dayNum}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayedHabits.map(habit => {
                const branch = branches[habit.branchId];

                return (
                  <tr key={habit.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-2.5 px-3 sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: branch.colorHex }}
                          title={branch.name}
                        />
                        {habit.isKeystone && (
                          <span className="text-[#FFC800] text-sm shrink-0" title="Keystone Habit">
                            ★
                          </span>
                        )}
                        <span className="font-extrabold text-xs sm:text-sm text-[#3C3C3C] truncate max-w-[220px]">
                          {habit.title}
                        </span>
                      </div>
                    </td>

                    {spreadDays.map(dayNum => {
                      const dayDateStr = `${currentYearMonth}-${String(dayNum).padStart(2, '0')}`;
                      const checked = habit.completedDates.includes(dayDateStr);
                      const isSelected = dayDateStr === selectedDate;

                      return (
                        <td
                          key={dayNum}
                          className={`py-2 px-1 text-center ${
                            isSelected ? 'bg-[#DDF4FF]/40' : ''
                          }`}
                        >
                          <button
                            onClick={() => toggleHabitCompletion(habit.id, dayDateStr)}
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl mx-auto flex items-center justify-center font-black transition-all cursor-pointer active:translate-y-0.5 border ${
                              checked
                                ? 'text-white border-b-2 shadow-xs'
                                : 'bg-gray-50 border-gray-200 text-transparent hover:border-gray-400'
                            }`}
                            style={{
                              backgroundColor: checked ? branch.colorHex : undefined,
                              borderColor: checked ? branch.borderHex : undefined
                            }}
                            title={`Toggle for Day ${dayNum}`}
                          >
                            <Check
                              size={16}
                              strokeWidth={3.5}
                              className={`transition-transform ${checked ? 'scale-100 text-white' : 'scale-0'}`}
                            />
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 4. Bottom Auto-Tally Cards & Monthly Reflection Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4 border-t-2 border-gray-100">
          <div className="lg:col-span-2 p-4 bg-[#F7F7F7] rounded-2xl border-2 border-[#E5E5E5] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-sm text-[#3C3C3C] flex items-center gap-1.5">
                <Award size={16} className="text-[#1CB0F6]" />
                <span>Monthly Active Branch Days (1 Point Rule)</span>
              </h4>
              <span className="text-[11px] text-[#777777] font-bold">
                Max 1 pt / branch / day
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(['body', 'mind', 'craft', 'bonds', 'empire'] as BranchId[]).map(bId => {
                const branch = branches[bId];
                const { half1Days, half2Days, totalMonthDays } = getBranchDaysForMonth(
                  bId,
                  habits,
                  currentYearMonth
                );

                return (
                  <div
                    key={bId}
                    className="p-3 bg-white rounded-xl border-2 border-b-3 border-[#E5E5E5] flex flex-col items-center text-center shadow-xs"
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: branch.colorHex }} />
                      <span className="font-black text-xs capitalize text-[#3C3C3C]">{branch.name}</span>
                    </div>

                    <div className="text-xl font-black text-[#3C3C3C] leading-tight">
                      {totalMonthDays}
                      <span className="text-[10px] text-[#777777] font-bold ml-0.5">days</span>
                    </div>

                    <div className="text-[10px] text-[#777777] font-semibold mt-0.5">
                      H1: {half1Days} | H2: {half2Days}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border-2 border-[#E5E5E5] border-b-4 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-[#58CC02]" />
                <h4 className="font-black text-sm text-[#3C3C3C]">Monthly Reflection Journal</h4>
              </div>
              <textarea
                value={character.monthlyReflectionNotes}
                onChange={e => updateMonthlyNotes(e.target.value)}
                placeholder="Log energy levels, flute tone observations, or coding breakthroughs..."
                rows={3}
                className="w-full text-xs font-medium p-2.5 rounded-xl border-2 border-gray-200 focus:border-[#1CB0F6] focus:outline-none resize-none"
              />
            </div>
            <div className="text-[10px] text-right text-gray-400 font-bold mt-2">
              Auto-saved to Character Sheet
            </div>
          </div>
        </div>
      </div>

      {/* Add New Habit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border-2 border-b-6 border-[#E5E5E5] p-6 max-w-md w-full shadow-2xl space-y-4 animate-pop">
            <div className="flex items-center justify-between border-b-2 border-gray-100 pb-3">
              <h3 className="font-black text-lg text-[#3C3C3C]">
                Create Polymath Habit
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full border-2 border-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center font-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateHabit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black uppercase text-[#777777] mb-1">
                  Habit Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. 20m Whistle Interval Ear Training"
                  className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 text-xs font-bold text-[#3C3C3C] focus:outline-none focus:border-[#1CB0F6]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#777777] mb-1">
                  Subtitle / Anchor Cue
                </label>
                <input
                  type="text"
                  value={newSubtitle}
                  onChange={e => setNewSubtitle(e.target.value)}
                  placeholder="e.g. Immediately after dinner with Clarke Sweetone"
                  className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 text-xs font-semibold text-[#777777] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#777777] mb-1">
                  Schedule Type
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['all', 'mwf', 'tts', 'sunday'] as const).map(sch => (
                    <button
                      type="button"
                      key={sch}
                      onClick={() => setNewSchedule(sch)}
                      className={`py-1.5 rounded-lg text-[10px] font-black uppercase cursor-pointer ${
                        newSchedule === sch ? 'bg-[#3C3C3C] text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {sch}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#777777] mb-1">
                  Attribute Branch
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['body', 'mind', 'craft', 'bonds', 'empire'] as BranchId[]).map(bId => {
                    const branch = branches[bId];
                    const selected = newBranch === bId;
                    return (
                      <button
                        type="button"
                        key={bId}
                        onClick={() => setNewBranch(bId)}
                        className={`p-2 rounded-xl border-2 text-xs font-black capitalize flex items-center gap-1.5 cursor-pointer ${
                          selected ? 'text-white border-transparent' : 'bg-white border-gray-200 text-[#777777]'
                        }`}
                        style={{ backgroundColor: selected ? branch.colorHex : undefined }}
                      >
                        <BranchIcon branchId={bId} size={14} />
                        <span>{branch.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#777777] mb-1">
                  Pinned Deep Link URL (Optional)
                </label>
                <input
                  type="text"
                  value={newLaunchUrl}
                  onChange={e => setNewLaunchUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="p-3 bg-[#FFFDF0] rounded-xl border-2 border-[#FFC800] flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="keystoneCheck"
                  checked={newIsKeystone}
                  onChange={e => setNewIsKeystone(e.target.checked)}
                  className="w-4 h-4 rounded text-[#FFC800] mt-0.5"
                />
                <label htmlFor="keystoneCheck" className="text-xs cursor-pointer">
                  <div className="font-black text-[#A17200]">★ Set as Keystone Habit</div>
                  <div className="text-[10px] text-gray-500">Designates this as priority anchor for Busy Day Survival Mode.</div>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <ChunkyButton type="button" variant="white" size="sm" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </ChunkyButton>
                <ChunkyButton type="submit" variant="green" size="sm">
                  Save Habit
                </ChunkyButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
