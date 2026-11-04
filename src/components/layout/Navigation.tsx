import React from 'react';
import { CalendarCheck, Route, Scroll, UserCheck, Trophy, LucideIcon } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { sound } from '../../utils/audio';

interface NavItem {
  id: 'today' | 'skillTree' | 'quests' | 'character' | 'vault';
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
      label: 'Habits & Today',
      shortLabel: 'Today',
      icon: CalendarCheck
    },
    {
      id: 'skillTree',
      label: 'Skill Tree',
      shortLabel: 'Tree',
      icon: Route
    },
    {
      id: 'quests',
      label: 'Quests & Feats',
      shortLabel: 'Quests',
      icon: Scroll
    },
    {
      id: 'character',
      label: 'Character & Key',
      shortLabel: 'Hero',
      icon: UserCheck
    },
    {
      id: 'vault',
      label: 'Loot & Vault',
      shortLabel: 'Vault',
      icon: Trophy,
      badge: totalPendingChests > 0 ? totalPendingChests : undefined
    }
  ];

  const handleTabClick = (tabId: NavItem['id']) => {
    sound.playTap();
    setActiveTab(tabId);
  };

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r-2 border-[#E5E5E5] p-4 shrink-0 min-h-[calc(100vh-65px)] justify-between">
        <div className="space-y-6">
          {/* Logo / Brand Header */}
          <div className="px-3 py-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#58CC02] border-2 border-b-4 border-[#46A302] flex items-center justify-center text-white font-black text-xl shadow-sm transform -rotate-3">
              ⚔️
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight text-[#3C3C3C] leading-none">
                POLYMATH QUEST
              </h1>
              <p className="text-[10px] font-extrabold uppercase text-[#777777] tracking-wider mt-0.5">
                Duolingo RPG Life OS
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
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-extrabold text-sm uppercase tracking-wide border-2 transition-all cursor-pointer select-none active:translate-y-0.5 ${
                    isActive
                      ? 'bg-[#DDF4FF] border-[#84D8FF] text-[#1CB0F6] border-b-4 shadow-sm'
                      : 'bg-white border-transparent text-[#777777] hover:bg-gray-100 hover:text-[#3C3C3C]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={22}
                      className={isActive ? 'text-[#1CB0F6]' : 'text-[#777777]'}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="w-6 h-6 rounded-full bg-[#FF4B4B] text-white text-xs font-black flex items-center justify-center animate-bounce-soft">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer info */}
        <div className="p-3 bg-[#F7F7F7] rounded-2xl border-2 border-[#E5E5E5] text-center">
          <div className="text-xs font-black text-[#3C3C3C]">Duolingo Tactile Edition</div>
          <div className="text-[11px] text-[#777777] font-semibold mt-0.5">
            1 Point Per Branch / Day Rule
          </div>
        </div>
      </aside>

      {/* Mobile Floating Bottom Dock */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t-2 border-[#E5E5E5] px-2 py-2 flex items-center justify-around shadow-lg">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all cursor-pointer select-none ${
                isActive
                  ? 'bg-[#DDF4FF] border-2 border-[#84D8FF] text-[#1CB0F6] -translate-y-1'
                  : 'text-[#777777] hover:text-[#3C3C3C]'
              }`}
            >
              <div className="relative">
                <Icon size={22} className={isActive ? 'text-[#1CB0F6]' : 'text-[#777777]'} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#FF4B4B] text-white text-[9px] font-black flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider mt-0.5">
                {item.shortLabel}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
