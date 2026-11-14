import React, { useState } from 'react';
import {
  Check,
  Plus,
  Clock,
  AlertTriangle,
  Flame,
  Brain,
  Shield,
  Trash2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Anchor,
  HelpCircle
} from 'lucide-react';
import { useAttackMode } from '../../context/AttackModeContext';
import { AttackTask, TriadCategory, SDTType } from '../../types/attackMode';
import { TRIAD_CONFIG, getTodayDateString } from '../../data/attackModeSeed';
import { CognitiveDrillModal } from './CognitiveDrillModal';
import { sound } from '../../utils/audio';

export const TodayTab: React.FC = () => {
  const {
    state,
    addTask,
    toggleTask,
    deleteTask,
    incrementTaskTime,
    incrementMonthlyTarget,
    decrementMonthlyTarget,
    addMonthlyTarget,
    deleteMonthlyTarget,
    metrics
  } = useAttackMode();

  const { todayProgress } = metrics;
  const today = getTodayDateString();

  // Quick-Add Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TriadCategory>('rich');
  const [newSdt, setNewSdt] = useState<SDTType>('intrinsic');
  const [newAllocation, setNewAllocation] = useState<number>(45);
  const [newDeadline, setNewDeadline] = useState<string>('18:00');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New Monthly Target Form State
  const [showAddTargetModal, setShowAddTargetModal] = useState(false);
  const [targetTitle, setTargetTitle] = useState('');
  const [targetCategory, setTargetCategory] = useState<TriadCategory>('rich');
  const [targetMax, setTargetMax] = useState<number>(3);
  const [targetUnit, setTargetUnit] = useState('Books');

  // Cognitive Drill Modal State
  const [isDrillModalOpen, setIsDrillModalOpen] = useState(false);

  // Filter Tasks
  const isAnchorMode = state.anchorModeActive;
  const activeDateTasks = state.tasks.filter(t => t.date === today);

  const anchorTasks = activeDateTasks.filter(t => t.isAnchor);
  const coreTasks = activeDateTasks.filter(t => !t.isAnchor && t.category !== 'mundane');
  const mundaneTasks = activeDateTasks.filter(t => !t.isAnchor && t.category === 'mundane');

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const result = addTask({
      title: newTitle,
      category: newCategory,
      sdtType: newSdt,
      allocationMinutes: newAllocation,
      deadlineTime: newDeadline
    });

    if (!result.success) {
      setErrorMessage(result.error || 'Failed to add task.');
    } else {
      setNewTitle('');
    }
  };

  const handleSaveMonthlyTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTitle.trim()) return;

    addMonthlyTarget({
      title: targetTitle.trim(),
      category: targetCategory,
      targetCount: targetMax,
      currentCount: 0,
      unit: targetUnit,
      month: today.slice(0, 7)
    });

    setTargetTitle('');
    setShowAddTargetModal(false);
  };

  // Helper for live deadline display
  const formatDeadlineRemaining = (deadlineTime: string) => {
    if (!deadlineTime) return null;
    const [h, m] = deadlineTime.split(':').map(Number);
    const now = new Date();
    const deadlineDate = new Date();
    deadlineDate.setHours(h, m, 0, 0);

    const diffMinutes = Math.round((deadlineDate.getTime() - now.getTime()) / (60 * 1000));
    if (diffMinutes <= 0) {
      return <span className="text-red-600 font-bold">Past Due ({deadlineTime})</span>;
    }
    const hrs = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;
    return (
      <span className="text-slate-600 font-medium">
        Due {deadlineTime} ({hrs > 0 ? `${hrs}h ` : ''}{mins}m left)
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* If Anchor Mode is Active, show full-width notice banner */}
      {isAnchorMode && (
        <div className="bg-amber-500 text-white rounded-2xl p-4 sm:p-5 border-2 border-amber-600 border-b-6 shadow-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl shrink-0">
              ⚓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base sm:text-lg uppercase tracking-wide leading-none">
                  ANCHOR MODE ACTIVE
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-amber-900 uppercase">
                  Travel / Chaotic Day Shield
                </span>
              </div>
              <p className="text-xs text-amber-100 font-medium mt-1">
                Full daily quota is paused. Execute ONLY these 3 psychological anchors to preserve consistency without stress.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ======================================================== */}
        {/* LEFT MAIN COLUMN: DAILY EXECUTION LIST (8 / 12 cols = ~67-70%) */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Daily Quota Progress Bar (Hidden in Anchor Mode) */}
          {!isAnchorMode && (
            <div className="bg-white rounded-2xl border-2 border-[#E2E8F0] border-b-5 p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-slate-800 tracking-wider">
                      Daily Quota ($X$ Target)
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {todayProgress.completedCore} / {todayProgress.quotaTarget} Core Tasks
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    "Deadline is God. Complete quota early to secure compound momentum."
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-mono text-xl sm:text-2xl font-black text-slate-900">
                    {todayProgress.percentage}%
                  </span>
                </div>
              </div>

              {/* Progress Track */}
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
                <div
                  className={`h-full transition-all duration-300 ${
                    todayProgress.isQuotaMet ? 'bg-emerald-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${todayProgress.percentage}%` }}
                />
              </div>

              {/* Binary Task Completion Pills */}
              <div className="flex items-center gap-1.5 pt-1">
                {Array.from({ length: todayProgress.quotaTarget }).map((_, idx) => {
                  const isDone = idx < todayProgress.completedCore;
                  return (
                    <div
                      key={idx}
                      className={`flex-1 h-2 rounded-full transition-all ${
                        isDone ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                      title={`Task Slot ${idx + 1}: ${isDone ? 'Completed' : 'Pending'}`}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Quick-Add Input Bar (With Strict Deadline Validation) */}
          {!isAnchorMode && (
            <div className="bg-white rounded-2xl border-2 border-[#E2E8F0] border-b-5 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">⚡</span>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Quick-Add Attack Task
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold">
                  Rule: Core tasks strictly require a deadline
                </span>
              </div>

              {errorMessage && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={15} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleQuickAdd} className="space-y-3">
                {/* Title Input */}
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Task deliverable (e.g., Deploy auth service, 5x5 weighted dips, read chapter 4)..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder:text-slate-400"
                />

                {/* Controls Bar: Category, SDT, Allocation, Deadline */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* Category Pill */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                      Pillar
                    </label>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value as TriadCategory)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                    >
                      <option value="rich">💰 Rich (Earning)</option>
                      <option value="muscular">💪 Muscular (Body)</option>
                      <option value="intelligent">🧠 Intelligent (Brain)</option>
                      <option value="mundane">⚙️ Mundane (Errand)</option>
                    </select>
                  </div>

                  {/* SDT Type */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                      Motivation (SDT)
                    </label>
                    <select
                      value={newSdt}
                      onChange={e => setNewSdt(e.target.value as SDTType)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                    >
                      <option value="intrinsic">🎯 Intrinsic (70%)</option>
                      <option value="extrinsic">⚡ Extrinsic (30%)</option>
                    </select>
                  </div>

                  {/* Allocation Cap */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                      Allocation Cap
                    </label>
                    <select
                      value={newAllocation}
                      onChange={e => setNewAllocation(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                    >
                      <option value={15}>15 Mins</option>
                      <option value={30}>30 Mins</option>
                      <option value={45}>45 Mins</option>
                      <option value={60}>60 Mins</option>
                      <option value={90}>90 Mins</option>
                      <option value={120}>120 Mins</option>
                    </select>
                  </div>

                  {/* Deadline Time (Strict Rule) */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                      Hard Deadline Time
                    </label>
                    <input
                      type="time"
                      value={newDeadline}
                      onChange={e => setNewDeadline(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider border-2 border-b-4 border-blue-800 active:border-b-2 active:translate-y-0.5 cursor-pointer flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <Plus size={14} />
                    <span>+ Add Task to Quota</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 3. ANCHOR MODE VIEW: Display only the 3 lightweight anchors */}
          {isAnchorMode && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                  <Anchor size={14} className="text-amber-600" />
                  <span>Psychological Anchor Quota (3 Tasks)</span>
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                  {anchorTasks.filter(t => t.isCompleted).length} / 3 Completed
                </span>
              </div>

              <div className="space-y-3">
                {anchorTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={() => toggleTask(task.id)}
                    onDelete={() => deleteTask(task.id)}
                    onAddTime={m => incrementTaskTime(task.id, m)}
                    formatDeadline={formatDeadlineRemaining}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 4. SECTION A: CORE ATTACK TASKS ($X$ DAILY QUOTA) */}
          {!isAnchorMode && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>Section A: Core Attack Tasks ({coreTasks.length})</span>
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  {coreTasks.filter(t => t.isCompleted).length} / {coreTasks.length} Done
                </span>
              </div>

              <div className="space-y-3">
                {coreTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={() => toggleTask(task.id)}
                    onDelete={() => deleteTask(task.id)}
                    onAddTime={m => incrementTaskTime(task.id, m)}
                    formatDeadline={formatDeadlineRemaining}
                  />
                ))}

                {coreTasks.length === 0 && (
                  <div className="p-6 rounded-2xl bg-white border-2 border-dashed border-slate-200 text-center text-xs text-slate-500">
                    No core attack tasks scheduled today. Use the Quick-Add bar above to load your quota.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. SECTION B: MUNDANE & ADMIN ERRANDS */}
          {!isAnchorMode && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>Section B: Mundane & Admin Errands ({mundaneTasks.length})</span>
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                  Does not dilute Triad analytics
                </span>
              </div>

              <div className="space-y-2.5">
                {mundaneTasks.map(task => (
                  <div
                    key={task.id}
                    className={`bg-white rounded-xl border p-3 flex items-center justify-between gap-3 transition-all ${
                      task.isCompleted
                        ? 'border-emerald-300 bg-emerald-50/40 opacity-70'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                          task.isCompleted
                            ? 'bg-emerald-600 border-emerald-700 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-transparent'
                        }`}
                      >
                        <Check size={14} strokeWidth={3} />
                      </button>

                      <div className="min-w-0 flex-1">
                        <span
                          className={`text-xs font-semibold ${
                            task.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'
                          }`}
                        >
                          {task.title}
                        </span>
                        <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>⚙️ Errand</span>
                          <span>•</span>
                          <span>Cap: {task.allocationMinutes}m</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer p-1"
                      title="Delete errand"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}

                {mundaneTasks.length === 0 && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-[11px] text-slate-500">
                    No errands pending.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 6. SECTION C: COGNITIVE / PERIPHERAL DRILL BOX */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 border-b-5 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl shadow-sm shrink-0">
                <Brain size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
                    Section C: Cognitive Peripheral Drill
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                    Daily Active
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  60-second rapid arithmetic & working memory speed sprint to activate prefrontal cortex.
                </p>
                <div className="flex items-center gap-3 text-[11px] font-bold text-blue-900 mt-2">
                  <span>Last Score: {state.cognitiveDrillRecord.score} pts</span>
                  <span>•</span>
                  <span>🔥 {state.cognitiveDrillRecord.streakDays} Day Cognitive Streak</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playTap();
                setIsDrillModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider border-2 border-b-4 border-blue-800 active:border-b-2 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-xs shrink-0"
            >
              <Brain size={15} />
              <span>Launch 60s Drill</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT SIDEBAR: V.IMP MONTHLY TARGETS (4 / 12 cols = ~30%) */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border-2 border-[#E2E8F0] border-b-5 p-4 sm:p-5 shadow-xs space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎯</span>
                <div>
                  <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
                    V.IMP Monthly Targets
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium">
                    4-Week Big Rocks (Never Forgotten)
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playTap();
                  setShowAddTargetModal(true);
                }}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-bold cursor-pointer"
                title="Add new monthly target"
              >
                +
              </button>
            </div>

            {/* Monthly Targets List */}
            <div className="space-y-4">
              {state.monthlyTargets.map(target => {
                const conf = TRIAD_CONFIG[target.category];
                const pct = Math.min(100, Math.round((target.currentCount / target.targetCount) * 100));

                return (
                  <div
                    key={target.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span
                          className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${conf.badgeClass}`}
                        >
                          {conf.label}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900 mt-1 leading-snug">
                          {target.title}
                        </h4>
                      </div>

                      <button
                        onClick={() => deleteMonthlyTarget(target.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer text-xs p-1"
                        title="Delete target"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Progress Track */}
                    <div className="space-y-1">
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                        <span>
                          {target.currentCount} / {target.targetCount} {target.unit}
                        </span>
                        <span className="font-mono text-blue-600">{pct}%</span>
                      </div>
                    </div>

                    {/* Stepper Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => decrementMonthlyTarget(target.id, target.unit === '%' ? 5 : 1)}
                        className="flex-1 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs font-black text-slate-700 cursor-pointer transition-all active:translate-y-0.5"
                      >
                        -
                      </button>
                      <button
                        onClick={() => incrementMonthlyTarget(target.id, target.unit === '%' ? 5 : 1)}
                        className="flex-1 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-black cursor-pointer transition-all active:translate-y-0.5"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}

              {state.monthlyTargets.length === 0 && (
                <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
                  No monthly targets set. Click '+' to define your 4-week big rocks.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cognitive Drill Modal */}
      <CognitiveDrillModal
        isOpen={isDrillModalOpen}
        onClose={() => setIsDrillModalOpen(false)}
      />

      {/* Add Monthly Target Modal */}
      {showAddTargetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border-2 border-slate-300 border-b-6 max-w-sm w-full p-5 space-y-4 shadow-xl animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h4 className="font-black text-sm text-slate-900 uppercase">
                Add V.Imp Monthly Target
              </h4>
              <button
                onClick={() => setShowAddTargetModal(false)}
                className="w-6 h-6 rounded-lg bg-slate-100 text-xs font-bold text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMonthlyTarget} className="space-y-3">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                  Target Title
                </label>
                <input
                  type="text"
                  required
                  value={targetTitle}
                  onChange={e => setTargetTitle(e.target.value)}
                  placeholder="e.g. Read 3 Books, Ship 3 Videos..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                    Pillar
                  </label>
                  <select
                    value={targetCategory}
                    onChange={e => setTargetCategory(e.target.value as TriadCategory)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                  >
                    <option value="rich">💰 Rich</option>
                    <option value="muscular">💪 Muscular</option>
                    <option value="intelligent">🧠 Intelligent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                    Target Goal
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={targetMax}
                    onChange={e => setTargetMax(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                  Unit Label
                </label>
                <input
                  type="text"
                  value={targetUnit}
                  onChange={e => setTargetUnit(e.target.value)}
                  placeholder="Books, Videos, %, Projects..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTargetModal(false)}
                  className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider border-2 border-b-4 border-blue-800 cursor-pointer"
                >
                  Save Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Clean Tactile Task Card
interface TaskCardProps {
  task: AttackTask;
  onToggle: () => void;
  onDelete: () => void;
  onAddTime: (minutes: number) => void;
  formatDeadline: (time: string) => React.ReactNode;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggle,
  onDelete,
  onAddTime,
  formatDeadline
}) => {
  const conf = TRIAD_CONFIG[task.category];
  const isCapReached = task.timeSpentMinutes >= task.allocationMinutes;

  return (
    <div
      className={`bg-white rounded-2xl border-2 transition-all p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${
        task.isCompleted
          ? 'border-emerald-300 border-b-5 bg-emerald-50/30'
          : 'border-[#E2E8F0] border-b-5 hover:border-slate-300'
      }`}
    >
      {/* Left: Checkmark + Details */}
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <button
          onClick={onToggle}
          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 border-2 border-b-4 active:border-b-2 active:translate-y-0.5 ${
            task.isCompleted
              ? 'bg-emerald-600 border-emerald-800 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-transparent'
          }`}
          title={task.isCompleted ? 'Mark incomplete' : 'Mark completed (+1 Quota)'}
        >
          <Check size={18} strokeWidth={3} />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${conf.badgeClass}`}
            >
              {conf.icon} {conf.label}
            </span>

            <span
              className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                task.sdtType === 'intrinsic'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {task.sdtType === 'intrinsic' ? '🎯 Intrinsic' : '⚡ Extrinsic'}
            </span>

            {/* Anti-Procrastination Allocation Cap Banner */}
            {isCapReached ? (
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-300 animate-pulse">
                ⚠️ ALLOCATION REACHED — MOVE TO NEXT PRIORITY
              </span>
            ) : (
              <span className="text-[10px] font-bold text-slate-500">
                Cap: {task.timeSpentMinutes}m / {task.allocationMinutes}m
              </span>
            )}
          </div>

          <h4
            className={`font-bold text-sm text-slate-900 mt-1.5 leading-snug ${
              task.isCompleted ? 'line-through text-slate-400' : ''
            }`}
          >
            {task.title}
          </h4>

          {/* Deadline Countdown */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <Clock size={13} className="text-slate-400" />
            <span>{formatDeadline(task.deadlineTime)}</span>
          </div>
        </div>
      </div>

      {/* Right: Allocation Log Action + Delete */}
      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        {!task.isCompleted && (
          <button
            onClick={() => onAddTime(15)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 cursor-pointer active:translate-y-0.5"
            title="Log +15 minutes of work to check against allocation cap"
          >
            +15m Work
          </button>
        )}

        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          title="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
