import React from 'react';
import { AttackModeProvider, useAttackMode } from './context/AttackModeContext';
import { AuthScreen } from './components/attack/AuthScreen';
import { HeaderCreedBanner } from './components/attack/HeaderCreedBanner';
import { SectionSystemTab } from './components/attack/SectionSystemTab';
import { SystemStatsTab } from './components/attack/SystemStatsTab';
import { DeadlineSLATab } from './components/attack/DeadlineSLATab';
import { AccountSettingsTab } from './components/attack/AccountSettingsTab';
import { OnboardingWizardModal } from './components/attack/OnboardingAndGuide';
import { DataDropModal } from './components/attack/DataDropModal';
import { DataDropPage } from './components/attack/DataDropPage';
import { AnchorModeModal } from './components/attack/AnchorModeModal';
import { SherlockProtocolModal } from './components/attack/SherlockProtocolModal';
import { SundayResetModal } from './components/attack/SundayResetModal';
import { BottomNav } from './components/attack/BottomNav';

const AppContent: React.FC = () => {
  const { state } = useAttackMode();

  // If user is unauthenticated, show clean professional AuthScreen
  if (!state.account.isLoggedIn) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-[#EEF0F6] text-slate-900 flex flex-col font-sans relative pb-28">
      {/* 1. Subtle Creed Header */}
      <HeaderCreedBanner />

      {/* 2. Modals & Protocols */}
      <OnboardingWizardModal />
      <AnchorModeModal />
      <DataDropModal />
      <SherlockProtocolModal />
      <SundayResetModal />

      {/* 3. Main Views */}
      <main className="flex-1">
        {state.activeTab === 'sections' && <SectionSystemTab />}
        {state.activeTab === 'datadrop' && <DataDropPage />}
        {state.activeTab === 'stats' && <SystemStatsTab />}
        {state.activeTab === 'sla' && <DeadlineSLATab />}
        {state.activeTab === 'account' && <AccountSettingsTab />}
      </main>

      {/* 4. Floating Bottom Navigation Bar (Matching Screenshot) */}
      <BottomNav />
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
