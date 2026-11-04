import React, { useState } from 'react';
import {
  Crown,
  Check,
  Lock,
  Sparkles,
  Info,
  Calendar,
  Gift
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BranchId, NodeThreshold } from '../../types';
import { BranchIcon } from '../common/BranchIcon';
import { PactSignaturePad } from './PactSignaturePad';
import { NODE_THRESHOLDS, getBranchNodeProgress } from '../../utils/gameMath';

export const SkillTreeTab: React.FC = () => {
  const { state, setActiveTab } = useGame();
  const { branches, habits, character, monthlySummaries } = state;

  // Selected branch for mobile / focused view
  const [selectedBranchId, setSelectedBranchId] = useState<BranchId>('body');

  const branchIds: BranchId[] = ['body', 'mind', 'craft', 'bonds', 'empire'];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header Info Banner */}
      <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-4 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🗺️</span>
            <h2 className="font-black text-xl sm:text-2xl text-[#3C3C3C]">
              The 80-Point Seasonal Skill Tree
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#777777] font-semibold max-w-2xl">
            Each branch advances by earning active branch days (capped at +1/day). Non-consecutive: unlock milestones at <strong>5, 15, 30, 50, and 80 days</strong> across the 90-day season. Each unlocked node grants a <strong>💎 Rare Loot Chest</strong>!
          </p>
        </div>

        {/* Quick jump to loot vault */}
        <button
          onClick={() => setActiveTab('vault')}
          className="self-start md:self-auto px-4 py-2.5 rounded-2xl bg-[#DDF4FF] border-2 border-[#84D8FF] border-b-4 text-[#1CB0F6] font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-[#cdeeff] active:translate-y-0.5 cursor-pointer"
        >
          <Gift size={16} />
          <span>Open Loot Vault</span>
        </button>
      </div>

      {/* Mobile Branch Switcher Tabs */}
      <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-1">
        {branchIds.map(bId => {
          const branch = branches[bId];
          const isSelected = selectedBranchId === bId;
          return (
            <button
              key={bId}
              onClick={() => setSelectedBranchId(bId)}
              className={`px-3 py-2 rounded-2xl font-black text-xs uppercase tracking-wider shrink-0 border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'text-white border-transparent border-b-4 shadow-sm'
                  : 'bg-white text-[#777777] border-gray-200'
              }`}
              style={{
                backgroundColor: isSelected ? branch.colorHex : undefined,
                borderColor: isSelected ? branch.borderHex : undefined
              }}
            >
              <div className="flex items-center gap-1.5">
                <BranchIcon branchId={bId} size={14} />
                <span>{branch.name}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* The 5 Stepping-Stone Paths (Desktop: 5 Columns side-by-side, Mobile: Active selected column) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {branchIds.map(bId => {
          const branch = branches[bId];
          const isHiddenOnMobile = selectedBranchId !== bId;
          const progress = getBranchNodeProgress(branch, habits, character.currentYearMonth);

          return (
            <div
              key={bId}
              className={`flex-col items-center bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-4 p-4 ${
                isHiddenOnMobile ? 'hidden md:flex' : 'flex'
              }`}
            >
              {/* Top Branch Header Banner */}
              <div
                className="w-full rounded-2xl p-3 text-center text-white font-black shadow-sm mb-6 border-b-4"
                style={{
                  backgroundColor: branch.colorHex,
                  borderColor: branch.borderHex
                }}
              >
                <div className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider">
                  <BranchIcon branchId={bId} size={15} />
                  <span>{branch.name}</span>
                </div>
                <div className="text-2xl font-black mt-1 leading-tight">
                  {progress.cumulativeDays}
                  <span className="text-xs font-bold opacity-80 ml-1">/ 80d</span>
                </div>
                <div className="text-[10px] font-extrabold uppercase tracking-wide opacity-90 mt-0.5">
                  Base Lvl: {branch.seasonStartLevel} • Mo. Days: {progress.currentMonthDays}
                </div>
              </div>

              {/* The 5 Stepping Stones: 80 (top) down to 5 (bottom) OR 5 (bottom) up to 80 (top) */}
              {/* Duolingo style: bottom is start (5), climbing upwards to 80 (pinnacle crown)! */}
              <div className="flex flex-col-reverse items-center gap-6 relative w-full py-2">
                {/* Winding Road / Connecting dashed background line */}
                <div className="absolute top-8 bottom-8 w-2 bg-gradient-to-b from-gray-200 to-gray-200 rounded-full z-0" />

                {NODE_THRESHOLDS.map((threshold, index) => {
                  const isUnlocked = progress.unlockedThresholds.includes(threshold);
                  const isTarget = progress.nextTargetThreshold === threshold;
                  const isCrownNode = threshold === 80;

                  // Winding lateral offset like Duolingo's path
                  const lateralOffsets = ['translate-x-0', 'translate-x-3', '-translate-x-3', 'translate-x-2', 'translate-x-0'];
                  const offsetClass = lateralOffsets[index % lateralOffsets.length];

                  return (
                    <div
                      key={threshold}
                      className={`relative z-10 flex flex-col items-center ${offsetClass}`}
                    >
                      {/* Floating Bouncing Tooltip on Target Node */}
                      {isTarget && (
                        <div className="absolute -top-12 z-20 whitespace-nowrap bg-[#3C3C3C] text-white px-3 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider shadow-lg animate-bounce-soft flex items-center gap-1">
                          <Sparkles size={12} className="text-[#FFC800]" />
                          <span>{progress.daysToNextNode} days to Rare Loot!</span>
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#3C3C3C] transform rotate-45" />
                        </div>
                      )}

                      {/* Stepping-Stone 3D Node Circle */}
                      <div className="relative">
                        {/* Circular Progress Ring around Active Target */}
                        {isTarget && (
                          <svg className="absolute -inset-2 w-24 h-24 transform -rotate-90 pointer-events-none">
                            <circle
                              cx="48"
                              cy="48"
                              r="42"
                              stroke="#E5E5E5"
                              strokeWidth="5"
                              fill="none"
                            />
                            <circle
                              cx="48"
                              cy="48"
                              r="42"
                              stroke={branch.colorHex}
                              strokeWidth="5"
                              strokeDasharray="264"
                              strokeDashoffset={264 - (264 * progress.progressPercentToNext) / 100}
                              strokeLinecap="round"
                              fill="none"
                              className="transition-all duration-500"
                            />
                          </svg>
                        )}

                        <button
                          className={`w-20 h-20 rounded-full flex flex-col items-center justify-center font-black transition-all cursor-pointer select-none active:translate-y-1 ${
                            isUnlocked
                              ? 'text-white border-4 border-b-8 shadow-md'
                              : isTarget
                              ? 'bg-white text-[#3C3C3C] border-4 border-b-8 shadow-sm'
                              : 'bg-gray-100 text-gray-400 border-4 border-b-8 border-gray-300'
                          }`}
                          style={{
                            backgroundColor: isUnlocked ? branch.colorHex : undefined,
                            borderColor: isUnlocked
                              ? branch.borderHex
                              : isTarget
                              ? branch.colorHex
                              : undefined
                          }}
                          title={`Milestone ${threshold} Days`}
                        >
                          {isCrownNode ? (
                            <Crown
                              size={26}
                              className={isUnlocked ? 'text-[#FFC800] fill-[#FFC800]' : 'text-gray-400'}
                            />
                          ) : isUnlocked ? (
                            <Check size={26} strokeWidth={4} className="text-white" />
                          ) : isTarget ? (
                            <span className="text-2xl font-black">{threshold}</span>
                          ) : (
                            <Lock size={20} className="text-gray-400" />
                          )}

                          <span className={`text-[10px] font-black uppercase mt-0.5 leading-none ${
                            isUnlocked ? 'text-white/90' : isTarget ? 'text-[#777777]' : 'text-gray-400'
                          }`}>
                            {threshold}d
                          </span>
                        </button>
                      </div>

                      {/* Small badge underneath node */}
                      <div className="mt-1.5 text-center">
                        {isUnlocked ? (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#EBF9DC] text-[#347A01] border border-[#58CC02]">
                            Unlocked ✓
                          </span>
                        ) : isTarget ? (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#DDF4FF] text-[#1CB0F6] border border-[#84D8FF]">
                            {progress.progressPercentToNext}% Done
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-400">
                            Locked
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Target summary */}
              <div className="w-full mt-4 p-2.5 bg-[#F7F7F7] rounded-xl border border-gray-200 text-center">
                <span className="text-[11px] font-extrabold text-[#777777]">
                  {progress.nextTargetThreshold
                    ? `Next: Node ${progress.nextTargetThreshold} (${progress.daysToNextNode}d left)`
                    : '🎉 Branch Mastered (80d)!'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. The Seasonal Pact (Signature Card) */}
      <PactSignaturePad />

      {/* 4. Month-to-Month Mini Tracker (3-Column Summary Pill Box) */}
      <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-4 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-lg text-[#3C3C3C] flex items-center gap-2">
              <Calendar size={20} className="text-[#1CB0F6]" />
              <span>Season {character.seasonNumber} Month-to-Month Progress</span>
            </h3>
            <p className="text-xs text-[#777777] font-semibold mt-0.5">
              Summary of nodes unlocked and monthly feats completed across the 3-month season.
            </p>
          </div>
          <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-[#DDF4FF] text-[#1CB0F6] border border-[#84D8FF]">
            Month {character.currentMonthIndex} of 3 Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(monthNum => {
            const isCurrent = character.currentMonthIndex === monthNum;
            const isPast = monthNum < character.currentMonthIndex;
            const summary = monthlySummaries.find(s => s.monthIndex === monthNum);

            return (
              <div
                key={monthNum}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  isCurrent
                    ? 'bg-[#FFFDF0] border-2 border-b-4 border-[#FFC800] shadow-sm'
                    : isPast
                    ? 'bg-[#F7F7F7] border-[#E5E5E5]'
                    : 'bg-gray-50 border-dashed border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-sm text-[#3C3C3C]">
                    Month {monthNum}
                  </span>
                  {isCurrent ? (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#58CC02] text-white">
                      In Progress
                    </span>
                  ) : isPast ? (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
                      Completed
                    </span>
                  ) : (
                    <span className="text-[10px] font-black uppercase text-gray-400">
                      Upcoming
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs font-bold text-[#777777]">
                  <div className="flex items-center justify-between">
                    <span>Nodes Unlocked:</span>
                    <span className="text-[#3C3C3C] font-black">
                      {isCurrent ? '2 Nodes' : summary ? `${summary.nodesUnlocked} Nodes` : '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Feats Completed:</span>
                    <span className="text-[#3C3C3C] font-black">
                      {isCurrent ? `${state.monthlyQuests.filter(q => q.isCompleted).length} Feats` : summary ? `${summary.featsCompleted} Feats` : '—'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

