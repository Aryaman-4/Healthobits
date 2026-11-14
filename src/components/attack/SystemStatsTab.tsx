import React, { useState } from 'react';
import {
  Calendar,
  Download,
  FileText,
  FileSpreadsheet,
  TrendingUp,
  Check,
  Clock,
  Award,
  ChevronRight,
  Sparkles
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

  // View toggle for Line Chart: Weekly Sprint vs Multi-Month Progression
  const [chartMode, setChartMode] = useState<'weekly' | 'monthly'>('weekly');

  // Real Weekly points from state.weeklyScorecards
  const currentWeekNum = state.currentWeekNumber || 1;
  const weeklyPoints = state.weeklyScorecards.map(sc => {
    const isCurrent = sc.weekNumber === currentWeekNum;
    const count = isCurrent ? allWeekStats.completedTasks : sc.completedTasks;
    return {
      label: `W${sc.weekNumber}`,
      value: count,
      target: sc.targetTasks || state.dailyQuotaX * 7
    };
  });

  // Real Monthly points: Only actual archived months from real usage + current in-progress month
  const currentMonthShort = (state.currentMonthName || new Date().toLocaleDateString('en-US', { month: 'short' })).slice(0, 3);
  const monthlyPoints = state.monthlyHistory.length > 0
    ? [
        ...state.monthlyHistory.map(m => ({
          label: m.monthName.slice(0, 3),
          value: m.completedTasks,
          target: m.targetTasks
        })),
        {
          label: currentMonthShort,
          value: monthStats.fourWeekTotalCompleted,
          target: monthStats.fourWeekTarget
        }
      ]
    : [
        {
          label: currentMonthShort,
          value: monthStats.fourWeekTotalCompleted,
          target: monthStats.fourWeekTarget
        }
      ];

  const activePoints = chartMode === 'weekly' ? weeklyPoints : monthlyPoints;

  // SVG Line Chart coordinates calculation
  const width = 360;
  const height = 130;
  const paddingX = 35;
  const paddingY = 22;
  const maxVal = Math.max(...activePoints.map(p => Math.max(p.target, p.value)), 1);

  const coords = activePoints.map((p, idx) => {
    const x = activePoints.length === 1
      ? width / 2
      : paddingX + (idx / (activePoints.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - (p.value / maxVal) * (height - 2 * paddingY);
    return { x, y, ...p };
  });

  const pathD = coords.length > 1
    ? coords.reduce((acc, curr, idx) => {
        return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
      }, '')
    : '';

  const areaD = coords.length > 1
    ? `${pathD} L ${coords[coords.length - 1].x} ${height - paddingY} L ${coords[0].x} ${height - paddingY} Z`
    : '';

  // Circular Progress Ring Math for Month
  const monthRadius = 38;
  const monthCirc = 2 * Math.PI * monthRadius;
  const monthOffset = monthCirc - (monthStats.monthPct / 100) * monthCirc;

  // Pillar percentages
  const totalPillarCompleted = Math.max(1, allWeekStats.completedTasks);
  const richPct = Math.round((allWeekStats.richCompleted / totalPillarCompleted) * 100);
  const muscularPct = Math.round((allWeekStats.muscularCompleted / totalPillarCompleted) * 100);
  const intelligentPct = Math.round((allWeekStats.intelligentCompleted / totalPillarCompleted) * 100);

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
    <div className="max-w-md mx-auto sm:max-w-4xl px-3.5 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-6 font-sans w-full overflow-x-hidden">
      {/* 1. Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Performance Report
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Progress analytics across 7 days, 4 weekly sprints, and monthly cycles
          </p>
        </div>
      </div>

      {/* 2. Task Overview (Two large soft cards matching Screenshot Screen 3) */}
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
                Completed This Week
              </p>
            </div>
            <svg className="w-full h-8 opacity-30 mt-2" viewBox="0 0 100 25" fill="none">
              <path
                d="M0 18 Q 20 8, 40 16 T 80 10 T 100 15"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Peach Card: Ongoing Tasks */}
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

      {/* 3. Progress Ring Infographic (Replacing Bar Chart as Requested!) */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xs border border-slate-100 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Mastery Progress Rings
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Monthly completion and distribution across the 3 core pillars
            </p>
          </div>
          <span className="text-xs font-bold text-[#937485] px-2.5 py-1 rounded-full bg-[#937485]/10">
            Grade {monthStats.overallGrade}
          </span>
        </div>

        {/* Responsive Progress Ring Layout: Clean Top Card for Month, and 3-Col Grid for Pillars */}
        <div className="space-y-3 sm:space-y-4 pt-1">
          {/* Main Month Progress Ring Card */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#EEF0F6]/50 border border-slate-100 flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="relative w-18 h-18 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
                <svg className="w-18 h-18 sm:w-20 sm:h-20 transform -rotate-90" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r={monthRadius} stroke="#E2E8F0" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="48"
                    cy="48"
                    r={monthRadius}
                    stroke="#7EB982"
                    strokeWidth="8"
                    strokeDasharray={monthCirc}
                    strokeDashoffset={monthOffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="font-extrabold text-base sm:text-lg text-slate-900 font-mono">
                    {monthStats.monthPct}%
                  </span>
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#937485] block">
                  Monthly Velocity
                </span>
                <h4 className="font-bold text-sm sm:text-base text-slate-900 truncate">
                  Overall Month Target
                </h4>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                  {monthStats.fourWeekTotalCompleted} of {monthStats.fourWeekTarget} Tasks Completed
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0">
              <span className={`text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full ${getGradeBadge(monthStats.overallGrade)}`}>
                Grade {monthStats.overallGrade}
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-400 mt-1 font-mono">4-Week Target</span>
            </div>
          </div>

          {/* 3 Pillar Progress Rings (Side-by-side 3 Columns on mobile and desktop) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3.5">
            {/* Pillar 1: Rich Ring */}
            <div className="bg-slate-50/60 rounded-2xl p-2.5 sm:p-3.5 flex flex-col items-center justify-center text-center border border-slate-100">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
                <svg className="w-14 h-14 sm:w-16 sm:h-16 transform -rotate-90" viewBox="0 0 72 72">
                  <circle cx="36" cy="36" r="26" stroke="#E2E8F0" strokeWidth="6" fill="transparent" />
                  <circle
                    cx="36"
                    cy="36"
                    r="26"
                    stroke="#937485"
                    strokeWidth="6"
                    strokeDasharray={2 * Math.PI * 26}
                    strokeDashoffset={2 * Math.PI * 26 * (1 - richPct / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700"
                  />
                </svg>
                <span className="absolute font-bold text-[11px] sm:text-xs text-slate-800 font-mono">{richPct}%</span>
              </div>
              <span className="font-bold text-[11px] sm:text-xs text-slate-800 mt-1.5 truncate w-full">💰 Rich</span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium">{allWeekStats.richCompleted} Done</span>
            </div>

            {/* Pillar 2: Muscular Ring */}
            <div className="bg-slate-50/60 rounded-2xl p-2.5 sm:p-3.5 flex flex-col items-center justify-center text-center border border-slate-100">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
                <svg className="w-14 h-14 sm:w-16 sm:h-16 transform -rotate-90" viewBox="0 0 72 72">
                  <circle cx="36" cy="36" r="26" stroke="#E2E8F0" strokeWidth="6" fill="transparent" />
                  <circle
                    cx="36"
                    cy="36"
                    r="26"
                    stroke="#ECA172"
                    strokeWidth="6"
                    strokeDasharray={2 * Math.PI * 26}
                    strokeDashoffset={2 * Math.PI * 26 * (1 - muscularPct / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700"
                  />
                </svg>
                <span className="absolute font-bold text-[11px] sm:text-xs text-slate-800 font-mono">{muscularPct}%</span>
              </div>
              <span className="font-bold text-[11px] sm:text-xs text-slate-800 mt-1.5 truncate w-full">💪 Muscular</span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium">{allWeekStats.muscularCompleted} Done</span>
            </div>

            {/* Pillar 3: Intelligent Ring */}
            <div className="bg-slate-50/60 rounded-2xl p-2.5 sm:p-3.5 flex flex-col items-center justify-center text-center border border-slate-100">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
                <svg className="w-14 h-14 sm:w-16 sm:h-16 transform -rotate-90" viewBox="0 0 72 72">
                  <circle cx="36" cy="36" r="26" stroke="#E2E8F0" strokeWidth="6" fill="transparent" />
                  <circle
                    cx="36"
                    cy="36"
                    r="26"
                    stroke="#7EB982"
                    strokeWidth="6"
                    strokeDasharray={2 * Math.PI * 26}
                    strokeDashoffset={2 * Math.PI * 26 * (1 - intelligentPct / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700"
                  />
                </svg>
                <span className="absolute font-bold text-[11px] sm:text-xs text-slate-800 font-mono">{intelligentPct}%</span>
              </div>
              <span className="font-bold text-[11px] sm:text-xs text-slate-800 mt-1.5 truncate w-full">🧠 Intelligent</span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium">{allWeekStats.intelligentCompleted} Done</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Line Graph Infographic (Weekly Sprint & Monthly Progression) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-100 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Task Velocity Line Graph
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              {chartMode === 'weekly' ? 'Completed tasks across Week 1 to 4' : 'Multi-month trend (Nov, Dec, Jan)'}
            </p>
          </div>

          {/* Line Chart Mode Switcher */}
          <div className="flex bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
            <button
              onClick={() => {
                sound.playTap();
                setChartMode('weekly');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                chartMode === 'weekly' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => {
                sound.playTap();
                setChartMode('monthly');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                chartMode === 'monthly' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* SVG Smooth Line Chart with Gradient Fill */}
        <div className="pt-2 w-full overflow-hidden">
          <svg className="w-full h-36 overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#937485" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#937485" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal baseline */}
            <line
              x1={paddingX}
              y1={height - paddingY}
              x2={width - paddingX}
              y2={height - paddingY}
              stroke="#EEF0F6"
              strokeWidth="1.5"
            />

            {/* Filled area */}
            {areaD && <path d={areaD} fill="url(#lineGrad)" />}

            {/* Line path */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#937485"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Point circles and labels */}
            {coords.map((c, idx) => (
              <g key={idx}>
                <circle cx={c.x} cy={c.y} r="4.5" fill="#937485" stroke="#FFFFFF" strokeWidth="2" />
                <text
                  x={c.x}
                  y={c.y - 8}
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-slate-700 font-mono"
                >
                  {c.value}
                </text>
                <text
                  x={c.x}
                  y={height - 6}
                  textAnchor="middle"
                  className="text-[10px] font-semibold fill-slate-400"
                >
                  {c.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* 5. Multi-Month History Log (Requirement 1: Total tasks done in a month saved) */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xs border border-slate-100 space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Monthly Archive & Saved History
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Total tasks completed saved at the end of each month
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600">
            {monthStats.monthlyHistory.length} Months Archived
          </span>
        </div>

        <div className="space-y-2.5">
          {monthStats.monthlyHistory.map(m => (
            <div
              key={m.monthKey}
              className="p-3 sm:p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-2.5 sm:gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 shrink-0">
                  📅
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-slate-900 block truncate">{m.monthName}</span>
                  <div className="text-[10px] sm:text-[11px] text-slate-400 truncate">
                    {m.completedTasks} of {m.targetTasks} tasks completed ({m.performancePct}%)
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getGradeBadge(m.grade)}`}>
                  Grade {m.grade}
                </span>
                <span className="font-mono font-bold text-slate-700 text-xs">{m.performancePct}%</span>
              </div>
            </div>
          ))}

          {monthStats.monthlyHistory.length === 0 && (
            <div className="p-6 text-center bg-slate-50/60 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-xl">📅</span>
              <p className="text-xs font-bold text-slate-700">No previous months archived yet</p>
              <p className="text-[11px] text-slate-400">
                At the end of your 4-week cycle (Week 4 Sunday), your full month's performance will be permanently recorded here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 6. Prominent & Recognisable Export Cards (Requirement 7) */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
        <div>
          <h3 className="font-bold text-base text-slate-900">
            Export Your System & Data
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Download your full 7-day Section System, monthly scorecards, and data drops in recognizable, clean formats.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Markdown Export Card */}
          <button
            onClick={exportMarkdown}
            className="p-4 rounded-2xl bg-[#937485] hover:bg-[#836475] text-white flex items-center justify-between gap-3 transition-all cursor-pointer shadow-sm text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <div className="font-bold text-sm tracking-wide">
                  Export Markdown (.MD)
                </div>
                <div className="text-[11px] opacity-80 mt-0.5">
                  Complete report formatted for Obsidian or Notion
                </div>
              </div>
            </div>
            <Download size={18} className="opacity-80 group-hover:translate-y-0.5 transition-transform" />
          </button>

          {/* Excel CSV Export Card */}
          <button
            onClick={exportCSV}
            className="p-4 rounded-2xl bg-[#7EB982] hover:bg-[#6FA873] text-white flex items-center justify-between gap-3 transition-all cursor-pointer shadow-sm text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                <FileSpreadsheet size={20} />
              </div>
              <div>
                <div className="font-bold text-sm tracking-wide">
                  Export to Excel (.CSV)
                </div>
                <div className="text-[11px] opacity-80 mt-0.5">
                  Raw data table ready for Google Sheets or Excel
                </div>
              </div>
            </div>
            <Download size={18} className="opacity-80 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
