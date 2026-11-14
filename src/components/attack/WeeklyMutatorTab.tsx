import React, { useState } from 'react';
import {
  BarChart2,
  Download,
  Calendar,
  FileText,
  FileSpreadsheet,
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Save,
  Check,
  Target
} from 'lucide-react';
import { useAttackMode } from '../../context/AttackModeContext';
import { TRIAD_CONFIG } from '../../data/attackModeSeed';
import { sound } from '../../utils/audio';

export const WeeklyMutatorTab: React.FC = () => {
  const {
    state,
    setDailyQuotaX,
    setMutationLog,
    updateWeeklyDayFocus,
    exportMarkdown,
    exportCSV,
    metrics
  } = useAttackMode();

  const { sdtRatio, triadBreakdown } = metrics;
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [dayFocusInput, setDayFocusInput] = useState('');

  // Daily target X math
  const dailyX = state.dailyQuotaX;
  const weeklyTarget = dailyX * 7;
  const monthlyTarget = dailyX * 28;

  // Monthly stats calculations
  const totalCompletedMonth = state.weeklyScorecards.reduce((acc, sc) => acc + sc.completedTasks, 0);
  const monthlyCompletionPct = Math.round((totalCompletedMonth / monthlyTarget) * 100);

  // Daily average calculation (from weeks 1, 2, 3)
  const activeWeeks = state.weeklyScorecards.filter(w => w.completedTasks > 0);
  const totalCompletedActive = activeWeeks.reduce((acc, w) => acc + w.completedTasks, 0);
  const totalDaysActive = activeWeeks.length * 7;
  const dailyAverage = totalDaysActive > 0 ? (totalCompletedActive / totalDaysActive).toFixed(1) : dailyX.toFixed(1);
  const dailyAvgPct = Math.round((Number(dailyAverage) / dailyX) * 100);

  const handleStartEditDay = (dayOfWeek: string, currentTitle: string) => {
    sound.playTap();
    setEditingDay(dayOfWeek);
    setDayFocusInput(currentTitle);
  };

  const handleSaveDayFocus = (dayOfWeek: string) => {
    sound.playTap();
    updateWeeklyDayFocus(dayOfWeek, dayFocusInput.trim());
    setEditingDay(null);
  };

  const getGradeColor = (grade: 'S' | 'A' | 'B' | 'C') => {
    switch (grade) {
      case 'S':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'A':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'B':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'C':
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* 1. Daily Quota ($X$) Controller & Multipliers Banner */}
      <div className="bg-white rounded-2xl border-2 border-[#E2E8F0] border-b-5 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h2 className="font-black text-lg sm:text-xl text-slate-900 uppercase tracking-tight">
              Daily Quota ($X$) Controller & 4-Week Mutator
            </h2>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Theoretical static plans fail. Define your daily $X$, let the plan mutate weekly, and export execution proof.
          </p>
        </div>

        {/* Stepper Controller */}
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200 self-start md:self-auto">
          <div className="text-right">
            <div className="text-[10px] font-black uppercase text-slate-500">
              Daily Target ($X$)
            </div>
            <div className="text-xs text-slate-600 font-bold">
              Tasks per Day
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDailyQuotaX(dailyX - 1)}
              className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 border border-slate-300 font-black text-sm text-slate-800 cursor-pointer flex items-center justify-center transition-all active:translate-y-0.5"
            >
              -
            </button>
            <span className="font-mono text-2xl font-black text-blue-600 w-8 text-center">
              {dailyX}
            </span>
            <button
              onClick={() => setDailyQuotaX(dailyX + 1)}
              className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 border border-slate-300 font-black text-sm text-slate-800 cursor-pointer flex items-center justify-center transition-all active:translate-y-0.5"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* 2. Quota Multiplier Cards ($X \times 7$ Math) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[10px] font-black uppercase text-slate-500">
            Daily Execution Quota ($X$)
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-1">
            {dailyX} Tasks / Day
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Non-negotiable daily core commitment
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[10px] font-black uppercase text-slate-500">
            Weekly Target ($X \times 7$)
          </div>
          <div className="text-2xl font-black font-mono text-blue-600 mt-1">
            {weeklyTarget} Tasks / Week
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Compound consistency across 7 days
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="text-[10px] font-black uppercase text-slate-500">
            4-Week Monthly Quota ($X \times 28$)
          </div>
          <div className="text-2xl font-black font-mono text-emerald-600 mt-1">
            {monthlyTarget} Tasks / Month
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Monthly high-impact volume baseline
          </div>
        </div>
      </div>

      {/* 3. Mutable 7-Day Action Grid (Mon - Sun) */}
      <div className="bg-white rounded-2xl border-2 border-[#E2E8F0] border-b-5 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
              Mutable 7-Day Action Grid
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Assign or mutate each day's tactical focus based on real-world constraints.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600">
            Current Week Target: {weeklyTarget}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {state.weeklyPlans.map(plan => {
            const isEditing = editingDay === plan.dayOfWeek;

            return (
              <div
                key={plan.dayOfWeek}
                className="bg-slate-50 rounded-xl border border-slate-200 p-3 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-slate-900">
                      {plan.dayOfWeek}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-white text-slate-600 border border-slate-200">
                      {plan.completedCount} / {dailyX} Done
                    </span>
                  </div>

                  {isEditing ? (
                    <div className="mt-2 space-y-1.5">
                      <input
                        type="text"
                        value={dayFocusInput}
                        onChange={e => setDayFocusInput(e.target.value)}
                        placeholder="Focus title..."
                        className="w-full px-2 py-1 rounded border border-blue-400 text-xs font-semibold text-slate-900 bg-white"
                      />
                      <button
                        onClick={() => handleSaveDayFocus(plan.dayOfWeek)}
                        className="w-full py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold uppercase cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs font-bold text-slate-700 mt-1.5 line-clamp-2 min-h-[32px]">
                      {plan.focusTitle}
                    </p>
                  )}
                </div>

                {!isEditing && (
                  <button
                    onClick={() => handleStartEditDay(plan.dayOfWeek, plan.focusTitle)}
                    className="text-[10px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <Edit2 size={10} />
                    <span>Mutate</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Weekly Mutation Log */}
      <div className="bg-white rounded-2xl border-2 border-[#E2E8F0] border-b-5 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
          <span className="text-sm">📝</span>
          <div>
            <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
              Weekly Mutation Log & Heuristics
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              What worked? What failed? How is your execution system mutating right now?
            </p>
          </div>
        </div>

        <textarea
          rows={3}
          value={state.mutationLog}
          onChange={e => setMutationLog(e.target.value)}
          placeholder="Record tactical lessons and plan mutations here..."
          className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600 bg-slate-50/50"
        />
      </div>

      {/* 5. Gamified Performance Scoreboard (4-Week Month View) */}
      <div className="bg-white rounded-2xl border-2 border-[#E2E8F0] border-b-5 p-4 sm:p-5 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-yellow-600" />
            <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
              Gamified Performance Scoreboard (4-Week Sprints)
            </h3>
          </div>

          <div className="text-xs font-bold text-slate-600">
            Daily Average: <strong className="font-mono text-blue-600">{dailyAverage} / {dailyX} ({dailyAvgPct}%)</strong>
          </div>
        </div>

        {/* 4 Weekly Scorecards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {state.weeklyScorecards.map(sc => {
            const pct = Math.round((sc.completedTasks / sc.targetTasks) * 100);

            return (
              <div
                key={sc.weekNumber}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-slate-800">
                    {sc.label}
                  </span>
                  <span
                    className={`font-mono font-black text-xs px-2 py-0.5 rounded-full border ${getGradeColor(
                      sc.grade
                    )}`}
                  >
                    Grade {sc.grade}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-600">
                      {sc.completedTasks} / {sc.targetTasks} Tasks
                    </span>
                    <span className="font-mono text-blue-600">{pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 font-bold flex items-center justify-between pt-1 border-t border-slate-200">
                  <span>SLA On-Time Rate:</span>
                  <span className="font-mono text-emerald-700">{sc.slaOnTimeRate}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Balance Gauges: SDT 70/30 & Triad Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* SDT 70/30 Meter */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-800">
                SDT Motivation Balance
              </span>
              <span className="text-[10px] font-bold text-slate-500">
                Target: 70% Intrinsic / 30% Extrinsic
              </span>
            </div>

            <div className="w-full h-3 bg-amber-200 rounded-full overflow-hidden flex border border-slate-200">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${sdtRatio.intrinsicPct}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-blue-700">
                🎯 Intrinsic: {sdtRatio.intrinsicPct}% ({sdtRatio.intrinsicCount} tasks)
              </span>
              <span className="text-amber-700">
                ⚡ Extrinsic: {sdtRatio.extrinsicPct}% ({sdtRatio.extrinsicCount} tasks)
              </span>
            </div>

            {!sdtRatio.isBalanced && (
              <p className="text-[10px] text-amber-700 font-medium">
                ⚠️ Balance Alert: Extrinsic tasks exceed 30% or Intrinsic dropped below 60%. Prioritize self-determined mastery.
              </p>
            )}
          </div>

          {/* Triad Balance Meter */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-800">
                Triad Category Balance
              </span>
              <span className="text-[10px] font-bold text-slate-500">
                Rich / Muscular / Intelligent
              </span>
            </div>

            {/* Tri-color bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex border border-slate-200">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${triadBreakdown.richPct}%` }}
                title={`Rich: ${triadBreakdown.richPct}%`}
              />
              <div
                className="h-full bg-red-500 transition-all duration-300"
                style={{ width: `${triadBreakdown.muscularPct}%` }}
                title={`Muscular: ${triadBreakdown.muscularPct}%`}
              />
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${triadBreakdown.intelligentPct}%` }}
                title={`Intelligent: ${triadBreakdown.intelligentPct}%`}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-emerald-700">
                💰 Rich: {triadBreakdown.richPct}%
              </span>
              <span className="text-red-700">
                💪 Muscular: {triadBreakdown.muscularPct}%
              </span>
              <span className="text-blue-700">
                🧠 Intelligent: {triadBreakdown.intelligentPct}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. 1-Click Data Export Bar (.MD and .CSV / Excel) */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <Download size={18} className="text-blue-400" />
            <h3 className="font-black text-sm uppercase tracking-wider">
              1-Click Execution Proof & Data Exporters
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Archive your execution logs in structured Markdown or open in Excel / Google Sheets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportMarkdown}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-wider border border-slate-700 cursor-pointer flex items-center gap-1.5 transition-all active:translate-y-0.5 shadow-xs"
          >
            <FileText size={15} className="text-blue-400" />
            <span>Export (.MD)</span>
          </button>

          <button
            onClick={exportCSV}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider border border-emerald-500 cursor-pointer flex items-center gap-1.5 transition-all active:translate-y-0.5 shadow-xs"
          >
            <FileSpreadsheet size={15} className="text-white" />
            <span>Export to Excel (.CSV)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
