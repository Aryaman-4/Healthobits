import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  AttackModeState,
  AttackModeTab,
  SectionTask,
  SLATicket,
  MonthlyTarget,
  WeekScorecard,
  MonthlyHistoryRecord,
  DataDropEntry,
  DataDropType,
  AnchorHabit,
  SherlockCaseLog,
  UserAccount,
  DayOfWeek,
  TriadCategory,
  SDTType
} from '../types/attackMode';
import {
  getInitialAttackModeState,
  getTodayDateString,
  getTodayDayOfWeek,
  CREED_MANTRAS,
  DAYS_OF_WEEK
} from '../data/attackModeSeed';
import { sound } from '../utils/audio';

const STORAGE_KEY = 'attack_mode_state_v3';

interface AttackModeContextType {
  state: AttackModeState;
  // Auth
  loginUser: (email: string, pass: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (email: string, pass: string, name: string) => Promise<{ success: boolean; error?: string }>;
  loginAsGuest: () => void;
  logoutUser: () => void;
  // Navigation & View
  setActiveTab: (tab: AttackModeTab) => void;
  setSelectedDayOfWeek: (day: DayOfWeek) => void;
  setViewMode: (mode: 'day' | 'weekGrid') => void;
  toggleAnchorMode: () => void;
  openAnchorModal: () => void;
  closeAnchorModal: () => void;
  toggleAnchorHabit: (id: string) => void;
  addAnchorHabit: (title: string, icon?: string) => void;
  deleteAnchorHabit: (id: string) => void;
  resetAnchorHabits: () => void;
  nextCreed: () => void;
  setDailyQuotaX: (x: number) => void;
  // Section Tasks
  addSectionTask: (day: DayOfWeek, section: 'rich' | 'muscular' | 'intelligent', title: string, allocMinutes?: number) => void;
  toggleSectionTask: (id: string) => void;
  deleteSectionTask: (id: string) => void;
  // Sunday Reset & Weekly Archive Engine
  archiveWeekAndReset: (nextWeekTargetX: number, keepRecurringTasks: boolean) => void;
  // Data Drop (Center '+' feature)
  addDataDrop: (content: string, type: DataDropType) => void;
  deleteDataDrop: (id: string) => void;
  openDataDropModal: () => void;
  closeDataDropModal: () => void;
  // Sherlock Holmes Contingency Protocol (Come Here)
  addSherlockLog: (log: { whatHappened: string; whyHappened: string; howToSolve: string; contingencyPlan: string }) => void;
  openSherlockModal: () => void;
  closeSherlockModal: () => void;
  openSundayResetModal: () => void;
  closeSundayResetModal: () => void;
  // SLA
  addSLATicket: (ticketData: {
    title: string;
    category: TriadCategory;
    sdtType: SDTType;
    allocationHours: number;
    deadlineDateTime: string;
    notes?: string;
  }) => void;
  resolveTicket: (id: string) => void;
  deleteTicket: (id: string) => void;
  pushTicketToToday: (ticketId: string) => void;
  // Monthly Targets
  incrementMonthlyTarget: (id: string, step?: number) => void;
  decrementMonthlyTarget: (id: string, step?: number) => void;
  addMonthlyTarget: (targetData: Omit<MonthlyTarget, 'id'>) => void;
  deleteMonthlyTarget: (id: string) => void;
  // Guide & Settings
  dismissGuide: () => void;
  reopenGuide: () => void;
  openOnboarding: () => void;
  closeOnboarding: () => void;
  toggleSound: () => boolean;
  setMutationLog: (log: string) => void;
  // Exporters
  exportMarkdown: () => void;
  exportCSV: () => void;
  exportDataDropMarkdown: (category?: string) => void;
  // Metrics
  metrics: {
    currentDayStats: {
      totalTasks: number;
      completedTasks: number;
      pct: number;
    };
    allWeekStats: {
      totalTasks: number;
      completedTasks: number;
      weeklyTarget: number;
      weeklyPct: number;
      richCompleted: number;
      muscularCompleted: number;
      intelligentCompleted: number;
    };
    monthStats: {
      fourWeekTotalCompleted: number;
      fourWeekTarget: number;
      monthPct: number;
      overallGrade: 'S' | 'A' | 'B' | 'C';
      monthlyHistory: MonthlyHistoryRecord[];
    };
    slaSummary: {
      p1Active: number;
      p2Active: number;
      totalActive: number;
      resolvedCount: number;
    };
  };
}

const AttackModeContext = createContext<AttackModeContextType | null>(null);

export const AttackModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AttackModeState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const initial = getInitialAttackModeState();
        return {
          ...initial,
          ...parsed,
          anchorHabits: parsed.anchorHabits?.length ? parsed.anchorHabits : initial.anchorHabits,
          isAnchorModalOpen: false,
          isDataDropModalOpen: false,
          isSherlockModalOpen: false,
          isSundayResetModalOpen: false
        };
      }
    } catch (e) {
      console.warn('Failed to parse state from localStorage:', e);
    }
    return getInitialAttackModeState();
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }, [state]);

  // Auth Handlers
  const loginUser = async (email: string, pass: string, name?: string) => {
    sound.playTap();
    if (!email || !pass) {
      return { success: false, error: 'Email and password are required.' };
    }

    try {
      const resp = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await resp.json();

      if (data.success) {
        setState(prev => ({
          ...prev,
          account: {
            userId: data.user.id,
            email: data.user.email,
            name: data.user.characterName || name || email.split('@')[0],
            isLoggedIn: true,
            authToken: data.token,
            syncStatus: 'synced',
            lastSyncedAt: new Date().toISOString()
          }
        }));
        sound.playLevelUp();
        return { success: true };
      }
    } catch (err) {
      console.info('Backend unreachable, using local fallback:', err);
    }

    const displayName = name || email.split('@')[0];
    setState(prev => ({
      ...prev,
      account: {
        userId: `usr_${Date.now()}`,
        email: email.trim().toLowerCase(),
        name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
        isLoggedIn: true,
        authToken: `tok_${Date.now()}`,
        syncStatus: 'synced',
        lastSyncedAt: new Date().toISOString()
      }
    }));

    sound.playLevelUp();
    return { success: true };
  };

  const registerUser = async (email: string, pass: string, name: string) => {
    sound.playTap();
    if (!email || !pass || pass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    try {
      const resp = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass, characterName: name })
      });
      const data = await resp.json();

      if (data.success) {
        setState(prev => ({
          ...prev,
          account: {
            userId: data.user.id,
            email: data.user.email,
            name: data.user.characterName || name,
            isLoggedIn: true,
            authToken: data.token,
            syncStatus: 'synced',
            lastSyncedAt: new Date().toISOString()
          },
          isOnboardingOpen: true
        }));
        sound.playFanfare();
        return { success: true };
      }
    } catch (err) {
      console.info('Backend unreachable, using local registration fallback:', err);
    }

    setState(prev => ({
      ...prev,
      account: {
        userId: `usr_${Date.now()}`,
        email: email.trim().toLowerCase(),
        name: name.trim() || 'Aryan',
        isLoggedIn: true,
        authToken: `tok_${Date.now()}`,
        syncStatus: 'synced',
        lastSyncedAt: new Date().toISOString()
      },
      isOnboardingOpen: true
    }));

    sound.playFanfare();
    return { success: true };
  };

  const loginAsGuest = () => {
    sound.playLevelUp();
    setState(prev => ({
      ...prev,
      account: {
        userId: 'usr_guest_demo',
        email: 'adventurer@attackmode.dev',
        name: 'Aryan',
        isLoggedIn: true,
        syncStatus: 'synced',
        lastSyncedAt: new Date().toISOString()
      }
    }));
  };

  const logoutUser = () => {
    sound.playTap();
    setState(prev => ({
      ...prev,
      account: {
        ...prev.account,
        isLoggedIn: false
      }
    }));
  };

  // Navigation
  const setActiveTab = (tab: AttackModeTab) => {
    sound.playTap();
    setState(prev => ({ ...prev, activeTab: tab }));
  };

  const setSelectedDayOfWeek = (day: DayOfWeek) => {
    sound.playTap();
    setState(prev => ({ ...prev, selectedDayOfWeek: day }));
  };

  const setViewMode = (mode: 'day' | 'weekGrid') => {
    sound.playTap();
    setState(prev => ({ ...prev, viewMode: mode }));
  };

  const toggleAnchorMode = () => {
    sound.playLevelUp();
    setState(prev => ({ ...prev, anchorModeActive: !prev.anchorModeActive }));
  };

  const openAnchorModal = () => {
    sound.playTap();
    setState(prev => ({ ...prev, isAnchorModalOpen: true }));
  };

  const closeAnchorModal = () => {
    setState(prev => ({ ...prev, isAnchorModalOpen: false }));
  };

  const toggleAnchorHabit = (id: string) => {
    sound.playCheck();
    setState(prev => {
      const nextHabits = prev.anchorHabits.map(h => {
        if (h.id === id) {
          const nextVal = !h.isCompleted;
          if (nextVal) {
            confetti({
              particleCount: 25,
              spread: 45,
              origin: { y: 0.8 },
              colors: ['#78909C', '#7EB982', '#937485']
            });
          }
          return { ...h, isCompleted: nextVal };
        }
        return h;
      });
      return { ...prev, anchorHabits: nextHabits, anchorModeActive: true };
    });
  };

  const addAnchorHabit = (title: string, icon: string = '⚓') => {
    if (!title.trim()) return;
    sound.playTap();
    const newHabit: AnchorHabit = {
      id: `anchor-${Date.now()}`,
      title: title.trim(),
      icon,
      isCompleted: false
    };
    setState(prev => ({
      ...prev,
      anchorHabits: [...prev.anchorHabits, newHabit]
    }));
  };

  const deleteAnchorHabit = (id: string) => {
    sound.playTap();
    setState(prev => ({
      ...prev,
      anchorHabits: prev.anchorHabits.filter(h => h.id !== id)
    }));
  };

  const resetAnchorHabits = () => {
    sound.playTap();
    setState(prev => ({
      ...prev,
      anchorHabits: prev.anchorHabits.map(h => ({ ...h, isCompleted: false }))
    }));
  };

  const nextCreed = () => {
    sound.playTap();
    setState(prev => ({
      ...prev,
      activeCreedIndex: (prev.activeCreedIndex + 1) % CREED_MANTRAS.length
    }));
  };

  const setDailyQuotaX = (x: number) => {
    const validX = Math.max(1, Math.min(15, x));
    sound.playTap();
    setState(prev => {
      const updatedScorecards = prev.weeklyScorecards.map(sc => ({
        ...sc,
        targetTasks: validX * 7
      }));
      return {
        ...prev,
        dailyQuotaX: validX,
        weeklyScorecards: updatedScorecards
      };
    });
  };

  // Section Tasks
  const addSectionTask = (
    day: DayOfWeek,
    section: 'rich' | 'muscular' | 'intelligent',
    title: string,
    allocMinutes: number = 30
  ) => {
    if (!title.trim()) return;
    sound.playTap();

    const newTask: SectionTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      dayOfWeek: day,
      section,
      title: title.trim(),
      isCompleted: false,
      allocationMinutes: allocMinutes,
      deadlineTime: '18:00'
    };

    setState(prev => ({
      ...prev,
      sectionTasks: [...prev.sectionTasks, newTask]
    }));
  };

  const toggleSectionTask = (id: string) => {
    setState(prev => {
      let newlyCompleted = false;
      const updated = prev.sectionTasks.map(t => {
        if (t.id === id) {
          const willComplete = !t.isCompleted;
          if (willComplete) newlyCompleted = true;
          return {
            ...t,
            isCompleted: willComplete,
            completedAt: willComplete ? new Date().toISOString() : undefined
          };
        }
        return t;
      });

      if (newlyCompleted) {
        sound.playCheck();
        const targetDay = prev.sectionTasks.find(t => t.id === id)?.dayOfWeek;
        if (targetDay) {
          const dayTasks = updated.filter(t => t.dayOfWeek === targetDay);
          if (dayTasks.length > 0 && dayTasks.every(t => t.isCompleted)) {
            sound.playFanfare();
            try {
              confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
            } catch (e) {}
          }
        }
      } else {
        sound.playTap();
      }

      return {
        ...prev,
        sectionTasks: updated
      };
    });
  };

  const deleteSectionTask = (id: string) => {
    sound.playTap();
    setState(prev => ({
      ...prev,
      sectionTasks: prev.sectionTasks.filter(t => t.id !== id)
    }));
  };

  // Sunday Reset & Weekly Archive Engine
  const archiveWeekAndReset = (nextWeekTargetX: number, keepRecurringTasks: boolean) => {
    sound.playFanfare();
    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}

    const completedThisWeek = state.sectionTasks.filter(t => t.isCompleted).length;
    const targetThisWeek = state.dailyQuotaX * 7;
    const weekPct = Math.round((completedThisWeek / targetThisWeek) * 100);

    let grade: 'S' | 'A' | 'B' | 'C' = 'B';
    if (weekPct >= 95) grade = 'S';
    else if (weekPct >= 85) grade = 'A';
    else if (weekPct >= 70) grade = 'B';
    else grade = 'C';

    setState(prev => {
      // Find current active week or advance
      const currentActiveIndex = prev.weeklyScorecards.findIndex(sc => sc.completedTasks === 0);
      const targetIndex = currentActiveIndex !== -1 ? currentActiveIndex : 0;

      const updatedScorecards = prev.weeklyScorecards.map((sc, idx) => {
        if (idx === targetIndex) {
          return {
            ...sc,
            completedTasks: completedThisWeek,
            targetTasks: targetThisWeek,
            grade,
            slaOnTimeRate: 95
          };
        }
        return sc;
      });

      // Reset task states for fresh sprint
      const nextTasks = keepRecurringTasks
        ? prev.sectionTasks.map(t => ({ ...t, isCompleted: false, completedAt: undefined }))
        : prev.sectionTasks;

      return {
        ...prev,
        dailyQuotaX: nextWeekTargetX,
        weeklyScorecards: updatedScorecards,
        sectionTasks: nextTasks,
        selectedDayOfWeek: 'Monday',
        isSundayResetModalOpen: false
      };
    });
  };

  // Data Drop (Center '+' feature)
  const addDataDrop = (content: string, type: DataDropType) => {
    if (!content.trim()) return;
    sound.playCheck();

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeFormatted = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newDrop: DataDropEntry = {
      id: `drop-${Date.now()}`,
      content: content.trim(),
      type,
      createdAt: `${dateFormatted} • ${timeFormatted}`
    };

    setState(prev => ({
      ...prev,
      dataDrops: [newDrop, ...prev.dataDrops],
      isDataDropModalOpen: false
    }));
  };

  const deleteDataDrop = (id: string) => {
    sound.playTap();
    setState(prev => ({
      ...prev,
      dataDrops: prev.dataDrops.filter(d => d.id !== id)
    }));
  };

  const openDataDropModal = () => {
    sound.playTap();
    setState(prev => ({ ...prev, isDataDropModalOpen: true }));
  };

  const closeDataDropModal = () => {
    setState(prev => ({ ...prev, isDataDropModalOpen: false }));
  };

  // Sherlock Holmes Contingency Protocol (Come Here)
  const addSherlockLog = (log: { whatHappened: string; whyHappened: string; howToSolve: string; contingencyPlan: string }) => {
    sound.playLevelUp();
    const newLog: SherlockCaseLog = {
      id: `case-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      ...log
    };

    setState(prev => ({
      ...prev,
      sherlockLogs: [newLog, ...prev.sherlockLogs],
      isSherlockModalOpen: false
    }));
  };

  const openSherlockModal = () => {
    sound.playTap();
    setState(prev => ({ ...prev, isSherlockModalOpen: true }));
  };

  const closeSherlockModal = () => {
    setState(prev => ({ ...prev, isSherlockModalOpen: false }));
  };

  const openSundayResetModal = () => {
    sound.playTap();
    setState(prev => ({ ...prev, isSundayResetModalOpen: true }));
  };

  const closeSundayResetModal = () => {
    setState(prev => ({ ...prev, isSundayResetModalOpen: false }));
  };

  // SLA Tickets
  const addSLATicket = (ticketData: {
    title: string;
    category: TriadCategory;
    sdtType: SDTType;
    allocationHours: number;
    deadlineDateTime: string;
    notes?: string;
  }) => {
    sound.playTap();
    const hoursRemaining = (new Date(ticketData.deadlineDateTime).getTime() - Date.now()) / (3600 * 1000);
    let priority: 'P1' | 'P2' | 'P3' | 'P4' = 'P3';
    if (hoursRemaining < 24) priority = 'P1';
    else if (hoursRemaining < 72) priority = 'P2';
    else if (hoursRemaining <= 168) priority = 'P3';
    else priority = 'P4';

    const count = state.slaTickets.length + 101;
    const newTicket: SLATicket = {
      id: `ATK-${count}`,
      title: ticketData.title.trim(),
      category: ticketData.category,
      sdtType: ticketData.sdtType,
      priority,
      allocationHours: ticketData.allocationHours,
      deadlineDateTime: ticketData.deadlineDateTime,
      status: 'active',
      createdAt: new Date().toISOString(),
      notes: ticketData.notes
    };

    setState(prev => ({
      ...prev,
      slaTickets: [newTicket, ...prev.slaTickets]
    }));
  };

  const resolveTicket = (id: string) => {
    sound.playCheck();
    try {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    } catch (e) {}

    setState(prev => ({
      ...prev,
      slaTickets: prev.slaTickets.map(t =>
        t.id === id ? { ...t, status: 'resolved', resolvedAt: new Date().toISOString() } : t
      )
    }));
  };

  const deleteTicket = (id: string) => {
    sound.playTap();
    setState(prev => ({
      ...prev,
      slaTickets: prev.slaTickets.filter(t => t.id !== id)
    }));
  };

  const pushTicketToToday = (ticketId: string) => {
    const ticket = state.slaTickets.find(t => t.id === ticketId);
    if (!ticket) return;

    sound.playLevelUp();
    const currentDay = state.selectedDayOfWeek;

    const newTask: SectionTask = {
      id: `task-from-sla-${ticket.id}-${Date.now()}`,
      dayOfWeek: currentDay,
      section: ticket.category === 'mundane' ? 'rich' : ticket.category,
      title: `[${ticket.id}] ${ticket.title}`,
      isCompleted: false,
      allocationMinutes: Math.round(ticket.allocationHours * 60),
      deadlineTime: '18:00'
    };

    setState(prev => ({
      ...prev,
      activeTab: 'sections',
      sectionTasks: [...prev.sectionTasks, newTask]
    }));
  };

  // Monthly Targets
  const incrementMonthlyTarget = (id: string, step: number = 1) => {
    sound.playTap();
    setState(prev => ({
      ...prev,
      monthlyTargets: prev.monthlyTargets.map(m =>
        m.id === id ? { ...m, currentCount: Math.min(m.targetCount, m.currentCount + step) } : m
      )
    }));
  };

  const decrementMonthlyTarget = (id: string, step: number = 1) => {
    sound.playTap();
    setState(prev => ({
      ...prev,
      monthlyTargets: prev.monthlyTargets.map(m =>
        m.id === id ? { ...m, currentCount: Math.max(0, m.currentCount - step) } : m
      )
    }));
  };

  const addMonthlyTarget = (targetData: Omit<MonthlyTarget, 'id'>) => {
    sound.playTap();
    const newTarget: MonthlyTarget = {
      id: `target-${Date.now()}`,
      ...targetData
    };
    setState(prev => ({
      ...prev,
      monthlyTargets: [...prev.monthlyTargets, newTarget]
    }));
  };

  const deleteMonthlyTarget = (id: string) => {
    sound.playTap();
    setState(prev => ({
      ...prev,
      monthlyTargets: prev.monthlyTargets.filter(m => m.id !== id)
    }));
  };

  // Guide & Settings
  const dismissGuide = () => {
    sound.playTap();
    setState(prev => ({ ...prev, isGuideDismissed: true }));
  };

  const reopenGuide = () => {
    sound.playTap();
    setState(prev => ({ ...prev, isGuideDismissed: false }));
  };

  const openOnboarding = () => {
    sound.playTap();
    setState(prev => ({ ...prev, isOnboardingOpen: true }));
  };

  const closeOnboarding = () => {
    setState(prev => ({ ...prev, isOnboardingOpen: false }));
  };

  const toggleSound = () => {
    const isNowEnabled = sound.toggleSound();
    setState(prev => ({ ...prev, soundEnabled: isNowEnabled }));
    return isNowEnabled;
  };

  const setMutationLog = (log: string) => {
    setState(prev => ({ ...prev, mutationLog: log }));
  };

  // Exporters
  const exportMarkdown = () => {
    sound.playTap();
    const today = getTodayDateString();

    let md = `# ⚡ ATTACK MODE — 7-Day Section System & Monthly Report\n`;
    md += `*Generated: ${new Date().toLocaleString()}*\n\n`;

    md += `## 1. Top Logical Creed\n`;
    md += `> "${CREED_MANTRAS[state.activeCreedIndex]}"\n\n`;

    md += `## 2. 7-Day Action Plan by Sections\n`;
    DAYS_OF_WEEK.forEach(day => {
      const dayTasks = state.sectionTasks.filter(t => t.dayOfWeek === day);
      md += `### ${day}\n`;
      ['rich', 'muscular', 'intelligent'].forEach(sec => {
        const secTasks = dayTasks.filter(t => t.section === sec);
        md += `#### ${sec.toUpperCase()}\n`;
        if (secTasks.length === 0) {
          md += `*(No tasks set)*\n`;
        } else {
          secTasks.forEach(t => {
            const check = t.isCompleted ? '[x]' : '[ ]';
            md += `- ${check} ${t.title} (${t.allocationMinutes}m)\n`;
          });
        }
      });
      md += `\n`;
    });

    md += `## 3. 4-Week Month Scorecard\n`;
    state.weeklyScorecards.forEach(sc => {
      md += `- **${sc.label}**: ${sc.completedTasks} / ${sc.targetTasks} Tasks Completed (Grade: **${sc.grade}**, SLA On-Time: ${sc.slaOnTimeRate}%)\n`;
    });
    md += `\n`;

    md += `## 4. Multi-Month History Log\n`;
    state.monthlyHistory.forEach(m => {
      md += `- **${m.monthName}**: ${m.completedTasks} / ${m.targetTasks} Tasks (${m.performancePct}%) — Grade: **${m.grade}**\n`;
    });
    md += `\n`;

    md += `## 5. Data Drops (Insights, Habits, Behaviors)\n`;
    state.dataDrops.forEach(d => {
      md += `- **[${d.type.toUpperCase()}]** (${d.createdAt}): ${d.content}\n`;
    });
    md += `\n`;

    md += `## 6. Sherlock Holmes Case Logs (Contingency Breakdowns)\n`;
    state.sherlockLogs.forEach(c => {
      md += `### Case on ${c.createdAt}\n`;
      md += `- **What Happened:** ${c.whatHappened}\n`;
      md += `- **Why It Happened:** ${c.whyHappened}\n`;
      md += `- **Solution:** ${c.howToSolve}\n`;
      md += `- **Contingency Plan:** ${c.contingencyPlan}\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AttackMode_System_Report_${today}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    sound.playTap();
    const today = getTodayDateString();

    const headers = ['Record_Type', 'Day_or_Month', 'Section_or_Type', 'Title_or_Content', 'Status', 'Date'];
    const rows: string[][] = [];

    state.sectionTasks.forEach(t => {
      rows.push([
        'DailyTask',
        t.dayOfWeek,
        t.section.toUpperCase(),
        `"${t.title.replace(/"/g, '""')}"`,
        t.isCompleted ? 'Completed' : 'Pending',
        today
      ]);
    });

    state.dataDrops.forEach(d => {
      rows.push([
        'DataDrop',
        d.createdAt,
        d.type.toUpperCase(),
        `"${d.content.replace(/"/g, '""')}"`,
        'Logged',
        today
      ]);
    });

    state.monthlyHistory.forEach(m => {
      rows.push([
        'MonthlyHistory',
        m.monthName,
        `Grade_${m.grade}`,
        `${m.completedTasks}/${m.targetTasks} (${m.performancePct}%)`,
        'Archived',
        m.monthKey
      ]);
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AttackMode_Data_${today}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportDataDropMarkdown = (category?: string) => {
    sound.playTap();
    const today = getTodayDateString();
    const isSingleCategory = category && category !== 'all';

    let md = '';
    let filename = '';

    if (isSingleCategory) {
      const typeLabel = category.replace('_', ' ').toUpperCase();
      const filtered = state.dataDrops.filter(d => d.type === category);
      filename = `DataDrop_${category}_${today}.md`;

      md += `# ⚡ ATTACK MODE — Data Drop Notes: ${typeLabel}\n`;
      md += `*Exported: ${new Date().toLocaleString()}*\n`;
      md += `*Total Entries: ${filtered.length}*\n\n`;
      md += `---\n\n`;

      if (filtered.length === 0) {
        md += `*(No notes recorded under this category yet)*\n`;
      } else {
        filtered.forEach((d, idx) => {
          md += `### ${idx + 1}. [${d.createdAt}]\n`;
          md += `${d.content}\n\n`;
        });
      }
    } else {
      filename = `DataDrop_All_Categories_${today}.md`;
      md += `# ⚡ ATTACK MODE — Master Data Drop Repository\n`;
      md += `*Exported: ${new Date().toLocaleString()}*\n`;
      md += `*Total Captured Drops: ${state.dataDrops.length}*\n\n`;
      md += `---\n\n`;

      const categories: { type: DataDropType; label: string; icon: string }[] = [
        { type: 'insight', label: 'Insights & Epiphanies', icon: '💡' },
        { type: 'bad_habit', label: 'Bad Habits & Triggers', icon: '⚠️' },
        { type: 'behavior', label: 'Behavioral Patterns', icon: '🔄' },
        { type: 'thought_process', label: 'Thought Processes & Mental Models', icon: '🧠' },
        { type: 'problem', label: 'Problems & Friction Points', icon: '🧩' }
      ];

      categories.forEach(cat => {
        const catDrops = state.dataDrops.filter(d => d.type === cat.type);
        md += `## ${cat.icon} ${cat.label} (${catDrops.length})\n\n`;
        if (catDrops.length === 0) {
          md += `*(None logged yet)*\n\n`;
        } else {
          catDrops.forEach((d, idx) => {
            md += `### ${idx + 1}. [${d.createdAt}]\n`;
            md += `${d.content}\n\n`;
          });
        }
        md += `---\n\n`;
      });
    }

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Metrics
  const metrics = useMemo(() => {
    const currentDayTasks = state.sectionTasks.filter(t => t.dayOfWeek === state.selectedDayOfWeek);
    const currentDayCompleted = currentDayTasks.filter(t => t.isCompleted).length;
    const currentDayTotal = currentDayTasks.length;
    const currentDayPct = currentDayTotal > 0 ? Math.round((currentDayCompleted / currentDayTotal) * 100) : 0;

    const allCompleted = state.sectionTasks.filter(t => t.isCompleted);
    const weeklyTarget = state.dailyQuotaX * 7;
    const weeklyPct = Math.min(100, Math.round((allCompleted.length / weeklyTarget) * 100));

    const richCompleted = allCompleted.filter(t => t.section === 'rich').length;
    const muscularCompleted = allCompleted.filter(t => t.section === 'muscular').length;
    const intelligentCompleted = allCompleted.filter(t => t.section === 'intelligent').length;

    const fourWeekTotalCompleted = state.weeklyScorecards.reduce((acc, sc) => acc + sc.completedTasks, 0);
    const fourWeekTarget = state.dailyQuotaX * 28;
    const monthPct = Math.round((fourWeekTotalCompleted / fourWeekTarget) * 100);

    let overallGrade: 'S' | 'A' | 'B' | 'C' = 'B';
    if (monthPct >= 95) overallGrade = 'S';
    else if (monthPct >= 85) overallGrade = 'A';
    else if (monthPct >= 70) overallGrade = 'B';
    else overallGrade = 'C';

    const p1Active = state.slaTickets.filter(s => s.status === 'active' && s.priority === 'P1').length;
    const p2Active = state.slaTickets.filter(s => s.status === 'active' && s.priority === 'P2').length;
    const totalActive = state.slaTickets.filter(s => s.status === 'active').length;
    const resolvedCount = state.slaTickets.filter(s => s.status === 'resolved').length;

    return {
      currentDayStats: {
        totalTasks: currentDayTotal,
        completedTasks: currentDayCompleted,
        pct: currentDayPct
      },
      allWeekStats: {
        totalTasks: state.sectionTasks.length,
        completedTasks: allCompleted.length,
        weeklyTarget,
        weeklyPct,
        richCompleted,
        muscularCompleted,
        intelligentCompleted
      },
      monthStats: {
        fourWeekTotalCompleted,
        fourWeekTarget,
        monthPct,
        overallGrade,
        monthlyHistory: state.monthlyHistory
      },
      slaSummary: {
        p1Active,
        p2Active,
        totalActive,
        resolvedCount
      }
    };
  }, [state.sectionTasks, state.selectedDayOfWeek, state.dailyQuotaX, state.weeklyScorecards, state.slaTickets, state.monthlyHistory]);

  return (
    <AttackModeContext.Provider
      value={{
        state,
        loginUser,
        registerUser,
        loginAsGuest,
        logoutUser,
        setActiveTab,
        setSelectedDayOfWeek,
        setViewMode,
        toggleAnchorMode,
        openAnchorModal,
        closeAnchorModal,
        toggleAnchorHabit,
        addAnchorHabit,
        deleteAnchorHabit,
        resetAnchorHabits,
        nextCreed,
        setDailyQuotaX,
        addSectionTask,
        toggleSectionTask,
        deleteSectionTask,
        archiveWeekAndReset,
        addDataDrop,
        deleteDataDrop,
        openDataDropModal,
        closeDataDropModal,
        addSherlockLog,
        openSherlockModal,
        closeSherlockModal,
        openSundayResetModal,
        closeSundayResetModal,
        addSLATicket,
        resolveTicket,
        deleteTicket,
        pushTicketToToday,
        incrementMonthlyTarget,
        decrementMonthlyTarget,
        addMonthlyTarget,
        deleteMonthlyTarget,
        dismissGuide,
        reopenGuide,
        openOnboarding,
        closeOnboarding,
        toggleSound,
        setMutationLog,
        exportMarkdown,
        exportCSV,
        exportDataDropMarkdown,
        metrics
      }}
    >
      {children}
    </AttackModeContext.Provider>
  );
};

export const useAttackMode = (): AttackModeContextType => {
  const context = useContext(AttackModeContext);
  if (!context) {
    throw new Error('useAttackMode must be used within an AttackModeProvider');
  }
  return context;
};
