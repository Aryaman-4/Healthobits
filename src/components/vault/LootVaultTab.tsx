import React, { useState } from 'react';
import {
  Gift,
  Trophy,
  Sparkles,
  Plus,
  Trash2,
  Check,
  ChevronRight,
  Flame,
  Star,
  Award,
  Crown
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BranchId, LootItem, LootRarity } from '../../types';
import { ChunkyButton } from '../common/ChunkyButton';
import { sound } from '../../utils/audio';
import { calculateMonthLevelUp } from '../../utils/gameMath';

interface ChestTierConfig {
  rarity: LootRarity;
  label: string;
  iconEmoji: string;
  triggerDescription: string;
  colorBg: string;
  borderLip: string;
  glowClass: string;
}

const CHEST_TIERS: ChestTierConfig[] = [
  {
    rarity: 'common',
    label: 'Common Chest',
    iconEmoji: '🪵',
    triggerDescription: '7 consecutive days (1 full week straight) of any ★ Keystone Habit',
    colorBg: 'bg-[#A67C52]',
    borderLip: 'border-[#7A5736]',
    glowClass: 'ring-4 ring-[#C2B7A3]/50'
  },
  {
    rarity: 'rare',
    label: 'Rare Chest',
    iconEmoji: '💎',
    triggerDescription: 'Every time 1 Skill Node (5, 15, 30, 50, or 80) is filled on the Skill Tree',
    colorBg: 'bg-[#1CB0F6]',
    borderLip: 'border-[#1899D6]',
    glowClass: 'ring-4 ring-[#84D8FF]/60'
  },
  {
    rarity: 'epic',
    label: 'Epic Chest',
    iconEmoji: '🔮',
    triggerDescription: 'Completing 1 entire branch on the Skill Tree (reaching Node 80)',
    colorBg: 'bg-[#CE82FF]',
    borderLip: 'border-[#A560E8]',
    glowClass: 'ring-4 ring-[#CE82FF]/50'
  },
  {
    rarity: 'legendary',
    label: 'Legendary Chest',
    iconEmoji: '👑',
    triggerDescription: 'Completing the ENTIRE Skill Tree (reaching 80 across all 5 branches in a season)',
    colorBg: 'bg-gradient-to-br from-[#FFC800] via-[#FFD738] to-[#E5A400]',
    borderLip: 'border-[#C78700]',
    glowClass: 'ring-4 ring-[#FFC800]/70'
  }
];

