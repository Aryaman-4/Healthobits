import React from 'react';
import { AttackModeProvider, useAttackMode } from './context/AttackModeContext';
import { HeaderCreedBanner } from './components/attack/HeaderCreedBanner';
import { TodayTab } from './components/attack/TodayTab';
import { DeadlineSLATab } from './components/attack/DeadlineSLATab';
import { WeeklyMutatorTab } from './components/attack/WeeklyMutatorTab';

const AppContent: React.FC = () => {
  const { state } = useAttackMode();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* 1. Top Persistent Creed Banner & 3-Tab Bar */}
      <HeaderCreedBanner />

      {/* 2. Main Tab View (Maximum 3 Top-Level Tabs, Zero Bloat) */}
      <main className="flex-1 pb-16">
        {state.activeTab === 'today' && <TodayTab />}
        {state.activeTab === 'sla' && <DeadlineSLATab />}
        {state.activeTab === 'weekly' && <WeeklyMutatorTab />}
      </main>

      {/* 3. Minimalist Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white py-4 px-4 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-800">⚡ ATTACK MODE</span>
            <span>•</span>
            <span>"Be a slave to your logical thinking. Mood and motivation are irrelevant."</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            SLA System v2.0 • LocalStorage Persisted • 70/30 SDT Engine
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AttackModeProvider>
      <AppContent />
    </AttackModeProvider>
  );
};

export default App;
