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
  ScheduleFilter,
  AlankarItem,
  CareerLabItem,
  SundayLinkPrep
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
  activeSpread: 'first' | 'second';
  setActiveSpread: (spread: 'first' | 'second') => void;

  // Schedule Filter (Auto detects MWF, TTS, Sunday or Manual Override)
  scheduleFilter: ScheduleFilter;
  setScheduleFilter: (filter: ScheduleFilter) => void;

  // Active Sub-Studio Modal Launcher
  activeStudioModal: 'workout' | 'music' | 'art' | 'reading' | 'career' | 'english' | 'quickLoot' | 'sundayLinks' | null;
  setActiveStudioModal: (modal: 'workout' | 'music' | 'art' | 'reading' | 'career' | 'english' | 'quickLoot' | 'sundayLinks' | null) => void;

  // Habit Actions
  toggleHabitCompletion: (habitId: string, dateStr: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'completedDates'>) => void;
  editHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  updateHabitLaunchUrl: (habitId: string, url: string) => void;

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

  // Polymath Specific Actions
  updateAlankarStatus: (id: number, instrument: 'flute' | 'whistle', status: 'locked' | 'practicing' | 'mastered') => void;
  logBookPages: (increment: number, quote?: string) => void;
  updateFinelinerCycle: (day: number, notes?: string, refUrl?: string) => void;
  updateCareerLabStatus: (id: string, status: 'in_lab' | 'code_pushed' | 'published') => void;
  addExpense: (amount: number, category: string) => void;
  toggleVlogClip: (dateStr: string, clipNumber: 1 | 2) => void;
  addAnkiCard: (front: string, back: string, category: 'quote' | 'sargam' | 'cloud' | 'vocab') => void;
  exportAnkiCsv: () => void;
  updateContactSpoken: (id: string, notes?: string) => void;
  updateSundayLinks: (links: Partial<SundayLinkPrep>) => void;

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

const STORAGE_KEY = 'polymath_quest_rpg_state_v2';

const GameContext = createContext<GameContextType | undefined>(undefined);

