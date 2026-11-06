import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { TopHud } from './components/layout/TopHud';
import { Navigation } from './components/layout/Navigation';
import { TodayAndHabitsTab } from './components/habits/TodayAndHabitsTab';
import { SkillTreeTab } from './components/skillTree/SkillTreeTab';
import { QuestsTab } from './components/quests/QuestsTab';
import { LootVaultTab } from './components/vault/LootVaultTab';
import { AccountSettingsTab } from './components/settings/AccountSettingsTab';
import { CharacterTab } from './components/character/CharacterTab';
import { AuthScreen } from './components/auth/AuthScreen';
import { OnboardingWizardModal } from './components/onboarding/OnboardingWizardModal';
import { ShiftSwitcherModal } from './components/schedule/ShiftSwitcherModal';
import { CharacterAndGuideModal } from './components/character/CharacterAndGuideModal';
import { WorkoutStudioModal } from './components/studios/WorkoutStudioModal';
import { MusicStudioModal } from './components/studios/MusicStudioModal';
import { DualCycleModal } from './components/studios/DualCycleModal';
import { CareerLabModal } from './components/studios/CareerLabModal';
import { EnglishCoachModal } from './components/studios/EnglishCoachModal';
import { QuickLootDrawer } from './components/studios/QuickLootDrawer';
import { SundayLinkPrepModal } from './components/studios/SundayLinkPrepModal';
import { ShoppingBag } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activeTab,
    setActiveStudioModal,
    account,
    isOnboardingOpen,
    setIsOnboardingOpen,
    isShiftSwitcherOpen,
    setIsShiftSwitcherOpen,
    isCharacterGuideModalOpen,
    setIsCharacterGuideModalOpen
  } = useGame();

  // If user is unauthenticated, show welcoming Duolingo-style AuthScreen
  if (!account?.isLoggedIn) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#3C3C3C] flex flex-col font-fredoka relative">
      {/* Top Persistent HUD Bar (Clean 3-Element Bar: Character Pill, Day Mode Badge, Chest/Streak) */}
      <TopHud />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar & Mobile Bottom Dock (5 Ergonomic Tabs) */}
        <Navigation />

        {/* Dynamic Tab Content (Mobile-First 1-Column Layout, py-6 px-4 whitespace) */}
        <main className="flex-1 min-w-0 pb-28 md:pb-12">
          {activeTab === 'today' && <TodayAndHabitsTab />}
          {activeTab === 'skillTree' && <SkillTreeTab />}
          {activeTab === 'quests' && <QuestsTab />}
          {activeTab === 'vault' && <LootVaultTab />}
          {activeTab === 'settings' && <AccountSettingsTab />}
          {activeTab === 'character' && <CharacterTab />}
        </main>
      </div>

      {/* Persistent Floating Quick-Loot Action Button */}
      <div className="fixed bottom-[74px] md:bottom-6 right-3 sm:right-6 z-40">
        <button
          onClick={() => setActiveStudioModal('quickLoot')}
          className="flex items-center gap-1.5 sm:gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-[#FFC800] border-2 border-b-4 border-[#E5A400] text-[#3C3C3C] font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:scale-105 active:translate-y-1 transition-all cursor-pointer"
        >
          <ShoppingBag size={17} className="sm:w-[18px] sm:h-[18px]" />
          <span>🎒 Quick-Loot</span>
        </button>
      </div>

      {/* Polymath Interactive Sub-Studio Modals (Progressive Disclosure) */}
      <WorkoutStudioModal />
      <MusicStudioModal />
      <DualCycleModal />
      <CareerLabModal />
      <EnglishCoachModal />
      <QuickLootDrawer />
      <SundayLinkPrepModal />

      {/* Onboarding Wizard Modal */}
      <OnboardingWizardModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      {/* Shift Switcher Modal (Triggered by Center Top Badge) */}
      <ShiftSwitcherModal
        isOpen={isShiftSwitcherOpen}
        onClose={() => setIsShiftSwitcherOpen(false)}
      />

      {/* Character Sheet & How to Play Guide Modal (Triggered by Character Pill / Guide Icon) */}
      <CharacterAndGuideModal
        isOpen={isCharacterGuideModalOpen}
        onClose={() => setIsCharacterGuideModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
};

export default App;
