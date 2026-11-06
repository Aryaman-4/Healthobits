import React, { useState } from 'react';
import {
  Crown,
  Check,
  Lock,
  Sparkles,
  Gift,
  Edit3,
  ChevronRight,
  Award,
  Star
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BranchId, BranchMilestoneNode } from '../../types';
import { BranchIcon } from '../common/BranchIcon';
import { GameGuideCard } from '../guide/GameGuideCard';
import { CustomizeLevelsModal } from './CustomizeLevelsModal';
import { DEFAULT_BRANCH_MILESTONES } from '../../data/seedData';
import { NODE_THRESHOLDS, getBranchNodeProgress } from '../../utils/gameMath';
import { sound } from '../../utils/audio';

export const SkillTreeTab: React.FC = () => {
  const { state, setActiveTab } = useGame();
  const { branches, habits, character } = state;

  const [selectedBranchId, setSelectedBranchId] = useState<BranchId>('body');
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [selectedMilestoneDetail, setSelectedMilestoneDetail] = useState<{ node: BranchMilestoneNode; branch: any; isUnlocked: boolean } | null>(null);

  const branchIds: BranchId[] = ['body', 'mind', 'craft', 'bonds', 'empire'];
  const activeBranch = branches[selectedBranchId];
  const progress = getBranchNodeProgress(activeBranch, habits, character.currentYearMonth);
  const milestoneNodes = activeBranch.milestoneNodes || DEFAULT_BRANCH_MILESTONES[selectedBranchId];

  const handleOpenCustomize = (bId?: BranchId) => {
    sound.playTap();
    if (bId) setSelectedBranchId(bId);
    setIsCustomizeModalOpen(true);
  };

  return (
    <div className="max-w-md mx-auto sm:max-w-4xl py-4 sm:py-6 px-3 sm:px-4 space-y-6 pb-20">
      {/* 1. Dismissible Beginner Game Guide Card */}
      <GameGuideCard />

      {/* 2. Top Banner */}
      <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-6 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🗺️</span>
            <h2 className="font-black text-lg sm:text-2xl text-[#3C3C3C]">
              The 80-Day Seasonal Skill Tree
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#777777] font-semibold max-w-2xl">
            Each branch advances by active habit days (capped at +1/day). Non-consecutive milestones at <strong>5, 15, 30, 50, and 80 days</strong>.
          </p>
        </div>

        {/* Quick Jump to Loot Vault */}
        <button
          onClick={() => {
            sound.playTap();
            setActiveTab('vault');
          }}
          className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-[#DDF4FF] border-2 border-[#84D8FF] border-b-4 text-[#1CB0F6] font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-[#cdeeff] active:translate-y-0.5 cursor-pointer shadow-xs"
        >
          <Gift size={16} />
          <span>Open Loot Vault</span>
        </button>
      </div>

      {/* 3. Branch Switcher Tabs (Spacious Mobile-First Navigation) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {branchIds.map(bId => {
          const branch = branches[bId];
          const isSelected = selectedBranchId === bId;
          const bProg = getBranchNodeProgress(branch, habits, character.currentYearMonth);

          return (
            <button
              key={bId}
              onClick={() => {
                sound.playTap();
                setSelectedBranchId(bId);
              }}
              className={`px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider shrink-0 border-2 transition-all cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'text-white border-transparent border-b-4 shadow-md'
                  : 'bg-white text-[#777777] border-gray-200 hover:bg-gray-100'
              }`}
              style={{
                backgroundColor: isSelected ? branch.colorHex : undefined,
                borderColor: isSelected ? branch.borderHex : undefined
              }}
            >
              <BranchIcon branchId={bId} size={15} />
              <span>{branch.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${isSelected ? 'bg-white/25 text-white' : 'bg-gray-100 text-[#777777]'}`}>
                {bProg.cumulativeDays}d
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Active Branch Hero & Customize Button */}
      <div
        className="rounded-3xl border-2 border-b-6 p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{
          backgroundColor: activeBranch.colorHex,
          borderColor: activeBranch.borderHex
        }}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-white text-2xl shadow-xs shrink-0">
            <BranchIcon branchId={selectedBranchId} size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-xl leading-none">
                {activeBranch.name} Attribute Path
              </h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white text-[#3C3C3C]">
                Lvl {activeBranch.seasonStartLevel}
              </span>
            </div>
            <p className="text-xs text-white/90 font-semibold mt-1">
              {activeBranch.focusArea}
            </p>
          </div>
        </div>

        {/* 100% Editable Customize Levels & Goals Button */}
        <button
          onClick={() => handleOpenCustomize(selectedBranchId)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-white text-[#3C3C3C] hover:bg-gray-100 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer active:translate-y-0.5 transition-all shadow-sm shrink-0 border-2 border-b-4 border-gray-300"
        >
          <Edit3 size={14} className="text-[#1CB0F6]" />
          <span>[✏️ Customize Levels & Goals]</span>
        </button>
      </div>

      {/* 5. Pre-Designed 5-Tier Level Stepping-Stone Path (Duolingo Style) */}
      <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-6 p-4 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#FFC800]" />
            <span className="text-xs font-black uppercase text-[#3C3C3C]">
              Season 1 Milestones ({progress.cumulativeDays} / 80 Total Days)
            </span>
          </div>

          <span className="text-xs font-extrabold text-[#777777]">
            {progress.unlockedThresholds.length}/5 Ranks Achieved
          </span>
        </div>

        {/* Vertical Stepping Stone Cards */}
        <div className="space-y-3.5">
          {milestoneNodes.map((node, index) => {
            const threshold = node.threshold;
            const isUnlocked = progress.unlockedThresholds.includes(threshold as any);
            const isTarget = progress.nextTargetThreshold === threshold;
            const isApex = index === 4 || threshold >= 80;

            return (
              <div
                key={threshold}
                onClick={() => {
                  sound.playTap();
                  setSelectedMilestoneDetail({ node, branch: activeBranch, isUnlocked });
                }}
                className={`rounded-2xl border-2 p-4 transition-all cursor-pointer relative shadow-xs ${
                  isUnlocked
                    ? 'border-[#58CC02] border-b-5 bg-[#F8FFF2]'
                    : isTarget
                    ? 'border-[#1CB0F6] border-b-5 bg-[#F0F9FF] ring-2 ring-[#84D8FF]/40'
                    : 'border-gray-200 border-b-4 bg-gray-50/70 hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Stepping-Stone Icon Badge */}
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 border-2 border-b-4 ${
                        isUnlocked
                          ? 'bg-[#58CC02] border-[#46A302] text-white'
                          : isTarget
                          ? 'bg-white border-[#1CB0F6] text-[#1CB0F6]'
                          : 'bg-gray-200 border-gray-300 text-gray-400'
                      }`}
                    >
                      {isApex ? (
                        <Crown size={20} className={isUnlocked ? 'text-[#FFC800] fill-[#FFC800]' : 'text-gray-400'} />
                      ) : isUnlocked ? (
                        <Check size={20} strokeWidth={4} />
                      ) : (
                        <span>{threshold}d</span>
                      )}
                    </div>

                    {/* Rank Title & Milestone Goal */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-gray-200 text-[#555555]">
                          Tier {index + 1} • {threshold} Days
                        </span>
                        <h4 className="font-black text-sm text-[#3C3C3C]">
                          {node.rankTitle}
                        </h4>
                        {isUnlocked && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#EBF9DC] text-[#347A01] border border-[#58CC02]">
                            Unlocked ✅
                          </span>
                        )}
                        {isTarget && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#DDF4FF] text-[#1CB0F6] border border-[#84D8FF] animate-pulse">
                            Next Target ({progress.daysToNextNode}d left)
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#555555] font-semibold mt-1.5 leading-relaxed">
                        {node.milestoneGoal}
                      </p>
                    </div>
                  </div>

                  {/* Reward Badge */}
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-black uppercase px-2 py-1 rounded-xl bg-white border border-gray-200 text-[#777777] shadow-2xs block">
                      {node.rewardDescription || (isApex ? '🔮 Epic Chest' : '💎 Rare Chest')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Milestone Detail Bottom Sheet / Modal */}
      {selectedMilestoneDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-8 max-w-md w-full p-5 space-y-4 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <h4 className="font-black text-base text-[#3C3C3C]">
                  {selectedMilestoneDetail.node.rankTitle}
                </h4>
              </div>
              <button
                onClick={() => setSelectedMilestoneDetail(null)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs text-gray-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-[#777777]">
                Milestone Objective ({selectedMilestoneDetail.node.threshold} Active Days)
              </span>
              <p className="text-xs text-[#3C3C3C] font-bold p-3 bg-gray-50 rounded-2xl border border-gray-200 leading-relaxed">
                {selectedMilestoneDetail.node.milestoneGoal}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#DDF4FF] border border-[#84D8FF] flex items-center justify-between text-xs font-black text-[#1CB0F6]">
              <span>Triggered Reward:</span>
              <span>{selectedMilestoneDetail.node.rewardDescription}</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setSelectedMilestoneDetail(null);
                  handleOpenCustomize();
                }}
                className="text-xs font-black text-[#1CB0F6] hover:underline cursor-pointer"
              >
                Edit this milestone ➔
              </button>
              <button
                onClick={() => setSelectedMilestoneDetail(null)}
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-xs font-black text-[#3C3C3C] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Level Customization Engine Modal */}
      <CustomizeLevelsModal
        isOpen={isCustomizeModalOpen}
        onClose={() => setIsCustomizeModalOpen(false)}
        branchId={selectedBranchId}
      />
    </div>
  );
};
