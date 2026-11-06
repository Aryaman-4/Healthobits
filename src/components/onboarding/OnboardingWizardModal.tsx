import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Flame,
  Check,
  Shield,
  Clock,
  Star,
  Award,
  PenTool,
  RotateCcw
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BranchId, Habit } from '../../types';
import { BranchIcon } from '../common/BranchIcon';
import { sound } from '../../utils/audio';

interface OnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingWizardModal: React.FC<OnboardingWizardModalProps> = ({ isOpen, onClose }) => {
  const { state, completeOnboarding, editHabit } = useGame();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 2 State: Work Shift & Week-Offs
  const [workStart, setWorkStart] = useState('12:00');
  const [workEnd, setWorkEnd] = useState('21:00');
  const [selectedWeekOffs, setSelectedWeekOffs] = useState<string[]>(['SAT', 'SUN']);

  // Step 3 State: Selected Keystone per branch
  const [selectedKeystones, setSelectedKeystones] = useState<Record<BranchId, string>>(() => {
    const map: Partial<Record<BranchId, string>> = {};
    (['body', 'mind', 'craft', 'bonds', 'empire'] as BranchId[]).forEach(bId => {
      const existing = state.habits.find(h => h.branchId === bId && h.isKeystone);
      const fallback = state.habits.find(h => h.branchId === bId);
      map[bId] = existing?.id || fallback?.id || '';
    });
    return map as Record<BranchId, string>;
  });

  // Step 4 State: Canvas Signature
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    if (step === 4 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = '#3C3C3C';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, [step]);

  if (!isOpen) return null;

  const branchIds: BranchId[] = ['body', 'mind', 'craft', 'bonds', 'empire'];

  const handleNext = () => {
    sound.playTap();
    if (step < 4) {
      setStep((step + 1) as any);
    }
  };

  const handleBack = () => {
    sound.playTap();
    if (step > 1) {
      setStep((step - 1) as any);
    }
  };

  const handleFinish = () => {
    let signatureUrl = '';
    if (canvasRef.current && hasDrawn) {
      signatureUrl = canvasRef.current.toDataURL('image/png');
    }

    // Update keystones in habits
    Object.entries(selectedKeystones).forEach(([bId, hId]) => {
      state.habits.forEach(h => {
        if (h.branchId === bId) {
          editHabit(h.id, { isKeystone: h.id === hId });
        }
      });
    });

    completeOnboarding({
      shift: {
        workStartTime: workStart,
        workEndTime: workEnd,
        weekOffDays: selectedWeekOffs
      },
      signatureUrl
    });
    onClose();
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    sound.playTap();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    setHasDrawn(false);
  };

