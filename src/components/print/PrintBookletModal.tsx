import React, { useState } from 'react';
import { Printer, X, FileText, Check, Scissors, Layers, Sliders } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { ChunkyButton } from '../common/ChunkyButton';
import { BranchId } from '../../types';
import { getDaysInMonth } from '../../utils/gameMath';

interface PrintBookletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PaperSize = 'letter' | 'a5' | 'fieldnotes';
type LayoutMode = 'frenchfold' | 'bifold' | 'singlesheet';

export const PrintBookletModal: React.FC<PrintBookletModalProps> = ({ isOpen, onClose }) => {
  const { state, overallLevel } = useGame();
  const { character, branches, habits, monthlyQuests, lootPool, buffsDebuffs } = state;

  const [paperSize, setPaperSize] = useState<PaperSize>('letter');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('frenchfold');

  if (!isOpen) return null;

  const totalDays = getDaysInMonth(character.currentYearMonth);
  const keystoneHabits = habits.filter(h => h.isKeystone);
  const mainQuest = monthlyQuests.find(q => q.isMainQuest);

  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 print:p-0 print:bg-white print:static">
      {/* Outer Modal Container (hidden during actual window.print, except the printable content) */}
      <div className="bg-white rounded-3xl border-2 border-b-8 border-[#1CB0F6] max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden print:border-none print:shadow-none print:max-w-none print:max-h-none print:w-full">
        {/* Modal Header (hidden during print) */}
        <div className="p-4 sm:p-6 border-b-2 border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#DDF4FF] border-2 border-[#1CB0F6] flex items-center justify-center text-[#1CB0F6]">
              <Printer size={24} />
            </div>
            <div>
              <h3 className="font-black text-xl text-[#3C3C3C]">
                Printable Pocket Notebook Insert Generator
              </h3>
              <p className="text-xs text-[#777777] font-semibold">
                Generate tactile paper inserts for your real-life bullet journal or pocket notebook.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ChunkyButton variant="blue" size="md" onClick={handleTriggerPrint}>
              <Printer size={18} />
              <span>Print Now</span>
            </ChunkyButton>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-2xl border-2 border-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center font-black cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Controls Bar: Size & Layout Selectors (hidden during print) */}
        <div className="p-4 bg-[#F7F7F7] border-b-2 border-gray-200 flex flex-wrap items-center justify-between gap-4 print:hidden">
          {/* Layout Mode */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-[#777777] flex items-center gap-1">
              <Layers size={14} />
              <span>Layout:</span>
            </span>
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200">
              <button
                onClick={() => setLayoutMode('frenchfold')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-colors ${
                  layoutMode === 'frenchfold'
                    ? 'bg-[#1CB0F6] text-white'
                    : 'text-[#777777] hover:text-[#3C3C3C]'
                }`}
              >
                ✂ 8-Page French Fold Zine
              </button>
              <button
                onClick={() => setLayoutMode('bifold')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-colors ${
                  layoutMode === 'bifold'
                    ? 'bg-[#1CB0F6] text-white'
                    : 'text-[#777777] hover:text-[#3C3C3C]'
                }`}
              >
                📖 Bifold Booklet
              </button>
              <button
                onClick={() => setLayoutMode('singlesheet')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-colors ${
                  layoutMode === 'singlesheet'
                    ? 'bg-[#1CB0F6] text-white'
                    : 'text-[#777777] hover:text-[#3C3C3C]'
                }`}
              >
                📄 Single Sheet
              </button>
            </div>
          </div>

          {/* Paper Size */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-[#777777] flex items-center gap-1">
              <Sliders size={14} />
              <span>Paper Size:</span>
            </span>
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200">
              <button
                onClick={() => setPaperSize('letter')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer ${
                  paperSize === 'letter' ? 'bg-[#3C3C3C] text-white' : 'text-[#777777]'
                }`}
              >
                Letter / A4
              </button>
              <button
                onClick={() => setPaperSize('a5')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer ${
                  paperSize === 'a5' ? 'bg-[#3C3C3C] text-white' : 'text-[#777777]'
                }`}
              >
                A5 BuJo
              </button>
              <button
                onClick={() => setPaperSize('fieldnotes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer ${
                  paperSize === 'fieldnotes' ? 'bg-[#3C3C3C] text-white' : 'text-[#777777]'
                }`}
              >
                Field Notes (3.5&quot; x 5.5&quot;)
              </button>
            </div>
          </div>

          {layoutMode === 'frenchfold' && (
            <div className="text-[11px] font-bold text-[#A17200] bg-[#FFF9E6] px-3 py-1 rounded-lg border border-[#FFC800] flex items-center gap-1">
              <Scissors size={13} />
              <span>Prints on 1 side! Fold in half twice, slit center crease with knife, fold into mini zine.</span>
            </div>
          )}
        </div>

        {/* Scrollable Printable Document Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(92vh-180px)] print:overflow-visible print:max-h-none print:p-0">
          {/* Printable Sheet Viewport */}
          <div className="bg-white border-2 border-dashed border-gray-300 p-6 rounded-2xl print:border-none print:p-0 max-w-4xl mx-auto space-y-8 font-sans text-black">
            {/* FRENCH FOLD ZINE 8-PANEL GRID */}
            {layoutMode === 'frenchfold' ? (
              <div className="space-y-4">
                <div className="text-center border-b pb-2 print:hidden text-xs text-gray-500 font-bold">
                  8-Page French Fold Zine Layout (Fold horizontally along center, slit center cut guide, fold accordion)
                </div>

                {/* 2 Rows x 4 Columns = 8 Mini Pages */}
                <div className="grid grid-cols-4 grid-rows-2 gap-2 border-2 border-black min-h-[550px] relative p-2 bg-white">
                  {/* Dashed Center Cut Guide */}
                  <div className="absolute top-1/2 left-1/4 right-1/4 -translate-y-1/2 border-t-2 border-dashed border-red-500 z-10 flex items-center justify-center">
                    <span className="bg-white px-2 text-[9px] font-black text-red-500 uppercase tracking-widest print:text-black">
                      ✂ SLIT HERE ONLY
                    </span>
                  </div>

                  {/* Panel 1: Cover (Rotated if standard french fold, or right-side up for easy reading) */}
                  <div className="p-3 border border-black/30 flex flex-col justify-between text-center bg-gray-50/50">
                    <div>
                      <div className="text-[9px] font-black uppercase text-gray-400">Page 1 • Cover</div>
                      <h4 className="font-black text-sm tracking-tight mt-2 text-black">QUESTLING</h4>
                      <p className="text-[9px] font-bold text-gray-600">Season {character.seasonNumber} Companion</p>
                    </div>
                    <div className="my-2 p-2 border border-black rounded-lg">
                      <div className="font-black text-xs">{character.name}</div>
                      <div className="text-[9px] italic text-gray-600">{character.classTitle}</div>
                      <div className="text-[10px] font-black mt-1">LVL {overallLevel}</div>
                    </div>
                    <div className="text-[8px] text-gray-500">Duolingo Seasonal RPG</div>
                  </div>

                  {/* Panel 2: Keystone Habits */}
                  <div className="p-3 border border-black/30 flex flex-col justify-between">
                    <div>
                      <div className="text-[9px] font-black uppercase text-gray-400">Page 2 • ★ Keystones</div>
                      <div className="space-y-1.5 mt-2">
                        {keystoneHabits.slice(0, 5).map(h => (
                          <div key={h.id} className="text-[9px] font-bold leading-tight flex items-start gap-1">
                            <span>★</span>
                            <span className="truncate">{h.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-[8px] text-gray-500 italic">7-day streak = Common Loot</div>
                  </div>

                  {/* Panel 3: Spread 1 (Days 1–15) */}
                  <div className="p-2 border border-black/30 flex flex-col justify-between">
                    <div className="text-[9px] font-black uppercase text-gray-400">Page 3 • Days 1–15</div>
                    <div className="grid grid-cols-5 gap-1 my-1">
                      {Array.from({ length: 15 }, (_, i) => (
                        <div key={i} className="h-4 border border-black/30 rounded flex items-center justify-center text-[8px] font-bold">
                          {i + 1}
                        </div>
                      ))}
                    </div>
                    <div className="text-[8px] text-gray-500">1 pt/branch/day</div>
                  </div>

                  {/* Panel 4: Spread 2 (Days 16–31) */}
                  <div className="p-2 border border-black/30 flex flex-col justify-between">
                    <div className="text-[9px] font-black uppercase text-gray-400">Page 4 • Days 16–{totalDays}</div>
                    <div className="grid grid-cols-5 gap-1 my-1">
                      {Array.from({ length: totalDays - 15 }, (_, i) => (
                        <div key={i} className="h-4 border border-black/30 rounded flex items-center justify-center text-[8px] font-bold">
                          {i + 16}
                        </div>
                      ))}
                    </div>
                    <div className="text-[8px] text-gray-500">Month End Level-Up</div>
                  </div>

                  {/* Panel 5: 80-Point Skill Tree Path */}
                  <div className="p-2 border border-black/30 flex flex-col justify-between">
                    <div className="text-[9px] font-black uppercase text-gray-400">Page 5 • Skill Tree</div>
                    <div className="flex items-center justify-around my-1">
                      {[5, 15, 30, 50, 80].map(n => (
                        <div key={n} className="w-5 h-5 rounded-full border border-black flex items-center justify-center text-[8px] font-black">
                          {n}
                        </div>
                      ))}
                    </div>
                    <div className="text-[8px] text-gray-500">Milestones: Rare Loot</div>
                  </div>

                  {/* Panel 6: Monthly Main Quest */}
                  <div className="p-3 border border-black/30 flex flex-col justify-between">
                    <div>
                      <div className="text-[9px] font-black uppercase text-gray-400">Page 6 • Main Quest</div>
                      <div className="font-black text-[10px] mt-1 leading-snug">
                        {mainQuest?.title || 'Seasonal Stretch Feat'}
                      </div>
                      <div className="text-[9px] text-gray-600 mt-1">
                        Prize: {mainQuest?.customReward || 'Self-Gift Prize'}
                      </div>
                    </div>
                    <div className="text-[8px] text-gray-500">⭐⭐⭐⭐⭐ Super Stretch</div>
                  </div>

                  {/* Panel 7: Loot Chest Table */}
                  <div className="p-2 border border-black/30 flex flex-col justify-between">
                    <div className="text-[9px] font-black uppercase text-gray-400">Page 7 • Loot Table</div>
                    <div className="text-[8px] space-y-1 mt-1">
                      <div>🪵 <strong>Common:</strong> 7d Keystone</div>
                      <div>💎 <strong>Rare:</strong> Skill Node</div>
                      <div>🔮 <strong>Epic:</strong> Node 80 Branch</div>
                      <div>👑 <strong>Legendary:</strong> All 5 80s</div>
                    </div>
                    <div className="text-[8px] text-gray-500">Gift yourself joy</div>
                  </div>

                  {/* Panel 8: Buffs & Debuffs */}
                  <div className="p-2 border border-black/30 flex flex-col justify-between">
                    <div className="text-[9px] font-black uppercase text-gray-400">Page 8 • Buffs / Debuffs</div>
                    <div className="text-[8px] space-y-1 mt-1">
                      <div>🛡️ Lay clothes night before</div>
                      <div>💀 Phone in bed past 11 PM</div>
                    </div>
                    <div className="text-[8px] text-gray-500 italic">Signed & Sealed</div>
                  </div>
                </div>
              </div>
            ) : (
              /* STANDARD BIFOLD OR SINGLE SHEET PRINT VIEW */
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b-2 border-black pb-3">
                  <div>
                    <h3 className="font-black text-2xl text-black">QUESTLING FIELD JOURNAL</h3>
                    <p className="text-xs font-bold text-gray-600">
                      Season {character.seasonNumber}: {character.seasonName} • Month {character.currentMonthIndex} ({character.currentYearMonth})
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-sm">{character.name} — {character.classTitle}</div>
                    <div className="text-xs font-bold">Total Level: LVL {overallLevel}</div>
                  </div>
                </div>

                {/* Keystone Habits Table */}
                <div>
                  <h4 className="font-black text-sm uppercase tracking-wider mb-2">
                    ★ Keystone Habits (1 Per Branch — 15m Busy Day Win)
                  </h4>
                  <table className="w-full border-collapse border border-black text-xs">
                    <thead>
                      <tr className="bg-gray-100 border-b border-black text-left">
                        <th className="p-1.5 border-r border-black">Branch</th>
                        <th className="p-1.5 border-r border-black">★ Keystone Habit</th>
                        <th className="p-1.5">7-Day Streak Tracker (Common Loot)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(['body', 'mind', 'craft', 'bonds', 'empire'] as BranchId[]).map(bId => {
                        const b = branches[bId];
                        const kh = habits.find(h => h.branchId === bId && h.isKeystone);
                        return (
                          <tr key={bId} className="border-b border-black">
                            <td className="p-1.5 border-r border-black font-black uppercase text-[10px]">{b.name}</td>
                            <td className="p-1.5 border-r border-black font-bold">{kh?.title || 'No keystone set'}</td>
                            <td className="p-1.5">
                              <div className="flex items-center gap-1.5">
                                {[1, 2, 3, 4, 5, 6, 7].map(d => (
                                  <span key={d} className="w-4 h-4 rounded border border-black inline-block text-center text-[9px] leading-3">
                                    {d}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* 80-Point Skill Tree Milestones */}
                <div>
                  <h4 className="font-black text-sm uppercase tracking-wider mb-2">
                    Seasonal 80-Point Skill Tree Path (Nodes: 5, 15, 30, 50, 80)
                  </h4>
                  <div className="grid grid-cols-5 gap-3 border border-black p-3 rounded-lg">
                    {(['body', 'mind', 'craft', 'bonds', 'empire'] as BranchId[]).map(bId => {
                      const b = branches[bId];
                      return (
                        <div key={bId} className="text-center space-y-1">
                          <div className="font-black text-xs uppercase border-b border-black pb-1">{b.name}</div>
                          <div className="flex flex-col items-center gap-1.5 pt-1">
                            {[80, 50, 30, 15, 5].map(n => (
                              <div key={n} className="w-6 h-6 rounded-full border border-black flex items-center justify-center text-[9px] font-black">
                                {n}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quests & Loot */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-black p-3 rounded-lg space-y-1.5">
                    <h5 className="font-black text-xs uppercase">Monthly Main Quest</h5>
                    <p className="text-xs font-bold">{mainQuest?.title || 'None'}</p>
                    <p className="text-[10px] italic">Prize: {mainQuest?.customReward || 'None'}</p>
                  </div>

                  <div className="border border-black p-3 rounded-lg space-y-1.5">
                    <h5 className="font-black text-xs uppercase">4-Tier Loot Table</h5>
                    <div className="text-[10px] space-y-0.5">
                      <div>🪵 Common: {lootPool.filter(l => l.rarity === 'common')[0]?.title || 'Reward'}</div>
                      <div>💎 Rare: {lootPool.filter(l => l.rarity === 'rare')[0]?.title || 'Reward'}</div>
                      <div>🔮 Epic: {lootPool.filter(l => l.rarity === 'epic')[0]?.title || 'Reward'}</div>
                      <div>👑 Legendary: {lootPool.filter(l => l.rarity === 'legendary')[0]?.title || 'Reward'}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

