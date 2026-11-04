import React, { useState } from 'react';
import {
  ShoppingBag,
  IndianRupee,
  Film,
  Download,
  Users,
  MessageCircle,
  Plus,
  Check,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { ChunkyButton } from '../common/ChunkyButton';
import { sound } from '../../utils/audio';

const QUESTION_BANK = [
  'What has been the best part of your week so far?',
  'What is something you’re working on right now that you’re genuinely excited about?',
  'What’s a small problem you’ve been trying to figure out lately?',
  'What is a little win or conversation that made you smile today?',
  'If you had an uninterrupted weekend afternoon with no chores, what would you spend it on?',
  'What’s one thing you’re looking forward to this upcoming month?'
];

export const QuickLootDrawer: React.FC = () => {
  const {
    activeStudioModal,
    setActiveStudioModal,
    state,
    addExpense,
    toggleVlogClip,
    addAnkiCard,
    exportAnkiCsv,
    updateContactSpoken,
    selectedDate
  } = useGame();

  const { quickLoot } = state;

  const [activeTab, setActiveTab] = useState<'expenses' | 'vlog' | 'anki' | 'crm'>('crm');

  // Expense Form State
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');

  // Anki Form State
  const [ankiFront, setAnkiFront] = useState('');
  const [ankiBack, setAnkiBack] = useState('');
  const [ankiCategory, setAnkiCategory] = useState<'quote' | 'sargam' | 'cloud' | 'vocab'>('vocab');

  // Question Carousel Index
  const [questionIndex, setQuestionIndex] = useState(0);

  if (activeStudioModal !== 'quickLoot') return null;

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(expenseAmount);
    if (isNaN(amt) || amt <= 0) return;
    addExpense(amt, expenseCategory);
    setExpenseAmount('');
    setExpenseCategory('');
  };

  const handleCreateAnki = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ankiFront.trim() || !ankiBack.trim()) return;
    addAnkiCard(ankiFront, ankiBack, ankiCategory);
    setAnkiFront('');
    setAnkiBack('');
  };

  const totalWeeklyExpense = quickLoot.expenses.reduce((sum, item) => sum + item.amount, 0);

  // Compute total vlog clips logged this week
  const vlogEntries = Object.values(quickLoot.vlogClips);
  const totalClips = vlogEntries.reduce((count, v) => count + (v.clip1 ? 1 : 0) + (v.clip2 ? 1 : 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4 animate-pop">
      <div className="bg-white rounded-3xl border-2 border-b-8 border-[#FFC800] max-w-3xl w-full p-6 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF5D6] border-2 border-[#FFC800] flex items-center justify-center text-[#A17200]">
              <ShoppingBag size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-xl text-[#3C3C3C]">
                  The Quick-Loot Bag & CRM
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#1CB0F6] text-white">
                  3-Second Quick Capture
                </span>
              </div>
              <p className="text-xs text-[#777777] font-semibold mt-0.5">
                Expenses, 10s Vlog Clips, Anki Export & Meaningful Relationship CRM
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveStudioModal(null)}
            className="w-9 h-9 rounded-full border-2 border-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center font-black cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* 4 Tabs Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => setActiveTab('crm')}
            className={`p-2.5 rounded-2xl text-xs font-black uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'crm'
                ? 'bg-[#D7FFB8] border-2 border-[#58CC02] border-b-4 text-[#46A302]'
                : 'bg-[#F7F7F7] text-[#777777] hover:bg-gray-100'
            }`}
          >
            <Users size={15} />
            <span>Relationship CRM</span>
          </button>

          <button
            onClick={() => setActiveTab('vlog')}
            className={`p-2.5 rounded-2xl text-xs font-black uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'vlog'
                ? 'bg-[#FFF5D6] border-2 border-[#FFC800] border-b-4 text-[#A17200]'
                : 'bg-[#F7F7F7] text-[#777777] hover:bg-gray-100'
            }`}
          >
            <Film size={15} />
            <span>10s Clips ({totalClips}/12)</span>
          </button>

          <button
            onClick={() => setActiveTab('anki')}
            className={`p-2.5 rounded-2xl text-xs font-black uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'anki'
                ? 'bg-[#DDF4FF] border-2 border-[#1CB0F6] border-b-4 text-[#1CB0F6]'
                : 'bg-[#F7F7F7] text-[#777777] hover:bg-gray-100'
            }`}
          >
            <Download size={15} />
            <span>Anki Cards ({quickLoot.ankiCards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            className={`p-2.5 rounded-2xl text-xs font-black uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'expenses'
                ? 'bg-[#F3E5FF] border-2 border-[#CE82FF] border-b-4 text-[#A560E8]'
                : 'bg-[#F7F7F7] text-[#777777] hover:bg-gray-100'
            }`}
          >
            <IndianRupee size={15} />
            <span>Expenses (₹{totalWeeklyExpense})</span>
          </button>
        </div>

        {/* TAB 1: Relationship CRM & Question Bank */}
        {activeTab === 'crm' && (
          <div className="space-y-5">
            {/* Built-in Question Bank Carousel */}
            <div className="p-4 bg-gradient-to-r from-[#F0FDF4] via-[#EBF9DC] to-[#D7FFB8] rounded-2xl border-2 border-[#58CC02] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#46A302] flex items-center gap-1">
                  <Sparkles size={13} />
                  <span>Question Bank (Never default to small talk):</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setQuestionIndex(prev => (prev > 0 ? prev - 1 : QUESTION_BANK.length - 1))}
                    className="w-6 h-6 rounded-lg bg-white/80 flex items-center justify-center text-xs hover:bg-white cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="text-[10px] font-bold text-[#46A302]">
                    {questionIndex + 1}/{QUESTION_BANK.length}
                  </span>
                  <button
                    onClick={() => setQuestionIndex(prev => (prev < QUESTION_BANK.length - 1 ? prev + 1 : 0))}
                    className="w-6 h-6 rounded-lg bg-white/80 flex items-center justify-center text-xs hover:bg-white cursor-pointer"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              <p className="text-sm font-black text-[#265B00] italic leading-snug">
                &ldquo;{QUESTION_BANK[questionIndex]}&rdquo;
              </p>
            </div>

            {/* Contacts by Tier */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-black text-xs uppercase text-[#777777] tracking-wider">
                  Daily Anchors:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {quickLoot.contacts.filter(c => c.tier === 'daily').map(contact => (
                    <div
                      key={contact.id}
                      className="p-3.5 bg-white rounded-2xl border-2 border-[#58CC02] border-b-4 flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h5 className="font-black text-sm text-[#3C3C3C]">{contact.name}</h5>
                          <span className="text-[10px] font-bold text-[#58CC02] bg-[#EBF9DC] px-1.5 py-0.5 rounded">
                            {contact.relationship}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 italic mt-0.5">
                          &ldquo;{contact.notes}&rdquo;
                        </p>
                        <span className="text-[10px] text-gray-400 font-bold block mt-1">
                          Last spoken: {contact.lastSpokenDate}
                        </span>
                      </div>

                      <button
                        onClick={() => updateContactSpoken(contact.id)}
                        className="px-3 py-2 rounded-xl bg-[#58CC02] border border-[#46A302] text-white text-xs font-black uppercase cursor-pointer shrink-0 active:translate-y-0.5"
                      >
                        ✓ Spoke
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-black text-xs uppercase text-[#777777] tracking-wider">
                  Weekly & Monthly Circle:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {quickLoot.contacts.filter(c => c.tier !== 'daily').map(contact => (
                    <div
                      key={contact.id}
                      className="p-3 bg-[#F7F7F7] rounded-xl border border-gray-200 flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-[#3C3C3C]">{contact.name}</span>
                          <span className="text-[9px] font-black uppercase text-gray-500 bg-white px-1.5 py-0.2 rounded border">
                            {contact.tier}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400">Last: {contact.lastSpokenDate}</span>
                      </div>

                      <button
                        onClick={() => updateContactSpoken(contact.id)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-gray-300 text-xs font-black uppercase text-[#3C3C3C] cursor-pointer"
                      >
                        ✓ Spoke
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 10-Second Vlog Clip Tracker */}
        {activeTab === 'vlog' && (
          <div className="space-y-5">
            {/* AMV Countdown Badge */}
            <div className="p-4 bg-gradient-to-r from-[#FFF5D6] to-[#FFEAA8] rounded-2xl border-2 border-[#FFC800] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-[#A17200]">Creative Video Milestone</span>
                <h4 className="font-black text-sm text-[#3C3C3C]">Next Full AMV / Flow Video Edit</h4>
                <p className="text-xs text-[#777777] font-semibold">
                  Assemble micro clips into cinematic 60fps montages
                </p>
              </div>
              <div className="text-center px-4 py-2 bg-white rounded-xl border-2 border-[#FFC800] shadow-xs">
                <div className="text-xl font-black text-[#A17200]">{quickLoot.amvCountdownWeeks}</div>
                <div className="text-[9px] font-black uppercase text-gray-500">Weeks Left</div>
              </div>
            </div>

            {/* Daily Clip Checkers */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-xs uppercase text-[#777777]">
                  Weekly 10-Second B-Roll Clips (Aim: 2 clips/day = 12 clips/week):
                </h4>
                <span className="text-xs font-black text-[#FF9600]">
                  {totalClips} / 12 Clips Ready
                </span>
              </div>

              {/* 7 Days Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {['2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06'].map(dateStr => {
                  const entry = quickLoot.vlogClips[dateStr] || { clip1: false, clip2: false };
                  const dayName = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

                  return (
                    <div
                      key={dateStr}
                      className="p-3 bg-[#F7F7F7] rounded-xl border border-gray-200 flex items-center justify-between"
                    >
                      <span className="text-xs font-black text-[#3C3C3C]">{dayName}</span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleVlogClip(dateStr, 1)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase border transition-colors cursor-pointer ${
                            entry.clip1
                              ? 'bg-[#58CC02] border-[#46A302] text-white'
                              : 'bg-white border-gray-300 text-gray-400'
                          }`}
                        >
                          Clip 1 {entry.clip1 && '✓'}
                        </button>
                        <button
                          onClick={() => toggleVlogClip(dateStr, 2)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase border transition-colors cursor-pointer ${
                            entry.clip2
                              ? 'bg-[#58CC02] border-[#46A302] text-white'
                              : 'bg-white border-gray-300 text-gray-400'
                          }`}
                        >
                          Clip 2 {entry.clip2 && '✓'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Anki Flashcards & Export */}
        {activeTab === 'anki' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-black text-sm uppercase text-[#3C3C3C]">
                  Captured Flashcards ({quickLoot.ankiCards.length})
                </h4>
                <p className="text-xs text-[#777777] font-semibold">
                  Saved from daily reading, Alankar notes, and cloud concepts
                </p>
              </div>

              <ChunkyButton variant="blue" size="sm" onClick={exportAnkiCsv}>
                <Download size={14} />
                <span>Export Week to Anki (.CSV)</span>
              </ChunkyButton>
            </div>

            {/* Quick Add Flashcard Form */}
            <form onSubmit={handleCreateAnki} className="p-4 bg-[#F7F7F7] rounded-2xl border border-gray-200 space-y-3">
              <span className="text-xs font-black uppercase text-[#777777]">Quick Card Capture:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  value={ankiFront}
                  onChange={e => setAnkiFront(e.target.value)}
                  placeholder="Front: Concept, Sargam or Word..."
                  className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-[#1CB0F6]"
                />
                <input
                  type="text"
                  required
                  value={ankiBack}
                  onChange={e => setAnkiBack(e.target.value)}
                  placeholder="Back: Definition, Pattern or Insight..."
                  className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-[#1CB0F6]"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {(['vocab', 'cloud', 'sargam', 'quote'] as const).map(cat => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setAnkiCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase cursor-pointer ${
                        ankiCategory === cat ? 'bg-[#1CB0F6] text-white' : 'bg-white border text-gray-500'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <ChunkyButton type="submit" variant="blue" size="sm">
                  + Add Card
                </ChunkyButton>
              </div>
            </form>

            {/* Cards List Preview */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {quickLoot.ankiCards.map(card => (
                <div
                  key={card.id}
                  className="p-3 bg-white rounded-xl border border-gray-200 flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-black text-[#3C3C3C]">{card.front}</div>
                    <div className="text-gray-500 font-semibold mt-0.5">{card.back}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-black uppercase shrink-0">
                    {card.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Expense Tracker */}
        {activeTab === 'expenses' && (
          <div className="space-y-5">
            <div className="p-4 bg-gradient-to-r from-[#F3E5FF] to-[#EAD4FF] rounded-2xl border-2 border-[#CE82FF] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-[#A560E8]">Weekly Expense Tally</span>
                <h4 className="font-black text-2xl text-[#3C3C3C]">₹{totalWeeklyExpense}</h4>
                <p className="text-xs text-[#777777] font-semibold">Auto-reconciles on Sunday Empire Reset</p>
              </div>
            </div>

            {/* Quick Add Expense Form */}
            <form onSubmit={handleCreateExpense} className="p-4 bg-[#F7F7F7] rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center gap-2">
              <input
                type="number"
                required
                value={expenseAmount}
                onChange={e => setExpenseAmount(e.target.value)}
                placeholder="Amount (₹)..."
                className="w-full sm:w-32 px-3 py-2 rounded-xl border border-gray-300 text-xs font-black focus:outline-none focus:border-[#CE82FF]"
              />
              <input
                type="text"
                required
                value={expenseCategory}
                onChange={e => setExpenseCategory(e.target.value)}
                placeholder="Category (e.g. Flute Oil, Stationery, Books)..."
                className="w-full sm:flex-1 px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-[#CE82FF]"
              />
              <ChunkyButton type="submit" variant="purple" size="sm">
                + Log ₹
              </ChunkyButton>
            </form>

            {/* Expense List */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {quickLoot.expenses.map(exp => (
                <div
                  key={exp.id}
                  className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-[#3C3C3C]">{exp.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-[#A560E8]">₹{exp.amount}</span>
                    <span className="text-[10px] text-gray-400">{exp.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

