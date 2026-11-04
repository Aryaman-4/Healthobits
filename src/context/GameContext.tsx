import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  AppState,
  AttributeBranch,
  BranchId,
  BuffOrDebuff,
  ClaimedLootLog,
  Habit,
  LootItem,
  LootRarity,
  MonthlyQuest,
} from '../types';
import { INITIAL_STATE } from '../data/seedData';
import { sound } from '../utils/audio';
import {
  calculateCharacterOverallLevel,
  calculateHabitStreak,
  formatDate,
  isBranchActiveOnDate,
  NODE_THRESHOLDS,
  getBranchNodeProgress
} from '../utils/gameMath';

interface GameContextType {
  state: AppState;
  activeTab: 'today' | 'skillTree' | 'quests' | 'character' | 'vault';
  setActiveTab: (tab: 'today' | 'skillTree' | 'quests' | 'character' | 'vault') => void;
  keystoneModeOnly: boolean;
  setKeystoneModeOnly: React.Dispatch<React.SetStateAction<boolean>>;
  soundEnabled: boolean;
  toggleSound: () => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  activeSpread: 'first' | 'second'; // 1-15 or 16-31
  setActiveSpread: (spread: 'first' | 'second') => void;

  // Habit Actions
  toggleHabitCompletion: (habitId: string, dateStr: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'completedDates'>) => void;
  editHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;

  // Quest Actions
  toggleQuestCompletion: (questId: string) => void;
  addQuest: (quest: Omit<MonthlyQuest, 'id'>) => void;
  deleteQuest: (questId: string) => void;
  importFeatFromScratchpad: (branchId: BranchId, featText: string) => void;

  // Character & Scratchpad
  updateCharacter: (updates: Partial<AppState['character']>) => void;
  signSeasonalPact: (signatureDataUrl: string) => void;
  addScratchpadIdea: (branchId: BranchId, idea: string) => void;
  deleteScratchpadIdea: (branchId: BranchId, index: number) => void;
  updateMonthlyNotes: (notes: string) => void;

  // Buffs & Debuffs
  addBuffDebuff: (item: Omit<BuffOrDebuff, 'id'>) => void;
  deleteBuffDebuff: (id: string) => void;

  // Loot Vault Actions
  addLootOption: (rarity: LootRarity, title: string) => void;
  claimLootReward: (rarity: LootRarity, rewardTitle: string, triggerReason: string) => void;
  awardChest: (rarity: LootRarity) => void;

  // Ceremony
  runEndOfMonthCeremony: () => void;
  resetAllDemoData: () => void;

  // Derived stats
  overallLevel: number;
  branchLevels: Record<BranchId, number>;
  seasonalGains: Record<BranchId, number>;
  totalPendingChests: number;
  keystoneStreakDays: number;
}

