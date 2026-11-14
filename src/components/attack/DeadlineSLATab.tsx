import React, { useState, useEffect } from 'react';
import {
  Clock,
  Check,
  Plus,
  Trash2,
  ArrowUpRight,
  AlertCircle
} from 'lucide-react';
import { useAttackMode } from '../../context/AttackModeContext';
import { SLAPriority, TriadCategory, SDTType } from '../../types/attackMode';
import { TRIAD_CONFIG } from '../../data/attackModeSeed';
import { sound } from '../../utils/audio';

export const DeadlineSLATab: React.FC = () => {
  const {
    state,
    addSLATicket,
    resolveTicket,
    deleteTicket,
    pushTicketToToday,
    metrics
  } = useAttackMode();

  const [filterPillar, setFilterPillar] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'resolved'>('active');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Ticket Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TriadCategory>('rich');
  const [newSdt, setNewSdt] = useState<SDTType>('extrinsic');
  const [newAllocHours, setNewAllocHours] = useState<number>(2.0);
  const [newDeadlineDate, setNewDeadlineDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().slice(0, 16);
  });
  const [newNotes, setNewNotes] = useState('');

  // Ticking time state (re-renders countdowns every second)
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredTickets = state.slaTickets
    .filter(ticket => {
      if (filterStatus !== 'all' && ticket.status !== filterStatus) return false;
      if (filterPillar !== 'all' && ticket.category !== filterPillar) return false;
      return true;
    })
    .sort((a, b) => {
      const pOrder: Record<SLAPriority, number> = { P1: 1, P2: 2, P3: 3, P4: 4 };
      if (pOrder[a.priority] !== pOrder[b.priority]) {
        return pOrder[a.priority] - pOrder[b.priority];
      }
      return new Date(a.deadlineDateTime).getTime() - new Date(b.deadlineDateTime).getTime();
    });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addSLATicket({
      title: newTitle.trim(),
      category: newCategory,
      sdtType: newSdt,
      allocationHours: newAllocHours,
      deadlineDateTime: new Date(newDeadlineDate).toISOString(),
      notes: newNotes.trim() || undefined
    });

    setNewTitle('');
    setNewNotes('');
    setShowAddModal(false);
  };

  const getLiveCountdown = (isoString: string) => {
    const target = new Date(isoString).getTime();
    const diff = target - Date.now();

    if (diff <= 0) {
      return { formatted: 'Past Due', isCritical: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = (n: number) => String(n).padStart(2, '0');
    const totalHours = diff / (1000 * 60 * 60);

    return {
      formatted: `${days > 0 ? `${days}d ` : ''}${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`,
      isCritical: totalHours < 12
    };
  };

  const getBadgeColor = (p: SLAPriority) => {
    switch (p) {
      case 'P1':
        return 'bg-[#E67370] text-white';
      case 'P2':
        return 'bg-[#ECA172] text-white';
      case 'P3':
        return 'bg-amber-100 text-amber-900';
      case 'P4':
        return 'bg-[#7EB982] text-white';
    }
  };

  return (
    <div className="max-w-md mx-auto sm:max-w-4xl px-4 sm:px-6 py-5 space-y-5 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Deadline SLA
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Hard incident timers for time-sensitive commitments
          </p>
        </div>

        <button
          onClick={() => {
            sound.playTap();
            setShowAddModal(true);
          }}
          className="px-3.5 py-2 rounded-xl bg-[#937485] hover:bg-[#836475] text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <Plus size={14} />
          <span>New Ticket</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar text-xs">
        <div className="flex items-center gap-1.5">
          {(['all', 'rich', 'muscular', 'intelligent'] as const).map(p => (
            <button
              key={p}
              onClick={() => setFilterPillar(p)}
              className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition-all cursor-pointer ${
                filterPillar === p
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-100'
              }`}
            >
              {p === 'all' ? 'All' : p}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          {(['active', 'resolved', 'all'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-2.5 py-1 rounded-lg font-semibold capitalize transition-all cursor-pointer ${
                filterStatus === s
                  ? 'bg-[#937485] text-white'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket List Cards */}
      <div className="space-y-3">
        {filteredTickets.map(ticket => {
          const countdown = getLiveCountdown(ticket.deadlineDateTime);
          const isResolved = ticket.status === 'resolved';

          return (
            <div
              key={ticket.id}
              className={`bg-white rounded-3xl p-4 sm:p-5 shadow-xs border transition-all ${
                isResolved
                  ? 'border-slate-100 opacity-60'
                  : countdown.isCritical
                  ? 'border-[#E67370] bg-red-50/20'
                  : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getBadgeColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    <span className="font-mono text-xs font-semibold text-slate-500">
                      {ticket.id}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 capitalize">
                      {ticket.category} • {ticket.allocationHours}h cap
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {ticket.title}
                  </h3>

                  {ticket.notes && (
                    <p className="text-xs text-slate-500 font-medium">
                      {ticket.notes}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs pt-1">
                    <Clock size={13} className={countdown.isCritical ? 'text-[#E67370]' : 'text-slate-400'} />
                    <span className={`font-mono font-semibold ${countdown.isCritical ? 'text-[#E67370]' : 'text-slate-600'}`}>
                      {isResolved ? 'Resolved' : countdown.formatted}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center">
                  {!isResolved && (
                    <button
                      onClick={() => pushTicketToToday(ticket.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                      title="Push to Today"
                    >
                      <ArrowUpRight size={13} />
                      <span className="hidden sm:inline">Push</span>
                    </button>
                  )}

                  {!isResolved && (
                    <button
                      onClick={() => resolveTicket(ticket.id)}
                      className="p-1.5 rounded-xl bg-[#7EB982] hover:bg-[#6FA873] text-white cursor-pointer transition-colors"
                      title="Resolve"
                    >
                      <Check size={14} strokeWidth={3} />
                    </button>
                  )}

                  <button
                    onClick={() => deleteTicket(ticket.id)}
                    className="p-1.5 rounded-xl text-slate-300 hover:text-red-500 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredTickets.length === 0 && (
          <div className="p-8 rounded-3xl bg-white border border-dashed border-slate-200 text-center text-xs text-slate-400">
            No incident tickets matching selected filters.
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-100 animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">
                New Deadline Ticket
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-6 h-6 rounded-lg bg-slate-100 text-xs font-semibold text-slate-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deliverable Name
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Deliver client report, 2.2x deadlift..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#937485]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pillar
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as TriadCategory)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
                  >
                    <option value="rich">Rich</option>
                    <option value="muscular">Muscular</option>
                    <option value="intelligent">Intelligent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Work Cap (Hours)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={newAllocHours}
                    onChange={e => setNewAllocHours(Number(e.target.value))}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hard Deadline (Date & Time)
                </label>
                <input
                  type="datetime-local"
                  required
                  value={newDeadlineDate}
                  onChange={e => setNewDeadlineDate(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="Key instructions..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#937485] hover:bg-[#836475] text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
