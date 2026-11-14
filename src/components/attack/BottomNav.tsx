import React from 'react';
import {
  Grid,
  Calendar,
  Plus,
  BarChart2,
  User,
  Clock
} from 'lucide-react';
import { useAttackMode } from '../../context/AttackModeContext';
import { sound } from '../../utils/audio';

export const BottomNav: React.FC<{ onQuickAdd?: () => void }> = ({ onQuickAdd }) => {
  const { state, setActiveTab } = useAttackMode();
  const currentTab = state.activeTab;

  return (
    <div className="fixed bottom-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-full px-4 py-2.5 shadow-lg border border-slate-200/60 flex items-center gap-4 sm:gap-6">
        {/* Tab 1: Today / Sections */}
        <button
          onClick={() => {
            sound.playTap();
            setActiveTab('sections');
          }}
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            currentTab === 'sections' ? 'text-[#937485]' : 'text-slate-400 hover:text-slate-700'
          }`}
          title="Today & Sections"
        >
          <Grid size={20} />
        </button>

        {/* Tab 2: Deadline SLA */}
        <button
          onClick={() => {
            sound.playTap();
            setActiveTab('sla');
          }}
          className={`p-2 rounded-full transition-colors cursor-pointer relative ${
            currentTab === 'sla' ? 'text-[#937485]' : 'text-slate-400 hover:text-slate-700'
          }`}
          title="Deadline SLA"
        >
          <Clock size={20} />
          {state.slaTickets.filter(s => s.status === 'active' && s.priority === 'P1').length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#E67370]" />
          )}
        </button>

        {/* Center Button: Mauve Circle (+) */}
        <button
          onClick={() => {
            sound.playTap();
            setActiveTab('sections');
            if (onQuickAdd) onQuickAdd();
          }}
          className="w-11 h-11 rounded-full bg-[#937485] hover:bg-[#836475] text-white flex items-center justify-center shadow-md cursor-pointer transition-all active:scale-95"
          title="Add Task"
        >
          <Plus size={22} strokeWidth={2.5} />
        </button>

        {/* Tab 3: Report / Stats */}
        <button
          onClick={() => {
            sound.playTap();
            setActiveTab('stats');
          }}
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            currentTab === 'stats' ? 'text-[#937485]' : 'text-slate-400 hover:text-slate-700'
          }`}
          title="Reports & Stats"
        >
          <BarChart2 size={20} />
        </button>

        {/* Tab 4: Account / Profile */}
        <button
          onClick={() => {
            sound.playTap();
            setActiveTab('account');
          }}
          className={`p-2 rounded-full transition-colors cursor-pointer ${
            currentTab === 'account' ? 'text-[#937485]' : 'text-slate-400 hover:text-slate-700'
          }`}
          title="Account"
        >
          <User size={20} />
        </button>
      </nav>
    </div>
  );
};