const STORAGE_KEY = 'questling_rpg_state_v1';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial state from localStorage or fallback to INITIAL_STATE
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved state:', e);
    }
    return INITIAL_STATE;
  });

  const [activeTab, setActiveTab] = useState<'today' | 'skillTree' | 'quests' | 'character' | 'vault'>('today');
  const [keystoneModeOnly, setKeystoneModeOnly] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(sound.isEnabled());
  const [selectedDate, setSelectedDate] = useState<string>(() => formatDate(new Date()));
  const [activeSpread, setActiveSpread] = useState<'first' | 'second'>('first');

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }, [state]);

  const toggleSound = () => {
    const next = sound.toggleSound();
    setSoundEnabled(next);
  };

  // Toggle Habit Completion
  const toggleHabitCompletion = (habitId: string, dateStr: string) => {
    setState(prev => {
      const habit = prev.habits.find(h => h.id === habitId);
      if (!habit) return prev;

      const isCompleted = habit.completedDates.includes(dateStr);
      let updatedDates: string[];

      // Check if branch was already active on this date prior to this toggle
      const branchWasActiveBefore = isBranchActiveOnDate(habit.branchId, prev.habits, dateStr);

      if (isCompleted) {
        updatedDates = habit.completedDates.filter(d => d !== dateStr);
        sound.playUncheck();
      } else {
        updatedDates = [...habit.completedDates, dateStr];
        if (habit.isKeystone) {
          sound.playKeystoneCheck();
        } else {
          sound.playCheck();
        }
      }

      const updatedHabits = prev.habits.map(h =>
        h.id === habitId ? { ...h, completedDates: updatedDates } : h
      );

      // Check if this newly made the branch active
      const branchIsActiveNow = isBranchActiveOnDate(habit.branchId, updatedHabits, dateStr);
      if (!branchWasActiveBefore && branchIsActiveNow) {
        // Celebratory mini confetti burst for +1 branch day!
        confetti({
          particleCount: 24,
          spread: 45,
          origin: { y: 0.8 },
          colors: [prev.branches[habit.branchId].colorHex, '#FFC800', '#58CC02']
        });
      }

      // Check for 7-day Keystone streak trigger for Common Loot
      let pendingCommon = prev.pendingChests.common;
      if (!isCompleted && habit.isKeystone) {
        const streakInfo = calculateHabitStreak({ ...habit, completedDates: updatedDates }, dateStr);
        if (streakInfo.currentStreak === 7 || streakInfo.longestStreak === 7) {
          pendingCommon += 1;
          sound.playUnlock();
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }

      // Check if any new skill node unlocked by this new active day
      let pendingRare = prev.pendingChests.rare;
      let pendingEpic = prev.pendingChests.epic;
      if (!isCompleted) {
        const branch = prev.branches[habit.branchId];
        const oldProgress = getBranchNodeProgress(branch, prev.habits, prev.character.currentYearMonth);
        const newProgress = getBranchNodeProgress(branch, updatedHabits, prev.character.currentYearMonth);

        // If a new threshold is crossed
        if (newProgress.unlockedThresholds.length > oldProgress.unlockedThresholds.length) {
          pendingRare += (newProgress.unlockedThresholds.length - oldProgress.unlockedThresholds.length);
          sound.playUnlock();
          confetti({
            particleCount: 80,
            spread: 80,
            origin: { y: 0.5 }
          });
        }

        // If node 80 was just reached
        if (!oldProgress.unlockedThresholds.includes(80) && newProgress.unlockedThresholds.includes(80)) {
          pendingEpic += 1;
          sound.playUnlock();
        }
      }

      return {
        ...prev,
        habits: updatedHabits,
        pendingChests: {
          ...prev.pendingChests,
          common: pendingCommon,
          rare: pendingRare,
          epic: pendingEpic
        }
      };
    });
  };

  const addHabit = (newHabitData: Omit<Habit, 'id' | 'completedDates'>) => {
    sound.playTap();
    const newHabit: Habit = {
      ...newHabitData,
      id: `h-${Date.now()}`,
      completedDates: [],
      createdDate: formatDate(new Date())
    };
    setState(prev => {
      // If marked as keystone, un-keystone other habits in this branch
      let habits = prev.habits;
      if (newHabit.isKeystone) {
        habits = habits.map(h => (h.branchId === newHabit.branchId ? { ...h, isKeystone: false } : h));
      }
      return {
        ...prev,
        habits: [...habits, newHabit]
      };
    });
  };

  const editHabit = (id: string, updates: Partial<Habit>) => {
    sound.playTap();
    setState(prev => {
      let habits = prev.habits.map(h => (h.id === id ? { ...h, ...updates } : h));
      if (updates.isKeystone) {
        const target = habits.find(h => h.id === id);
        if (target) {
          habits = habits.map(h =>
            h.id !== id && h.branchId === target.branchId ? { ...h, isKeystone: false } : h
          );
        }
      }
      return { ...prev, habits };
    });
  };

  const deleteHabit = (id: string) => {
    sound.playTap();
    setState(prev => ({
      ...prev,
      habits: prev.habits.filter(h => h.id !== id)
    }));
  };

  // Toggle Quest Completion
  const toggleQuestCompletion = (questId: string) => {
    setState(prev => {
      const quest = prev.monthlyQuests.find(q => q.id === questId);
      if (!quest) return prev;

      const nextCompleted = !quest.isCompleted;
      if (nextCompleted) {
        sound.playUnlock();
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.5 }
        });
      } else {
        sound.playUncheck();
      }

      return {
        ...prev,
        monthlyQuests: prev.monthlyQuests.map(q =>
          q.id === questId ? { ...q, isCompleted: nextCompleted } : q
        )
      };
    });
  };

  const addQuest = (questData: Omit<MonthlyQuest, 'id'>) => {
    sound.playTap();
    const newQuest: MonthlyQuest = {
      ...questData,
      id: `q-${Date.now()}`
    };
    setState(prev => ({
      ...prev,
      monthlyQuests: [...prev.monthlyQuests, newQuest]
    }));
  };

  const deleteQuest = (questId: string) => {
    sound.playTap();
    setState(prev => ({
      ...prev,
      monthlyQuests: prev.monthlyQuests.filter(q => q.id !== questId)
    }));
  };

  // Import Feat Idea from Scratchpad into Monthly Side Quests
  const importFeatFromScratchpad = (branchId: BranchId, featText: string) => {
    sound.playTap();
    const newQuest: MonthlyQuest = {
      id: `q-${Date.now()}`,
      title: featText,
      branchId,
      isMainQuest: false,
      isCompleted: false
    };

    setState(prev => ({
      ...prev,
      monthlyQuests: [...prev.monthlyQuests, newQuest]
    }));

    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.7 }
    });
  };

  const updateCharacter = (updates: Partial<AppState['character']>) => {
    sound.playTap();
    setState(prev => ({
      ...prev,
      character: { ...prev.character, ...updates }
    }));
  };

  const signSeasonalPact = (signatureDataUrl: string) => {
    sound.playChestOpen();
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FFC800', '#58CC02', '#1CB0F6', '#FF4B4B']
    });

    setState(prev => ({
      ...prev,
      character: {
        ...prev.character,
        pactSigned: true,
        pactSignatureDataUrl: signatureDataUrl,
        pactSignedDate: formatDate(new Date())
      }
    }));
  };

  const addScratchpadIdea = (branchId: BranchId, idea: string) => {
    sound.playTap();
    setState(prev => ({
      ...prev,
      branches: {
        ...prev.branches,
        [branchId]: {
          ...prev.branches[branchId],
          featIdeasScratchpad: [...prev.branches[branchId].featIdeasScratchpad, idea]
        }
      }
    }));
  };

  const deleteScratchpadIdea = (branchId: BranchId, index: number) => {
    sound.playTap();
    setState(prev => ({
      ...prev,
      branches: {
        ...prev.branches,
        [branchId]: {
          ...prev.branches[branchId],
          featIdeasScratchpad: prev.branches[branchId].featIdeasScratchpad.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const updateMonthlyNotes = (notes: string) => {
    setState(prev => ({
      ...prev,
      character: {
        ...prev.character,
        monthlyReflectionNotes: notes
      }
    }));
  };

  const addBuffDebuff = (item: Omit<BuffOrDebuff, 'id'>) => {
    sound.playTap();
    const newItem: BuffOrDebuff = {
      ...item,
      id: `${item.type}-${Date.now()}`
    };
    setState(prev => ({
      ...prev,
      buffsDebuffs: [...prev.buffsDebuffs, newItem]
    }));
  };

  const deleteBuffDebuff = (id: string) => {
    sound.playTap();
    setState(prev => ({
      ...prev,
      buffsDebuffs: prev.buffsDebuffs.filter(b => b.id !== id)
    }));
  };

  const addLootOption = (rarity: LootRarity, title: string) => {
    sound.playTap();
    const newItem: LootItem = {
      id: `loot-${Date.now()}`,
      rarity,
      title
    };
    setState(prev => ({
      ...prev,
      lootPool: [...prev.lootPool, newItem]
    }));
  };

  const claimLootReward = (rarity: LootRarity, rewardTitle: string, triggerReason: string) => {
    sound.playChestOpen();
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 }
    });

    const newClaim: ClaimedLootLog = {
      id: `claim-${Date.now()}`,
      rarity,
      rewardTitle,
      claimedDate: formatDate(new Date()),
      triggerReason
    };

    setState(prev => ({
      ...prev,
      claimedLoot: [newClaim, ...prev.claimedLoot],
      pendingChests: {
        ...prev.pendingChests,
        [rarity]: Math.max(0, prev.pendingChests[rarity] - 1)
      }
    }));
  };

  const awardChest = (rarity: LootRarity) => {
    sound.playUnlock();
    setState(prev => ({
      ...prev,
      pendingChests: {
        ...prev.pendingChests,
        [rarity]: prev.pendingChests[rarity] + 1
      }
    }));
  };

  // End of Month Level Up Ceremony Roll-Over
  const runEndOfMonthCeremony = () => {
    sound.playLevelUp();
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.4 }
    });

    setState(prev => {
      const { branchLevels } = calculateCharacterOverallLevel(
        prev.branches,
        prev.habits,
        prev.monthlyQuests,
        prev.character.currentYearMonth
      );

      // Advance month
      const nextMonthIndex = (prev.character.currentMonthIndex === 3 ? 1 : prev.character.currentMonthIndex + 1) as 1 | 2 | 3;
      const [year, month] = prev.character.currentYearMonth.split('-').map(Number);
      const nextDate = new Date(year, month, 1);
      const nextYearMonth = formatDate(nextDate).slice(0, 7);

      // Record monthly summary
      const branchDaysSummary: Record<BranchId, number> = {} as Record<BranchId, number>;
      (Object.keys(prev.branches) as BranchId[]).forEach(id => {
        const branch = prev.branches[id];
        const progress = getBranchNodeProgress(branch, prev.habits, prev.character.currentYearMonth);
        branchDaysSummary[id] = progress.currentMonthDays;
      });

      const updatedBranches: Record<BranchId, AttributeBranch> = { ...prev.branches };
      (Object.keys(updatedBranches) as BranchId[]).forEach(id => {
        const b = updatedBranches[id];
        const progress = getBranchNodeProgress(b, prev.habits, prev.character.currentYearMonth);
        const unlockedNodeStatuses = NODE_THRESHOLDS.map(t => ({
          threshold: t,
          unlocked: progress.cumulativeDays >= t,
          unlockedInMonth: progress.cumulativeDays >= t ? prev.character.currentMonthIndex : undefined
        }));

        updatedBranches[id] = {
          ...b,
          currentMonthStartLevel: branchLevels[id],
          priorMonthsSeasonalDays: nextMonthIndex === 1 ? 0 : progress.cumulativeDays, // reset if season ends
          seasonStartLevel: nextMonthIndex === 1 ? branchLevels[id] : b.seasonStartLevel,
          unlockedNodes: unlockedNodeStatuses
        };
      });

      return {
        ...prev,
        branches: updatedBranches,
        character: {
          ...prev.character,
          currentMonthIndex: nextMonthIndex,
          currentYearMonth: nextYearMonth,
          seasonNumber: nextMonthIndex === 1 ? prev.character.seasonNumber + 1 : prev.character.seasonNumber,
          monthlyReflectionNotes: ''
        },
        monthlySummaries: [
          ...prev.monthlySummaries,
          {
            monthIndex: prev.character.currentMonthIndex,
            monthName: `Month ${prev.character.currentMonthIndex} (${prev.character.currentYearMonth})`,
            branchDays: branchDaysSummary,
            nodesUnlocked: 2,
            featsCompleted: prev.monthlyQuests.filter(q => q.isCompleted).length
          }
        ]
      };
    });
  };

  const resetAllDemoData = () => {
    sound.playTap();
    if (window.confirm('Reset Questling back to the initial demo playground data?')) {
      setState(INITIAL_STATE);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Calculate Overall Level
  const { overallLevel, branchLevels, seasonalGains } = calculateCharacterOverallLevel(
    state.branches,
    state.habits,
    state.monthlyQuests,
    state.character.currentYearMonth
  );

  const totalPendingChests =
    state.pendingChests.common +
    state.pendingChests.rare +
    state.pendingChests.epic +
    state.pendingChests.legendary;

  // Compute Keystone streak days (longest among current keystone habits)
  const keystoneHabits = state.habits.filter(h => h.isKeystone);
  const keystoneStreakDays = Math.max(
    0,
    ...keystoneHabits.map(h => calculateHabitStreak(h, selectedDate).currentStreak)
  );

  return (
    <GameContext.Provider
      value={{
        state,
        activeTab,
        setActiveTab,
        keystoneModeOnly,
        setKeystoneModeOnly,
        soundEnabled,
        toggleSound,
        selectedDate,
        setSelectedDate,
        activeSpread,
        setActiveSpread,
        toggleHabitCompletion,
        addHabit,
        editHabit,
        deleteHabit,
        toggleQuestCompletion,
        addQuest,
        deleteQuest,
        importFeatFromScratchpad,
        updateCharacter,
        signSeasonalPact,
        addScratchpadIdea,
        deleteScratchpadIdea,
        updateMonthlyNotes,
        addBuffDebuff,
        deleteBuffDebuff,
        addLootOption,
        claimLootReward,
        awardChest,
        runEndOfMonthCeremony,
        resetAllDemoData,
        overallLevel,
        branchLevels,
        seasonalGains,
        totalPendingChests,
        keystoneStreakDays
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
