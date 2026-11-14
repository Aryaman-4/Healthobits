import React from 'react';
import {
  Award,
  TrendingUp,
  Download,
  Calendar,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Zap,
  BarChart2
} from 'lucide-react';
import { useAttackMode } from '../../context/AttackModeContext';
import { sound } from '../../utils/audio';

export const SystemStatsTab: React.FC = () => {
  const {
    state,
    setDailyQuotaX,
    setMutationLog,
    exportMarkdown,
    exportCSV,
    metrics
  } = useAttackMode();

  const { allWeekStats, monthStats } = metrics;
  const dailyX = state.dailyQuotaX;
  const weeklyTarget = dailyX * 7;
  const monthlyTarget = dailyX * 28;

  const getGradeStyle = (grade: 'S' | 'A' | 'B' | 'C') => {
    switch (grade) {
      case 'S':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'A':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'B':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'C':
        return 'bg-amber-100 text-amber-900 border-amber-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 font-sans">
      {/* 1. Header Banner & Daily Quota Controller */}
      <div className="bg-white rounded-3xl border-2 border-[#E2E8F0] border-b-6 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h2 className="font-black text-lg sm:text-xl text-slate-900 uppercase tracking-tight">
              Week's End & 4-Week Month Performance System
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            At each week's end, completed tasks are calculated across all 7 days. 4 weeks compound into your monthly report card.
          </p>
        </div>

        {/* Quota Stepper */}
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200 self-start md:self-auto">
          <div className="text-right">
            <div className="text-[10px] font-black uppercase text-slate-500">
              Daily Quota ($X$)
            </div>
            <div className="text-xs text-slate-600 font-bold">
              Tasks / Day
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDailyQuotaX(dailyX - 1)}
              className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200 border border-slate-300 font-black text-sm text-slate-800 cursor-pointer flex items-center justify-center transition-all active:translate-y-0.5"
            >
              -
            </button>
            <span className="font-mono text-2xl font-black text-blue-600 w-8 text-center">
              {dailyX}
            </span>
            <button
              onClick={() => setDailyQuotaX(dailyX + 1)}
              className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200 border border-slate-300 font-black text-sm text-slate-800 cursor-pointer flex items-center justify-center transition-all active:translate-y-0.5"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* 2. Month Overview Hero Card */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-3xl p-5 sm:p-6 shadow-md border-2 border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Award size={20} className="text-yellow-400" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-300">
              4-Week Monthly Accumulator
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black tracking-tight">
            Overall Monthly Grade: <span className="text-emerald-400">Grade {monthStats.overallGrade}</span>
          </div>
          <p className="text-xs text-slate-300 font-medium max-w-md">
            You completed <strong>{monthStats.fourWeekTotalCompleted}</strong> of {monthStats.fourWeekTarget} tasks across the 4-week cycle ({monthStats.monthPct}% performance rate).
          </p>
        </div>

        <div className="bg-white/10 p-4 rounded-2xl border border-white/20 text-center sm:text-right shrink-0">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-300">
            Current Week Progress
          </div>
          <div className="font-mono text-3xl font-black text-white mt-1">
            {allWeekStats.completedTasks} / {allWeekStats.weeklyTarget}
          </div>
          <div className="text-xs text-emerald-300 font-bold mt-0.5">
            {allWeekStats.weeklyPct}% Weekly Consistency
          </div>
        </div>
      </div>

      {/* 3. The 4 Weekly Scorecards (Week 1, Week 2, Week 3, Week 4) */}
      <div className="bg-white rounded-3xl border-2 border-[#E2E8F0] border-b-6 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
              4-Week Monthly Sprint Scorecards
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Calculates consistency each week to ensure compound growth over 30 days.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600">
            Monthly Target: {monthlyTarget} Tasks
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {state.weeklyScorecards.map(sc => {
            const pct = Math.round((sc.completedTasks / sc.targetTasks) * 100);

            return (
              <div
                key={sc.weekNumber}
                className="p-4 rounded-2xl border-2 border-slate-200 border-b-4 bg-slate-50/70 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-slate-800">
                    {sc.label}
                  </span>
                  <span
                    className={`font-mono font-black text-xs px-2.5 py-0.5 rounded-full border ${getGradeStyle(
                      sc.grade
                    )}`}
                  >
                    Grade {sc.grade}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-600">
                      {sc.completedTasks} / {sc.targetTasks} Tasks
                    </span>
                    <span className="font-mono text-blue-600">{pct}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>

                <div className="pt-1 border-t border-slate-200 flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span>SLA On-Time:</span>
                  <span className="font-mono text-emerald-700">{sc.slaOnTimeRate}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Section Pillar Distribution */}
      <div className="bg-white rounded-3xl border-2 border-[#E2E8F0] border-b-6 p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
          Section Mastery Distribution
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-2 text-emerald-900 font-black text-xs uppercase">
              <span>💰</span>
              <span>Rich Section</span>
            </div>
            <div className="font-mono text-2xl font-black text-emerald-800 mt-1">
              {allWeekStats.richCompleted} Done
            </div>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
              Freelancing, client projects, and income generation.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
            <div className="flex items-center gap-2 text-red-900 font-black text-xs uppercase">
              <span>💪</span>
              <span>Muscular Section</span>
            </div>
            <div className="font-mono text-2xl font-black text-red-800 mt-1">
              {allWeekStats.muscularCompleted} Done
            </div>
            <p className="text-[11px] text-red-700 font-medium mt-0.5">
              Yoga, karate, calisthenics, and aesthetic strength.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-2 text-blue-900 font-black text-xs uppercase">
              <span>🧠</span>
              <span>Intelligent Section</span>
            </div>
            <div className="font-mono text-2xl font-black text-blue-800 mt-1">
              {allWeekStats.intelligentCompleted} Done
            </div>
            <p className="text-[11px] text-blue-700 font-medium mt-0.5">
              Algorithms, deep reading, problem solving, and meditation.
            </p>
          </div>
        </div>
      </div>

      {/* 5. 1-Click Data Exporters */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <Download size={18} className="text-blue-400" />
            <h3 className="font-black text-sm uppercase tracking-wider">
              1-Click Execution Proof & Data Exporters
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Download your full 7-day Section System and 4-week monthly scorecards in Markdown or CSV for Excel.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportMarkdown}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-wider border border-slate-700 cursor-pointer flex items-center gap-1.5 transition-all active:translate-y-0.5"
          >
            <FileText size={15} className="text-blue-400" />
            <span>Export (.MD)</span>
          </button>

          <button
            onClick={exportCSV}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider border border-emerald-500 cursor-pointer flex items-center gap-1.5 transition-all active:translate-y-0.5"
          >
            <FileSpreadsheet size={15} className="text-white" />
            <span>Export to Excel (.CSV)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
