import React from 'react';
import { AttackModeProvider, useAttackMode } from './context/AttackModeContext';
import { AuthScreen } from './components/attack/AuthScreen';
import { HeaderCreedBanner } from './components/attack/HeaderCreedBanner';
import { SectionSystemTab } from './components/attack/SectionSystemTab';
import { SystemStatsTab } from './components/attack/SystemStatsTab';
import { DeadlineSLATab } from './components/attack/DeadlineSLATab';
import { AccountSettingsTab } from './components/attack/AccountSettingsTab';
import { OnboardingWizardModal } from './components/attack/OnboardingAndGuide';

const AppContent: React.FC = () => {
  const { state } = useAttackMode();

  // If user is unauthenticated, show welcoming Duolingo-style AuthScreen
  if (!state.account.isLoggedIn) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* 1. Persistent Logical Creed & Navigation Bar */}
      <HeaderCreedBanner />

      {/* 2. Onboarding Wizard Modal */}
      <OnboardingWizardModal />

      {/* 3. Main Views (Zero Clutter, 4 Clear Tabs) */}
      <main className="flex-1 pb-16">
        {state.activeTab === 'sections' && <SectionSystemTab />}
        {state.activeTab === 'stats' && <SystemStatsTab />}
        {state.activeTab === 'sla' && <DeadlineSLATab />}
        {state.activeTab === 'account' && <AccountSettingsTab />}
      </main>

      {/* 4. Minimalist Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white py-4 px-4 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-800">⚡ ATTACK MODE</span>
            <span>•</span>
            <span>"Be a slave to your logical thinking. Mood and motivation are irrelevant."</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Cloudflare D1 Persisted • 7-Day Section System • 4-Week Month Accumulator
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
