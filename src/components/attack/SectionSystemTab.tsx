import React, { useState } from 'react';
import {
  Calendar,
  Check,
  Plus,
  Trash2,
  Clock,
  ArrowRight,
  ShieldAlert,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Archive
} from 'lucide-react';
import { useAttackMode } from '../../context/AttackModeContext';
import { DayOfWeek } from '../../types/attackMode';
import { DAYS_OF_WEEK, TRIAD_SECTIONS, getTodayDayOfWeek } from '../../data/attackModeSeed';
import { BeginnerGuideCard } from './OnboardingAndGuide';
import { sound } from '../../utils/audio';

export const SectionSystemTab: React.FC = () => {
  const {
    state,
    setSelectedDayOfWeek,
    setViewMode,
    addSectionTask,
    toggleSectionTask,
    deleteSectionTask,
    clearCompletedSectionTasks,
    openSherlockModal,
    openSundayResetModal,
    openAnchorModal,
    metrics
  } = useAttackMode();

  const currentTodayDay = getTodayDayOfWeek();
  const activeDay = state.selectedDayOfWeek;
  const { currentDayStats, allWeekStats } = metrics;

  const [filterSection, setFilterSection] = useState<'all' | 'rich' | 'muscular' | 'intelligent'>('all');

  const [inputs, setInputs] = useState<Record<string, string>>({
    rich: '',
    muscular: '',
    intelligent: ''
  });

  const handleInputChange = (sec: string, val: string) => {
    setInputs(prev => ({ ...prev, [sec]: val }));
  };

  const handleAddTaskSubmit = (day: DayOfWeek, section: 'rich' | 'muscular' | 'intelligent', e: React.FormEvent) => {
    e.preventDefault();
    const val = inputs[section]?.trim();
    if (!val) return;

    addSectionTask(day, section, val);
    handleInputChange(section, '');
  };

  const activeDayTasks = state.sectionTasks
    .filter(t => t.dayOfWeek === activeDay)
    .filter(t => (filterSection === 'all' ? true : t.section === filterSection));

  const ongoingCount = state.sectionTasks.filter(t => !t.isCompleted).length;
  const completedCount = state.sectionTasks.filter(t => t.isCompleted).length;
  const todayCompleted = state.sectionTasks.filter(t => t.dayOfWeek === activeDay && t.isCompleted).length;
  const todayTotal = state.sectionTasks.filter(t => t.dayOfWeek === activeDay).length;
  const todayPct = todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0;

  // SVG Progress Ring calculations for Today
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (todayPct / 100) * circumference;

  return (
    <div className="max-w-md mx-auto sm:max-w-4xl px-3.5 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5 font-sans w-full overflow-x-hidden">
      {/* 1. Beginner Guide Card (Collapsible) */}
      <BeginnerGuideCard />

      {/* 2. Responsive Top Header: Date, View Switcher & Quick Protocol Triggers */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <Calendar size={14} className="text-[#937485]" />
            <span>
              {activeDay === currentTodayDay ? 'Today, ' : `${activeDay}, `}
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          {/* Day / Week View Switcher */}
          <div className="flex bg-white rounded-xl p-0.5 shadow-2xs border border-slate-200 text-[11px] font-semibold">
            <button
              onClick={() => setViewMode('day')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                state.viewMode === 'day' ? 'bg-[#937485] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setViewMode('weekGrid')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                state.viewMode === 'weekGrid' ? 'bg-[#937485] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Days
            </button>
          </div>
        </div>

        {/* Quick Protocol Buttons Row (Anchor Mode + Sherlock Protocol + Sunday Reset) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {/* Anchor Mode (Out of the Zone) Trigger */}
          <button
            onClick={openAnchorModal}
            className="px-2.5 py-1.5 rounded-xl bg-[#78909C]/15 hover:bg-[#78909C]/25 text-[#455A64] text-[11px] font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
            title="Anchor Mode: Minimum viable tasks when you are out of the zone"
          >
            <span>⚓</span>
            <span>Anchor Mode</span>
            {state.anchorModeActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#7EB982] animate-pulse" />
            )}
          </button>

          {/* Sherlock Protocol (When You Mess Up) Trigger Button */}
          <button
            onClick={openSherlockModal}
            className="px-2.5 py-1.5 rounded-xl bg-[#ECA172]/15 hover:bg-[#ECA172]/25 text-[#D17E49] text-[11px] font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
            title="Sherlock Holmes Contingency Protocol (When You Mess Up)"
          >
            <span>🔍</span>
            <span>Come Here</span>
          </button>

          {/* Save Week Performance Trigger Button */}
          <button
            onClick={openSundayResetModal}
            className="px-2.5 py-1.5 rounded-xl bg-[#937485]/15 hover:bg-[#937485]/25 text-[#937485] text-[11px] font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
            title="Save this week's completed tasks into report & advance cycle"
          >
            <span>💾</span>
            <span>Save Week {state.currentWeekNumber || 1}</span>
          </button>
        </div>
      </div>

      {/* 3. Today Hero with Circular Progress Ring */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-100 flex items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <span className="text-[11px] sm:text-xs font-bold text-[#937485] uppercase tracking-wider">
            Daily Execution
          </span>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5 truncate">
            {state.viewMode === 'day' ? activeDay : '7-Day Overview'}
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 sm:mt-1">
            {todayCompleted} of {todayTotal} tasks completed for {activeDay}
          </p>
        </div>

        {/* Circular Progress Ring on Today Page */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
          <svg className="w-16 h-16 sm:w-20 sm:h-20 transform -rotate-90" viewBox="0 0 72 72">
            <circle
              cx="36"
              cy="36"
              r={radius}
              stroke="#EEF0F6"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="36"
              cy="36"
              r={radius}
              stroke="#7EB982"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute text-center">
            <span className="font-extrabold text-xs sm:text-sm text-slate-900 font-mono">
              {todayPct}%
            </span>
          </div>
        </div>
      </div>

      {/* 4. The 4 Stat Cards (Mauve, Peach, Sage Green, Coral) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Card 1: Ongoing (Mauve) */}
        <div className="bg-[#937485] text-white rounded-3xl p-3.5 sm:p-4 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[96px] sm:min-h-[105px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide opacity-90">Ongoing</span>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">
              ⚡
            </div>
          </div>
          <div className="mt-1.5 sm:mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold">{ongoingCount}</span>
            <span className="text-[11px] ml-1 opacity-80">tasks</span>
          </div>
          <svg className="absolute -bottom-1 -right-2 w-24 h-10 opacity-20 pointer-events-none" viewBox="0 0 100 40">
            <path d="M0 20 Q 25 5, 50 20 T 100 20 L 100 40 L 0 40 Z" fill="currentColor" />
          </svg>
        </div>

        {/* Card 2: In Process / Today (Peach) */}
        <div className="bg-[#ECA172] text-white rounded-3xl p-3.5 sm:p-4 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[96px] sm:min-h-[105px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide opacity-90">In Process</span>
            <Clock size={15} className="opacity-80" />
          </div>
          <div className="mt-1.5 sm:mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold">{todayTotal - todayCompleted}</span>
            <span className="text-[11px] ml-1 opacity-80">pending</span>
          </div>
          <svg className="absolute -bottom-1 -right-2 w-24 h-10 opacity-20 pointer-events-none" viewBox="0 0 100 40">
            <path d="M0 25 Q 30 10, 60 25 T 100 25 L 100 40 L 0 40 Z" fill="currentColor" />
          </svg>
        </div>

        {/* Card 3: Completed (Sage Green) */}
        <div className="bg-[#7EB982] text-white rounded-3xl p-3.5 sm:p-4 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[96px] sm:min-h-[105px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide opacity-90">Completed</span>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <Check size={13} strokeWidth={3} />
            </div>
          </div>
          <div className="mt-1.5 sm:mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold">{completedCount}</span>
            <span className="text-[11px] ml-1 opacity-80">done</span>
          </div>
          <svg className="absolute -bottom-1 -right-2 w-24 h-10 opacity-20 pointer-events-none" viewBox="0 0 100 40">
            <path d="M0 20 Q 25 35, 50 20 T 100 20 L 100 40 L 0 40 Z" fill="currentColor" />
          </svg>
        </div>

        {/* Card 4: High Urgency (Coral) */}
        <div className="bg-[#E67370] text-white rounded-3xl p-3.5 sm:p-4 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[96px] sm:min-h-[105px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide opacity-90">P1 SLA</span>
            <Clock size={15} className="opacity-80" />
          </div>
          <div className="mt-1.5 sm:mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold">{metrics.slaSummary.p1Active}</span>
            <span className="text-[11px] ml-1 opacity-80">critical</span>
          </div>
          <svg className="absolute -bottom-1 -right-2 w-24 h-10 opacity-20 pointer-events-none" viewBox="0 0 100 40">
            <path d="M0 30 Q 30 15, 60 30 T 100 30 L 100 40 L 0 40 Z" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* 5. Day Stepper Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
        {DAYS_OF_WEEK.map(day => {
          const isSelected = activeDay === day;
          const isToday = currentTodayDay === day;
          const dayTasks = state.sectionTasks.filter(t => t.dayOfWeek === day);
          const done = dayTasks.filter(t => t.isCompleted).length;

          return (
            <button
              key={day}
              onClick={() => setSelectedDayOfWeek(day)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-semibold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#937485] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              <span>{day.slice(0, 3)}</span>
              {isToday && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white text-[#937485]' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Today
                </span>
              )}
              <span className="text-[10px] opacity-75">
                {done}/{dayTasks.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* VIEW MODE 1: DAY FOCUS (Cards matching screenshot) */}
      {/* ======================================================== */}
      {state.viewMode === 'day' && (
        <div className="space-y-4">
          {/* Section Filter Pills */}
          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {(['all', 'rich', 'muscular', 'intelligent'] as const).map(sec => (
                <button
                  key={sec}
                  onClick={() => setFilterSection(sec)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                    filterSection === sec
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-500 hover:text-slate-900 border border-slate-100'
                  }`}
                >
                  {sec === 'all' ? 'All Sections' : sec}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {activeDayTasks.some(t => t.isCompleted) && (
                <button
                  onClick={() => clearCompletedSectionTasks(activeDay)}
                  className="px-2.5 py-1 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                  title="Clear completed tasks from board (safely preserved in reports)"
                >
                  <Archive size={12} className="text-[#937485]" />
                  <span>Clear Done ({activeDayTasks.filter(t => t.isCompleted).length})</span>
                </button>
              )}

              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                {activeDayTasks.length} tasks
              </span>
            </div>
          </div>

          {/* The 3 Core Pillar Sections */}
          <div className="space-y-4">
            {TRIAD_SECTIONS.filter(s => (filterSection === 'all' ? true : s.id === filterSection)).map(sec => {
              const secTasks = activeDayTasks.filter(t => t.section === sec.id);

              return (
                <div key={sec.id} className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-3.5">
                  {/* Section Title */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{sec.icon}</span>
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 tracking-tight">
                        {sec.name}
                      </h3>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                      {secTasks.filter(t => t.isCompleted).length} / {secTasks.length} Done
                    </span>
                  </div>

                  {/* Tasks in this section */}
                  <div className="space-y-2">
                    {secTasks.map(task => (
                      <div
                        key={task.id}
                        className={`p-3.5 rounded-2xl flex items-center justify-between gap-3 transition-all border ${
                          task.isCompleted
                            ? 'bg-slate-50 border-slate-100 opacity-60'
                            : 'bg-white border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <button
                            onClick={() => toggleSectionTask(task.id)}
                            className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 border ${
                              task.isCompleted
                                ? 'bg-[#7EB982] border-[#7EB982] text-white'
                                : 'border-slate-300 hover:border-[#937485] bg-white'
                            }`}
                          >
                            {task.isCompleted && <Check size={12} strokeWidth={3} />}
                          </button>

                          <div className="min-w-0 flex-1">
                            <span
                              className={`text-xs font-semibold leading-snug break-words ${
                                task.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'
                              }`}
                            >
                              {task.title}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                              <span>{task.allocationMinutes}m</span>
                              {task.deadlineTime && (
                                <>
                                  <span>•</span>
                                  <span>Due {task.deadlineTime}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => deleteSectionTask(task.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors p-1 cursor-pointer shrink-0"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}

                    {secTasks.length === 0 && (
                      <p className="text-xs text-slate-400 italic py-2">
                        No tasks set for this section on {activeDay}.
                      </p>
                    )}
                  </div>

                  {/* Inline Task Add */}
                  <form
                    onSubmit={e => handleAddTaskSubmit(activeDay, sec.id, e)}
                    className="pt-2 border-t border-slate-100 flex gap-2 w-full"
                  >
                    <input
                      type="text"
                      value={inputs[sec.id] || ''}
                      onChange={e => handleInputChange(sec.id, e.target.value)}
                      placeholder={`Add task under ${sec.shortName}...`}
                      className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#937485] focus:bg-white transition-colors"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl bg-[#937485] hover:bg-[#836475] text-white text-xs font-semibold cursor-pointer transition-colors shadow-2xs shrink-0"
                    >
                      Add
                    </button>
                  </form>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW MODE 2: PROJECTS / ALL DAYS (Screen 2 in screenshot) */}
      {/* ======================================================== */}
      {state.viewMode === 'weekGrid' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DAYS_OF_WEEK.map(day => {
              const dayTasks = state.sectionTasks.filter(t => t.dayOfWeek === day);
              const done = dayTasks.filter(t => t.isCompleted).length;
              const total = dayTasks.length;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              const isToday = currentTodayDay === day;

              const rad = 22;
              const circ = 2 * Math.PI * rad;
              const off = circ - (pct / 100) * circ;

              return (
                <div
                  key={day}
                  onClick={() => {
                    setSelectedDayOfWeek(day);
                    setViewMode('day');
                  }}
                  className={`bg-white rounded-3xl p-5 shadow-xs border transition-all cursor-pointer hover:border-[#937485] flex items-center justify-between gap-4 ${
                    isToday ? 'border-[#937485] ring-2 ring-[#937485]/10' : 'border-slate-100'
                  }`}
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-base text-slate-900">{day}</h3>
                      {isToday && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#937485] text-white">
                          Today
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {done} of {total} tasks completed
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-[#937485] font-semibold pt-1">
                      <span>View Day Plan</span>
                      <ArrowRight size={12} />
                    </div>
                  </div>

                  <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle cx="32" cy="32" r={rad} stroke="#EEF0F6" strokeWidth="5" fill="transparent" />
                      <circle
                        cx="32"
                        cy="32"
                        r={rad}
                        stroke="#7EB982"
                        strokeWidth="5"
                        strokeDasharray={circ}
                        strokeDashoffset={off}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-500"
                      />
                    </svg>
                    <span className="absolute font-bold text-xs text-slate-800">
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
