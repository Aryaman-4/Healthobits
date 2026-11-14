import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Trash2,
  Filter,
  Lightbulb,
  AlertTriangle,
  RotateCcw,
  Brain,
  HelpCircle,
  Clock,
  Copy,
  Check
} from 'lucide-react';
import { useAttackMode } from '../../context/AttackModeContext';
import { DataDropType } from '../../types/attackMode';
import { sound } from '../../utils/audio';

const TYPE_CONFIG: Record<DataDropType, { label: string; icon: string; badgeClass: string }> = {
  insight: { label: 'Insight', icon: '💡', badgeClass: 'bg-[#7EB982]/15 text-[#5A9A5E]' },
  bad_habit: { label: 'Bad Habit', icon: '⚠️', badgeClass: 'bg-[#E67370]/15 text-[#C95451]' },
  behavior: { label: 'Behavior', icon: '🔄', badgeClass: 'bg-[#ECA172]/15 text-[#D17E49]' },
  thought_process: { label: 'Thought Process', icon: '🧠', badgeClass: 'bg-[#937485]/15 text-[#7A5A6D]' },
  problem: { label: 'Problem', icon: '🧩', badgeClass: 'bg-slate-100 text-slate-700' }
};

export const DataDropModal: React.FC = () => {
  const { state, addDataDrop, deleteDataDrop, closeDataDropModal } = useAttackMode();

  const [content, setContent] = useState('');
  const [selectedType, setSelectedType] = useState<DataDropType>('insight');
  const [filterType, setFilterType] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    sound.playCheck();
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!state.isDataDropModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    addDataDrop(content.trim(), selectedType);
    setContent('');
  };

  const filteredDrops = state.dataDrops.filter(d => (filterType === 'all' ? true : d.type === filterType));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 font-sans">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-scale-up max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Data Drop
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Log instant insights, behavioral patterns, or friction in real-time.
            </p>
          </div>

          <button
            onClick={closeDataDropModal}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-semibold cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3 shrink-0">
          <textarea
            rows={3}
            autoFocus
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="What did you just realize about yourself, a habit, or a problem?..."
            className="w-full p-3.5 rounded-2xl bg-[#EEF0F6]/60 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#937485] focus:bg-white transition-all"
          />

          {/* Type Selector Pills */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              {(Object.keys(TYPE_CONFIG) as DataDropType[]).map(t => {
                const conf = TYPE_CONFIG[t];
                const isSelected = selectedType === t;

                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      sound.playTap();
                      setSelectedType(t);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#937485] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{conf.icon}</span>
                    <span>{conf.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="submit"
              disabled={!content.trim()}
              className="px-4 py-2 rounded-xl bg-[#937485] hover:bg-[#836475] disabled:opacity-40 text-white font-semibold text-xs tracking-wide transition-colors cursor-pointer shadow-xs ml-auto"
            >
              Drop Data
            </button>
          </div>
        </form>

        {/* History / Filter Timeline */}
        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="font-bold text-slate-700">
              Captured Drops ({filteredDrops.length})
            </span>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {['all', 'insight', 'bad_habit', 'behavior', 'thought_process', 'problem'].map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilterType(f)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer capitalize ${
                    filterType === f ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {f === 'all' ? 'All' : f.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredDrops.map(drop => {
              const conf = TYPE_CONFIG[drop.type] || TYPE_CONFIG.insight;

              return (
                <div
                  key={drop.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-2xs space-y-1.5 transition-all hover:border-slate-200"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${conf.badgeClass}`}>
                      {conf.icon} {conf.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium text-slate-400">
                        {drop.createdAt}
                      </span>
                      <button
                        onClick={() => handleCopy(drop.id, drop.content)}
                        className={`p-1 rounded-lg border transition-colors flex items-center gap-1 text-[10px] font-semibold cursor-pointer ${
                          copiedId === drop.id
                            ? 'bg-[#7EB982]/15 text-[#5A9A5E] border-[#7EB982]/30'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border-slate-200/60'
                        }`}
                        title="Copy note"
                      >
                        {copiedId === drop.id ? (
                          <>
                            <Check size={11} strokeWidth={2.5} />
                            <span>Copied</span>
                          </>
                        ) : (
                          <Copy size={11} />
                        )}
                      </button>

                      <button
                        onClick={() => deleteDataDrop(drop.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50 cursor-pointer"
                        title="Delete drop"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {drop.content}
                  </p>
                </div>
              );
            })}

            {filteredDrops.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6 italic">
                No data drops recorded yet. Capture your thoughts above.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

