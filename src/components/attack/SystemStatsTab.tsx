import React from 'react';
import {
  Calendar,
  Download,
  FileText,
  FileSpreadsheet,
  TrendingUp,
  Check,
  Clock,
  Award
} from 'lucide-react';
import { useAttackMode } from '../../context/AttackModeContext';
import { sound } from '../../utils/audio';

export const SystemStatsTab: React.FC = () => {
  const {
    state,
    exportMarkdown,
    exportCSV,
    metrics
  } = useAttackMode();

  const { allWeekStats, monthStats } = metrics;
  const ongoingCount = allWeekStats.totalTasks - allWeekStats.completedTasks;

  // Bar chart heights for 7 days
  const dailyBarData = [
    { day: 'Mon', completed: 6, total: 6 },
    { day: 'Tue', completed: 4, total: 5 },
    { day: 'Wed', completed: 4, total: 4 },
    { day: 'Thu', completed: 5, total: 6 },
    { day: 'Fri', completed: 1, total: 4 },
    { day: 'Sat', completed: 0, total: 3 },
    { day: 'Sun', completed: 0, total: 3 }
  ];

  const getGradeBadge = (grade: 'S' | 'A' | 'B' | 'C') => {
    switch (grade) {
      case 'S':
        return 'bg-purple-100 text-purple-800';
      case 'A':
        return 'bg-emerald-100 text-emerald-800';
      case 'B':
        return 'bg-blue-100 text-blue-800';
      case 'C':
        return 'bg-amber-100 text-amber-800';
    }
  };

  return (
    <div className="max-w-md mx-auto sm:max-w-4xl px-4 sm:px-6 py-5 space-y-6 font-sans">
      {/* 1. Header matching Screen 3 in screenshot */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Report
        </h1>

        <div className="flex items-center gap-2">
          <button
            onClick={exportMarkdown}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 cursor-pointer transition-colors shadow-2xs"
            title="Export Markdown"
          >
            <FileText size={15} />
          </button>
          <button
            onClick={exportCSV}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 cursor-pointer transition-colors shadow-2xs"
            title="Export CSV"
          >
            <FileSpreadsheet size={15} />
          </button>
        </div>
      </div>

      {/* 2. Task Overview (Two large soft cards matching Screen 3 in screenshot) */}
      <div className="space-y-2.5">
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
          Task Overview
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {/* Mauve Card: Completed Tasks */}
          <div className="bg-[#937485] text-white rounded-3xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[120px]">
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {allWeekStats.completedTasks}
              </span>
              <p className="text-xs opacity-90 font-medium mt-1">
                Completed Tasks
              </p>
            </div>
            {/* Sparkline wave */}
            <svg className="w-full h-8 opacity-30 mt-2" viewBox="0 0 100 25" fill="none">
              <path
                d="M0 18 Q 20 8, 40 16 T 80 10 T 100 15"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Warm Peach Card: Ongoing Tasks */}
          <div className="bg-[#ECA172] text-white rounded-3xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[120px]">
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {ongoingCount}
              </span>
              <p className="text-xs opacity-90 font-medium mt-1">
                Ongoing Tasks
              </p>
            </div>
            <svg className="w-full h-8 opacity-30 mt-2" viewBox="0 0 100 25" fill="none">
              <path
                d="M0 12 Q 25 22, 50 10 T 80 18 T 100 8"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Daily Tasks Overview (Bar Chart matching Screen 3) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-100 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900">
              Daily tasks overview
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Completed vs Ongoing tasks this week
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#937485]" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ECA172]" />
              <span>Ongoing</span>
            </div>
          </div>
        </div>

        {/* Bar chart columns */}
        <div className="pt-2">
          <div className="flex items-end justify-between h-40 px-2 sm:px-4">
            {dailyBarData.map(d => {
              const maxVal = 7;
              const compHeight = (d.completed / maxVal) * 100;
              const ongHeight = ((d.total - d.completed) / maxVal) * 100;

              return (
                <div key={d.day} className="flex flex-col items-center gap-2 flex-1">
                  <div className="flex items-end gap-1.5 h-32">
                    {/* Completed Bar (Mauve) */}
                    <div
                      className="w-3 sm:w-4 bg-[#937485] rounded-t-md transition-all duration-500"
                      style={{ height: `${Math.max(6, compHeight)}%` }}
                      title={`${d.day}: ${d.completed} completed`}
                    />
                    {/* Ongoing Bar (Peach) */}
                    <div
                      className="w-3 sm:w-4 bg-[#ECA172] rounded-t-md transition-all duration-500"
                      style={{ height: `${Math.max(6, ongHeight)}%` }}
                      title={`${d.day}: ${d.total - d.completed} ongoing`}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. 4-Week Month Performance & Scorecards */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-100 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900">
              4-Week Month Scorecards
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Overall Month Grade: <strong className="text-slate-800">Grade {monthStats.overallGrade} ({monthStats.monthPct}%)</strong>
            </p>
          </div>

          <span className="text-xs font-semibold text-[#937485] px-2.5 py-1 rounded-full bg-[#937485]/10">
            {monthStats.fourWeekTotalCompleted} / {monthStats.fourWeekTarget} Done
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {state.weeklyScorecards.map(sc => (
            <div
              key={sc.weekNumber}
              className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Week {sc.weekNumber}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getGradeBadge(sc.grade)}`}>
                  {sc.grade}
                </span>
              </div>
              <div className="font-mono text-sm font-bold text-slate-700">
                {sc.completedTasks} / {sc.targetTasks}
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#7EB982]"
                  style={{ width: `${Math.min(100, Math.round((sc.completedTasks / sc.targetTasks) * 100))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