// Helper to determine day of week schedule
export const getScheduleTypeFromDate = (dateStr: string): 'mwf' | 'tts' | 'sunday' => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const day = dateObj.getDay(); // 0 is Sunday, 1 is Mon, 2 is Tue...
  if (day === 0) return 'sunday';
  if (day === 1 || day === 3 || day === 5) return 'mwf';
  return 'tts';
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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

  // Schedule Filter: defaults to 'today' (auto-detected), but user can override to 'mwf', 'tts', or 'sunday'
  const [scheduleFilter, setScheduleFilter] = useState<ScheduleFilter>('today');

  // Active Sub-Studio Modal Launcher
  const [activeStudioModal, setActiveStudioModal] = useState<'workout' | 'music' | 'art' | 'reading' | 'career' | 'english' | 'quickLoot' | 'sundayLinks' | null>(null);

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

      const branchIsActiveNow = isBranchActiveOnDate(habit.branchId, updatedHabits, dateStr);
      if (!branchWasActiveBefore && branchIsActiveNow) {
        confetti({
          particleCount: 28,
          spread: 50,
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
            particleCount: 70,
            spread: 80,
            origin: { y: 0.6 }
          });
        }
      }

      // Check if any new skill node unlocked
      let pendingRare = prev.pendingChests.rare;
      let pendingEpic = prev.pendingChests.epic;
      if (!isCompleted) {
        const branch = prev.branches[habit.branchId];
        const oldProgress = getBranchNodeProgress(branch, prev.habits, prev.character.currentYearMonth);
        const newProgress = getBranchNodeProgress(branch, updatedHabits, prev.character.currentYearMonth);

        if (newProgress.unlockedThresholds.length > oldProgress.unlockedThresholds.length) {
          pendingRare += (newProgress.unlockedThresholds.length - oldProgress.unlockedThresholds.length);
          sound.playUnlock();
          confetti({
            particleCount: 80,
            spread: 80,
            origin: { y: 0.5 }
          });
        }

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

  const updateHabitLaunchUrl = (habitId: string, url: string) => {
    sound.playTap();
    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h => (h.id === habitId ? { ...h, launchUrl: url } : h))
    }));
  };

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

  // POLYMATH SPECIFIC ACTIONS
  const updateAlankarStatus = (id: number, instrument: 'flute' | 'whistle', status: 'locked' | 'practicing' | 'mastered') => {
    sound.playTap();
    setState(prev => ({
      ...prev,
      alankars: prev.alankars.map(a =>
        a.id === id
          ? {
              ...a,
              [instrument === 'flute' ? 'fluteStatus' : 'whistleStatus']: status
            }
          : a
      )
    }));
  };

  const logBookPages = (increment: number, quote?: string) => {
    sound.playCheck();
    confetti({
      particleCount: 20,
      spread: 40,
      origin: { y: 0.7 }
    });

    setState(prev => {
      const nextPages = Math.min(prev.bookTracker.totalPages, prev.bookTracker.currentPage + increment);
      const updatedQuotes = quote?.trim()
        ? [
            {
              id: `q-${Date.now()}`,
              text: quote.trim(),
              date: formatDate(new Date())
            },
            ...prev.bookTracker.quotes
          ]
        : prev.bookTracker.quotes;

      // Also add quote to Anki Cards in Quick-Loot
      const updatedAnki = quote?.trim()
        ? [
            {
              id: `anki-${Date.now()}`,
              front: `Insight from "${prev.bookTracker.title}" (Page ${nextPages})`,
              back: quote.trim(),
              category: 'quote' as const,
              date: formatDate(new Date())
            },
            ...prev.quickLoot.ankiCards
          ]
        : prev.quickLoot.ankiCards;

      return {
        ...prev,
        bookTracker: {
          ...prev.bookTracker,
          currentPage: nextPages,
          quotes: updatedQuotes
        },
        quickLoot: {
          ...prev.quickLoot,
          ankiCards: updatedAnki
        }
      };
    });
  };

  const updateFinelinerCycle = (day: number, notes?: string, refUrl?: string) => {
    sound.playTap();
    setState(prev => ({
      ...prev,
      finelinerTracker: {
        ...prev.finelinerTracker,
        currentCycleDay: Math.min(14, Math.max(1, day)),
        notes: notes !== undefined ? notes : prev.finelinerTracker.notes,
        referenceUrl: refUrl !== undefined ? refUrl : prev.finelinerTracker.referenceUrl
      }
    }));
  };

  const updateCareerLabStatus = (id: string, status: 'in_lab' | 'code_pushed' | 'published') => {
    sound.playTap();
    if (status === 'published') {
      sound.playUnlock();
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    }
    setState(prev => ({
      ...prev,
      careerLabs: prev.careerLabs.map(lab => (lab.id === id ? { ...lab, status } : lab))
    }));
  };

  const addExpense = (amount: number, category: string) => {
    sound.playTap();
    const newExp = {
      id: `exp-${Date.now()}`,
      amount,
      category: category.trim() || 'General Expense',
      date: formatDate(new Date())
    };
    setState(prev => ({
      ...prev,
      quickLoot: {
        ...prev.quickLoot,
        expenses: [newExp, ...prev.quickLoot.expenses]
      }
    }));
  };

  const toggleVlogClip = (dateStr: string, clipNumber: 1 | 2) => {
    sound.playCheck();
    setState(prev => {
      const current = prev.quickLoot.vlogClips[dateStr] || { clip1: false, clip2: false };
      const updated = {
        ...current,
        [clipNumber === 1 ? 'clip1' : 'clip2']: !current[clipNumber === 1 ? 'clip1' : 'clip2']
      };
      return {
        ...prev,
        quickLoot: {
          ...prev.quickLoot,
          vlogClips: {
            ...prev.quickLoot.vlogClips,
            [dateStr]: updated
          }
        }
      };
    });
  };

  const addAnkiCard = (front: string, back: string, category: 'quote' | 'sargam' | 'cloud' | 'vocab') => {
    sound.playTap();
    const card = {
      id: `anki-${Date.now()}`,
      front: front.trim(),
      back: back.trim(),
      category,
      date: formatDate(new Date())
    };
    setState(prev => ({
      ...prev,
      quickLoot: {
        ...prev.quickLoot,
        ankiCards: [card, ...prev.quickLoot.ankiCards]
      }
    }));
  };

  const exportAnkiCsv = () => {
    sound.playChestOpen();
    const cards = state.quickLoot.ankiCards;
    if (cards.length === 0) {
      alert('No flashcards logged yet to export!');
      return;
    }

    const csvContent = cards
      .map(c => `"${c.front.replace(/"/g, '""')}","${c.back.replace(/"/g, '""')}","${c.category}"`)
      .join('\n');

    const blob = new Blob([`Front,Back,Tags\n${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PolymathQuest_AnkiExport_${formatDate(new Date())}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateContactSpoken = (id: string, notes?: string) => {
    sound.playCheck();
    confetti({ particleCount: 25, spread: 45, origin: { y: 0.7 } });
    setState(prev => ({
      ...prev,
      quickLoot: {
        ...prev.quickLoot,
        contacts: prev.quickLoot.contacts.map(c =>
          c.id === id
            ? {
                ...c,
                lastSpokenDate: formatDate(new Date()),
                notes: notes !== undefined ? notes : c.notes
              }
            : c
        )
      }
    }));
  };

  const updateSundayLinks = (links: Partial<SundayLinkPrep>) => {
    sound.playTap();
    setState(prev => ({
      ...prev,
      sundayLinks: {
        ...prev.sundayLinks,
        ...links
      }
    }));
  };

  // End of Month Ceremony Roll-Over
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

      const nextMonthIndex = (prev.character.currentMonthIndex === 3 ? 1 : prev.character.currentMonthIndex + 1) as 1 | 2 | 3;
      const [year, month] = prev.character.currentYearMonth.split('-').map(Number);
      const nextDate = new Date(year, month, 1);
      const nextYearMonth = formatDate(nextDate).slice(0, 7);

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
          priorMonthsSeasonalDays: nextMonthIndex === 1 ? 0 : progress.cumulativeDays,
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
    if (window.confirm('Reset Polymath Quest back to the initial playground data?')) {
      setState(INITIAL_STATE);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

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
        scheduleFilter,
        setScheduleFilter,
        activeStudioModal,
        setActiveStudioModal,
        toggleHabitCompletion,
        addHabit,
        editHabit,
        deleteHabit,
        updateHabitLaunchUrl,
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
        updateAlankarStatus,
        logBookPages,
        updateFinelinerCycle,
        updateCareerLabStatus,
        addExpense,
        toggleVlogClip,
        addAnkiCard,
        exportAnkiCsv,
        updateContactSpoken,
        updateSundayLinks,
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