  const toggleWeekOff = (day: string) => {
    sound.playTap();
    setSelectedWeekOffs(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-8 max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
        {/* Top Progress Bar */}
        <div className="p-4 sm:p-5 border-b-2 border-gray-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚀</span>
            <div>
              <h3 className="font-black text-sm sm:text-base text-[#3C3C3C] leading-tight">
                Beginner Onboarding Wizard
              </h3>
              <p className="text-[10px] sm:text-xs text-[#777777] font-bold">
                Step {step} of 4: {step === 1 ? 'Meet The 5 Attributes' : step === 2 ? 'Set Work Shift' : step === 3 ? 'Choose 5 Keystones' : 'Sign Season Pact'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`h-2.5 rounded-full transition-all ${
                  s === step
                    ? 'w-7 bg-[#1CB0F6]'
                    : s < step
                    ? 'w-2.5 bg-[#58CC02]'
                    : 'w-2.5 bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* STEP 1: Meet 5 Life Attributes */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h4 className="font-black text-lg text-[#3C3C3C]">
                  Meet Your 5 Life Attributes
                </h4>
                <p className="text-xs text-[#777777]">
                  Polymath Quest turns your daily routine into an RPG character sheet.
                </p>
              </div>

              <div className="space-y-2.5">
                {branchIds.map(bId => {
                  const b = state.branches[bId];
                  return (
                    <div
                      key={bId}
                      className="rounded-2xl border-2 border-b-4 p-3 sm:p-3.5 flex items-center gap-3.5 transition-all shadow-xs"
                      style={{
                        backgroundColor: `${b.colorHex}12`,
                        borderColor: b.borderHex
                      }}
                    >
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-xs shrink-0"
                        style={{ backgroundColor: b.colorHex }}
                      >
                        <BranchIcon branchId={bId} size={22} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-black text-sm uppercase text-[#3C3C3C]">
                            {b.name}
                          </h5>
                          <span
                            className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: b.colorHex }}
                          >
                            +1 Pt/Day Max
                          </span>
                        </div>
                        <p className="text-xs text-[#666666] font-medium mt-0.5">
                          {b.focusArea}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Set Work Shift & Week-Offs */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h4 className="font-black text-lg text-[#3C3C3C]">
                  Set Your Work Shift & Week-Offs
                </h4>
                <p className="text-xs text-[#777777]">
                  The app builds deep creative focus BEFORE work and gentle reading BEFORE bed.
                </p>
              </div>

              {/* Time Pickers */}
              <div className="bg-[#F7F7F7] rounded-2xl border-2 border-gray-200 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-[#3C3C3C]">
                  <Clock size={15} className="text-[#1CB0F6]" />
                  <span>Daily Work Shift Window</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-[#777777] mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={workStart}
                      onChange={e => setWorkStart(e.target.value)}
                      className="w-full bg-white rounded-xl border border-gray-300 px-3 py-2 text-xs font-black text-[#3C3C3C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-[#777777] mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={workEnd}
                      onChange={e => setWorkEnd(e.target.value)}
                      className="w-full bg-white rounded-xl border border-gray-300 px-3 py-2 text-xs font-black text-[#3C3C3C] outline-none"
                    />
                  </div>
                </div>

                {/* Timeline Visual Preview */}
                <div className="pt-2 border-t border-gray-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-gray-100">
                    <span className="font-bold text-[#1CB0F6]">🌅 Pre-Shift Focus:</span>
                    <span className="font-semibold text-[#777777]">6:30 AM – 11:15 AM (Workout + Art)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-gray-100">
                    <span className="font-bold text-[#FF9600]">💼 Core Work Shift:</span>
                    <span className="font-semibold text-[#777777]">{workStart} – {workEnd}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-gray-100">
                    <span className="font-bold text-[#CE82FF]">🌙 Night Wind-Down:</span>
                    <span className="font-semibold text-[#777777]">9:45 PM (Reading + Tea)</span>
                  </div>
                </div>
              </div>

              {/* Week-Off Days Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase text-[#777777]">
                  Your Week-Off Days (No Work)
                </label>
                <div className="grid grid-cols-7 gap-1.5">
                  {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => {
                    const isOff = selectedWeekOffs.includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() => toggleWeekOff(day)}
                        className={`py-2 rounded-xl font-black text-xs uppercase cursor-pointer transition-all ${
                          isOff
                            ? 'bg-[#58CC02] text-white border-2 border-b-4 border-[#46A302] shadow-xs'
                            : 'bg-gray-100 text-[#777777] border border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Choose 5 ★ Keystone Habits */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h4 className="font-black text-lg text-[#3C3C3C]">
                  Choose Your 5 ★ Keystone Habits
                </h4>
                <p className="text-xs text-[#777777]">
                  Pick 1 non-negotiable habit per branch. On crazy busy days, just doing your ★ Keystone habit keeps your streak alive!
                </p>
              </div>

              <div className="space-y-3">
                {branchIds.map(bId => {
                  const b = state.branches[bId];
                  const branchHabits = state.habits.filter(h => h.branchId === bId);
                  const currentKeystoneId = selectedKeystones[bId];

                  return (
                    <div
                      key={bId}
                      className="bg-white rounded-2xl border-2 border-[#E5E5E5] border-b-4 p-3.5 space-y-2 shadow-xs"
                    >
                      <div className="flex items-center gap-2">
                        <BranchIcon branchId={bId} size={16} />
                        <span className="font-black text-xs uppercase text-[#3C3C3C]">
                          {b.name} Branch Keystone:
                        </span>
                      </div>

                      <select
                        value={currentKeystoneId}
                        onChange={e => {
                          sound.playTap();
                          setSelectedKeystones(prev => ({ ...prev, [bId]: e.target.value }));
                        }}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-[#3C3C3C] outline-none"
                      >
                        {branchHabits.map(h => (
                          <option key={h.id} value={h.id}>
                            ★ {h.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Sign 90-Day Season Pact */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h4 className="font-black text-lg text-[#3C3C3C]">
                  Sign Your 90-Day Season Pact
                </h4>
                <p className="text-xs text-[#777777]">
                  Lock in your commitment to play Season 1 with the 5 Keystone pledge.
                </p>
              </div>

              {/* Pact Terms */}
              <div className="bg-[#FFF5D6] rounded-2xl border-2 border-[#FFC800] p-4 text-xs text-[#3C3C3C] space-y-2">
                <div className="flex items-center gap-2 font-black text-sm text-[#A17200]">
                  <Award size={18} />
                  <span>The Polymath Quest Code</span>
                </div>
                <p className="leading-relaxed font-semibold">
                  "I commit to 90 days of sustainable consistency. I recognize that completing just 1 habit in a branch per day builds true mastery. On busy days, my 5 ★ Keystone habits will protect my streak."
                </p>
              </div>

              {/* Canvas Signature Pad */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-[#777777] flex items-center gap-1">
                    <PenTool size={13} />
                    <span>Your Signature</span>
                  </label>
                  {hasDrawn && (
                    <button
                      onClick={clearCanvas}
                      className="text-[11px] font-bold text-red-500 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw size={11} /> Clear
                    </button>
                  )}
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-1 bg-white">
                  <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-32 rounded-xl bg-gray-50 cursor-crosshair touch-none"
                  />
                </div>
                <p className="text-[10px] text-[#888888] text-center">
                  Draw your signature or initials above with your finger or mouse.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Navigation Footer */}
        <div className="p-4 bg-gray-50 border-t-2 border-gray-100 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="px-4 py-2.5 rounded-2xl bg-white border-2 border-gray-200 hover:border-gray-300 text-xs font-black text-[#777777] hover:text-[#3C3C3C] cursor-pointer flex items-center gap-1 active:translate-y-0.5 transition-all"
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl text-xs font-black text-[#777777] hover:text-[#3C3C3C] cursor-pointer"
            >
              Skip
            </button>
          )}

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-2xl bg-[#1CB0F6] border-2 border-b-4 border-[#1899D6] text-white font-black text-xs uppercase tracking-wider cursor-pointer active:translate-y-0.5 transition-all shadow-md flex items-center gap-1.5"
            >
              <span>Continue</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-2xl bg-[#58CC02] border-2 border-b-4 border-[#46A302] text-white font-black text-xs uppercase tracking-wider cursor-pointer active:translate-y-0.5 transition-all shadow-md flex items-center gap-1.5"
            >
              <Sparkles size={16} />
              <span>Lock In Season 1 Pact!</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
