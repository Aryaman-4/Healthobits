import React, { useState, useEffect } from 'react';
import { X, Check, RotateCcw, Sparkles, Award, Edit3, Save } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BranchId, BranchMilestoneNode } from '../../types';
import { DEFAULT_BRANCH_MILESTONES } from '../../data/seedData';
import { BranchIcon } from '../common/BranchIcon';
import { sound } from '../../utils/audio';

interface CustomizeLevelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  branchId: BranchId;
}

export const CustomizeLevelsModal: React.FC<CustomizeLevelsModalProps> = ({
  isOpen,
  onClose,
  branchId: initialBranchId
}) => {
  const { state, updateBranchMilestones } = useGame();
  const [selectedBranch, setSelectedBranch] = useState<BranchId>(initialBranchId);

  useEffect(() => {
    setSelectedBranch(initialBranchId);
  }, [initialBranchId]);

  const branch = state.branches[selectedBranch];
  const currentNodes = branch?.milestoneNodes || DEFAULT_BRANCH_MILESTONES[selectedBranch];

  const [nodes, setNodes] = useState<BranchMilestoneNode[]>(currentNodes);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (branch) {
      setNodes(branch.milestoneNodes || DEFAULT_BRANCH_MILESTONES[selectedBranch]);
    }
  }, [selectedBranch, branch]);

  if (!isOpen) return null;

  const handleNodeChange = (index: number, field: keyof BranchMilestoneNode, value: any) => {
    setNodes(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSave = () => {
    sound.playCheck();
    updateBranchMilestones(selectedBranch, nodes);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 900);
  };

  const handleResetDefaults = () => {
    sound.playTap();
    const defaults = DEFAULT_BRANCH_MILESTONES[selectedBranch];
    setNodes(defaults);
    updateBranchMilestones(selectedBranch, defaults);
  };

  const branchIds: BranchId[] = ['body', 'mind', 'craft', 'bonds', 'empire'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4">
      <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-8 max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xs shrink-0"
              style={{ backgroundColor: branch?.colorHex || '#1CB0F6' }}
            >
              <BranchIcon branchId={selectedBranch} size={20} />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-[#3C3C3C] leading-tight">
                Customize Levels & Milestones
              </h3>
              <p className="text-[11px] sm:text-xs text-[#777777] font-semibold">
                Edit RPG rank titles, day thresholds, and goals for {branch?.name}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-[#777777] hover:text-[#3C3C3C] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Branch Selector Pills */}
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {branchIds.map(bId => {
            const isSelected = selectedBranch === bId;
            const b = state.branches[bId];
            return (
              <button
                key={bId}
                onClick={() => {
                  sound.playTap();
                  setSelectedBranch(bId);
                }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'text-white shadow-xs border-b-2'
                    : 'bg-white text-[#777777] border border-gray-200 hover:bg-gray-100'
                }`}
                style={{
                  backgroundColor: isSelected ? b.colorHex : undefined,
                  borderColor: isSelected ? b.borderHex : undefined
                }}
              >
                <BranchIcon branchId={bId} size={13} />
                <span>{b.name}</span>
              </button>
            );
          })}
        </div>

        {/* 5-Tier Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {nodes.map((node, index) => {
            const tierNumber = index + 1;
            const isLastTier = tierNumber === 5;

            return (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl border-2 border-gray-200 p-3.5 sm:p-4 space-y-3 relative group focus-within:border-[#1CB0F6] focus-within:bg-white transition-all"
              >
                {/* Node Tier Header */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-7 h-7 rounded-xl font-black text-xs text-white flex items-center justify-center shadow-xs shrink-0"
                      style={{ backgroundColor: branch.colorHex }}
                    >
                      N{tierNumber}
                    </span>
                    <span className="font-extrabold text-xs text-[#3C3C3C]">
                      Tier {tierNumber} Milestone
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#777777]">
                    <span>Reward:</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#DDF4FF] text-[#1CB0F6] font-black uppercase text-[10px]">
                      {isLastTier ? '🔮 Epic Chest + Lvl' : '💎 Rare Chest + Lvl'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Days Threshold */}
                  <div>
                    <label className="block text-[10px] font-black uppercase text-[#777777] mb-1">
                      Days Required
                    </label>
                    <div className="flex items-center gap-1.5 bg-white rounded-xl border border-gray-200 px-3 py-1.5">
                      <input
                        type="number"
                        min="1"
                        max="90"
                        value={node.threshold}
                        onChange={e => handleNodeChange(index, 'threshold', Number(e.target.value))}
                        className="w-full text-xs font-black text-[#3C3C3C] outline-none"
                      />
                      <span className="text-[10px] font-bold text-[#777777]">Days</span>
                    </div>
                  </div>

                  {/* RPG Rank Title */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-[#777777] mb-1">
                      RPG Rank Title
                    </label>
                    <input
                      type="text"
                      value={node.rankTitle}
                      onChange={e => handleNodeChange(index, 'rankTitle', e.target.value)}
                      placeholder="e.g. Novice Initiate"
                      className="w-full text-xs font-black text-[#3C3C3C] bg-white rounded-xl border border-gray-200 px-3 py-1.5 outline-none focus:border-[#1CB0F6]"
                    />
                  </div>
                </div>

                {/* Milestone Goal Text */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-[#777777] mb-1">
                    Polymath Milestone Goal
                  </label>
                  <textarea
                    rows={2}
                    value={node.milestoneGoal}
                    onChange={e => handleNodeChange(index, 'milestoneGoal', e.target.value)}
                    placeholder="Enter concrete goal (e.g. Nail 5 days of joint prep + handstands)..."
                    className="w-full text-xs text-[#3C3C3C] font-semibold bg-white rounded-xl border border-gray-200 p-2.5 outline-none focus:border-[#1CB0F6] resize-none"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t-2 border-gray-100 flex items-center justify-between gap-3">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl bg-white border-2 border-gray-200 hover:border-gray-300 text-xs font-black text-[#777777] hover:text-[#3C3C3C] cursor-pointer flex items-center gap-1.5 active:translate-y-0.5 transition-all"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">Reset Defaults</span>
            <span className="sm:hidden">Reset</span>
          </button>

          <div className="flex items-center gap-2">
            {savedNotice && (
              <span className="text-xs font-black text-[#58CC02] flex items-center gap-1 animate-fade-in">
                <Check size={14} /> Saved!
              </span>
            )}
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-2xl bg-[#58CC02] border-2 border-b-4 border-[#46A302] text-white font-black text-xs uppercase tracking-wider cursor-pointer active:translate-y-0.5 transition-all shadow-md flex items-center gap-1.5"
            >
              <Save size={14} />
              <span>Save Milestones</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