export const LootVaultTab: React.FC = () => {
  const {
    state,
    claimLootReward,
    addLootOption,
    awardChest,
    runEndOfMonthCeremony
  } = useGame();

  const { lootPool, pendingChests, character, branches, habits, monthlyQuests } = state;

  // Selected chest to open in modal
  const [activeOpeningTier, setActiveOpeningTier] = useState<LootRarity | null>(null);
  const [selectedRewardTitle, setSelectedRewardTitle] = useState<string>('');
  const [customTriggerReason, setCustomTriggerReason] = useState<string>('');

  // Add custom loot option modal
  const [isAddOptionModalOpen, setIsAddOptionModalOpen] = useState(false);
  const [newOptionRarity, setNewOptionRarity] = useState<LootRarity>('common');
  const [newOptionTitle, setNewOptionTitle] = useState('');

  // Level Up Wizard Modal
  const [isCeremonyWizardOpen, setIsCeremonyWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<number>(1);

  const handleOpenChest = (rarity: LootRarity) => {
    sound.playChestOpen();
    const tierRewards = lootPool.filter(l => l.rarity === rarity);
    setSelectedRewardTitle(tierRewards[0]?.title || '');
    setCustomTriggerReason(
      rarity === 'common'
        ? '7-Day Keystone Streak'
        : rarity === 'rare'
        ? 'Skill Tree Node Milestone'
        : rarity === 'epic'
        ? 'Branch Mastered (Node 80)'
        : 'Legendary Season Master (All 5 Branches at 80)'
    );
    setActiveOpeningTier(rarity);
  };

  const handleConfirmClaim = () => {
    if (!activeOpeningTier || !selectedRewardTitle.trim()) return;
    claimLootReward(activeOpeningTier, selectedRewardTitle.trim(), customTriggerReason);
    setActiveOpeningTier(null);
  };

  const handleCreateLootOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOptionTitle.trim()) return;
    addLootOption(newOptionRarity, newOptionTitle.trim());
    setNewOptionTitle('');
    setIsAddOptionModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-6 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🎁</span>
            <h2 className="font-black text-2xl text-[#3C3C3C]">
              The 4-Tier Loot Vault & Ceremony
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#777777] font-semibold max-w-2xl">
            Real-life rewards tied to tangible habit milestones. Fill each chest with things you genuinely love, and gift them to yourself guilt-free when unlocked!
          </p>
        </div>

        {/* End of Month Ceremony Launch Button */}
        <ChunkyButton
          variant="purple"
          size="md"
          onClick={() => {
            sound.playTap();
            setIsCeremonyWizardOpen(true);
            setWizardStep(1);
          }}
        >
          <Sparkles size={18} />
          <span>Month-End Level-Up Ceremony</span>
        </ChunkyButton>
      </div>

      {/* 1. 4 Interactive 3D Treasure Chests */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {CHEST_TIERS.map(tier => {
          const count = pendingChests[tier.rarity];
          const hasPending = count > 0;
          const tierOptions = lootPool.filter(l => l.rarity === tier.rarity);

          return (
            <div
              key={tier.rarity}
              className={`group bg-white rounded-3xl border-2 border-b-6 p-5 flex flex-col justify-between transition-all duration-200 ${
                hasPending
                  ? `border-[#58CC02] shadow-lg ${tier.glowClass}`
                  : 'border-[#E5E5E5]'
              }`}
            >
              <div className="space-y-4">
                {/* Chest Header & Counter */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-[#777777] tracking-wider">
                    Tier {CHEST_TIERS.indexOf(tier) + 1}
                  </span>

                  {/* Unopened Count Pill */}
                  <span
                    className={`text-xs font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1 ${
                      hasPending
                        ? 'bg-[#EBF9DC] text-[#347A01] border border-[#58CC02] animate-bounce-soft'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <Gift size={13} />
                    <span>{count} Ready</span>
                  </span>
                </div>

                {/* 3D Visual Treasure Chest Illustration */}
                <div className="flex flex-col items-center py-4">
                  <div
                    className={`relative w-28 h-24 rounded-3xl flex items-center justify-center text-4xl border-4 border-b-8 transition-transform select-none ${
                      tier.colorBg
                    } ${tier.borderLip} ${
                      hasPending
                        ? 'cursor-pointer hover:scale-105 active:translate-y-2 animate-bounce-soft shadow-xl'
                        : 'opacity-70 grayscale-30 shadow-md'
                    }`}
                    onClick={() => hasPending && handleOpenChest(tier.rarity)}
                  >
                    <span>{tier.iconEmoji}</span>
                    {hasPending && (
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#FF4B4B] text-white text-xs font-black flex items-center justify-center shadow-md animate-ping" />
                    )}
                  </div>

                  <h3 className="font-black text-lg text-[#3C3C3C] mt-3">
                    {tier.label}
                  </h3>
                </div>

                {/* Unlock Trigger Rule */}
                <div className="p-2.5 bg-[#F7F7F7] rounded-xl border border-gray-200">
                  <span className="text-[10px] font-black uppercase text-[#777777] block">
                    Trigger Condition:
                  </span>
                  <p className="text-xs font-bold text-[#3C3C3C] leading-snug mt-0.5">
                    {tier.triggerDescription}
                  </p>
                </div>

                {/* Reward Pool Preview */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-black uppercase text-[#777777]">
                      Rewards ({tierOptions.length}):
                    </span>
                    <button
                      onClick={() => {
                        setNewOptionRarity(tier.rarity);
                        setIsAddOptionModalOpen(true);
                      }}
                      className="text-[11px] font-black text-[#1CB0F6] hover:underline cursor-pointer"
                    >
                      + Add Prize
                    </button>
                  </div>
                  <ul className="space-y-1 text-xs font-semibold text-[#777777]">
                    {tierOptions.slice(0, 3).map(opt => (
                      <li key={opt.id} className="truncate flex items-center gap-1.5">
                        <span className="text-[#FFC800]">★</span>
                        <span className="truncate">{opt.title}</span>
                      </li>
                    ))}
                    {tierOptions.length > 3 && (
                      <li className="text-[10px] text-gray-400 font-bold">
                        +{tierOptions.length - 3} more prizes
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 space-y-2">
                {hasPending ? (
                  <ChunkyButton
                    variant="green"
                    size="md"
                    fullWidth
                    onClick={() => handleOpenChest(tier.rarity)}
                  >
                    <Sparkles size={16} />
                    <span>Open Chest!</span>
                  </ChunkyButton>
                ) : (
                  <button
                    onClick={() => awardChest(tier.rarity)}
                    className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-300 text-xs font-black uppercase tracking-wider text-gray-400 hover:text-[#3C3C3C] hover:border-gray-400 transition-colors cursor-pointer"
                    title="Simulate / Trigger this chest for demo testing"
                  >
                    + Test Trigger
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Open Chest Claim Celebration Modal */}
      {activeOpeningTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border-2 border-b-8 border-[#FFC800] p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-pop">
            <div className="text-center space-y-2">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-[#FFF9E6] border-2 border-[#FFC800] flex items-center justify-center text-4xl shadow-inner animate-bounce-soft">
                {CHEST_TIERS.find(t => t.rarity === activeOpeningTier)?.iconEmoji || '🎁'}
              </div>

              <h3 className="font-black text-2xl text-[#3C3C3C]">
                🎉 {activeOpeningTier.toUpperCase()} CHEST UNLOCKED!
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-[#777777]">
                You worked hard and hit your milestone! Pick which reward option you are gifting yourself today:
              </p>
            </div>

            {/* Reward Option Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase text-[#777777]">
                Select 1 Real-Life Prize:
              </label>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {lootPool
                  .filter(l => l.rarity === activeOpeningTier)
                  .map(opt => {
                    const isSelected = selectedRewardTitle === opt.title;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedRewardTitle(opt.title)}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#FFF9E6] border-[#FFC800] border-b-4 text-[#3C3C3C]'
                            : 'bg-[#F7F7F7] border-gray-200 text-[#777777] hover:bg-gray-100'
                        }`}
                      >
                        <span className="font-extrabold text-sm">{opt.title}</span>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-[#58CC02] text-white flex items-center justify-center">
                            <Check size={14} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>

              {/* Or type a custom reward right now */}
              <div className="pt-2">
                <input
                  type="text"
                  value={selectedRewardTitle}
                  onChange={e => setSelectedRewardTitle(e.target.value)}
                  placeholder="Or write a spontaneous custom reward..."
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-gray-200 text-xs font-bold text-[#3C3C3C] focus:border-[#FFC800] focus:outline-none"
                />
              </div>
            </div>

            {/* Trigger Reason */}
            <div>
              <label className="block text-xs font-black uppercase text-[#777777] mb-1">
                Milestone Trigger Reason:
              </label>
              <input
                type="text"
                value={customTriggerReason}
                onChange={e => setCustomTriggerReason(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border-2 border-gray-200 text-xs font-semibold text-[#777777]"
              />
            </div>

            {/* Confirmation Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <ChunkyButton
                variant="white"
                size="md"
                onClick={() => setActiveOpeningTier(null)}
              >
                Save for Later
              </ChunkyButton>
              <ChunkyButton
                variant="green"
                size="md"
                onClick={handleConfirmClaim}
              >
                <Gift size={18} />
                <span>Claim & Celebrate!</span>
              </ChunkyButton>
            </div>
          </div>
        </div>
      )}

      {/* 3. Add Custom Reward Option to Pool Modal */}
      {isAddOptionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border-2 border-b-6 border-[#E5E5E5] p-6 max-w-md w-full shadow-2xl space-y-4 animate-pop">
            <div className="flex items-center justify-between border-b-2 border-gray-100 pb-3">
              <h3 className="font-black text-lg text-[#3C3C3C]">
                Add Reward to Chest Pool
              </h3>
              <button
                onClick={() => setIsAddOptionModalOpen(false)}
                className="w-8 h-8 rounded-full border-2 border-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center font-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLootOption} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-[#777777] mb-1">
                  Chest Tier
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CHEST_TIERS.map(t => (
                    <button
                      type="button"
                      key={t.rarity}
                      onClick={() => setNewOptionRarity(t.rarity)}
                      className={`p-2.5 rounded-xl border-2 text-xs font-black capitalize flex items-center gap-1.5 cursor-pointer ${
                        newOptionRarity === t.rarity
                          ? 'bg-[#1CB0F6] text-white border-[#1899D6] border-b-4'
                          : 'bg-white border-gray-200 text-[#777777]'
                      }`}
                    >
                      <span>{t.iconEmoji}</span>
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#777777] mb-1">
                  Prize Title
                </label>
                <input
                  type="text"
                  required
                  value={newOptionTitle}
                  onChange={e => setNewOptionTitle(e.target.value)}
                  placeholder="e.g. Special matcha latte & croissant from bakery"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 font-extrabold text-sm text-[#3C3C3C] focus:border-[#1CB0F6] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <ChunkyButton
                  type="button"
                  variant="white"
                  size="sm"
                  onClick={() => setIsAddOptionModalOpen(false)}
                >
                  Cancel
                </ChunkyButton>
                <ChunkyButton type="submit" variant="green" size="sm">
                  Add Prize
                </ChunkyButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Gamified End-of-Month Level-Up Wizard Modal */}
      {isCeremonyWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border-2 border-b-8 border-[#CE82FF] p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 animate-pop">
            <div className="flex items-center justify-between border-b-2 border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={24} className="text-[#CE82FF]" />
                <h3 className="font-black text-xl text-[#3C3C3C]">
                  End-of-Month Level-Up Ceremony
                </h3>
              </div>
              <button
                onClick={() => setIsCeremonyWizardOpen(false)}
                className="w-8 h-8 rounded-full border-2 border-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center font-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Step 1: Visual Math Breakdown */}
            {wizardStep === 1 && (
              <div className="space-y-5">
                <div className="text-center space-y-1">
                  <span className="text-xs font-black uppercase text-[#CE82FF] bg-[#F3E5FF] px-3 py-1 rounded-full border border-[#CE82FF]">
                    Month {character.currentMonthIndex} of 3 Wrap-Up
                  </span>
                  <h4 className="font-black text-2xl text-[#3C3C3C] mt-2">
                    Tallying Seasonal XP & Milestones
                  </h4>
                  <p className="text-xs text-[#777777] font-semibold">
                    Formula: Previous Level ➕ Nodes Unlocked This Month ➕ Feats Completed ➡️ New Level!
                  </p>
                </div>

                {/* Animated breakdown per branch */}
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {(['body', 'mind', 'craft', 'bonds', 'empire'] as BranchId[]).map(bId => {
                    const branch = branches[bId];
                    const calc = calculateMonthLevelUp(
                      branch,
                      habits,
                      monthlyQuests,
                      character.currentYearMonth
                    );

                    return (
                      <div
                        key={bId}
                        className="p-3.5 bg-[#F7F7F7] rounded-2xl border-2 border-[#E5E5E5] flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full"
                            style={{ backgroundColor: branch.colorHex }}
                          />
                          <span className="font-black text-sm capitalize text-[#3C3C3C]">
                            {branch.name}
                          </span>
                        </div>

                        {/* The Math Formula Pill */}
                        <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-[#3C3C3C]">
                          <span className="bg-white px-2 py-1 rounded-lg border border-gray-200">
                            Lvl {calc.previousLevel}
                          </span>
                          <span className="text-gray-400">➕</span>
                          <span className="bg-[#DDF4FF] text-[#1CB0F6] px-2 py-1 rounded-lg border border-[#84D8FF]">
                            +{calc.nodesUnlockedThisMonth} Nodes
                          </span>
                          <span className="text-gray-400">➕</span>
                          <span className="bg-[#FFF5D6] text-[#A17200] px-2 py-1 rounded-lg border border-[#FFC800]">
                            +{calc.featsCompletedThisMonth} Feats
                          </span>
                          <span className="text-gray-400">➡️</span>
                          <span
                            className="text-white px-2.5 py-1 rounded-lg font-black"
                            style={{ backgroundColor: branch.colorHex }}
                          >
                            Lvl {calc.newLevel}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t">
                  <ChunkyButton
                    variant="white"
                    size="md"
                    onClick={() => setIsCeremonyWizardOpen(false)}
                  >
                    Cancel
                  </ChunkyButton>
                  <ChunkyButton
                    variant="purple"
                    size="md"
                    onClick={() => {
                      sound.playLevelUp();
                      setWizardStep(2);
                    }}
                  >
                    <span>Proceed to Grand Level-Up</span>
                    <ChevronRight size={18} />
                  </ChunkyButton>
                </div>
              </div>
            )}

            {/* Step 2: Grand Fanfare & Roll-Over */}
            {wizardStep === 2 && (
              <div className="text-center space-y-6 py-4">
                <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-[#CE82FF] to-[#A560E8] border-4 border-[#FFF] shadow-xl flex items-center justify-center text-5xl animate-bounce-soft">
                  👑
                </div>

                <div className="space-y-2">
                  <h4 className="font-black text-3xl text-[#3C3C3C]">
                    🎉 LEVEL UP CONGRATULATIONS!
                  </h4>
                  <p className="text-sm font-semibold text-[#777777] max-w-md mx-auto">
                    Your consistency this month powered your character to new heights. Attribute levels are saved and carried forward into next month!
                  </p>
                </div>

                <div className="p-4 bg-[#F7F7F7] rounded-2xl border-2 border-[#E5E5E5] max-w-md mx-auto text-left text-xs font-bold text-[#777777] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span>New Total Character Level:</span>
                    <span className="text-[#3C3C3C] font-black text-sm">
                      LVL {Object.values(branches).reduce((acc, b) => acc + calculateMonthLevelUp(b, habits, monthlyQuests, character.currentYearMonth).newLevel, 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Next Horizon:</span>
                    <span className="text-[#1CB0F6] font-black">
                      {character.currentMonthIndex === 3 ? 'Season Complete! New Season 3 Begins!' : `Month ${character.currentMonthIndex + 1} of 3`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <ChunkyButton
                    variant="green"
                    size="lg"
                    onClick={() => {
                      runEndOfMonthCeremony();
                      setIsCeremonyWizardOpen(false);
                    }}
                  >
                    <Check size={20} strokeWidth={3} />
                    <span>Confirm & Roll Over to Next Month</span>
                  </ChunkyButton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

