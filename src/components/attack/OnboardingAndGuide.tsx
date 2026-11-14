import React, { useState } from 'react';
import {
  HelpCircle,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
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
    <div className="bg-white rounded-2xl border-2 border-[#E2E8F0] border-b-5 p-4 sm:p-5 shadow-xs transition-all space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">📘</span>
          <div>
            <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
              How This System Works (Beginner Guide)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              A 3-second overview of the 7-Day Section System and 4-Week Monthly Accumulator.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs uppercase cursor-pointer transition-all"
          >
            {isExpanded ? 'Collapse' : 'Learn Features ▾'}
          </button>
          <button
            onClick={dismissGuide}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center text-xs font-bold cursor-pointer"
            title="Dismiss guide card"
          >
            ✕
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in">
          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
            <div className="font-black text-xs text-emerald-900 flex items-center gap-1.5">
              <span>💰</span>
              <span>1. The 3 Core Pillars</span>
            </div>
            <p className="text-[11px] text-emerald-800 font-medium leading-relaxed">
              Every day holds tasks under <strong>Rich</strong> (earning), <strong>Muscular</strong> (body/karate/yoga), and <strong>Intelligent</strong> (reading/coding/meditation).
            </p>
          </div>

          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1">
            <div className="font-black text-xs text-blue-900 flex items-center gap-1.5">
              <span>📅</span>
              <span>2. 7-Day Section Grid</span>
            </div>
            <p className="text-[11px] text-blue-800 font-medium leading-relaxed">
              Plan Monday through Sunday. Check items off as you finish them, or add custom tasks directly inside any section.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200 space-y-1">
            <div className="font-black text-xs text-purple-900 flex items-center gap-1.5">
              <span>🏆</span>
              <span>3. 4-Week Month Rollup</span>
            </div>
            <p className="text-[11px] text-purple-800 font-medium leading-relaxed">
              At each week's end, completed tasks are calculated into a Weekly Scorecard. 4 weeks compound into your Monthly Grade (S/A/B/C).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// 2. 4-STEP ONBOARDING WIZARD MODAL
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 font-sans">
      <div className="bg-white rounded-3xl border-2 border-slate-300 border-b-6 max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl animate-scale-up">
        {/* Step Progress Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span className="font-black text-xs uppercase tracking-wider text-slate-800">
              Welcome to Attack Mode • Step {step} of {totalSteps}
            </span>
          </div>

          <button
            onClick={closeOnboarding}
            className="w-7 h-7 rounded-lg bg-slate-100 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* STEP 1: THE 3 CORE PILLARS */}
        {step === 1 && (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl mx-auto shadow-xs">
              💰
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900">
                Rule 1: The 3 Core Pillars of Mastery
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Zero clutter. Every high-leverage task in your life belongs to one of three categories:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left pt-1">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="font-black text-xs text-emerald-900">💰 RICH</div>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Freelance, business, money systems, revenue leverage.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                <div className="font-black text-xs text-red-900">💪 MUSCULAR</div>
                <p className="text-[11px] text-red-800 mt-0.5">
                  Calisthenics, karate, yoga, flexibility, aesthetics.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                <div className="font-black text-xs text-blue-900">🧠 INTELLIGENT</div>
                <p className="text-[11px] text-blue-800 mt-0.5">
                  Algo practice, problem solving, deep reading, meditation.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: THE 7-DAY SECTION SYSTEM */}
        {step === 2 && (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-3xl mx-auto shadow-xs">
              📅
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900">
                Rule 2: The 7-Day Section System
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Your week is organized cleanly by days (Monday through Sunday):
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
              <div className="font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>Under every single day, you have the 3 collapsible sections.</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Add your tasks directly into each section (e.g., <em>learn about money</em>, <em>Yoga</em>, <em>Reading</em>). Check them off on mobile with one tap.
              </p>
              <div className="flex items-center gap-1.5 pt-1 text-[11px] font-bold text-blue-600">
                <span>⚡ Tip: Toggle between Day View and Full Week Grid anytime!</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: 4-WEEK MONTHLY PERFORMANCE SCORECARD */}
        {step === 3 && (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-3xl mx-auto shadow-xs">
              🏆
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900">
                Rule 3: 4-Week Month Performance Rollup
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                At each week's end, the completed tasks across all 7 days are totaled:
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-left pt-1">
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                <div className="font-black text-xs text-purple-900">Weekly Grades</div>
                <p className="text-[11px] text-purple-800 mt-0.5">
                  Week 1, 2, 3, 4 each receive a Grade (S, A, B, C) based on your consistency.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="font-black text-xs text-emerald-900">Monthly Average %</div>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Rolls up 4 weeks into your monthly report card with 1-click Markdown & Excel export.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: DEADLINE SLA GOD TABLE */}
        {step === 4 && (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center text-3xl mx-auto shadow-xs">
              ⏰
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900">
                Rule 4: Deadline SLA Incident Engine
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                For deliverables that cannot afford to slip:
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-left space-y-2 text-xs text-red-950">
              <div className="font-bold flex items-center gap-2">
                <span>🔴 P1 &lt; 24h</span>
                <span>•</span>
                <span>🟠 P2 &lt; 72h</span>
                <span>•</span>
                <span>🟡 P3 &lt; 7d</span>
              </div>
              <p className="text-[11px] text-red-800 leading-relaxed">
                Live ticking countdown timers make invisible time physically urgent. Push deliverables to Today in 1 click!
              </p>
            </div>
          </div>
        )}

        {/* Modal Controls */}
        <div className="flex items-center justify-between pt-2">
          {step > 1 ? (
            <button
              onClick={handlePrev}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase cursor-pointer transition-all"
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider border-2 border-b-4 border-blue-800 active:border-b-2 active:translate-y-0.5 cursor-pointer transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>{step === totalSteps ? 'Got it — Enter System' : 'Next Step →'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
