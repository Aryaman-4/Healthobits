import React, { useState, useEffect } from 'react';
import { Brain, Zap, Clock, Trophy, CheckCircle, RotateCcw } from 'lucide-react';
import { useAttackMode } from '../../context/AttackModeContext';
import { sound } from '../../utils/audio';

interface Question {
  question: string;
  answer: number;
}

const GENERATE_QUESTIONS = (): Question[] => [
  { question: '14 × 7', answer: 98 },
  { question: '136 ÷ 8', answer: 17 },
  { question: '2^6 - 15', answer: 49 },
  { question: '84 + 67', answer: 151 },
  { question: '19 × 6', answer: 114 },
  { question: '225 ÷ 15', answer: 15 },
  { question: '73 - 39', answer: 34 },
  { question: '18 × 9', answer: 162 },
  { question: '240 ÷ 16', answer: 15 },
  { question: '12 × 13', answer: 156 }
];

export const CognitiveDrillModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { state, recordDrillScore } = useAttackMode();
  const [questions] = useState<Question[]>(GENERATE_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(60);
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    if (!isOpen || isCompleted) return;

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinish(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isCompleted, score]);

  const handleFinish = (finalScore: number) => {
    setIsCompleted(true);
    recordDrillScore(finalScore * 10);
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(userAnswer.trim(), 10);
    const currentQ = questions[currentIndex];

    if (parsed === currentQ.answer) {
      sound.playComplete();
      setFeedback('correct');
      const nextScore = score + 1;
      setScore(nextScore);

      setTimeout(() => {
        setFeedback(null);
        setUserAnswer('');
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex(currentIndex + 1);
        } else {
          handleFinish(nextScore);
        }
      }, 250);
    } else {
      sound.playTap();
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback(null);
        setUserAnswer('');
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex(currentIndex + 1);
        } else {
          handleFinish(score);
        }
      }, 350);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border-2 border-slate-300 border-b-6 max-w-md w-full p-5 space-y-4 shadow-2xl animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Brain size={18} />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
                Cognitive Peripheral Drill
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Rapid Mental Sharpness & Working Memory (60s Sprint)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xs text-slate-600 font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {!isCompleted ? (
          <div className="space-y-4">
            {/* Status Bar */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
              <div className="flex items-center gap-1.5">
                <Clock size={14} className={secondsRemaining < 15 ? 'text-red-600 animate-pulse' : 'text-slate-500'} />
                <span>Timer: <strong className="font-mono">{secondsRemaining}s</strong></span>
              </div>
              <div>
                Question: <strong className="font-mono">{currentIndex + 1} / {questions.length}</strong>
              </div>
              <div className="text-emerald-700">
                Score: <strong className="font-mono">{score} pts</strong>
              </div>
            </div>

            {/* Current Question */}
            <div
              className={`p-6 rounded-2xl border-2 text-center transition-all ${
                feedback === 'correct'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                  : feedback === 'wrong'
                  ? 'bg-red-50 border-red-500 text-red-900'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <div className="text-[11px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                Calculate Immediately
              </div>
              <div className="font-mono text-3xl font-black tracking-tight">
                {questions[currentIndex]?.question} = ?
              </div>
            </div>

            {/* Answer Input */}
            <form onSubmit={handleAnswerSubmit} className="flex gap-2">
              <input
                type="number"
                autoFocus
                value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                placeholder="Type answer..."
                className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-300 font-mono text-lg font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-wide border-2 border-b-4 border-blue-800 active:border-b-2 active:translate-y-0.5 cursor-pointer"
              >
                Enter
              </button>
            </form>
          </div>
        ) : (
          /* Completion State */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center text-3xl shadow-sm">
              🏆
            </div>
            <div>
              <h4 className="font-black text-xl text-slate-900">
                Drill Completed!
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                You scored <strong className="text-blue-600 font-mono text-base">{score * 10} / 100 points</strong>.
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Current Daily Cognitive Streak: <strong>{state.cognitiveDrillRecord.streakDays} Days</strong>
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-black text-sm uppercase tracking-wide border-2 border-b-4 border-black active:border-b-2 active:translate-y-0.5 cursor-pointer"
            >
              Done — Back to Execution
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
