import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Check, Sparkles, X, ChevronRight, Dumbbell, Shield, Flame } from 'lucide-react';
import { useGame, getScheduleTypeFromDate } from '../../context/GameContext';
import { ChunkyButton } from '../common/ChunkyButton';
import { sound } from '../../utils/audio';

export const WorkoutStudioModal: React.FC = () => {
  const { activeStudioModal, setActiveStudioModal, selectedDate, toggleHabitCompletion, state } = useGame();

  const [activePhase, setActivePhase] = useState<1 | 2 | 3 | 4>(1);
  const [secondsLeft, setSecondsLeft] = useState<number>(600); // 10 mins for phase 1
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const scheduleType = getScheduleTypeFromDate(selectedDate);
  const isMWF = scheduleType === 'mwf';

  const phases = [
    {
      id: 1,
      title: 'Phase 1: Mind & Joint Prep',
      durationMinutes: 10,
      description: '5m breath meditation + wrist conditioning, shoulder dislocates, hip mobility',
      exercises: [
        '5m Box Breathing & Mental Focus (In 4s, Hold 4s, Out 4s, Hold 4s)',
        'Wrist Flexion & Extension Circles (30 reps each)',
        'Resistance Band / Towel Shoulder Dislocates (20 reps)',
        'Deep Hip 90/90 Switches & Deep Squat Prying'
      ]
    },
    {
      id: 2,
      title: 'Phase 2: Skill, Balance & Acrobatics',
      durationMinutes: 20,
      description: 'Handstand wall drills -> HSPU progression, Planche leans / Frog stands, Acrobatic transitions',
      exercises: [
        'Chest-to-Wall Handstand Hold (4 sets x 30-45s) -> Freestanding Balance Taps',
        'Handstand Push-Up (HSPU) Negatives or Elevated Pike Pushups (3 sets x 5 reps)',
        'Planche Leans on Floor / Frog Stand Balance (3 sets x 20s)',
        'Acrobatic Transitions: Cartwheel variations, Macaco flow, Bridge kick-overs (8 mins)'
      ]
    },
    {
      id: 3,
      title: isMWF ? 'Phase 3: Strength & Upper Core (MWF)' : 'Phase 3: Explosive Legs & Martial Power (TTS)',
      durationMinutes: 20,
      description: isMWF
        ? 'Archer / Pseudo-planche push-ups, Pull/Row variations, L-sit holds'
        : 'Plyometric box/tuck jumps, Pistol squat progressions, Explosive Karate kick chambers, short sprints',
      exercises: isMWF
        ? [
            'Archer Push-ups or Pseudo-Planche Push-ups (4 sets x 8 reps)',
            'Pull-up / Inverted Row variations (4 sets x 8-10 reps)',
            'Parallel Bar / Floor L-Sit Holds (4 sets x 15-25s)',
            'Hanging Leg Raises / Dragon Flag Negatives (3 sets x 8 reps)'
          ]
        : [
            'Pistol Squats / Assisted Single-Leg Squats (4 sets x 6 reps per leg)',
            'Explosive Tuck Jumps / Plyo Box Jumps (4 sets x 8 reps)',
            'Karate Side Kick & Roundhouse Chamber Holds (3 sets x 10 kicks per leg)',
            'Short Explosive Acceleration Sprints / Shadowboxing Footwork (6 mins)'
          ]
    },
    {
      id: 4,
      title: 'Phase 4: Complex Yoga & Flexibility',
      durationMinutes: 10,
      description: 'Crow to Crane (Bakasana), Eight-Angle Pose (Astavakrasana), Peacock Pose (Mayurasana), deep splits',
      exercises: [
        'Crow to Crane Transition (Bakasana hold 20s x 3 sets)',
        'Eight-Angle Pose (Astavakrasana balance both sides)',
        'Peacock Pose (Mayurasana arm balance attempt)',
        'Deep Hamstring PNF Stretching, Pigeon Pose & Front Split Stretches'
      ]
    }
  ];

  useEffect(() => {
    let interval: number | null = null;
    if (isRunning && secondsLeft > 0) {
      interval = window.setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      sound.playUnlock();
      setIsRunning(false);
    }
    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [isRunning, secondsLeft]);

  if (activeStudioModal !== 'workout') return null;

  const handleSelectPhase = (phaseId: 1 | 2 | 3 | 4) => {
    sound.playTap();
    setActivePhase(phaseId);
    setSecondsLeft(phases[phaseId - 1].durationMinutes * 60);
    setIsRunning(false);
  };

  const handleToggleTimer = () => {
    sound.playTap();
    setIsRunning(!isRunning);
  };

  const handleResetTimer = () => {
    sound.playTap();
    setIsRunning(false);
    setSecondsLeft(phases[activePhase - 1].durationMinutes * 60);
  };

  const handleFinishWorkout = () => {
    sound.playLevelUp();
    const workoutHabit = state.habits.find(h => h.id === 'h-body-calisthenics');
    if (workoutHabit && !workoutHabit.completedDates.includes(selectedDate)) {
      toggleHabitCompletion(workoutHabit.id, selectedDate);
    }
    setActiveStudioModal(null);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const currentPhaseData = phases[activePhase - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-2 sm:p-4 animate-pop">
      <div className="bg-white rounded-3xl border-2 border-b-8 border-[#FF4B4B] max-w-2xl w-full p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-6 max-h-[94vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-gray-100 pb-3 gap-2">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#FFDFE0] border-2 border-[#FF4B4B] flex items-center justify-center text-[#EA2B2B] shrink-0">
              <Dumbbell size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h3 className="font-black text-sm sm:text-xl text-[#3C3C3C] truncate">
                  60m Calisthenics & Yoga
                </h3>
                <span className="text-[9px] sm:text-[10px] font-black uppercase px-1.5 sm:px-2 py-0.5 rounded-full bg-[#FF4B4B] text-white shrink-0">
                  {isMWF ? 'MWF' : 'TTS'}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#777777] font-semibold mt-0.5 truncate">
                4-Phase Guided Training Engine for Full-Body Mastery
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveStudioModal(null)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center font-black cursor-pointer shrink-0"
          >
            <X size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>

        {/* Phase Stepper Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {phases.map(p => {
            const isSelected = activePhase === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPhase(p.id as 1 | 2 | 3 | 4)}
                className={`p-3 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFDFE0] border-[#FF4B4B] border-b-4 text-[#EA2B2B] shadow-xs'
                    : 'bg-[#F7F7F7] border-gray-200 text-[#777777] hover:bg-gray-100'
                }`}
              >
                <div className="text-[10px] font-black uppercase">Phase {p.id}</div>
                <div className="font-black text-xs truncate mt-0.5">{p.title.split(':')[1]?.trim() || p.title}</div>
                <div className="text-[10px] font-bold text-gray-500 mt-1">{p.durationMinutes} mins</div>
              </button>
            );
          })}
        </div>

        {/* Giant Timer & Controls */}
        <div className="bg-[#FFF5F5] rounded-3xl border-2 border-b-4 border-[#FF4B4B] p-6 text-center space-y-4">
          <div className="text-xs font-black uppercase tracking-widest text-[#EA2B2B]">
            {currentPhaseData.title}
          </div>

          <div className="text-6xl sm:text-7xl font-black text-[#3C3C3C] tracking-tight font-mono">
            {formatTimer(secondsLeft)}
          </div>

          <div className="flex items-center justify-center gap-3">
            <ChunkyButton
              variant={isRunning ? 'white' : 'red'}
              size="md"
              onClick={handleToggleTimer}
            >
              {isRunning ? <Pause size={18} /> : <Play size={18} />}
              <span>{isRunning ? 'Pause' : 'Start Phase Timer'}</span>
            </ChunkyButton>

            <button
              onClick={handleResetTimer}
              className="p-3 bg-white rounded-2xl border-2 border-gray-200 text-[#777777] hover:bg-gray-50 cursor-pointer active:translate-y-0.5"
              title="Reset Timer"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        {/* Exercises Checklist for Active Phase */}
        <div className="space-y-3">
          <h4 className="font-black text-sm uppercase text-[#3C3C3C] flex items-center gap-1.5">
            <Flame size={16} className="text-[#FF4B4B]" />
            <span>Target Drills for this Phase:</span>
          </h4>

          <div className="space-y-2">
            {currentPhaseData.exercises.map((ex, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#F7F7F7] rounded-2xl border border-gray-200 flex items-start gap-2.5 text-xs font-bold text-[#3C3C3C]"
              >
                <span className="w-5 h-5 rounded-full bg-[#FFDFE0] text-[#FF4B4B] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{ex}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-3 border-t">
          {activePhase < 4 ? (
            <button
              onClick={() => handleSelectPhase((activePhase + 1) as 1 | 2 | 3 | 4)}
              className="px-4 py-2 text-xs font-black uppercase text-[#1CB0F6] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Next Phase ({activePhase + 1})</span>
              <ChevronRight size={14} />
            </button>
          ) : (
            <div />
          )}

          <ChunkyButton variant="green" size="md" onClick={handleFinishWorkout}>
            <Check size={18} strokeWidth={3} />
            <span>Complete 60m Training & Mark Done</span>
          </ChunkyButton>
        </div>
      </div>
    </div>
  );
};
