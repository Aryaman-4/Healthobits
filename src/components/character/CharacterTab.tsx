import React, { useState } from 'react';
import {
  Shield,
  Star,
  Sparkles,
  Plus,
  Trash2,
  Check,
  Zap,
  Skull,
  Lightbulb,
  Edit3
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BranchId } from '../../types';
import { BranchIcon } from '../common/BranchIcon';
import { ChunkyButton } from '../common/ChunkyButton';

const CLASS_PRESETS = [
  'Cloud-Native Polymath',
  'Full-Stack Paladin',
  'Level 9 Tea Alchemist',
  'Chaos Wizard of Midnight Coffee',
  'Flute & Fineliner Sorcerer',
  'Novice Dungeon Cartographer',
  'Habit Beastmaster'
];

const AVATAR_OPTIONS = [
  { id: 'knight', emoji: '🛡️', label: 'Knight' },
  { id: 'wizard', emoji: '🧙', label: 'Wizard' },
  { id: 'ruler', emoji: '👑', label: 'Ruler' },
  { id: 'paladin', emoji: '⚔️', label: 'Paladin' },
  { id: 'ranger', emoji: '🏹', label: 'Ranger' },
  { id: 'scholar', emoji: '📚', label: 'Scholar' }
];

const COLOR_OPTIONS = [
  '#58CC02',
  '#1CB0F6',
  '#FF4B4B',
  '#FFC800',
  '#CE82FF',
  '#3C3C3C'
];

