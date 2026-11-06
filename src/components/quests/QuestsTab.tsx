import React, { useState } from 'react';
import {
  Crown,
  Star,
  Check,
  Plus,
  Trash2,
  Gift,
  Sparkles,
  Download,
  Trophy,
  ExternalLink,
  Edit2,
  Calendar,
  Grid
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BranchId, MonthlyQuest } from '../../types';
import { BranchIcon } from '../common/BranchIcon';
import { ChunkyButton } from '../common/ChunkyButton';
import { getDaysInMonth, isBranchActiveOnDate, getBranchDaysForMonth } from '../../utils/gameMath';
import { sound } from '../../utils/audio';

export const QuestsTab: React.FC = () => {
  const {
    state,
    toggleQuestCompletion,
    addQuest,
    deleteQuest,
    importFeatFromScratchpad
  } = useGame();

  const { monthlyQuests, branches, claimedLoot, character, habits } = state;

  const [viewMode, setViewMode] = useState<'quests' | 'calendar'>('quests');
  const [calendarHalf, setCalendarHalf] = useState<'first' | 'second'>('first');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isEditMainModalOpen, setIsEditMainModalOpen] = useState(false);

  // New Quest Form State
  const [newTitle, setNewTitle] = useState('');
  const [newBranch, setNewBranch] = useState<BranchId>('mind');

  // Main Quest Editing State
  const mainQuest = monthlyQuests.find(q => q.isMainQuest);
  const sideQuests = monthlyQuests.filter(q => !q.isMainQuest);

  const [mainTitle, setMainTitle] = useState(mainQuest?.title || '');
  const [mainStars, setMainStars] = useState<1 | 2 | 3 | 4 | 5>(mainQuest?.difficultyStars || 5);
  const [mainReward, setMainReward] = useState(mainQuest?.customReward || '');
  const [mainBranch, setMainBranch] = useState<BranchId>(mainQuest?.branchId || 'body');

  const totalDays = getDaysInMonth(character.currentYearMonth);
  const halfDays = calendarHalf === 'first'
    ? Array.from({ length: 15 }, (_, i) => i + 1)
    : Array.from({ length: totalDays - 15 }, (_, i) => i + 16);

  const branchIds: BranchId[] = ['body', 'mind', 'craft', 'bonds', 'empire'];

  const handleCreateSideQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addQuest({
      title: newTitle.trim(),
      branchId: newBranch,
      isMainQuest: false,
      isCompleted: false
    });
    setNewTitle('');
    setIsAddModalOpen(false);
  };

  const handleSaveMainQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (mainQuest) {
      deleteQuest(mainQuest.id);
    }
    addQuest({
      title: mainTitle,
      branchId: mainBranch,
      isMainQuest: true,
      difficultyStars: mainStars,
      customReward: mainReward,
      isCompleted: false
    });
    setIsEditMainModalOpen(false);
  };

  const getDifficultyLabel = (stars: number) => {
    switch (stars) {
      case 1:
        return 'Gentle Starter';
      case 2:
        return 'Moderate Feat';
      case 3:
        return 'Challenging Quest';
      case 4:
        return 'Epic Ambition';
      case 5:
        return 'Super Stretch Goal!';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto sm:max-w-4xl py-4 sm:py-6 px-3 sm:px-4 pb-20">
      {/* View Switcher: Quests Board vs Half-Month Calendar Grid */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-3xl border-2 border-[#E5E5E5] border-b-6 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playTap();
              setViewMode('quests');
            }}
            className={`px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'quests'
                ? 'bg-[#1CB0F6] text-white shadow-xs border-b-3'
                : 'bg-gray-100 text-[#777777] hover:bg-gray-200'
            }`}
          >
            <span>⚔️ Monthly Quests</span>
          </button>

          <button
            onClick={() => {
              sound.playTap();
              setViewMode('calendar');
            }}
            className={`px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'calendar'
                ? 'bg-[#58CC02] text-white shadow-xs border-b-3'
                : 'bg-gray-100 text-[#777777] hover:bg-gray-200'
            }`}
          >
            <Calendar size={14} />
            <span>📅 Half-Month Grid</span>
          </button>
        </div>

        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FFF5D6] text-[#A17200] hidden sm:inline">
          Month {character.currentMonthIndex} ({character.currentYearMonth})
        </span>
      </div>

      {/* CALENDAR VIEW MODE */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-6 p-4 sm:p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-black text-lg text-[#3C3C3C] flex items-center gap-2">
                <span>Half-Month Habit Ledger</span>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-[#EBF9DC] text-[#347A01]">
                  +1 Pt/Branch/Day
                </span>
              </h3>
              <p className="text-xs text-[#777777] font-semibold mt-0.5">
                Visual matrix of your active daily points across all 5 branches
              </p>
            </div>

            {/* Half Month Selector (Days 1–15 vs Days 16–31) */}
            <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-2xl">
              <button
                onClick={() => {
                  sound.playTap();
                  setCalendarHalf('first');
                }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  calendarHalf === 'first'
                    ? 'bg-white text-[#1CB0F6] shadow-xs'
                    : 'text-[#777777] hover:text-[#3C3C3C]'
                }`}
              >
                Days 1–15
              </button>
              <button
                onClick={() => {
                  sound.playTap();
                  setCalendarHalf('second');
                }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  calendarHalf === 'second'
                    ? 'bg-white text-[#1CB0F6] shadow-xs'
                    : 'text-[#777777] hover:text-[#3C3C3C]'
                }`}
              >
                Days 16–{totalDays}
              </button>
            </div>
          </div>

          {/* Matrix Grid */}
          <div className="overflow-x-auto pb-2">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left font-black text-[#777777] uppercase py-2 pr-3 min-w-[90px]">
                    Branch
                  </th>
                  {halfDays.map(d => (
                    <th key={d} className="font-black text-center text-[#777777] px-1 py-2 min-w-[26px]">
                      {d}
                    </th>
                  ))}
                  <th className="text-right font-black text-[#777777] uppercase py-2 pl-3 min-w-[50px]">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {branchIds.map(bId => {
                  const b = branches[bId];
                  const branchDaysSummary = getBranchDaysForMonth(bId, habits, character.currentYearMonth);

                  return (
                    <tr key={bId} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-2.5 pr-3">
                        <div className="flex items-center gap-1.5">
                          <BranchIcon branchId={bId} size={15} />
                          <span className="font-extrabold uppercase text-[#3C3C3C] text-[11px]">
                            {b.name}
                          </span>
                        </div>
                      </td>

                      {halfDays.map(d => {
                        const dateStr = `${character.currentYearMonth}-${String(d).padStart(2, '0')}`;
                        const isActive = isBranchActiveOnDate(bId, habits, dateStr);

                        return (
                          <td key={d} className="px-1 py-2 text-center">
                            <div
                              className={`w-6 h-6 rounded-lg mx-auto flex items-center justify-center font-black text-[10px] transition-transform ${
                                isActive
                                  ? 'text-white shadow-2xs scale-105'
                                  : 'bg-gray-100 text-gray-300'
                              }`}
                              style={{ backgroundColor: isActive ? b.colorHex : undefined }}
                              title={`${b.name} on day ${d}: ${isActive ? '+1 Point' : 'Inactive'}`}
                            >
                              {isActive ? '✓' : '·'}
                            </div>
                          </td>
                        );
                      })}

                      <td className="py-2.5 pl-3 text-right">
                        <span className="font-black text-xs text-[#3C3C3C]">
                          {branchDaysSummary.totalMonthDays}d
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QUESTS VIEW MODE */}
      {viewMode === 'quests' && (
        <>
          {/* 1. Main Quest Hero Banner (Duolingo Monthly Boss Challenge Card) */}
      {mainQuest ? (
        <div className="relative overflow-hidden rounded-3xl border-2 border-b-6 border-[#FFC800] bg-gradient-to-r from-[#FFF8E6] via-[#FFF2CC] to-[#FFEAA8] p-4 sm:p-8 shadow-md">
          {/* Decorative Corner Crown Accent */}
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-[#FFC800]/20 pointer-events-none flex items-center justify-center transform rotate-12">
            <Crown size={80} className="text-[#FFC800]/40" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-2.5 sm:space-y-3 max-w-2xl">
              {/* Header Badges */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-[#FFC800] border-2 border-[#E5A400] text-[#3C3C3C] text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-xs">
                  <Crown size={13} className="fill-[#3C3C3C]" />
                  <span>Month {character.currentMonthIndex} Main Quest</span>
                </span>

                {/* Difficulty Stars */}
                <div className="flex items-center gap-1 px-2.5 sm:px-3 py-1 bg-white/80 rounded-full border border-[#E5A400]/40">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={
                        i < (mainQuest.difficultyStars || 5)
                          ? 'text-[#E5A400] fill-[#FFC800]'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                  <span className="text-[10px] sm:text-[11px] font-black text-[#A17200] ml-1">
                    {getDifficultyLabel(mainQuest.difficultyStars || 5)}
                  </span>
                </div>

                {/* Branch attribution */}
                <span
                  className="text-[11px] sm:text-xs font-black uppercase px-2 sm:px-2.5 py-1 rounded-full text-white shadow-xs"
                  style={{ backgroundColor: branches[mainQuest.branchId].colorHex }}
                >
                  +1 {branches[mainQuest.branchId].name}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-black text-lg sm:text-3xl text-[#3C3C3C] tracking-tight leading-snug break-words">
                {mainQuest.title}
              </h2>

              {/* Custom Prize Pill */}
              {mainQuest.customReward && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl bg-white/90 border-2 border-[#E5A400] shadow-xs">
                  <Gift size={16} className="text-[#E5A400] shrink-0" />
                  <div className="text-xs">
                    <span className="font-extrabold uppercase text-[#A17200] block text-[9px] sm:text-[10px]">
                      Dedicated Reward Prize:
                    </span>
                    <span className="font-black text-[#3C3C3C] text-xs sm:text-sm">{mainQuest.customReward}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Action: Huge 3D Completion Button */}
            <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
              <button
                onClick={() => toggleQuestCompletion(mainQuest.id)}
                className={`flex-1 md:flex-initial px-4 sm:px-6 py-3 sm:py-4 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider cursor-pointer border-2 border-b-6 transition-all select-none active:translate-y-1 text-center ${
                  mainQuest.isCompleted
                    ? 'bg-[#58CC02] border-[#46A302] text-white shadow-lg'
                    : 'bg-white border-[#FFC800] text-[#A17200] hover:bg-[#fff7e0] shadow-sm'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <Check
                    size={20}
                    strokeWidth={3.5}
                    className={mainQuest.isCompleted ? 'text-white' : 'text-gray-400'}
                  />
                  <span>{mainQuest.isCompleted ? 'Main Quest Succeeded!' : 'Mark Complete'}</span>
                </div>
              </button>

              <button
                onClick={() => setIsEditMainModalOpen(true)}
                className="p-3 bg-white/80 hover:bg-white rounded-2xl border-2 border-[#E5A400] text-[#A17200] transition-colors cursor-pointer shrink-0"
                title="Edit Main Quest"
              >
                <Edit2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-white rounded-3xl border-2 border-[#E5E5E5] text-center space-y-3">
          <p className="font-extrabold text-[#777777]">No Main Quest set for this month!</p>
          <ChunkyButton variant="yellow" onClick={() => setIsEditMainModalOpen(true)}>
            Set Monthly Main Quest
          </ChunkyButton>
        </div>
      )}

      {/* 2. Side Quests (Branch Feats) Board */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-black text-xl text-[#3C3C3C] flex items-center gap-2">
              <Sparkles size={20} className="text-[#1CB0F6]" />
              <span>Monthly Stretch Goals & Feats</span>
              <span className="text-xs font-black text-[#1CB0F6] bg-[#DDF4FF] px-2.5 py-0.5 rounded-full border border-[#84D8FF]">
                {sideQuests.filter(q => q.isCompleted).length} / {sideQuests.length}
              </span>
            </h3>
            <p className="text-xs text-[#777777] font-semibold mt-0.5">
              Completing each feat awards +1 Skill Level directly to its attribute branch at month&apos;s end!
            </p>
          </div>

          {/* Action Buttons: Add Feat & Pull from Skill Key Ideas */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#FFF5D6] border-2 border-[#FFC800] border-b-4 text-[#A17200] font-black text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#ffefc2] active:translate-y-0.5 cursor-pointer"
            >
              <Download size={15} />
              <span>Pull from My Skill Key Ideas</span>
            </button>

            <ChunkyButton
              variant="green"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus size={16} />
              <span>New Side Quest</span>
            </ChunkyButton>
          </div>
        </div>

        {/* Side Quest Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sideQuests.map(quest => {
            const branch = branches[quest.branchId];

            return (
              <div
                key={quest.id}
                className={`group p-5 rounded-3xl border-2 transition-all flex flex-col justify-between gap-4 ${
                  quest.isCompleted
                    ? 'bg-white border-[#58CC02] border-b-4 shadow-sm'
                    : 'bg-white border-[#E5E5E5] border-b-4 hover:border-gray-300'
                }`}
              >
                <div className="space-y-2.5">
                  {/* Top Branch Tag */}
                  <div className="flex items-center justify-between">
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black uppercase text-white shadow-xs"
                      style={{ backgroundColor: branch.colorHex }}
                    >
                      <BranchIcon branchId={quest.branchId} size={13} />
                      <span>+1 {branch.name} Level</span>
                    </span>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete feat "${quest.title}"?`)) {
                          deleteQuest(quest.id);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-red-500 rounded-lg transition-opacity cursor-pointer"
                      title="Delete Feat"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Title */}
                  <p className={`font-black text-base leading-snug break-words ${
                    quest.isCompleted ? 'text-gray-400 line-through' : 'text-[#3C3C3C]'
                  }`}>
                    {quest.title}
                  </p>
                </div>

                {/* Bottom Toggle */}
                <button
                  onClick={() => toggleQuestCompletion(quest.id)}
                  className={`w-full py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-b-4 transition-all cursor-pointer select-none active:translate-y-0.5 ${
                    quest.isCompleted
                      ? 'bg-[#58CC02] border-[#46A302] text-white'
                      : 'bg-[#F7F7F7] border-[#E5E5E5] text-[#777777] hover:bg-gray-100 hover:text-[#3C3C3C]'
                  }`}
                >
                  <Check
                    size={16}
                    strokeWidth={3}
                    className={quest.isCompleted ? 'text-white' : 'text-gray-400'}
                  />
                  <span>{quest.isCompleted ? 'Feat Completed!' : 'Mark Completed (+1 Lvl)'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Loot Claimed Trophy Shelf (Bottom Carousel) */}
      <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-4 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF5D6] border-2 border-[#FFC800] border-b-4 flex items-center justify-center text-[#E5A400]">
              <Trophy size={20} />
            </div>
            <div>
              <h3 className="font-black text-lg text-[#3C3C3C]">
                Loot Claimed Trophy Shelf
              </h3>
              <p className="text-xs text-[#777777] font-semibold">
                Rewards you unlocked and gifted yourself this season (0 points, pure joy & celebration!)
              </p>
            </div>
          </div>

          <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-[#EBF9DC] text-[#347A01] border border-[#58CC02]">
            {claimedLoot.length} Trophies Enjoyed
          </span>
        </div>

        {claimedLoot.length === 0 ? (
          <div className="p-8 text-center bg-[#F7F7F7] rounded-2xl border-2 border-dashed border-[#E5E5E5]">
            <p className="font-extrabold text-sm text-[#777777]">
              No loot claimed yet! Keep hitting your Keystone streaks and Skill Tree nodes to open chests!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {claimedLoot.map(item => {
              const rarityColors = {
                common: { bg: 'bg-[#F5F2EB]', border: 'border-[#C2B7A3]', text: 'text-[#695F4D]', badge: '🪵 Common' },
                rare: { bg: 'bg-[#DDF4FF]', border: 'border-[#84D8FF]', text: 'text-[#1CB0F6]', badge: '💎 Rare' },
                epic: { bg: 'bg-[#F3E5FF]', border: 'border-[#CE82FF]', text: 'text-[#A560E8]', badge: '🔮 Epic' },
                legendary: { bg: 'bg-[#FFF5D6]', border: 'border-[#FFC800]', text: 'text-[#A17200]', badge: '👑 Legendary' }
              }[item.rarity];

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border-2 border-b-4 ${rarityColors.bg} ${rarityColors.border} flex flex-col justify-between gap-3 shadow-xs`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-white/80 border ${rarityColors.text}`}>
                        {rarityColors.badge}
                      </span>
                      <span className="text-[10px] font-bold text-gray-500">
                        {item.claimedDate}
                      </span>
                    </div>

                    <h4 className="font-black text-sm text-[#3C3C3C] leading-snug">
                      &ldquo;{item.rewardTitle}&rdquo;
                    </h4>
                  </div>

                  <div className="text-[10px] font-extrabold text-gray-500 bg-white/60 p-2 rounded-xl">
                    Triggered by: {item.triggerReason}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      </>
      )}

      {/* Modal: Pull from Skill Key Ideas */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border-2 border-b-6 border-[#E5E5E5] p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto animate-pop">
            <div className="flex items-center justify-between border-b-2 border-gray-100 pb-3">
              <div>
                <h3 className="font-black text-lg text-[#3C3C3C] flex items-center gap-2">
                  <Download size={20} className="text-[#FFC800]" />
                  <span>Import Feat Idea from Skill Key</span>
                </h3>
                <p className="text-xs text-[#777777] font-semibold mt-0.5">
                  Ideas you brainstormed under your 5 attribute branches. Click one to turn it into an active monthly Side Quest!
                </p>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="w-8 h-8 rounded-full border-2 border-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center font-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {(['body', 'mind', 'craft', 'bonds', 'empire'] as BranchId[]).map(bId => {
                const branch = branches[bId];
                const ideas = branch.featIdeasScratchpad;

                return (
                  <div key={bId} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: branch.colorHex }}
                      />
                      <h4 className="font-black text-sm capitalize text-[#3C3C3C]">
                        {branch.name} Ideas ({ideas.length})
                      </h4>
                    </div>

                    {ideas.length === 0 ? (
                      <p className="text-xs text-gray-400 italic pl-5">
                        No ideas jotted down yet under {branch.name}.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-5">
                        {ideas.map((idea, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-[#F7F7F7] rounded-xl border-2 border-[#E5E5E5] flex items-center justify-between gap-2 hover:bg-[#FFF9E6] transition-colors"
                          >
                            <span className="text-xs font-bold text-[#3C3C3C] leading-snug">
                              {idea}
                            </span>
                            <button
                              onClick={() => {
                                importFeatFromScratchpad(bId, idea);
                                setIsImportModalOpen(false);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-[#58CC02] border border-[#46A302] text-white text-[10px] font-black uppercase shrink-0 cursor-pointer active:translate-y-0.5"
                            >
                              + Pull
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Side Quest */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border-2 border-b-6 border-[#E5E5E5] p-6 max-w-md w-full shadow-2xl space-y-4 animate-pop">
            <div className="flex items-center justify-between border-b-2 border-gray-100 pb-3">
              <h3 className="font-black text-lg text-[#3C3C3C]">
                Add Monthly Side Quest
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full border-2 border-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center font-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSideQuest} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-[#777777] mb-1">
                  Quest / Feat Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Read 10 chapters of Dungeon Crawler Carl"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 font-extrabold text-sm text-[#3C3C3C] focus:border-[#1CB0F6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#777777] mb-1">
                  Attribute Branch (+1 Level on completion)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['body', 'mind', 'craft', 'bonds', 'empire'] as BranchId[]).map(bId => {
                    const branch = branches[bId];
                    const selected = newBranch === bId;
                    return (
                      <button
                        type="button"
                        key={bId}
                        onClick={() => setNewBranch(bId)}
                        className={`p-2.5 rounded-xl border-2 text-xs font-black capitalize flex items-center gap-1.5 cursor-pointer transition-all ${
                          selected
                            ? 'text-white border-transparent border-b-4 shadow-sm'
                            : 'bg-white border-gray-200 text-[#777777] hover:bg-gray-50'
                        }`}
                        style={{
                          backgroundColor: selected ? branch.colorHex : undefined,
                          borderColor: selected ? branch.borderHex : undefined
                        }}
                      >
                        <BranchIcon branchId={bId} size={14} />
                        <span>{branch.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <ChunkyButton
                  type="button"
                  variant="white"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </ChunkyButton>
                <ChunkyButton type="submit" variant="green" size="sm">
                  Add Feat
                </ChunkyButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Monthly Main Quest */}
      {isEditMainModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border-2 border-b-6 border-[#E5E5E5] p-6 max-w-lg w-full shadow-2xl space-y-4 animate-pop">
            <div className="flex items-center justify-between border-b-2 border-gray-100 pb-3">
              <h3 className="font-black text-lg text-[#3C3C3C] flex items-center gap-2">
                <Crown size={20} className="text-[#FFC800]" />
                <span>Set Monthly Main Quest</span>
              </h3>
              <button
                onClick={() => setIsEditMainModalOpen(false)}
                className="w-8 h-8 rounded-full border-2 border-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center font-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMainQuest} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-[#777777] mb-1">
                  Main Quest Title
                </label>
                <input
                  type="text"
                  required
                  value={mainTitle}
                  onChange={e => setMainTitle(e.target.value)}
                  placeholder="e.g. Complete 100km Seasonal Trail Run Challenge"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 font-extrabold text-sm text-[#3C3C3C] focus:border-[#FFC800] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#777777] mb-1">
                  Difficulty Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-2 p-3 bg-[#F7F7F7] rounded-xl border-2 border-gray-200">
                  {[1, 2, 3, 4, 5].map(starNum => (
                    <button
                      type="button"
                      key={starNum}
                      onClick={() => setMainStars(starNum as 1 | 2 | 3 | 4 | 5)}
                      className="cursor-pointer hover:scale-110 transition-transform"
                    >
                      <Star
                        size={24}
                        className={
                          starNum <= mainStars
                            ? 'text-[#E5A400] fill-[#FFC800]'
                            : 'text-gray-300'
                        }
                      />
                    </button>
                  ))}
                  <span className="text-xs font-black text-[#A17200] ml-2">
                    {getDifficultyLabel(mainStars)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#777777] mb-1">
                  Dedicated Main Quest Prize / Reward
                </label>
                <input
                  type="text"
                  value={mainReward}
                  onChange={e => setMainReward(e.target.value)}
                  placeholder="e.g. Ultra lightweight hydration vest & trail shoes"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 font-extrabold text-sm text-[#3C3C3C] focus:border-[#FFC800] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#777777] mb-1">
                  Attributed Branch (+1 Level)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['body', 'mind', 'craft', 'bonds', 'empire'] as BranchId[]).map(bId => {
                    const branch = branches[bId];
                    const selected = mainBranch === bId;
                    return (
                      <button
                        type="button"
                        key={bId}
                        onClick={() => setMainBranch(bId)}
                        className={`p-2.5 rounded-xl border-2 text-xs font-black capitalize flex items-center gap-1.5 cursor-pointer transition-all ${
                          selected
                            ? 'text-white border-transparent border-b-4 shadow-sm'
                            : 'bg-white border-gray-200 text-[#777777] hover:bg-gray-50'
                        }`}
                        style={{
                          backgroundColor: selected ? branch.colorHex : undefined,
                          borderColor: selected ? branch.borderHex : undefined
                        }}
                      >
                        <BranchIcon branchId={bId} size={14} />
                        <span>{branch.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <ChunkyButton
                  type="button"
                  variant="white"
                  size="sm"
                  onClick={() => setIsEditMainModalOpen(false)}
                >
                  Cancel
                </ChunkyButton>
                <ChunkyButton type="submit" variant="yellow" size="sm">
                  Save Main Quest
                </ChunkyButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

