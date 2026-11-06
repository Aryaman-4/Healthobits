import React from 'react';
import { BookOpen, Check, Sparkles, Flame, Trophy, X, ChevronRight, HelpCircle } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';

interface GameGuideCardProps {
  onClose?: () => void;
  standalone?: boolean;
}

export const GameGuideCard: React.FC<GameGuideCardProps> = ({ onClose, standalone = false }) => {
  const { toggleGameGuide, showGameGuide } = useGame();

  if (!standalone && !showGameGuide) return null;

  const handleDismiss = () => {
    sound.playTap();
    if (onClose) {
      onClose();
    } else {
      toggleGameGuide();
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1CB0F6]/10 via-white to-[#FFC800]/10 rounded-3xl border-2 border-[#1CB0F6] border-b-6 p-4 sm:p-6 shadow-md relative overflow-hidden">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#DDF4FF] border-2 border-[#1CB0F6] flex items-center justify-center text-[#1CB0F6] text-xl font-black shadow-xs shrink-0">
            📘
          </div>
          <div>
            <h3 className="font-black text-base sm:text-lg text-[#3C3C3C] leading-tight">
              How Points & Leveling Work
            </h3>
            <p className="text-[11px] sm:text-xs text-[#777777] font-bold">
              The 4 Core Rules of Polymath Quest (Duolingo for Real Life)
            </p>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="px-3 py-1.5 rounded-xl bg-white border-2 border-gray-200 hover:border-gray-300 text-xs font-black text-[#777777] hover:text-[#3C3C3C] cursor-pointer active:translate-y-0.5 transition-all shadow-xs flex items-center gap-1 shrink-0"
        >
          <Check size={14} className="text-[#58CC02]" />
          <span>Got it, hide</span>
        </button>
      </div>

      {/* 4 Core Rule Visual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Rule 1 */}
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] border-b-4 p-3.5 flex items-start gap-3 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-[#FFDFE0] border-2 border-[#FF4B4B] text-[#FF4B4B] flex items-center justify-center font-black text-sm shrink-0">
            1
          </div>
          <div className="min-w-0">
            <h4 className="font-extrabold text-xs sm:text-sm text-[#3C3C3C] flex items-center gap-1.5">
              <span>Daily Branch Points</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#FFDFE0] text-[#EA2B2B] text-[10px] font-black uppercase">
                Max +1/day
              </span>
            </h4>
            <p className="text-[11px] sm:text-xs text-[#666666] mt-1 leading-relaxed">
              Completing <strong>at least 1 habit</strong> in a branch today awards <strong>+1 Active Day Point</strong> to that branch's Skill Tree. Doing 3 Body habits still gives +1 point—consistency across 90 days beats single-day burnout!
            </p>
          </div>
        </div>

        {/* Rule 2 */}
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] border-b-4 p-3.5 flex items-start gap-3 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-[#DDF4FF] border-2 border-[#1CB0F6] text-[#1CB0F6] flex items-center justify-center font-black text-sm shrink-0">
            2
          </div>
          <div className="min-w-0">
            <h4 className="font-extrabold text-xs sm:text-sm text-[#3C3C3C] flex items-center gap-1.5">
              <span>80-Day Skill Tree</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#DDF4FF] text-[#1CB0F6] text-[10px] font-black uppercase">
                5 → 15 → 30 → 50 → 80
              </span>
            </h4>
            <p className="text-[11px] sm:text-xs text-[#666666] mt-1 leading-relaxed">
              Every season lasts <strong>90 Days</strong>. Each branch has 5 milestone nodes (5, 15, 30, 50, and 80 total days). <strong>No streak is required!</strong> Unlock a node anytime to earn a <strong>💎 Rare Loot Chest</strong>!
            </p>
          </div>
        </div>

        {/* Rule 3 */}
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] border-b-4 p-3.5 flex items-start gap-3 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-[#FFF5D6] border-2 border-[#FFC800] text-[#A17200] flex items-center justify-center font-black text-sm shrink-0">
            3
          </div>
          <div className="min-w-0">
            <h4 className="font-extrabold text-xs sm:text-sm text-[#3C3C3C] flex items-center gap-1.5">
              <span>★ Keystone Habits</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#FFF5D6] text-[#A17200] text-[10px] font-black uppercase flex items-center gap-0.5">
                <Flame size={10} className="fill-[#FF9600]" /> 7-Day Streak
              </span>
            </h4>
            <p className="text-[11px] sm:text-xs text-[#666666] mt-1 leading-relaxed">
              Your #1 non-negotiable habit per branch has a <strong>Golden Star (★)</strong>. Complete any ★ Keystone habit for <strong>7 days in a row</strong> to unlock a <strong>🪵 Common Loot Chest</strong> reward!
            </p>
          </div>
        </div>

        {/* Rule 4 */}
        <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] border-b-4 p-3.5 flex items-start gap-3 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-[#F3E5FF] border-2 border-[#CE82FF] text-[#A560E8] flex items-center justify-center font-black text-sm shrink-0">
            4
          </div>
          <div className="min-w-0">
            <h4 className="font-extrabold text-xs sm:text-sm text-[#3C3C3C] flex items-center gap-1.5">
              <span>End-of-Month Level Up</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#F3E5FF] text-[#A560E8] text-[10px] font-black uppercase">
                Formula
              </span>
            </h4>
            <p className="text-[11px] sm:text-xs text-[#666666] mt-1 leading-relaxed">
              Quests (Feats) add <strong>+1 Bonus Level</strong> each! At month end, your level formula is:
              <br />
              <code className="text-[10px] bg-purple-50 text-purple-700 font-mono font-bold px-1.5 py-0.5 rounded inline-block mt-0.5">
                Level = Start Level + Nodes Unlocked + Quests Done
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

