import React, { useState } from 'react';
import {
  Check,
  Plus,
  Trash2,
  Calendar,
  Grid,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  ChevronDown
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
    metrics
  } = useAttackMode();

  const currentTodayDay = getTodayDayOfWeek();
  const activeDay = state.selectedDayOfWeek;
  const { currentDayStats, allWeekStats } = metrics;

  // New task inputs by section for active day
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

  const activeDayTasks = state.sectionTasks.filter(t => t.dayOfWeek === activeDay);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 font-sans">
      {/* 1. Beginner Guide Card (Collapsible & Dismissible) */}
      <BeginnerGuideCard />

      {/* 2. Top Header & Day Selector Bar */}
      <div className="bg-white rounded-3xl border-2 border-[#E2E8F0] border-b-6 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📅</span>
              <h2 className="font-black text-lg sm:text-xl text-slate-900 uppercase tracking-tight">
                7-Day Section System
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Organize daily execution under the 3 Core Pillars. At week's end, completion totals roll up into your monthly score.
            </p>
          </div>

          {/* View Toggle: Single Day vs Full Week Grid */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                state.viewMode === 'day'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar size={13} />
              <span>Day Focus</span>
            </button>

            <button
              onClick={() => setViewMode('weekGrid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                state.viewMode === 'weekGrid'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid size={13} />
              <span>Full Week Grid</span>
            </button>
          </div>
        </div>

        {/* 7-Day Stepper Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-slate-100">
          {DAYS_OF_WEEK.map(day => {
            const isSelected = activeDay === day;
            const isToday = currentTodayDay === day;
            const dayTasks = state.sectionTasks.filter(t => t.dayOfWeek === day);
            const doneCount = dayTasks.filter(t => t.isCompleted).length;

            return (
              <button
                key={day}
                onClick={() => setSelectedDayOfWeek(day)}
                className={`px-3.5 py-2 rounded-2xl font-black text-xs uppercase tracking-wider shrink-0 transition-all cursor-pointer border-2 border-b-4 flex items-center gap-2 active:border-b-2 active:translate-y-0.5 ${
                  isSelected
                    ? 'bg-blue-600 border-blue-800 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{day.slice(0, 3)}</span>
                {isToday && (
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase ${
                      isSelected ? 'bg-white text-blue-700' : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    Today
                  </span>
                )}
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {doneCount}/{dayTasks.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* VIEW MODE 1: DAY FOCUS (Clean 3-Section Cards) */}
      {/* ======================================================== */}
      {state.viewMode === 'day' && (
        <div className="space-y-6">
          {/* Active Day Banner with Progress Bar */}
          <div className="bg-white rounded-3xl border-2 border-[#E2E8F0] border-b-6 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg sm:text-xl text-slate-900 uppercase">
                  {activeDay} Execution Plan
                </h3>
                {activeDay === currentTodayDay && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase border border-emerald-300">
                    Active Today
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Completed {currentDayStats.completedTasks} of {currentDayStats.totalTasks} tasks today ({currentDayStats.pct}%)
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-black text-slate-700">
                <span>Day Completion</span>
                <span className="font-mono text-blue-600">{currentDayStats.pct}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${currentDayStats.pct}%` }}
                />
              </div>
            </div>
          </div>

          {/* The 3 Core Pillar Section Cards (Exactly as in screenshot) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {TRIAD_SECTIONS.map(sec => {
              const secTasks = activeDayTasks.filter(t => t.section === sec.id);
              const doneSecCount = secTasks.filter(t => t.isCompleted).length;

              return (
                <div
                  key={sec.id}
                  className="bg-white rounded-3xl border-2 border-[#E2E8F0] border-b-6 p-5 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Section Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{sec.icon}</span>
                        <div>
                          <h4 className="font-black text-xs sm:text-sm text-slate-900 uppercase tracking-tight">
                            {sec.name}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {sec.description}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sec.headerBadge}`}
                      >
                        {doneSecCount} / {secTasks.length}
                      </span>
                    </div>

                    {/* Task Checklist Items */}
                    <div className="space-y-2.5 pt-1">
                      {secTasks.map(task => (
                        <div
                          key={task.id}
                          className={`p-3 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all ${
                            task.isCompleted
                              ? 'border-emerald-300 border-b-4 bg-emerald-50/40 opacity-80'
                              : 'border-slate-200 border-b-4 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            {/* Checkmark Button */}
                            <button
                              onClick={() => toggleSectionTask(task.id)}
                              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 border-2 active:translate-y-0.5 ${
                                task.isCompleted
                                  ? 'bg-emerald-600 border-emerald-700 text-white'
                                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-transparent'
                              }`}
                            >
                              <Check size={14} strokeWidth={3} />
                            </button>

                            <span
                              className={`text-xs font-bold leading-snug break-words ${
                                task.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'
                              }`}
                            >
                              {task.title}
                            </span>
                          </div>

                          <button
                            onClick={() => deleteSectionTask(task.id)}
                            className="text-slate-300 hover:text-red-500 transition-colors cursor-pointer p-1 shrink-0"
                            title="Delete task"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}

                      {secTasks.length === 0 && (
                        <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                          No tasks set for this section on {activeDay}.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Inline Quick Add Task for this Section */}
                  <form
                    onSubmit={e => handleAddTaskSubmit(activeDay, sec.id, e)}
                    className="pt-2 border-t border-slate-100"
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputs[sec.id] || ''}
                        onChange={e => handleInputChange(sec.id, e.target.value)}
                        placeholder={`+ Add task under ${sec.shortName}...`}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                      <button
                        type="submit"
                        className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold cursor-pointer transition-all active:translate-y-0.5"
                      >
                        + Add
                      </button>
                    </div>
                  </form>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW MODE 2: FULL WEEK GRID (Notion-style side-by-side) */}
      {/* ======================================================== */}
      {state.viewMode === 'weekGrid' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {DAYS_OF_WEEK.map(day => {
              const dayTasks = state.sectionTasks.filter(t => t.dayOfWeek === day);
              const isToday = currentTodayDay === day;

              return (
                <div
                  key={day}
                  className={`bg-white rounded-3xl border-2 border-b-6 p-4 shadow-xs space-y-3 ${
                    isToday ? 'border-blue-500 ring-2 ring-blue-200' : 'border-[#E2E8F0]'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-black text-sm text-slate-900 uppercase">
                        {day}
                      </h4>
                      {isToday && (
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-blue-600 text-white uppercase">
                          Today
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">
                      {dayTasks.filter(t => t.isCompleted).length} / {dayTasks.length} Done
                    </span>
                  </div>

                  {/* 3 Sections Collapsible list */}
                  <div className="space-y-3">
                    {TRIAD_SECTIONS.map(sec => {
                      const secTasks = dayTasks.filter(t => t.section === sec.id);

                      return (
                        <div key={sec.id} className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase text-slate-700">
                            <span>{sec.icon}</span>
                            <span>{sec.name}</span>
                          </div>

                          <div className="space-y-1 pl-4">
                            {secTasks.map(t => (
                              <div
                                key={t.id}
                                className="flex items-center gap-2 group text-xs font-semibold"
                              >
                                <input
                                  type="checkbox"
                                  checked={t.isCompleted}
                                  onChange={() => toggleSectionTask(t.id)}
                                  className="w-3.5 h-3.5 rounded text-blue-600 cursor-pointer"
                                />
                                <span
                                  className={`flex-1 truncate ${
                                    t.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'
                                  }`}
                                >
                                  {t.title}
                                </span>
                              </div>
                            ))}

                            {secTasks.length === 0 && (
                              <p className="text-[10px] text-slate-400 italic">No tasks set</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
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
