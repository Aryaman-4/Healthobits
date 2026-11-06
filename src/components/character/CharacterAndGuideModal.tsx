import React, { useState } from 'react';
import { X, Sparkles, Trophy, HelpCircle, Shield, Award, RotateCcw, Check, Flame } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { GameGuideCard } from '../guide/GameGuideCard';
import { BranchIcon } from '../common/BranchIcon';
import { sound } from '../../utils/audio';

interface CharacterAndGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'sheet' | 'guide';
}

export const CharacterAndGuideModal: React.FC<CharacterAndGuideModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'sheet'
}) => {
  const {
    state,
    overallLevel,
    branchLevels,
    seasonalGains,
    setIsOnboardingOpen,
    setActiveTab
  } = useGame();

  const [activeSubTab, setActiveSubTab] = useState<'sheet' | 'guide'>(initialTab);

  if (!isOpen) return null;

  const { character, branches } = state;

  const handleStartOnboarding = () => {
    sound.playTap();
    onClose();
    setIsOnboardingOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-8 max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b-2 border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playTap();
                setActiveSubTab('sheet');
              }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeSubTab === 'sheet'
                  ? 'bg-[#1CB0F6] text-white shadow-xs'
                  : 'bg-gray-100 text-[#777777] hover:bg-gray-200'
              }`}
            >
              🛡️ Character Sheet
            </button>
            <button
              onClick={() => {
                sound.playTap();
                setActiveSubTab('guide');
              }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                activeSubTab === 'guide'
                  ? 'bg-[#FFC800] text-[#3C3C3C] shadow-xs'
                  : 'bg-gray-100 text-[#777777] hover:bg-gray-200'
              }`}
            >
              <HelpCircle size={14} />
              <span>Game Guide (?)</span>
            </button>
          </div>

          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-[#777777] hover:text-[#3C3C3C] cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {activeSubTab === 'sheet' ? (
            <div className="space-y-5">
              {/* Hero Banner */}
              <div className="bg-gradient-to-br from-[#DDF4FF] via-white to-[#FFF5D6] rounded-2xl border-2 border-[#1CB0F6] border-b-4 p-4 flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black text-white border-2 border-b-4 shadow-md shrink-0"
                  style={{ backgroundColor: character.avatarBg, borderColor: '#33333333' }}
                >
                  {character.avatarSeed === 'knight' ? '🛡️' : character.avatarSeed === 'wizard' ? '🧙' : '👑'}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-xl text-[#3C3C3C] truncate">
                      {character.name}
                    </h3>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#1CB0F6] text-white">
                      Season {character.seasonNumber}
                    </span>
                  </div>
                  <p className="text-xs text-[#777777] font-bold truncate mt-0.5">
                    {character.classTitle}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FFF5D6] border border-[#FFC800] text-[#A17200] font-black text-xs">
                      <span>👑 Total Level:</span>
                      <span className="text-sm font-black">{overallLevel}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5 Attribute Levels Grid */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#777777]">
                  5 Life Attributes Progress
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(['body', 'mind', 'craft', 'bonds', 'empire'] as const).map(bId => {
                    const b = branches[bId];
                    const lvl = branchLevels[bId] || b.currentMonthStartLevel;
                    const gain = seasonalGains[bId] || 0;
                    return (
                      <div
                        key={bId}
                        className="bg-white rounded-xl border-2 border-[#E5E5E5] border-b-3 p-3 flex items-center justify-between shadow-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <BranchIcon branchId={bId} size={18} />
                          <div className="min-w-0">
                            <span className="font-black text-xs text-[#3C3C3C] uppercase block">
                              {b.name}
                            </span>
                            <span className="text-[10px] text-[#777777] font-semibold truncate block">
                              {b.focusArea}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-black text-[#3C3C3C]">
                            Lvl {lvl}
                          </div>
                          {gain > 0 && (
                            <div className="text-[10px] font-bold text-[#58CC02]">
                              +{gain} Season
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Season Pact Card */}
              <div className="bg-[#F7F7F7] rounded-2xl border-2 border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[#3C3C3C]">
                    <Shield size={14} className="text-[#58CC02]" />
                    <span>Season 1 Pact Status</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#EBF9DC] text-[#58CC02] border border-[#58CC02] text-[10px] font-black uppercase">
                    Locked & Active
                  </span>
                </div>
                <p className="text-xs text-[#777777]">
                  Signed with the 5 Keystone pledge: 1 non-negotiable habit per branch to conquer burnout over 90 days.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    onClose();
                    setActiveTab('settings');
                  }}
                  className="flex-1 py-2.5 rounded-2xl bg-white border-2 border-gray-200 hover:border-gray-300 font-black text-xs uppercase tracking-wider text-[#3C3C3C] cursor-pointer active:translate-y-0.5 transition-all shadow-xs"
                >
                  ⚙️ Open Full Settings
                </button>
                <button
                  onClick={handleStartOnboarding}
                  className="py-2.5 px-3 rounded-2xl bg-[#DDF4FF] border-2 border-[#84D8FF] text-[#1CB0F6] font-black text-xs uppercase tracking-wider cursor-pointer active:translate-y-0.5 transition-all shadow-xs flex items-center gap-1"
                >
                  <RotateCcw size={13} />
                  <span>Tutorial</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <GameGuideCard standalone={true} />

              <div className="p-3 bg-[#FFF5D6] rounded-2xl border-2 border-[#FFC800] flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h5 className="font-black text-xs text-[#3C3C3C]">Want a guided walkthrough?</h5>
                  <p className="text-[11px] text-[#777777]">Replay the 4-step beginner onboarding wizard anytime.</p>
                </div>
                <button
                  onClick={handleStartOnboarding}
                  className="px-3 py-1.5 rounded-xl bg-[#FFC800] border-2 border-b-4 border-[#E5A400] text-[#3C3C3C] font-black text-xs uppercase tracking-wider cursor-pointer active:translate-y-0.5 transition-all shrink-0"
                >
                  Replay
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

