import React, { useState } from 'react';
import {
  Anchor,
  Check,
  Plus,
  Trash2,
  X,
  Sparkles,
  Heart,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { useAttackMode } from '../../context/AttackModeContext';
import { sound } from '../../utils/audio';

export const AnchorModeModal: React.FC = () => {
  const {
    state,
    closeAnchorModal,
    toggleAnchorHabit,
    addAnchorHabit,
    deleteAnchorHabit,
    resetAnchorHabits
  } = useAttackMode();

  const [newTitle, setNewTitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('⚓');

  if (!state.isAnchorModalOpen) return null;

  const habits = state.anchorHabits || [];
  const completedCount = habits.filter(h => h.isCompleted).length;
  const totalCount = habits.length;
  const isAnyDone = completedCount > 0;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addAnchorHabit(newTitle.trim(), selectedIcon);
    setNewTitle('');
  };

  const icons = ['⚓', '🎧', '🎨', '🏃‍♂️', '📖', '🧘', '💧', '✍️'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-3.5 sm:p-4 font-sans">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] space-y-4 animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#78909C]/15 text-[#546E7A] flex items-center justify-center text-lg shrink-0">
              ⚓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Anchor Mode
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#78909C]/15 text-[#546E7A]">
                  Low Energy Sanctuary
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                The minimum baseline when you are completely out of the zone.
              </p>
            </div>
          </div>

          <button
            onClick={closeAnchorModal}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-semibold cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Supportive Self-Compassion Callout */}
        <div className="p-3.5 rounded-2xl bg-[#EEF0F6] border border-slate-200/60 text-xs text-slate-700 leading-relaxed flex items-start gap-2.5 shrink-0">
          <Heart size={16} className="text-[#E67370] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900">It is okay to have off days. </span>
            Do not force a grueling sprint. Just complete 1 or 2 anchors to preserve your habit identity and keep momentum alive.
          </div>
        </div>

        {/* Progress Strip */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-2xs flex items-center justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={16} className={isAnyDone ? 'text-[#7EB982]' : 'text-slate-400'} />
              <span className="text-xs font-bold text-slate-800">
                {completedCount} of {totalCount} Anchors Completed
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              {isAnyDone ? '🎉 Day saved! Your baseline streak is protected.' : 'Select at least 1 anchor to secure your day.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold font-mono text-slate-700">{pct}%</span>
            <button
              onClick={resetAnchorHabits}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Reset today's anchors"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Habit Checklist Scroll Area */}
        <div className="space-y-2 flex-1 overflow-y-auto pr-1">
          {habits.map(habit => (
            <div
              key={habit.id}
              onClick={() => toggleAnchorHabit(habit.id)}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                habit.isCompleted
                  ? 'bg-[#7EB982]/10 border-[#7EB982]/30 text-slate-800'
                  : 'bg-white border-slate-200/80 hover:border-[#78909C]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <button
                  type="button"
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                    habit.isCompleted
                      ? 'bg-[#7EB982] border-[#7EB982] text-white shadow-2xs'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {habit.isCompleted && <Check size={14} strokeWidth={3} />}
                </button>

                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-base shrink-0">{habit.icon || '⚓'}</span>
                  <span
                    className={`text-xs font-semibold leading-snug break-words ${
                      habit.isCompleted ? 'line-through text-slate-500' : 'text-slate-800'
                    }`}
                  >
                    {habit.title}
                  </span>
                </div>
              </div>

              {/* Allow delete for custom anchors */}
              {habit.id.startsWith('anchor-') && parseInt(habit.id.replace('anchor-', '')) > 5 && (
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    deleteAnchorHabit(habit.id);
                  }}
                  className="text-slate-300 hover:text-red-500 p-1 transition-colors shrink-0"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Custom Anchor Habit Form */}
        <form onSubmit={handleAddSubmit} className="pt-2 border-t border-slate-100 space-y-2 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {icons.map(ic => (
              <button
                key={ic}
                type="button"
                onClick={() => setSelectedIcon(ic)}
                className={`w-7 h-7 rounded-xl text-xs flex items-center justify-center shrink-0 transition-colors ${
                  selectedIcon === ic ? 'bg-[#78909C] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {ic}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="Add custom anchor (e.g. Draw 5 mins, drink lemon water)..."
              className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#78909C] focus:bg-white transition-colors"
            />
            <button
              type="submit"
              disabled={!newTitle.trim()}
              className="px-3.5 py-2 rounded-xl bg-[#78909C] hover:bg-[#607D8B] disabled:opacity-40 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
            >
              Add
            </button>
          </div>
        </form>

        {/* Footer Button */}
        <div className="pt-2 shrink-0">
          <button
            onClick={() => {
              sound.playTap();
              closeAnchorModal();
            }}
            className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            {isAnyDone ? 'Secure Day & Return' : 'Close Anchor Mode'}
          </button>
        </div>
      </div>
    </div>
  );
};

