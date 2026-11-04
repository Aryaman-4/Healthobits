import React, { useState } from 'react';
import { BookOpen, Palette, Plus, Check, X, ExternalLink, Quote, Sparkles } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { ChunkyButton } from '../common/ChunkyButton';

export const DualCycleModal: React.FC = () => {
  const { activeStudioModal, setActiveStudioModal, state, logBookPages, updateFinelinerCycle, toggleHabitCompletion, selectedDate } = useGame();
  const { bookTracker, finelinerTracker } = state;

  const [activeTab, setActiveTab] = useState<'reading' | 'art'>(
    activeStudioModal === 'reading' ? 'reading' : 'art'
  );

  const [newQuote, setNewQuote] = useState('');
  const [finelinerNotes, setFinelinerNotes] = useState(finelinerTracker.notes);
  const [customRefUrl, setCustomRefUrl] = useState(finelinerTracker.referenceUrl);

  if (activeStudioModal !== 'reading' && activeStudioModal !== 'art') return null;

  const handleAddReadingSprint = () => {
    logBookPages(29, newQuote);
    setNewQuote('');
    const readHabit = state.habits.find(h => h.id === 'h-mind-reading');
    if (readHabit && !readHabit.completedDates.includes(selectedDate)) {
      toggleHabitCompletion(readHabit.id, selectedDate);
    }
    setActiveStudioModal(null);
  };

  const handleSaveFineliner = () => {
    updateFinelinerCycle(finelinerTracker.currentCycleDay, finelinerNotes, customRefUrl);
    const artHabit = state.habits.find(h => h.id === 'h-craft-art');
    if (artHabit && !artHabit.completedDates.includes(selectedDate)) {
      toggleHabitCompletion(artHabit.id, selectedDate);
    }
    setActiveStudioModal(null);
  };

  const getFinelinerPhase = (day: number) => {
    if (day <= 3) {
      return {
        name: 'Phase 1: Reference & Proportion Grid',
        days: 'Days 1–3',
        description: 'Reference selection, thumbnail composition & 2H light pencil grid structure.'
      };
    }
    if (day <= 8) {
      return {
        name: 'Phase 2: Primary Ink Outlines & Forms',
        days: 'Days 4–8',
        description: 'Sakura Pigma Micron 005 outlines, defining hard silhouettes and mechanical contours.'
      };
    }
    return {
      name: 'Phase 3: Deep Cross-Hatching & Stippling',
      days: 'Days 9–14',
      description: 'Layered cross-hatching, stippled gradient texture, and high-contrast atmospheric shading.'
    };
  };

  const currentPhase = getFinelinerPhase(finelinerTracker.currentCycleDay);
  const bookPercentage = Math.round((bookTracker.currentPage / bookTracker.totalPages) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4 animate-pop">
      <div className="bg-white rounded-3xl border-2 border-b-8 border-[#1CB0F6] max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('reading')}
              className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'reading'
                  ? 'bg-[#DDF4FF] border-2 border-[#1CB0F6] border-b-4 text-[#1CB0F6]'
                  : 'text-[#777777] hover:bg-gray-100'
              }`}
            >
              <BookOpen size={16} />
              <span>14-Day Book Cycle</span>
            </button>

            <button
              onClick={() => setActiveTab('art')}
              className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'art'
                  ? 'bg-[#FFF5D6] border-2 border-[#FFC800] border-b-4 text-[#A17200]'
                  : 'text-[#777777] hover:bg-gray-100'
              }`}
            >
              <Palette size={16} />
              <span>14-Day Fineliner Piece</span>
            </button>
          </div>

          <button
            onClick={() => setActiveStudioModal(null)}
            className="w-9 h-9 rounded-full border-2 border-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center font-black cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* TAB 1: 14-Day Book Tracker */}
        {activeTab === 'reading' && (
          <div className="space-y-5">
            <div className="p-4 bg-[#F7F7F7] rounded-2xl border-2 border-[#E5E5E5] space-y-2">
              <span className="text-[10px] font-black uppercase text-[#1CB0F6]">Current Book Active</span>
              <h3 className="font-black text-lg text-[#3C3C3C]">{bookTracker.title}</h3>

              {/* Progress Bar */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs font-black text-[#777777] mb-1">
                  <span>Page {bookTracker.currentPage} of {bookTracker.totalPages}</span>
                  <span>{bookPercentage}% Complete</span>
                </div>
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-[#1CB0F6] rounded-full transition-all duration-300"
                    style={{ width: `${bookPercentage}%` }}
                  />
                </div>
                <div className="text-[11px] text-gray-500 font-bold mt-1">
                  Target pace: 29 pages per day (14 days = 400 pages)
                </div>
              </div>
            </div>

            {/* Mandatory Quote Input */}
            <div className="p-4 bg-[#DDF4FF]/40 rounded-2xl border-2 border-[#84D8FF] space-y-2">
              <label className="block text-xs font-black uppercase text-[#1899D6] flex items-center gap-1">
                <Quote size={14} />
                <span>Mandatory Capture: Log 1 Quote, Idea, or Vocabulary Word</span>
              </label>
              <p className="text-[11px] text-[#777777] font-semibold">
                This rule forces active reading over passive skimming. Auto-saves directly to your Anki Quick-Loot bag!
              </p>
              <textarea
                value={newQuote}
                onChange={e => setNewQuote(e.target.value)}
                placeholder="Type your favorite quote or key concept from today's 29 pages..."
                rows={3}
                className="w-full p-3 rounded-xl border-2 border-gray-200 text-xs font-semibold focus:border-[#1CB0F6] focus:outline-none"
              />
            </div>

            {/* Quick Action */}
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-xs font-bold text-[#777777]">
                Clicking adds +29 pages and marks today&apos;s Reading Keystone habit done.
              </span>
              <ChunkyButton variant="blue" size="md" onClick={handleAddReadingSprint}>
                <Check size={18} strokeWidth={3} />
                <span>Log +29 Pages & Save</span>
              </ChunkyButton>
            </div>
          </div>
        )}

        {/* TAB 2: 14-Day Fineliner Masterpiece Tracker */}
        {activeTab === 'art' && (
          <div className="space-y-5">
            <div className="p-4 bg-[#FFFDF0] rounded-2xl border-2 border-[#FFC800] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-[#A17200]">Active 14-Day Project</span>
                <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-[#FFC800] text-[#3C3C3C]">
                  Day {finelinerTracker.currentCycleDay} of 14
                </span>
              </div>
              <h3 className="font-black text-lg text-[#3C3C3C]">{finelinerTracker.pieceTitle}</h3>

              {/* Day Stepper */}
              <div className="flex items-center gap-1 pt-2 overflow-x-auto pb-1">
                {Array.from({ length: 14 }, (_, i) => i + 1).map(day => (
                  <button
                    key={day}
                    onClick={() => updateFinelinerCycle(day)}
                    className={`w-8 h-8 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer ${
                      finelinerTracker.currentCycleDay === day
                        ? 'bg-[#FFC800] text-[#3C3C3C] border-2 border-[#E5A400] scale-110 shadow-xs'
                        : day < finelinerTracker.currentCycleDay
                        ? 'bg-[#EBF9DC] text-[#347A01] border border-[#58CC02]'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Phase Card */}
            <div className="p-4 bg-[#F7F7F7] rounded-2xl border-2 border-[#E5E5E5] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-[#A17200]">{currentPhase.name}</span>
                <span className="text-[11px] font-bold text-gray-500">{currentPhase.days}</span>
              </div>
              <p className="text-xs font-semibold text-[#777777] leading-relaxed">
                {currentPhase.description}
              </p>
            </div>

            {/* Reference URL */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase text-[#777777]">
                Pinned Pinterest Reference URL:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customRefUrl}
                  onChange={e => setCustomRefUrl(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border-2 border-gray-200 text-xs font-semibold focus:border-[#FFC800] focus:outline-none"
                />
                <a
                  href={customRefUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#FFC800] border-2 border-[#E5A400] text-[#3C3C3C] text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink size={14} />
                  <span>Open</span>
                </a>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase text-[#777777]">
                Session Reflection / Technique Focus:
              </label>
              <textarea
                value={finelinerNotes}
                onChange={e => setFinelinerNotes(e.target.value)}
                placeholder="e.g. Focused on feathers curvature using light 005 cross-hatching..."
                rows={2}
                className="w-full p-2.5 rounded-xl border-2 border-gray-200 text-xs font-semibold focus:border-[#FFC800] focus:outline-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end pt-2 border-t">
              <ChunkyButton variant="yellow" size="md" onClick={handleSaveFineliner}>
                <Check size={18} strokeWidth={3} />
                <span>Save Studio Session & Mark Art Done</span>
              </ChunkyButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

