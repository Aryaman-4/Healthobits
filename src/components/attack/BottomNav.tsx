import React from 'react';
import {
  Grid,
  Clock,
  Plus,
  BarChart2,
  User
} from 'lucide-react';
import { useAttackMode } from '../../context/AttackModeContext';
import { sound } from '../../utils/audio';

export const BottomNav: React.FC = () => {
  const { state, setActiveTab, openDataDropModal } = useAttackMode();
  const currentTab = state.activeTab;

  return (
    <div className="fixed bottom-4 inset-x-0 z-40 flex justify-center px-4 pointer-events-none font-sans">
      <nav className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-full px-5 py-2.5 shadow-lg border border-slate-200/60 flex items-center gap-5 sm:gap-7">
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
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E67370]" />
          )}
        </button>

        {/* Center Button: Mauve Circle (+) for DATA DROP */}
        <button
          onClick={() => {
            sound.playTap();
            openDataDropModal();
          }}
          className="w-12 h-12 rounded-full bg-[#937485] hover:bg-[#836475] text-white flex items-center justify-center shadow-md cursor-pointer transition-all active:scale-95"
          title="Data Drop: Quick capture insight, habit, or problem"
        >
          <Plus size={24} strokeWidth={2.5} />
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
          title="Reports & Analytics"
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
          title="Account & Settings"
        >
          <User size={20} />
        </button>
      </nav>
    </div>
  );
};
