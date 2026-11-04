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
  Info
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BranchId, Habit } from '../../types';
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
    toggleHabitCompletion,
    addHabit,
    deleteHabit,
    updateMonthlyNotes
  } = useGame();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBranch, setNewBranch] = useState<BranchId>('body');
  const [newIsKeystone, setNewIsKeystone] = useState(false);

  const { habits, branches, character } = state;
  const currentYearMonth = character.currentYearMonth; // '2026-11'
  const totalDays = getDaysInMonth(currentYearMonth);

  // Filter habits for Keystone Mode
  const displayedHabits = keystoneModeOnly ? habits.filter(h => h.isKeystone) : habits;

  // Selected date parsed
  const [selectedY, selectedM, selectedD] = selectedDate.split('-').map(Number);
  const selectedDateObj = new Date(selectedY, selectedM - 1, selectedD);
  const isToday = selectedDate === formatDate(new Date());

  // Quick Day Stepper
  const handleStepDay = (step: number) => {
    const nextDate = new Date(selectedDateObj);
    nextDate.setDate(nextDate.getDate() + step);
    const formatted = formatDate(nextDate);
    setSelectedDate(formatted);

    // Auto-switch spread if date crosses 15
    const nextDayNum = nextDate.getDate();
    if (nextDayNum <= 15 && activeSpread !== 'first') {
      setActiveSpread('first');
    } else if (nextDayNum > 15 && activeSpread !== 'second') {
      setActiveSpread('second');
    }
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addHabit({
      title: newTitle.trim(),
      branchId: newBranch,
      isKeystone: newIsKeystone
    });
    setNewTitle('');
    setIsAddModalOpen(false);
  };

  // Days array for current spread
  const spreadDays = activeSpread === 'first'
    ? Array.from({ length: 15 }, (_, i) => i + 1)
    : Array.from({ length: totalDays - 15 }, (_, i) => i + 16);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* 1. "Busy Day / Keystone Mode" Toggle Banner */}
      <div className={`p-4 sm:p-5 rounded-3xl border-2 border-b-4 transition-all duration-200 ${keystoneModeOnly
          ? 'bg-gradient-to-r from-[#FFF4D6] via-[#FFF9E6] to-[#FFE8A3] border-[#FFC800]'
          : 'bg-white border-[#E5E5E5]'
        }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 border-b-4 ${keystoneModeOnly
                ? 'bg-[#FFC800] border-[#E5A400] text-white shadow-md'
                : 'bg-[#FFF9E6] border-[#FFC800] text-[#E5A400]'
              }`}>
              <Star size={24} className={keystoneModeOnly ? 'fill-white' : 'fill-[#FFC800]'} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base sm:text-lg text-[#3C3C3C]">
                  {keystoneModeOnly ? '★ KEYSTONE MODE ACTIVE' : 'Running Low on Time Today?'}
                </h2>
                {keystoneModeOnly && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FFC800] text-[#3C3C3C]">
                    15m Quick Win
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#777777] font-semibold mt-0.5">
                {keystoneModeOnly
                  ? 'Secondary habits collapsed! Focus only on your 5 Keystone Habits to earn all branch days.'
                  : 'Toggle ★ Keystone Mode to collapse secondary habits and focus solely on your 5 core priorities.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setKeystoneModeOnly(!keystoneModeOnly)}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider cursor-pointer border-2 border-b-4 transition-all active:translate-y-0.5 whitespace-nowrap self-start sm:self-auto ${keystoneModeOnly
                ? 'bg-[#3C3C3C] border-[#222222] text-white'
                : 'bg-[#FFC800] border-[#E5A400] text-[#3C3C3C] hover:bg-[#ffd220]'
              }`}
          >
            {keystoneModeOnly ? 'Show All Habits' : '★ Toggle Keystone Mode'}
          </button>
        </div>
      </div>

      {/* Date Navigator & Quick Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border-2 border-[#E5E5E5] border-b-4">
        {/* Date Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleStepDay(-1)}
            className="w-9 h-9 rounded-xl border-2 border-[#E5E5E5] border-b-4 flex items-center justify-center hover:bg-gray-50 active:translate-y-0.5 cursor-pointer text-[#777777]"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F7F7F7] rounded-xl border-2 border-[#E5E5E5]">
            <Calendar size={18} className="text-[#1CB0F6]" />
            <span className="font-extrabold text-sm sm:text-base text-[#3C3C3C]">
              {selectedDateObj.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            {isToday && (
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#58CC02] text-white">
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

        {/* 1-Point Branch Active Day Status for Selected Date */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-[#777777] mr-1 hidden sm:inline">Active Branches:</span>
          {(['body', 'mind', 'craft', 'bonds', 'empire'] as BranchId[]).map(bId => {
            const branch = branches[bId];
            const isActiveToday = isBranchActiveOnDate(bId, habits, selectedDate);

            return (
              <div
                key={bId}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black border transition-all ${isActiveToday
                    ? 'text-white border-transparent shadow-sm'
                    : 'text-gray-400 border-gray-200 bg-gray-50 opacity-60'
                  }`}
                style={{
                  backgroundColor: isActiveToday ? branch.colorHex : undefined
                }}
                title={`${branch.name}: ${isActiveToday ? '+1 Active Day Earned!' : 'No habits completed yet'}`}
              >
                <BranchIcon branchId={bId} size={13} />
                <span className="capitalize">{branch.name}</span>
                {isActiveToday && <Check size={12} strokeWidth={3} />}
              </div>
            );
          })}
        </div>

        {/* Add Habit Button */}
        <ChunkyButton
          variant="green"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={16} />
          <span>New Habit</span>
        </ChunkyButton>
      </div>

      {/* 2. Today's Bouncy Habit Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-lg text-[#3C3C3C] flex items-center gap-2">
            <span>Playground Checklist</span>
            <span className="text-xs font-extrabold text-[#777777] bg-white px-2.5 py-0.5 rounded-full border border-gray-200">
              {displayedHabits.filter(h => h.completedDates.includes(selectedDate)).length} / {displayedHabits.length} Done
            </span>
          </h3>
          <span className="text-xs font-semibold text-[#777777]">
            ★ Golden Crown = Keystone Habit
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {displayedHabits.map(habit => {
            const branch = branches[habit.branchId];
            const isCompleted = habit.completedDates.includes(selectedDate);
            const streak = calculateHabitStreak(habit, selectedDate);

            return (
              <div
                key={habit.id}
                className={`group relative p-4 rounded-3xl border-2 transition-all duration-100 flex items-center justify-between gap-3 ${isCompleted
                    ? 'bg-white border-[#58CC02] border-b-4 shadow-sm'
                    : 'bg-white border-[#E5E5E5] border-b-4 hover:border-gray-300'
                  }`}
              >
                {/* Branch Accent Pill on the left edge */}
                <div
                  className="w-2.5 self-stretch rounded-full shrink-0"
                  style={{ backgroundColor: branch.colorHex }}
                />

                {/* Habit Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    {habit.isKeystone && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFF5D6] border border-[#FFC800] text-[#A17200] text-[10px] font-black uppercase tracking-wider">
                        ★ Keystone
                      </span>
                    )}
                    <span
                      className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1"
                      style={{ color: branch.colorHex }}
                    >
                      <BranchIcon branchId={habit.branchId} size={12} />
                      {branch.name}
                    </span>
                  </div>

                  <p className={`font-extrabold text-sm sm:text-base leading-snug break-words ${isCompleted ? 'text-[#3C3C3C] line-through opacity-75' : 'text-[#3C3C3C]'
                    }`}>
                    {habit.title}
                  </p>

                  {/* 7-Day Mini-Streak Bar for Keystone Habits */}
                  {habit.isKeystone && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Flame size={14} className="text-[#FF9600] fill-[#FF9600]" />
                        <span className="text-[11px] font-black text-[#FF9600]">
                          {streak.currentStreak}/7 Days
                        </span>
                      </div>
                      {/* Mini progress dots */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 7 }, (_, i) => {
                          const filled = i < (streak.currentStreak % 7 === 0 && streak.currentStreak > 0 ? 7 : streak.currentStreak % 7);
                          return (
                            <span
                              key={i}
                              className={`w-2 h-2 rounded-full transition-all ${filled ? 'bg-[#FF9600]' : 'bg-gray-200'
                                }`}
                            />
                          );
                        })}
                      </div>
                      <span className="text-[10px] text-[#777777] font-semibold">
                        (Common Loot)
                      </span>
                    </div>
                  )}
                </div>

                {/* Right: Bouncy Pressable Check Circle & Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleHabitCompletion(habit.id, selectedDate)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all cursor-pointer select-none active:translate-y-1 ${isCompleted
                        ? 'bg-[#58CC02] border-2 border-b-4 border-[#46A302] text-white shadow-md'
                        : 'bg-white border-2 border-b-4 border-[#E5E5E5] text-transparent hover:border-gray-300'
                      }`}
                    title={isCompleted ? 'Mark incomplete' : 'Mark completed!'}
                  >
                    <Check
                      size={24}
                      strokeWidth={3.5}
                      className={`transition-transform duration-150 ${isCompleted ? 'scale-100 text-white' : 'scale-0'
                        }`}
                    />
                  </button>

                  {/* Subtle Delete */}
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete habit "${habit.title}"?`)) {
                        deleteHabit(habit.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 rounded-xl transition-opacity cursor-pointer"
                    title="Delete habit"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Half-Month Split Calendar Grid (Spread 1: Days 1–15 | Spread 2: Days 16–31) */}
      <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-4 p-5 space-y-4">
        {/* Header & Spread Switcher Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-gray-100 pb-4">
          <div>
            <h3 className="font-black text-lg text-[#3C3C3C] flex items-center gap-2">
              <span>Monthly Habit Spread</span>
              <span className="text-xs font-black uppercase text-[#1CB0F6] bg-[#DDF4FF] px-2.5 py-0.5 rounded-full border border-[#84D8FF]">
                {currentYearMonth}
              </span>
            </h3>
            <p className="text-xs text-[#777777] font-semibold mt-0.5">
              Split into 15-day views so the grid never cramps on desktop or mobile.
            </p>
          </div>

          {/* Pill Tabs: Spread 1 (1–15) vs Spread 2 (16–31) */}
          <div className="flex items-center gap-1 p-1 bg-[#F7F7F7] rounded-2xl border-2 border-[#E5E5E5] self-start sm:self-auto">
            <button
              onClick={() => setActiveSpread('first')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all active:translate-y-0.5 ${activeSpread === 'first'
                  ? 'bg-white border-2 border-b-4 border-[#1CB0F6] text-[#1CB0F6] shadow-sm'
                  : 'text-[#777777] hover:text-[#3C3C3C]'
                }`}
            >
              Spread 1 (Days 1–15)
            </button>
            <button
              onClick={() => setActiveSpread('second')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all active:translate-y-0.5 ${activeSpread === 'second'
                  ? 'bg-white border-2 border-b-4 border-[#1CB0F6] text-[#1CB0F6] shadow-sm'
                  : 'text-[#777777] hover:text-[#3C3C3C]'
                }`}
            >
              Spread 2 (Days 16–{totalDays})
            </button>
          </div>
        </div>

        {/* The Grid Table */}
        <div className="overflow-x-auto pb-2">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b-2 border-gray-100 text-xs font-black text-[#777777]">
                <th className="py-2.5 px-3 min-w-[200px]">Habit & Branch</th>
                {spreadDays.map(dayNum => {
                  const dayDateStr = `${currentYearMonth}-${String(dayNum).padStart(2, '0')}`;
                  const isCurrent = dayDateStr === selectedDate;
                  const isRealToday = dayDateStr === formatDate(new Date());

                  return (
                    <th
                      key={dayNum}
                      onClick={() => setSelectedDate(dayDateStr)}
                      className={`py-2 px-1 text-center cursor-pointer select-none rounded-t-xl transition-colors ${isCurrent
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
                    <td className="py-2.5 px-3">
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
                          className={`py-2 px-1 text-center ${isSelected ? 'bg-[#DDF4FF]/40' : ''
                            }`}
                        >
                          <button
                            onClick={() => toggleHabitCompletion(habit.id, dayDateStr)}
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl mx-auto flex items-center justify-center font-black transition-all cursor-pointer active:translate-y-0.5 border ${checked
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
          {/* Half-Month Branch Day Totals */}
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
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: branch.colorHex }}
                      />
                      <span className="font-black text-xs capitalize text-[#3C3C3C]">
                        {branch.name}
                      </span>
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

          {/* Monthly Reflection Notes Journal Card */}
          <div className="p-4 bg-white rounded-2xl border-2 border-[#E5E5E5] border-b-4 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-[#58CC02]" />
                <h4 className="font-black text-sm text-[#3C3C3C]">Monthly Reflection Journal</h4>
              </div>
              <p className="text-[11px] text-[#777777] font-semibold">
                Jot down what worked, energy levels, or Keystone observations:
              </p>
              <textarea
                value={character.monthlyReflectionNotes}
                onChange={e => updateMonthlyNotes(e.target.value)}
                placeholder="E.g. Keystone habit focus helped on high-stress days..."
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
              <h3 className="font-black text-lg text-[#3C3C3C] flex items-center gap-2">
                <Sparkles size={20} className="text-[#58CC02]" />
                <span>Create New Habit</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full border-2 border-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center font-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-[#777777] mb-1">
                  Habit Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. 10m Morning Sunlight & Stretch"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 font-extrabold text-sm text-[#3C3C3C] focus:border-[#1CB0F6] focus:outline-none"
                />
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
                        className={`p-2.5 rounded-xl border-2 text-xs font-black capitalize flex items-center gap-1.5 cursor-pointer transition-all ${selected
                            ? 'text-white border-transparent border-b-4 shadow-sm'
                            : 'bg-white border-gray-200 text-[#777777] hover:bg-gray-50'
                          }`}
                        style={{
                          backgroundColor: selected ? branch.colorHex : undefined,
                          borderColor: selected ? branch.borderHex : undefined
                        }}
                      >
                        <BranchIcon branchId={bId} size={14} />
                        <span>{branch.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Keystone Checkbox */}
              <div className="p-3 bg-[#FFFDF0] rounded-xl border-2 border-[#FFC800] flex items-start gap-3">
                <input
                  type="checkbox"
                  id="keystoneToggle"
                  checked={newIsKeystone}
                  onChange={e => setNewIsKeystone(e.target.checked)}
                  className="w-5 h-5 rounded-md text-[#FFC800] focus:ring-0 mt-0.5 cursor-pointer"
                />
                <label htmlFor="keystoneToggle" className="cursor-pointer">
                  <div className="font-black text-xs text-[#A17200] flex items-center gap-1">
                    ★ Set as Keystone Habit
                  </div>
                  <div className="text-[11px] text-[#777777] font-semibold mt-0.5">
                    Designates this as your #1 non-negotiable habit for this branch. Active during Busy Day Mode.
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <ChunkyButton
                  type="button"
                  variant="white"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </ChunkyButton>
                <ChunkyButton type="submit" variant="green" size="sm">
                  Add Habit
                </ChunkyButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

