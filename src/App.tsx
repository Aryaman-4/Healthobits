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

const AppContent: React.FC = () => {
  const { activeTab } = useGame();
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#3C3C3C] flex flex-col font-fredoka">
      {/* Top Persistent HUD Bar */}
      <TopHud onOpenPrintModal={() => setIsPrintModalOpen(true)} />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar & Mobile Bottom Dock */}
        <Navigation />

        {/* Dynamic Tab Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 min-w-0 pb-24 md:pb-12">
          {activeTab === 'today' && <TodayAndHabitsTab />}
          {activeTab === 'skillTree' && <SkillTreeTab />}
          {activeTab === 'quests' && <QuestsTab />}
          {activeTab === 'character' && <CharacterTab />}
          {activeTab === 'vault' && <LootVaultTab />}
        </main>
      </div>

      {/* Printable French-Fold Pocket Booklet Generator Modal */}
      <PrintBookletModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
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