export const CharacterTab: React.FC = () => {
  const {
    state,
    overallLevel,
    branchLevels,
    seasonalGains,
    updateCharacter,
    addScratchpadIdea,
    deleteScratchpadIdea,
    addBuffDebuff,
    deleteBuffDebuff
  } = useGame();

  const { character, branches, habits, buffsDebuffs } = state;

  // Editing state for Character Name & Class
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(character.name);
  const [classInput, setClassInput] = useState(character.classTitle);

  // Scratchpad inputs per branch
  const [scratchpadInputs, setScratchpadInputs] = useState<Record<BranchId, string>>({
    body: '',
    mind: '',
    craft: '',
    bonds: '',
    empire: ''
  });

  // Buff / Debuff Inputs
  const [newBuffText, setNewBuffText] = useState('');
  const [newDebuffText, setNewDebuffText] = useState('');

  const handleSaveProfile = () => {
    updateCharacter({
      name: nameInput.trim() || 'Adventurer',
      classTitle: classInput.trim() || 'Recovering Couch Potato'
    });
    setIsEditingName(false);
  };

  const handleAddScratchpad = (bId: BranchId) => {
    const text = scratchpadInputs[bId]?.trim();
    if (!text) return;
    addScratchpadIdea(bId, text);
    setScratchpadInputs(prev => ({ ...prev, [bId]: '' }));
  };

  const handleAddBuff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBuffText.trim()) return;
    addBuffDebuff({
      type: 'buff',
      description: newBuffText.trim()
    });
    setNewBuffText('');
  };

  const handleAddDebuff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDebuffText.trim()) return;
    addBuffDebuff({
      type: 'debuff',
      description: newDebuffText.trim()
    });
    setNewDebuffText('');
  };

  const buffs = buffsDebuffs.filter(b => b.type === 'buff');
  const debuffs = buffsDebuffs.filter(b => b.type === 'debuff');

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* 1. Character Identity Card */}
      <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-6 p-4 sm:p-8 shadow-sm space-y-4 sm:space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          {/* Avatar & Title */}
          <div className="flex items-center gap-3.5 sm:gap-5 min-w-0">
            <div className="relative group shrink-0">
              <div
                className="w-16 h-16 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center text-2xl sm:text-4xl text-white font-black border-4 border-b-8 shadow-md"
                style={{ backgroundColor: character.avatarBg, borderColor: '#22222233' }}
              >
                {AVATAR_OPTIONS.find(a => a.id === character.avatarSeed)?.emoji || '🛡️'}
              </div>

              {/* Avatar Selector Mini Popover */}
              <div className="mt-2 flex items-center gap-1 sm:gap-1.5 flex-wrap">
                {AVATAR_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => updateCharacter({ avatarSeed: opt.id })}
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg text-xs sm:text-sm flex items-center justify-center cursor-pointer transition-transform hover:scale-110 ${character.avatarSeed === opt.id ? 'bg-[#DDF4FF] border border-[#1CB0F6]' : 'bg-gray-100'
                      }`}
                    title={opt.label}
                  >
                    {opt.emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1 min-w-0 flex-1">
              {isEditingName ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border-2 border-gray-300 font-black text-base sm:text-lg text-[#3C3C3C] focus:border-[#1CB0F6] focus:outline-none"
                    placeholder="Hero Name"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={classInput}
                      onChange={e => setClassInput(e.target.value)}
                      className="flex-1 px-3 py-1 rounded-lg border-2 border-gray-300 text-xs font-bold text-[#777777] focus:border-[#1CB0F6] focus:outline-none"
                      placeholder="Class Title"
                    />
                    <button
                      onClick={handleSaveProfile}
                      className="px-3 py-1 rounded-lg bg-[#58CC02] text-white font-black text-xs uppercase cursor-pointer shrink-0"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <h2 className="font-black text-xl sm:text-3xl text-[#3C3C3C] truncate">
                      {character.name}
                    </h2>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="p-1.5 text-gray-400 hover:text-[#1CB0F6] rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Edit Profile"
                    >
                      <Edit3 size={15} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#777777] truncate">
                    <Sparkles size={14} className="text-[#FFC800] shrink-0" />
                    <span className="truncate">{character.classTitle}</span>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#DDF4FF] text-[#1CB0F6] border border-[#84D8FF]">
                      S{character.seasonNumber}: {character.seasonName}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#EBF9DC] text-[#347A01] border border-[#58CC02]">
                      Mo {character.currentMonthIndex} Active
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Giant Overall Level Shield */}
          <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-5 rounded-3xl bg-gradient-to-br from-[#FFF9E6] to-[#FFF0B8] border-2 border-[#FFC800] border-b-6 shadow-sm w-full md:w-auto">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[#FFC800] border-2 border-[#E5A400] flex items-center justify-center text-white shadow-inner shrink-0">
              <Star size={26} className="fill-white sm:w-8 sm:h-8" />
            </div>
            <div>
              <div className="text-[10px] sm:text-[11px] font-black uppercase text-[#A17200] tracking-wider">
                Overall Level
              </div>
              <div className="text-2xl sm:text-4xl font-black text-[#3C3C3C] leading-none mt-0.5">
                LVL {overallLevel}
              </div>
              <div className="text-[9px] sm:text-[10px] text-[#777777] font-bold mt-1">
                Sum of 5 Attributes
              </div>
            </div>
          </div>
        </div>

        {/* Fun Class Presets Pill Cloud */}
        <div className="p-3 bg-[#F7F7F7] rounded-2xl border-2 border-[#E5E5E5] space-y-2">
          <div className="text-xs font-black uppercase text-[#777777]">
            Switch Playful RPG Class:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CLASS_PRESETS.map(preset => (
              <button
                key={preset}
                onClick={() => updateCharacter({ classTitle: preset })}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold cursor-pointer border transition-all active:translate-y-0.5 ${character.classTitle === preset
                    ? 'bg-[#1CB0F6] text-white border-[#1899D6] shadow-xs'
                    : 'bg-white text-[#777777] border-gray-200 hover:border-gray-400'
                  }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* 5 Attribute Stat Pills (Base Level + Seasonal Gain) */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-[#777777] mb-3">
            5 Core RPG Attributes (Base Level + Seasonal Gain)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {(['body', 'mind', 'craft', 'bonds', 'empire'] as BranchId[]).map(bId => {
              const branch = branches[bId];
              const currentLvl = branchLevels[bId];
              const gain = seasonalGains[bId];

              return (
                <div
                  key={bId}
                  className="p-3.5 bg-white rounded-2xl border-2 border-b-4 flex flex-col items-center text-center shadow-xs"
                  style={{ borderColor: branch.colorHex }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white mb-2 shadow-xs"
                    style={{ backgroundColor: branch.colorHex }}
                  >
                    <BranchIcon branchId={bId} size={18} />
                  </div>
                  <span className="font-black text-xs uppercase text-[#3C3C3C]">
                    {branch.name}
                  </span>
                  <div className="text-2xl font-black text-[#3C3C3C] leading-tight mt-1">
                    Lvl {currentLvl}
                  </div>
                  <div className="text-[11px] font-bold text-[#58CC02] mt-0.5">
                    {branch.seasonStartLevel} + {gain} this season
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Interactive Skill Key & Feat Brainstorming Drawer */}
      <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-4 p-6 space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb size={22} className="text-[#FFC800]" />
            <h3 className="font-black text-xl text-[#3C3C3C]">
              Skill Key & Feat Idea Scratchpad
            </h3>
          </div>
          <p className="text-xs text-[#777777] font-semibold mt-0.5">
            The 90-day seasonal core: review your assigned daily habits and brainstorm stretch quest ideas anytime.
          </p>
        </div>

        <div className="space-y-6">
          {(['body', 'mind', 'craft', 'bonds', 'empire'] as BranchId[]).map(bId => {
            const branch = branches[bId];
            const branchHabits = habits.filter(h => h.branchId === bId);
            const ideas = branch.featIdeasScratchpad;

            return (
              <div
                key={bId}
                className="p-5 rounded-2xl border-2 border-b-4 bg-[#FDFDFD] space-y-4"
                style={{ borderColor: branch.colorHex }}
              >
                {/* Branch Header */}
                <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: branch.tintHex }}>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shadow-xs"
                      style={{ backgroundColor: branch.colorHex }}
                    >
                      <BranchIcon branchId={bId} size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-base text-[#3C3C3C] capitalize">
                        {branch.name} Branch
                      </h4>
                      <p className="text-xs text-[#777777] font-semibold">
                        Base Level {branch.seasonStartLevel} • {branchHabits.length} Assigned Habits
                      </p>
                    </div>
                  </div>

                  <span
                    className="text-xs font-black uppercase px-3 py-1 rounded-full text-white shadow-xs"
                    style={{ backgroundColor: branch.colorHex }}
                  >
                    Level {branchLevels[bId]}
                  </span>
                </div>

                {/* Assigned Habits */}
                <div>
                  <span className="text-[11px] font-black uppercase text-[#777777] block mb-1.5">
                    Assigned Daily Habits:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {branchHabits.map(h => (
                      <span
                        key={h.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border-2 border-[#E5E5E5] text-xs font-bold text-[#3C3C3C]"
                      >
                        {h.isKeystone && <span className="text-[#FFC800]">★</span>}
                        <span>{h.title}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Feat Ideas Scratchpad */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-[#A17200] flex items-center gap-1">
                      <Sparkles size={13} className="text-[#FFC800]" />
                      <span>Brainstormed Feat Ideas ({ideas.length})</span>
                    </span>
                    <span className="text-[10px] text-[#777777] font-semibold">
                      Importable into Quests tab
                    </span>
                  </div>

                  {/* Idea pills */}
                  <div className="flex flex-wrap gap-2">
                    {ideas.map((idea, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FFF9E6] border border-[#FFC800] text-xs font-extrabold text-[#3C3C3C]"
                      >
                        <span>{idea}</span>
                        <button
                          onClick={() => deleteScratchpadIdea(bId, idx)}
                          className="text-gray-400 hover:text-red-500 font-bold cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Idea Input */}
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      value={scratchpadInputs[bId] || ''}
                      onChange={e =>
                        setScratchpadInputs(prev => ({ ...prev, [bId]: e.target.value }))
                      }
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          handleAddScratchpad(bId);
                        }
                      }}
                      placeholder={`Jot down a future ${branch.name} stretch goal idea...`}
                      className="flex-1 px-3 py-2 rounded-xl border-2 border-gray-200 text-xs font-semibold focus:border-[#1CB0F6] focus:outline-none"
                    />
                    <button
                      onClick={() => handleAddScratchpad(bId)}
                      className="px-3.5 py-2 rounded-xl bg-[#1CB0F6] border-2 border-[#1899D6] text-white text-xs font-black uppercase cursor-pointer active:translate-y-0.5"
                    >
                      + Jot
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Buffs & Debuffs Awareness Cards (Side-by-Side) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Buffs (Green Card) */}
        <div className="p-6 rounded-3xl border-2 border-b-6 border-[#58CC02] bg-[#F7FDF3] space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b-2 border-[#D7FFB8] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#58CC02] border-2 border-[#46A302] flex items-center justify-center text-white">
                <Zap size={22} className="fill-white" />
              </div>
              <div>
                <h3 className="font-black text-lg text-[#265B00]">Active Buffs</h3>
                <p className="text-xs text-[#46A302] font-semibold">
                  Friction-removers that make habits effortless
                </p>
              </div>
            </div>
            <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-[#58CC02] text-white">
              {buffs.length} Active
            </span>
          </div>

          {/* Buff List */}
          <div className="space-y-2">
            {buffs.map(buff => (
              <div
                key={buff.id}
                className="group p-3 bg-white rounded-2xl border-2 border-[#D7FFB8] flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#58CC02] font-black text-sm">✦</span>
                  <p className="font-bold text-xs sm:text-sm text-[#3C3C3C] leading-snug">
                    {buff.description}
                  </p>
                </div>
                <button
                  onClick={() => deleteBuffDebuff(buff.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 rounded-lg transition-opacity cursor-pointer shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          {/* Add Buff Form */}
          <form onSubmit={handleAddBuff} className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={newBuffText}
              onChange={e => setNewBuffText(e.target.value)}
              placeholder="e.g. Leave workout clothes out at night"
              className="flex-1 px-3.5 py-2 rounded-xl border-2 border-gray-200 text-xs font-semibold focus:border-[#58CC02] focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#58CC02] border-2 border-[#46A302] text-white text-xs font-black uppercase cursor-pointer active:translate-y-0.5"
            >
              + Buff
            </button>
          </form>
        </div>

        {/* Active Debuffs (Coral Card) */}
        <div className="p-6 rounded-3xl border-2 border-b-6 border-[#FF4B4B] bg-[#FFF5F5] space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b-2 border-[#FFDFE0] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#FF4B4B] border-2 border-[#EA2B2B] flex items-center justify-center text-white">
                <Skull size={22} className="fill-white" />
              </div>
              <div>
                <h3 className="font-black text-lg text-[#A61C1C]">Active Debuffs</h3>
                <p className="text-xs text-[#EA2B2B] font-semibold">
                  Saboteurs & friction points to watch out for
                </p>
              </div>
            </div>
            <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-[#FF4B4B] text-white">
              {debuffs.length} Alert
            </span>
          </div>

          {/* Debuff List */}
          <div className="space-y-2">
            {debuffs.map(debuff => (
              <div
                key={debuff.id}
                className="group p-3 bg-white rounded-2xl border-2 border-[#FFDFE0] flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#FF4B4B] font-black text-sm">⚠</span>
                  <p className="font-bold text-xs sm:text-sm text-[#3C3C3C] leading-snug">
                    {debuff.description}
                  </p>
                </div>
                <button
                  onClick={() => deleteBuffDebuff(debuff.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 rounded-lg transition-opacity cursor-pointer shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          {/* Add Debuff Form */}
          <form onSubmit={handleAddDebuff} className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={newDebuffText}
              onChange={e => setNewDebuffText(e.target.value)}
              placeholder="e.g. Phone in bed past 11 PM"
              className="flex-1 px-3.5 py-2 rounded-xl border-2 border-gray-200 text-xs font-semibold focus:border-[#FF4B4B] focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#FF4B4B] border-2 border-[#EA2B2B] text-white text-xs font-black uppercase cursor-pointer active:translate-y-0.5"
            >
              + Debuff
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

