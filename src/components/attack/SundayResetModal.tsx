import React, { useState } from 'react';
import {
  Calendar,
  Check,
  RefreshCw,
  Award,
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { useAttackMode } from '../../context/AttackModeContext';
import { sound } from '../../utils/audio';

export const SundayResetModal: React.FC = () => {
  const { state, archiveWeekAndReset, closeSundayResetModal, metrics } = useAttackMode();

  const currentWeekNumber = state.currentWeekNumber || 1;
  const isMonthEnd = currentWeekNumber === 4;
  const [nextTargetX, setNextTargetX] = useState<number>(state.dailyQuotaX);
  const [keepRecurring, setKeepRecurring] = useState(true);

  if (!state.isSundayResetModalOpen) return null;

  const { allWeekStats } = metrics;
  const currentCompleted = allWeekStats.completedTasks;
  const currentTarget = allWeekStats.weeklyTarget;
  const pct = Math.round((currentCompleted / currentTarget) * 100);

  const handleConfirm = () => {
    archiveWeekAndReset(nextTargetX, keepRecurring);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 font-sans">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xl">💾</span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Save Week {currentWeekNumber} Performance
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                Week {currentWeekNumber} of 4 • {state.currentMonthName || 'Current Month'}
              </p>
            </div>
          </div>

          <button
            onClick={closeSundayResetModal}
            className="w-7 h-7 rounded-full bg-slate-100 text-xs font-semibold text-slate-500 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Step 1: Last Week Performance */}
        <div className="p-4 rounded-2xl bg-[#EEF0F6]/80 border border-slate-200/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Week {currentWeekNumber} Tasks Done</span>
            <span className="font-mono text-[#937485] text-sm">{pct}%</span>
          </div>

          <div className="text-2xl font-extrabold text-slate-900">
            {currentCompleted} / {currentTarget} Tasks Completed
          </div>

          <p className="text-[11px] text-slate-500 font-medium">
            {isMonthEnd
              ? '🎉 Week 4 complete! Saving will calculate and archive your full month performance into the monthly log, then advance the cycle.'
              : `This will lock in your Week ${currentWeekNumber} score in the report and roll over to Week ${currentWeekNumber + 1}.`}
          </p>
        </div>

        {/* Step 2: New Week Setup */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-800">
            Upcoming Week Daily Target ($X$)
          </label>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setNextTargetX(Math.max(1, nextTargetX - 1))}
                className="w-8 h-8 rounded-lg bg-white text-slate-800 font-bold text-sm cursor-pointer"
              >
                -
              </button>
              <span className="font-mono text-xl font-extrabold text-slate-900 w-8 text-center">
                {nextTargetX}
              </span>
              <button
                type="button"
                onClick={() => setNextTargetX(Math.min(15, nextTargetX + 1))}
                className="w-8 h-8 rounded-lg bg-white text-slate-800 font-bold text-sm cursor-pointer"
              >
                +
              </button>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              = <strong className="text-slate-800 font-mono">{nextTargetX * 7} tasks</strong> across Mon–Sun
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <span className="block text-xs font-bold text-slate-800">Board Clean-up Preference:</span>
            
            <label className={`p-3 rounded-2xl border transition-all flex items-start gap-2.5 cursor-pointer ${
              keepRecurring ? 'bg-[#937485]/10 border-[#937485]/40 text-slate-900' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <input
                type="radio"
                name="recurringOption"
                checked={keepRecurring}
                onChange={() => setKeepRecurring(true)}
                className="mt-0.5 text-[#937485] cursor-pointer"
              />
              <div className="text-xs">
                <div className="font-bold">Reset checkmarks (Keep recurring habits)</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Unchecks all habits for Monday so they are fresh and ready (never left greyed out).
                </div>
              </div>
            </label>

            <label className={`p-3 rounded-2xl border transition-all flex items-start gap-2.5 cursor-pointer ${
              !keepRecurring ? 'bg-[#937485]/10 border-[#937485]/40 text-slate-900' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <input
                type="radio"
                name="recurringOption"
                checked={!keepRecurring}
                onChange={() => setKeepRecurring(false)}
                className="mt-0.5 text-[#937485] cursor-pointer"
              />
              <div className="text-xs">
                <div className="font-bold">Clear board (Start clean slate)</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Removes all completed tasks from the active screen. Your report retains all numbers.
                </div>
              </div>
            </label>
          </div>

          <div className="p-3 rounded-xl bg-[#7EB982]/10 border border-[#7EB982]/20 text-[11px] text-[#5A9A5E] font-medium flex items-center gap-1.5">
            <span>🛡️</span>
            <span>All completed tasks are permanently preserved in your monthly reports & stats.</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={closeSundayResetModal}
            className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-semibold text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2.5 rounded-xl bg-[#937485] hover:bg-[#836475] text-white font-semibold text-xs tracking-wide cursor-pointer transition-colors shadow-xs"
          >
            {isMonthEnd ? 'Save Week 4 & Archive Month' : `Save Week ${currentWeekNumber} & Advance`}
          </button>
        </div>
      </div>
    </div>
  );
};

