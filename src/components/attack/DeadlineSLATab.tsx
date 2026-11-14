import React, { useState, useEffect } from 'react';
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  Plus,
  Filter,
  ArrowUpRight,
  Trash2,
  Calendar,
  AlertOctagon,
  ShieldAlert,
  Flame,
  Check
} from 'lucide-react';
import { useAttackMode } from '../../context/AttackModeContext';
import { SLATicket, SLAPriority, TriadCategory, SDTType } from '../../types/attackMode';
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

  // Filter & Sort
  const filteredTickets = state.slaTickets
    .filter(ticket => {
      if (filterStatus !== 'all' && ticket.status !== filterStatus) return false;
      if (filterPillar !== 'all' && ticket.category !== filterPillar) return false;
      return true;
    })
    .sort((a, b) => {
      // Priority ordering: P1 -> P2 -> P3 -> P4
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

  // Helper for live time-blindness countdown
  const getLiveCountdown = (isoString: string) => {
    const target = new Date(isoString).getTime();
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      return {
        formatted: 'BREACHED / PAST DUE',
        isCritical: true,
        hoursRemaining: 0
      };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = (n: number) => String(n).padStart(2, '0');
    const totalHours = diff / (1000 * 60 * 60);

    return {
      formatted: `${days > 0 ? `${days}d ` : ''}${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`,
      isCritical: totalHours < 12,
      hoursRemaining: totalHours
    };
  };

  const getPriorityStyle = (priority: SLAPriority, isCritical: boolean) => {
    switch (priority) {
      case 'P1':
        return 'bg-red-50 border-l-6 border-red-600 text-red-950';
      case 'P2':
        return 'bg-amber-50 border-l-6 border-amber-500 text-amber-950';
      case 'P3':
        return 'bg-yellow-50 border-l-6 border-yellow-400 text-yellow-950';
      case 'P4':
        return 'bg-emerald-50 border-l-6 border-emerald-500 text-emerald-950';
      default:
        return 'bg-slate-50 border-l-6 border-slate-400 text-slate-900';
    }
  };

  const getPriorityBadge = (priority: SLAPriority) => {
    switch (priority) {
      case 'P1':
        return 'bg-red-600 text-white font-mono';
      case 'P2':
        return 'bg-amber-500 text-white font-mono';
      case 'P3':
        return 'bg-yellow-500 text-slate-900 font-mono';
      case 'P4':
        return 'bg-emerald-600 text-white font-mono';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* 1. Header & Controls */}
      <div className="bg-white rounded-2xl border-2 border-[#E2E8F0] border-b-5 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">⚖️</span>
            <h2 className="font-black text-lg sm:text-xl text-slate-900 uppercase tracking-tight">
              The God Table — Incident-Priority SLA Ticketing
            </h2>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Engineered for time-blindness. Makes invisible deadlines physically urgent through hard countdowns.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playTap();
            setShowAddModal(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider border-2 border-b-4 border-red-800 active:border-b-2 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-xs self-start md:self-auto"
        >
          <Plus size={15} />
          <span>+ New Incident Ticket</span>
        </button>
      </div>

      {/* 2. Priority Matrix Legend & SLA Rules */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-mono text-[10px]">P1</span>
          <div>
            <div className="leading-tight">CRITICAL (&lt; 24h)</div>
            <div className="text-[10px] text-red-700 font-normal">Immediate Execution</div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-amber-500 text-white font-mono text-[10px]">P2</span>
          <div>
            <div className="leading-tight">HIGH (&lt; 72h)</div>
            <div className="text-[10px] text-amber-700 font-normal">Next In Queue</div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-900 flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-yellow-400 text-slate-900 font-mono text-[10px]">P3</span>
          <div>
            <div className="leading-tight">MEDIUM (&lt; 7d)</div>
            <div className="text-[10px] text-yellow-800 font-normal">Scheduled This Week</div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-mono text-[10px]">P4</span>
          <div>
            <div className="leading-tight">SAFE (&gt; 7d)</div>
            <div className="text-[10px] text-emerald-700 font-normal">Buffer Stage</div>
          </div>
        </div>
      </div>

      {/* 3. Filters & Search Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-black uppercase text-slate-500">Pillar:</span>
          {['all', 'rich', 'muscular', 'intelligent'].map(p => (
            <button
              key={p}
              onClick={() => setFilterPillar(p)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                filterPillar === p
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black uppercase text-slate-500">Status:</span>
          {(['active', 'resolved', 'all'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                filterStatus === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* 4. The Interactive God Table */}
      <div className="bg-white rounded-2xl border-2 border-[#E2E8F0] border-b-5 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-black uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">SLA / ID</th>
                <th className="py-3 px-3">Deliverable & Notes</th>
                <th className="py-3 px-3">Pillar / SDT</th>
                <th className="py-3 px-3">Alloc. Cap</th>
                <th className="py-3 px-3">Hard Deadline</th>
                <th className="py-3 px-3">Live Countdown</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTickets.map(ticket => {
                const conf = TRIAD_CONFIG[ticket.category];
                const countdown = getLiveCountdown(ticket.deadlineDateTime);
                const isResolved = ticket.status === 'resolved';

                return (
                  <tr
                    key={ticket.id}
                    className={`transition-colors ${
                      isResolved ? 'opacity-60 bg-slate-50' : getPriorityStyle(ticket.priority, countdown.isCritical)
                    }`}
                  >
                    {/* SLA Priority & ID */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${getPriorityBadge(
                            ticket.priority
                          )}`}
                        >
                          {ticket.priority}
                        </span>
                        <span className="font-mono font-bold text-slate-800">
                          {ticket.id}
                        </span>
                      </div>
                    </td>

                    {/* Deliverable Title & Notes */}
                    <td className="py-3.5 px-3 min-w-[220px]">
                      <div className="font-bold text-slate-900 leading-snug">
                        {ticket.title}
                      </div>
                      {ticket.notes && (
                        <p className="text-[11px] text-slate-600 font-medium mt-0.5 italic">
                          {ticket.notes}
                        </p>
                      )}
                    </td>

                    {/* Pillar & SDT */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="flex flex-col gap-1 items-start">
                        <span
                          className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${conf.badgeClass}`}
                        >
                          {conf.icon} {conf.label}
                        </span>
                        <span className="text-[9px] font-bold text-slate-500 uppercase">
                          {ticket.sdtType === 'intrinsic' ? '🎯 Intrinsic (70%)' : '⚡ Extrinsic (30%)'}
                        </span>
                      </div>
                    </td>

                    {/* Work Allocation Cap */}
                    <td className="py-3.5 px-3 whitespace-nowrap font-mono font-bold text-slate-700">
                      {ticket.allocationHours}h Max
                    </td>

                    {/* Hard Deadline */}
                    <td className="py-3.5 px-3 whitespace-nowrap font-medium text-slate-800">
                      <div>
                        {new Date(ticket.deadlineDateTime).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {new Date(ticket.deadlineDateTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>

                    {/* Live Time-Blindness Countdown */}
                    <td className="py-3.5 px-3 whitespace-nowrap font-mono font-black">
                      {isResolved ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle size={14} /> Resolved
                        </span>
                      ) : (
                        <div
                          className={`flex items-center gap-1.5 ${
                            countdown.isCritical
                              ? 'text-red-600 text-sm animate-pulse'
                              : 'text-slate-800'
                          }`}
                        >
                          <Clock size={13} className={countdown.isCritical ? 'text-red-600' : 'text-slate-500'} />
                          <span>{countdown.formatted}</span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {!isResolved && (
                          <button
                            onClick={() => pushTicketToToday(ticket.id)}
                            className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 font-bold text-[10px] uppercase flex items-center gap-1 cursor-pointer transition-all"
                            title="Push this deliverable directly to Today's quota"
                          >
                            <ArrowUpRight size={12} />
                            <span>Push Today</span>
                          </button>
                        )}

                        {!isResolved && (
                          <button
                            onClick={() => resolveTicket(ticket.id)}
                            className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase flex items-center gap-1 cursor-pointer transition-all"
                            title="Mark resolved on time"
                          >
                            <Check size={12} strokeWidth={3} />
                            <span>Resolve</span>
                          </button>
                        )}

                        <button
                          onClick={() => deleteTicket(ticket.id)}
                          className="p-1 rounded text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete ticket"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs font-semibold">
                    No incident tickets found matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Add SLA Ticket Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border-2 border-slate-300 border-b-6 max-w-md w-full p-5 space-y-4 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-lg">🚨</span>
                <h3 className="font-black text-sm text-slate-900 uppercase">
                  Log New Incident SLA Ticket
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 text-xs font-bold text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                  Deliverable Name
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Deliver Security Audit, 2.2x Deadlift, Cloud Video Ship..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                    Pillar
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as TriadCategory)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                  >
                    <option value="rich">💰 Rich</option>
                    <option value="muscular">💪 Muscular</option>
                    <option value="intelligent">🧠 Intelligent</option>
                    <option value="mundane">⚙️ Mundane</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                    Motivation (SDT)
                  </label>
                  <select
                    value={newSdt}
                    onChange={e => setNewSdt(e.target.value as SDTType)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                  >
                    <option value="extrinsic">⚡ Extrinsic (30%)</option>
                    <option value="intrinsic">🎯 Intrinsic (70%)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                    Allocated Work Cap (Hrs)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={newAllocHours}
                    onChange={e => setNewAllocHours(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                    Hard Deadline (Date & Time)
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={newDeadlineDate}
                    onChange={e => setNewDeadlineDate(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">
                  Context / Remediation Notes
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="Key acceptance criteria or instructions..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider border-2 border-b-4 border-red-800 cursor-pointer"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
