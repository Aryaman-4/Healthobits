import React, { useState } from 'react';
import {
  HelpCircle,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Award,
  Clock,
  X,
  Zap,
  Info
} from 'lucide-react';
import { useAttackMode } from '../../context/AttackModeContext';
import { sound } from '../../utils/audio';

// 1. COLLAPSIBLE TOP GUIDE CARD
export const BeginnerGuideCard: React.FC = () => {
  const { state, dismissGuide } = useAttackMode();
  const [isExpanded, setIsExpanded] = useState(false);

  if (state.isGuideDismissed) return null;

  return (
    <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 transition-all space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#937485]/15 text-[#937485] flex items-center justify-center font-bold text-sm">
            i
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 tracking-tight">
              Quick Guide: The 7-Day Section System
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Understand the 3 pillars and weekly accumulation in seconds.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 font-semibold text-xs cursor-pointer transition-colors"
          >
            {isExpanded ? 'Hide' : 'Show Details'}
          </button>
          <button
            onClick={dismissGuide}
            className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs font-semibold cursor-pointer transition-colors"
            title="Dismiss guide card"
          >
            ✕
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in text-xs">
          <div className="p-3.5 rounded-2xl bg-[#937485]/10 border border-[#937485]/20 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span>💰</span>
              <span>1. The 3 Core Pillars</span>
            </div>
            <p className="text-slate-600 font-medium leading-relaxed">
              Every day organizes habits under <strong>Rich</strong> (earning/freelance), <strong>Muscular</strong> (karate/yoga/calisthenics), and <strong>Intelligent</strong> (reading/coding/meditation).
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#ECA172]/10 border border-[#ECA172]/20 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span>📅</span>
              <span>2. 7-Day Week Flow</span>
            </div>
            <p className="text-slate-600 font-medium leading-relaxed">
              Navigate Monday through Sunday with one tap. Check items off or add new tasks directly under each section.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#7EB982]/10 border border-[#7EB982]/20 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span>🏆</span>
              <span>3. 4-Week Month Rollup</span>
            </div>
            <p className="text-slate-600 font-medium leading-relaxed">
              Each Sunday, archive your week. 4 weeks compound into your monthly report card with performance grades (S, A, B, C).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// 2. ONBOARDING WIZARD MODAL (100% RE-STYLED TO SOFT DRIBBLE PALETTE)
export const OnboardingWizardModal: React.FC = () => {
  const { state, closeOnboarding } = useAttackMode();
  const [step, setStep] = useState(1);

  if (!state.isOnboardingOpen) return null;

  const totalSteps = 4;

  const handleNext = () => {
    sound.playTap();
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      closeOnboarding();
    }
  };

  const handlePrev = () => {
    sound.playTap();
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 font-sans">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-100 animate-scale-up">
        {/* Step Progress Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#937485]" />
            <span className="font-bold text-xs text-slate-500 uppercase tracking-wider">
              System Walkthrough • Step {step} of {totalSteps}
            </span>
          </div>

          <button
            onClick={closeOnboarding}
            className="w-7 h-7 rounded-full bg-slate-100 text-xs font-semibold text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* STEP 1: THE 3 CORE PILLARS */}
        {step === 1 && (
          <div className="space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#937485]/15 text-[#937485] flex items-center justify-center text-2xl mx-auto shadow-2xs">
              💰
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 tracking-tight">
                The 3 Core Pillars of Mastery
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Zero clutter. Every high-leverage habit and task in your life belongs to one of three sections:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left pt-1 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#937485]/10 border border-[#937485]/20">
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <span>💰</span>
                  <span>Rich</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Freelance, business, money systems, revenue leverage.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#ECA172]/10 border border-[#ECA172]/20">
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <span>💪</span>
                  <span>Muscular</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Calisthenics, karate, yoga, flexibility, aesthetics.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#7EB982]/10 border border-[#7EB982]/20">
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <span>🧠</span>
                  <span>Intelligent</span>
                </div>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Algo practice, problem solving, deep reading, meditation.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: THE 7-DAY SECTION SYSTEM */}
        {step === 2 && (
          <div className="space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#ECA172]/15 text-[#ECA172] flex items-center justify-center text-2xl mx-auto shadow-2xs">
              📅
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 tracking-tight">
                The 7-Day Section System
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Your week is organized cleanly by days (Monday through Sunday):
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#EEF0F6]/70 border border-slate-200/60 text-left space-y-2 text-xs">
              <div className="font-bold text-slate-800">
                Under every single day, you have the 3 collapsible sections.
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Add your tasks directly into each section (e.g., <em>learn about money</em>, <em>Yoga</em>, <em>Reading</em>). Check them off on mobile with one tap.
              </p>
              <div className="text-[11px] font-semibold text-[#937485] pt-1">
                Toggle between Today focus and Full Week overview anytime.
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SUNDAY RESET & 4-WEEK ACCUMULATOR */}
        {step === 3 && (
          <div className="space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#7EB982]/15 text-[#7EB982] flex items-center justify-center text-2xl mx-auto shadow-2xs">
              🏆
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 tracking-tight">
                Sunday Archive & 4-Week Month System
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                At each week's end, the completed tasks across all 7 days are totaled:
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-left pt-1 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#EEF0F6]/80 border border-slate-200/60">
                <div className="font-bold text-slate-900">Weekly Grades</div>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Week 1, 2, 3, 4 each receive a Grade (S, A, B, C) based on your consistency.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#EEF0F6]/80 border border-slate-200/60">
                <div className="font-bold text-slate-900">Monthly History</div>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Rolls up 4 weeks into your monthly report card with 1-click Markdown & Excel export.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: DATA DROP & SHERLOCK PROTOCOL */}
        {step === 4 && (
          <div className="space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#937485]/15 text-[#937485] flex items-center justify-center text-2xl mx-auto shadow-2xs">
              ⚡
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 tracking-tight">
                Data Drop & Sherlock Protocol
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Tools built specifically for your self-awareness and contingency recovery:
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#EEF0F6]/70 border border-slate-200/60 text-left space-y-2 text-xs">
              <div>
                <strong className="text-slate-900">Center (+) Button:</strong> Tap to open <em>Data Drop</em> — instantly record an insight, bad habit, or thought process.
              </div>
              <div className="pt-1">
                <strong className="text-slate-900">Come Here (Sherlock):</strong> When you mess up or lose focus, tap the Sherlock button to run a compassionate post-mortem and set a contingency plan.
              </div>
            </div>
          </div>
        )}

        {/* Modal Controls */}
        <div className="flex items-center justify-between pt-2">
          {step > 1 ? (
            <button
              onClick={handlePrev}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-[#937485] hover:bg-[#836475] text-white font-semibold text-xs tracking-wide transition-colors cursor-pointer shadow-xs"
          >
            {step === totalSteps ? 'Get Started' : 'Next Step'}
          </button>
        </div>
      </div>
    </div>
  );
};
