import React, { useState } from 'react';
import {
  Sparkles,
  Trash2,
  Filter,
  Download,
  FileText,
  Search,
  Plus,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useAttackMode } from '../../context/AttackModeContext';
import { DataDropType } from '../../types/attackMode';
import { sound } from '../../utils/audio';

const TYPE_CONFIG: Record<DataDropType, { label: string; icon: string; badgeClass: string; dotColor: string }> = {
  insight: { label: 'Insight', icon: '💡', badgeClass: 'bg-[#7EB982]/15 text-[#5A9A5E]', dotColor: 'bg-[#7EB982]' },
  bad_habit: { label: 'Bad Habit', icon: '⚠️', badgeClass: 'bg-[#E67370]/15 text-[#C95451]', dotColor: 'bg-[#E67370]' },
  behavior: { label: 'Behavior', icon: '🔄', badgeClass: 'bg-[#ECA172]/15 text-[#D17E49]', dotColor: 'bg-[#ECA172]' },
  thought_process: { label: 'Thought Process', icon: '🧠', badgeClass: 'bg-[#937485]/15 text-[#7A5A6D]', dotColor: 'bg-[#937485]' },
  problem: { label: 'Problem', icon: '🧩', badgeClass: 'bg-slate-100 text-slate-700', dotColor: 'bg-slate-400' }
};

export const DataDropPage: React.FC = () => {
  const {
    state,
    setActiveTab,
    addDataDrop,
    deleteDataDrop,
    exportDataDropMarkdown
  } = useAttackMode();

  const [content, setContent] = useState('');
  const [selectedType, setSelectedType] = useState<DataDropType>('insight');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    addDataDrop(content.trim(), selectedType);
    setContent('');
  };

  const filteredDrops = state.dataDrops
    .filter(d => (filterType === 'all' ? true : d.type === filterType))
    .filter(d => (searchQuery.trim() ? d.content.toLowerCase().includes(searchQuery.toLowerCase()) : true));

  const totalCount = state.dataDrops.length;
  const activeCategoryLabel = filterType === 'all'
    ? 'All Categories'
    : TYPE_CONFIG[filterType as DataDropType]?.label || filterType;

  return (
    <div className="max-w-md mx-auto sm:max-w-4xl px-3.5 sm:px-6 py-4 sm:py-5 space-y-5 font-sans w-full overflow-x-hidden">
      {/* 1. Header with Breadcrumb, Title & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <button
            onClick={() => setActiveTab('sections')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#937485] hover:text-[#7A5A6D] mb-1 cursor-pointer transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Daily Plan</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Data Drop
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Real-time notes for insights, behavioral triggers, patterns, and problems.
          </p>
        </div>

        {/* Prominent Export Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Export Filtered Category */}
          <button
            onClick={() => exportDataDropMarkdown(filterType)}
            className="px-3 py-2 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            title={`Export ${activeCategoryLabel} as Markdown`}
          >
            <FileText size={14} className="text-[#937485]" />
            <span>Export {filterType === 'all' ? 'All' : activeCategoryLabel} (.MD)</span>
            <Download size={12} className="text-slate-400" />
          </button>

          {/* Export Master All Categories */}
          {filterType !== 'all' && (
            <button
              onClick={() => exportDataDropMarkdown('all')}
              className="px-3 py-2 rounded-2xl bg-[#937485] hover:bg-[#836475] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              title="Export complete Data Drop archive as Markdown"
            >
              <Download size={14} />
              <span>Export All (.MD)</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Fast Capture Card (No titles needed, pure zero-friction) */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xs border border-slate-100 space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#937485]" />
            <span>Instant Capture</span>
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            Category automatically attached
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            rows={3}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="What insight, friction, bad habit trigger, or realization just occurred? Write freely without formatting..."
            className="w-full p-3.5 rounded-2xl bg-[#EEF0F6]/60 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#937485] focus:bg-white transition-all leading-relaxed"
          />

          {/* Type Selector Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
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
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
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
              className="px-5 py-2 rounded-xl bg-[#937485] hover:bg-[#836475] disabled:opacity-40 text-white font-bold text-xs tracking-wide transition-colors cursor-pointer shadow-xs shrink-0 self-end sm:self-auto"
            >
              Drop Note
            </button>
          </div>
        </form>
      </div>

      {/* 3. Filter Bar & Search */}
      <div className="space-y-2.5">
        {/* Category Filter Stepper */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {['all', 'insight', 'bad_habit', 'behavior', 'thought_process', 'problem'].map(f => {
            const count = f === 'all'
              ? state.dataDrops.length
              : state.dataDrops.filter(d => d.type === f).length;
            const isSelected = filterType === f;
            const icon = f === 'all' ? '📁' : TYPE_CONFIG[f as DataDropType]?.icon || '';
            const label = f === 'all' ? 'All' : TYPE_CONFIG[f as DataDropType]?.label || f;

            return (
              <button
                key={f}
                type="button"
                onClick={() => {
                  sound.playTap();
                  setFilterType(f);
                }}
                className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search input if more than 3 drops */}
        {state.dataDrops.length > 2 && (
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search in notes..."
              className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#937485] transition-colors"
            />
          </div>
        )}
      </div>

      {/* 4. Drops List */}
      <div className="space-y-3">
        {filteredDrops.map(drop => {
          const conf = TYPE_CONFIG[drop.type] || TYPE_CONFIG.insight;

          return (
            <div
              key={drop.id}
              className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-100 shadow-2xs space-y-2.5 transition-all hover:border-slate-200"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${conf.badgeClass}`}>
                  <span>{conf.icon}</span>
                  <span>{conf.label}</span>
                </span>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                    <Clock size={12} />
                    <span>{drop.createdAt}</span>
                  </div>

                  <button
                    onClick={() => deleteDataDrop(drop.id)}
                    className="text-slate-300 hover:text-red-500 p-1 transition-colors cursor-pointer"
                    title="Delete note"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">
                {drop.content}
              </p>
            </div>
          );
        })}

        {filteredDrops.length === 0 && (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 space-y-2">
            <div className="text-2xl">📝</div>
            <p className="text-xs font-bold text-slate-700">No notes found under this category</p>
            <p className="text-[11px] text-slate-400">
              {searchQuery ? 'Try clearing your search query.' : 'Type your realization in the box above to drop your first note.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
