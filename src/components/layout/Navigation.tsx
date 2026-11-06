import React from 'react';
import { CalendarCheck, Route, Scroll, Trophy, Settings, LucideIcon } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { ActiveTab } from '../../types';
import { sound } from '../../utils/audio';

interface NavItem {
  id: ActiveTab;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  badge?: number;
}

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, totalPendingChests } = useGame();

  const navItems: NavItem[] = [
    {
      id: 'today',
      label: 'Today & Habits',
      shortLabel: 'Today',
      icon: CalendarCheck
    },
    {
      id: 'skillTree',
      label: 'Skill Tree',
      shortLabel: 'Skill Tree',
      icon: Route
    },
    {
      id: 'quests',
      label: 'Quests & Feats',
      shortLabel: 'Quests',
      icon: Scroll
    },
    {
      id: 'vault',
      label: 'Loot & Vaults',
      shortLabel: 'Loot',
      icon: Trophy,
      badge: totalPendingChests > 0 ? totalPendingChests : undefined
    },
    {
      id: 'settings',
      label: 'Account & Settings',
      shortLabel: 'Account',
      icon: Settings
    }
  ];

  const handleTabClick = (tabId: ActiveTab) => {
    sound.playTap();
    setActiveTab(tabId);
  };

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r-2 border-[#E5E5E5] p-4 shrink-0 min-h-[calc(100vh-65px)] justify-between">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="px-3 py-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#58CC02] border-2 border-b-4 border-[#46A302] flex items-center justify-center text-white font-black text-xl shadow-sm transform -rotate-3">
              🛡️
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tight text-[#3C3C3C] leading-none">
                POLYMATH QUEST
              </h1>
              <p className="text-[10px] font-extrabold uppercase text-[#777777] tracking-wider mt-0.5">
                Cloudflare D1 Life OS
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-extrabold text-xs uppercase tracking-wide border-2 transition-all cursor-pointer select-none active:translate-y-0.5 ${
                    isActive
                      ? 'bg-[#DDF4FF] border-[#84D8FF] text-[#1CB0F6] border-b-4 shadow-sm'
                      : 'bg-white border-transparent text-[#777777] hover:bg-gray-100 hover:text-[#3C3C3C]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={20}
                      className={isActive ? 'text-[#1CB0F6]' : 'text-[#777777]'}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="w-5 h-5 rounded-full bg-[#FF4B4B] text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Cloud Sync Status Footer in Sidebar */}
        <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-black text-[#58CC02] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#58CC02] animate-ping" />
            <span>D1 Synced</span>
          </div>
          <p className="text-[10px] text-[#888888] font-medium mt-0.5">
            Real-time persistence enabled
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Dock (Spacious, Ergonomic 5-Tab Bar) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-[#E5E5E5] px-2 py-1.5 shadow-lg">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all cursor-pointer relative min-w-[56px] ${
                  isActive
                    ? 'text-[#1CB0F6]'
                    : 'text-[#777777] hover:text-[#3C3C3C]'
                }`}
              >
                <div
                  className={`p-1 rounded-xl transition-all ${
                    isActive ? 'bg-[#DDF4FF] border border-[#84D8FF]' : ''
                  }`}
                >
                  <Icon size={20} />
                </div>
                <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-black' : 'font-extrabold'}`}>
                  {item.shortLabel}
                </span>

                {item.badge !== undefined && (
                  <span className="absolute top-0 right-2 w-4 h-4 rounded-full bg-[#FF4B4B] text-white text-[9px] font-black flex items-center justify-center shadow-xs animate-bounce-soft">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
