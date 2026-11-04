import React, { useState } from 'react';
import { Mic, Copy, Check, ExternalLink, X, Sparkles, MessageSquare } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { ChunkyButton } from '../common/ChunkyButton';
import { sound } from '../../utils/audio';

export const EnglishCoachModal: React.FC = () => {
  const { activeStudioModal, setActiveStudioModal, state, toggleHabitCompletion, selectedDate } = useGame();
  const [copied, setCopied] = useState(false);

  if (activeStudioModal !== 'english') return null;

  const coachPrompt = `Act as my personal communication coach and creative director. I am going to speak/write my thoughts about what I learned, read, or built today. Do NOT turn my words into robotic corporate jargon or generic AI text. Instead: 1) Point out any grammar or phrasing mistakes I made, 2) Give me a sharper, more natural, and articulate way to express the exact same thought while keeping my authentic human voice, 3) Teach me 2 expressive vocabulary words or idioms that fit what I just talked about, and 4) Ask me one follow-up question that forces me to explain my idea more deeply.`;

  const handleCopyAndLaunch = (aiUrl: string) => {
    sound.playTap();
    navigator.clipboard.writeText(coachPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
    window.open(aiUrl, '_blank');
  };

  const handleCompleteHabit = () => {
    const speechHabit = state.habits.find(h => h.id === 'h-bonds-english');
    if (speechHabit && !speechHabit.completedDates.includes(selectedDate)) {
      toggleHabitCompletion(speechHabit.id, selectedDate);
    }
    setActiveStudioModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4 animate-pop">
      <div className="bg-white rounded-3xl border-2 border-b-8 border-[#58CC02] max-w-xl w-full p-6 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-[#D7FFB8] border-2 border-[#58CC02] flex items-center justify-center text-[#46A302]">
              <Mic size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-xl text-[#3C3C3C]">
                  AI English Coach Launcher
                </h3>
              </div>
              <p className="text-xs text-[#777777] font-semibold mt-0.5">
                15m Speech Fluency & Expressive Articulation Polish
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

        {/* Prompt Card */}
        <div className="p-4 bg-[#F7F7F7] rounded-2xl border-2 border-gray-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-[#46A302]">The Master Coach Prompt:</span>
            {copied && (
              <span className="text-[10px] font-black uppercase text-[#58CC02] bg-white px-2 py-0.5 rounded-full border border-[#58CC02]">
                Copied to Clipboard!
              </span>
            )}
          </div>
          <p className="text-xs font-medium text-[#3C3C3C] italic leading-relaxed bg-white p-3 rounded-xl border border-gray-200">
            &ldquo;{coachPrompt}&rdquo;
          </p>
        </div>

        {/* Launch Buttons */}
        <div className="space-y-2">
          <div className="text-xs font-black uppercase text-[#777777]">
            Copy Prompt & Launch in 1 Click:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <ChunkyButton
              variant="green"
              size="md"
              onClick={() => handleCopyAndLaunch('https://chatgpt.com')}
            >
              <Copy size={16} />
              <span>Copy & Open ChatGPT</span>
            </ChunkyButton>

            <ChunkyButton
              variant="blue"
              size="md"
              onClick={() => handleCopyAndLaunch('https://claude.ai')}
            >
              <ExternalLink size={16} />
              <span>Copy & Open Claude</span>
            </ChunkyButton>
          </div>
        </div>

        {/* Session Reflection */}
        <div className="p-4 bg-[#FFFDF0] rounded-2xl border-2 border-[#FFC800] space-y-1.5">
          <div className="text-xs font-black uppercase text-[#A17200] flex items-center gap-1">
            <Sparkles size={14} />
            <span>How to structure your 15 minutes:</span>
          </div>
          <ul className="text-xs font-semibold text-[#777777] list-disc list-inside space-y-0.5">
            <li>Speak freely for 3–5 minutes about what you built or learned today.</li>
            <li>Paste or voice-dictate into the AI Chat using the copied prompt.</li>
            <li>Review the 2 vocabulary idioms and save them to your Anki Quick-Loot Bag.</li>
          </ul>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end pt-3 border-t">
          <ChunkyButton variant="green" size="md" onClick={handleCompleteHabit}>
            <Check size={18} strokeWidth={3} />
            <span>Mark 15m Speech Practice Complete</span>
          </ChunkyButton>
        </div>
      </div>
    </div>
  );
};

