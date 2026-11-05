import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { TopHud } from './components/layout/TopHud';
import { Navigation } from './components/layout/Navigation';
import { TodayAndHabitsTab } from './components/habits/TodayAndHabitsTab';
import { SkillTreeTab } from './components/skillTree/SkillTreeTab';
import { QuestsTab } from './components/quests/QuestsTab';
import { CharacterTab } from './components/character/CharacterTab';
import { LootVaultTab } from './components/vault/LootVaultTab';
import { PrintBookletModal } from './components/print/PrintBookletModal';
import { WorkoutStudioModal } from './components/studios/WorkoutStudioModal';
import { MusicStudioModal } from './components/studios/MusicStudioModal';
import { DualCycleModal } from './components/studios/DualCycleModal';
import { CareerLabModal } from './components/studios/CareerLabModal';
import { EnglishCoachModal } from './components/studios/EnglishCoachModal';
import { QuickLootDrawer } from './components/studios/QuickLootDrawer';
import { SundayLinkPrepModal } from './components/studios/SundayLinkPrepModal';
import { SettingsDrawer } from './components/settings/SettingsDrawer';
import { ShoppingBag } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveStudioModal } = useGame();
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#3C3C3C] flex flex-col font-fredoka relative">
      {/* Top Persistent HUD Bar */}
      <TopHud
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar & Mobile Bottom Dock */}
        <Navigation />

        {/* Dynamic Tab Content */}
        <main className="flex-1 p-3 sm:p-6 md:p-8 min-w-0 pb-32 md:pb-12">
          {activeTab === 'today' && <TodayAndHabitsTab />}
          {activeTab === 'skillTree' && <SkillTreeTab />}
          {activeTab === 'quests' && <QuestsTab />}
          {activeTab === 'character' && <CharacterTab />}
          {activeTab === 'vault' && <LootVaultTab />}
        </main>
      </div>

      {/* Persistent Floating Quick-Loot Action Button */}
      <div className="fixed bottom-[72px] md:bottom-6 right-3 sm:right-6 z-40">
        <button
          onClick={() => setActiveStudioModal('quickLoot')}
          className="flex items-center gap-1.5 sm:gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-[#FFC800] border-2 border-b-4 border-[#E5A400] text-[#3C3C3C] font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:scale-105 active:translate-y-1 transition-all cursor-pointer"
        >
          <ShoppingBag size={17} className="sm:w-[18px] sm:h-[18px]" />
          <span>🎒 Quick-Loot</span>
        </button>
      </div>

      {/* Polymath Interactive Sub-Studio Modals */}
      <WorkoutStudioModal />
      <MusicStudioModal />
      <DualCycleModal />
      <CareerLabModal />
      <EnglishCoachModal />
      <QuickLootDrawer />
      <SundayLinkPrepModal />

      {/* Printable French-Fold Pocket Booklet Generator Modal */}
      <PrintBookletModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />

      {/* Dynamic 100% Full CRUD Settings Drawer */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
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
