import React, { useState } from 'react';
import {
  Compass,
  AlertOctagon,
  CheckCircle,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  Flame,
  Search,
  BookOpen
} from 'lucide-react';
import { useAttackMode } from '../../context/AttackModeContext';
import { sound } from '../../utils/audio';

export const SherlockProtocolModal: React.FC = () => {
  const { state, addSherlockLog, closeSherlockModal } = useAttackMode();

  const [whatHappened, setWhatHappened] = useState('');
  const [whyHappened, setWhyHappened] = useState('');
  const [howToSolve, setHowToSolve] = useState('');
  const [contingencyPlan, setContingencyPlan] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (!state.isSherlockModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatHappened.trim()) return;

    addSherlockLog({
      whatHappened: whatHappened.trim(),
      whyHappened: whyHappened.trim() || 'Fatigue and loss of focus.',
      howToSolve: howToSolve.trim() || 'Simplify daily commitment and rebuild momentum.',
      contingencyPlan: contingencyPlan.trim() || 'Execute minimum 15m habit instead of skipping.'
    });

    setWhatHappened('');
    setWhyHappened('');
    setHowToSolve('');
    setContingencyPlan('');
    setIsFormOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 font-sans">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 animate-scale-up max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#ECA172]/15 text-[#ECA172] flex items-center justify-center text-xl">
              🔍
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Come Here: Sherlock Holmes Protocol
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                When you mess up: Stop being mean. Treat it as a case to investigate and solve.
              </p>
            </div>
          </div>

          <button
            onClick={closeSherlockModal}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-semibold cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* The Core Compassionate Guidance */}
        <div className="p-5 rounded-2xl bg-[#EEF0F6]/80 border border-slate-200/60 space-y-3 text-xs leading-relaxed text-slate-800">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <span>🛡️</span>
            <span>It is okay. No need to be mean to yourself.</span>
          </div>

          <p>
            <strong>Become Sherlock Holmes and solve this case.</strong> You are allowed to fuck up, so you learn how you tend to fuck up. Fucking up exposes the hidden tendencies in you, allowing you to close them up tight and implement new measures that change those behaviors and modify your system.
          </p>

          <p className="text-slate-600 italic">
            "Focus on your behavior and create contingency plans for self-destructive patterns. Example: You might discover that after every 6 days, you stop working and go back to xyz activity. Or every time you text a specific person, you open yourself to an emotional freefall. Recognize the trigger."
          </p>
        </div>

        {/* Trigger Button or Active Investigation Form */}
        {!isFormOpen ? (
          <button
            onClick={() => {
              sound.playTap();
              setIsFormOpen(true);
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#937485] hover:bg-[#836475] text-white font-semibold text-xs tracking-wide transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
          >
            <span>+ Open New Case Investigation (What Went Wrong?)</span>
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Case Analysis Worksheet
              </h3>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-700 font-semibold"
              >
                Cancel
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                1. What happened?
              </label>
              <textarea
                rows={2}
                required
                value={whatHappened}
                onChange={e => setWhatHappened(e.target.value)}
                placeholder="e.g. I got distracted from the things I had set for myself. I got tired and didn't follow one day then the next..."
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#937485] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                2. Why is this happening? Go deeper. What is the real need?
              </label>
              <textarea
                rows={3}
                value={whyHappened}
                onChange={e => setWhyHappened(e.target.value)}
                placeholder="e.g. Trying to change everything all at once. Need a focused distraction-free space. Need physical discharge (resume karate)..."
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#937485] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                3. How to solve this so it doesn't happen?
              </label>
              <textarea
                rows={2}
                value={howToSolve}
                onChange={e => setHowToSolve(e.target.value)}
                placeholder="Direct, honest, and detailed steps..."
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#937485] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                4. Contingency Plan for this self-destructive pattern
              </label>
              <input
                type="text"
                value={contingencyPlan}
                onChange={e => setContingencyPlan(e.target.value)}
                placeholder="e.g. If energy drops below 30%, execute 15m yoga instead of full workout."
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#937485] focus:bg-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#7EB982] hover:bg-[#6FA873] text-white font-semibold text-xs tracking-wide cursor-pointer transition-colors shadow-2xs"
              >
                Log Case & Close Investigation
              </button>
            </div>
          </form>
        )}

        {/* Past Cases Log */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
            Solved Cases & Behavioral Contingencies ({state.sherlockLogs.length})
          </h3>

          <div className="space-y-3">
            {state.sherlockLogs.map(caseItem => (
              <div
                key={caseItem.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold border-b border-slate-100 pb-1.5">
                  <span className="text-[#937485] font-bold">Investigation Log</span>
                  <span>{caseItem.createdAt}</span>
                </div>

                <div>
                  <span className="font-bold text-slate-900">What Happened: </span>
                  <span className="text-slate-700">{caseItem.whatHappened}</span>
                </div>

                <div>
                  <span className="font-bold text-slate-900">Root Cause (Why): </span>
                  <span className="text-slate-600 leading-relaxed">{caseItem.whyHappened}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50/70 text-emerald-900 border border-emerald-200 font-medium">
                  <strong>Contingency Action:</strong> {caseItem.contingencyPlan || caseItem.howToSolve}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

