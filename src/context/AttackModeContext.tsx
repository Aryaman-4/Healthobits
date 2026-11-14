import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  AttackModeState,
  AttackTask,
  SLATicket,
  MonthlyTarget,
  WeeklyDayPlan,
  WeekScorecard,
  TriadCategory,
  SDTType
} from '../types/attackMode';
import {
  getInitialAttackModeState,
  getTodayDateString,
  CREED_MANTRAS
} from '../data/attackModeSeed';
import { sound } from '../utils/audio';

const STORAGE_KEY = 'attack_mode_state_v1';

interface AttackModeContextType {
  state: AttackModeState;
  // Controls
  setActiveTab: (tab: 'today' | 'sla' | 'weekly') => void;
  toggleAnchorMode: () => void;
  nextCreed: () => void;
  setDailyQuotaX: (x: number) => void;
  // Task Management
  addTask: (taskData: {
    title: string;
    category: TriadCategory;
    sdtType: SDTType;
    allocationMinutes: number;
    deadlineTime: string;
    isAnchor?: boolean;
  }) => { success: boolean; error?: string };
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  incrementTaskTime: (id: string, minutes: number) => void;
  // SLA Management
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
  // Weekly & Mutation
  setMutationLog: (log: string) => void;
  updateWeeklyDayFocus: (dayOfWeek: string, focusTitle: string) => void;
  // Cognitive Drill
  recordDrillScore: (score: number) => void;
  // Data Exports
  exportMarkdown: () => void;
  exportCSV: () => void;
  // Metrics
  metrics: {
    sdtRatio: {
      intrinsicPct: number;
      extrinsicPct: number;
      intrinsicCount: number;
      extrinsicCount: number;
      isBalanced: boolean;
    };
    triadBreakdown: {
      richCount: number;
      muscularCount: number;
      intelligentCount: number;
      totalCore: number;
      richPct: number;
      muscularPct: number;
      intelligentPct: number;
    };
    todayProgress: {
      completedCore: number;
      quotaTarget: number;
      percentage: number;
      isQuotaMet: boolean;
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
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse AttackMode state from localStorage:', e);
    }
    return getInitialAttackModeState();
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save AttackMode state:', e);
    }
  }, [state]);

  // Tab & Header Controls
  const setActiveTab = (tab: 'today' | 'sla' | 'weekly') => {
    sound.playTap();
    setState(prev => ({ ...prev, activeTab: tab }));
  };

  const toggleAnchorMode = () => {
    sound.playLevelUp();
    setState(prev => ({ ...prev, anchorModeActive: !prev.anchorModeActive }));
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
      // Update weekly scorecards targets with new quota (x * 7)
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

  // Task Handlers
  const addTask = (data: {
    title: string;
    category: TriadCategory;
    sdtType: SDTType;
    allocationMinutes: number;
    deadlineTime: string;
    isAnchor?: boolean;
  }) => {
    if (!data.title.trim()) {
      return { success: false, error: 'Task title is required.' };
    }

    // Strict Rule: Non-mundane tasks must have a deadline time ("Deadline is God")
    if (data.category !== 'mundane' && !data.deadlineTime) {
      return { success: false, error: 'Deadline is God! You must set a deadline time.' };
    }

    sound.playTap();
    const today = getTodayDateString();
    const newTask: AttackTask = {
      id: `task-${Date.now()}`,
      title: data.title.trim(),
      category: data.category,
      sdtType: data.sdtType,
      allocationMinutes: Math.max(5, data.allocationMinutes || 30),
      timeSpentMinutes: 0,
      allocationReached: false,
      deadlineTime: data.deadlineTime || '23:59',
      isCompleted: false,
      isAnchor: data.isAnchor || false,
      date: today
    };

    setState(prev => ({
      ...prev,
      tasks: [newTask, ...prev.tasks]
    }));

    return { success: true };
  };

  const toggleTask = (id: string) => {
    const today = getTodayDateString();
    setState(prev => {
      let newlyCompleted = false;
      const updatedTasks = prev.tasks.map(t => {
        if (t.id === id) {
          const willComplete = !t.isCompleted;
          if (willComplete) newlyCompleted = true;
          return {
            ...t,
            isCompleted: willComplete,
            completedAt: willComplete ? `${today}T${new Date().toLocaleTimeString('en-GB')}` : undefined
          };
        }
        return t;
      });

      if (newlyCompleted) {
        sound.playComplete();
        // Check if daily quota is met
        const activeCoreTasks = updatedTasks.filter(t => !t.isAnchor && t.category !== 'mundane' && t.date === today);
        const completedCore = activeCoreTasks.filter(t => t.isCompleted).length;
        if (completedCore === prev.dailyQuotaX) {
          sound.playFanfare();
          try {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.6 }
            });
          } catch (e) {}
        }
      } else {
        sound.playTap();
      }

      return {
        ...prev,
        tasks: updatedTasks
      };
    });
  };

  const deleteTask = (id: string) => {
    sound.playTap();
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id)
    }));
  };

  const incrementTaskTime = (id: string, minutes: number) => {
    sound.playTap();
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => {
        if (t.id === id) {
          const newSpent = t.timeSpentMinutes + minutes;
          const reached = newSpent >= t.allocationMinutes;
          return {
            ...t,
            timeSpentMinutes: newSpent,
            allocationReached: reached
          };
        }
        return t;
      })
    }));
  };

  // SLA Tickets Handlers
  const addSLATicket = (ticketData: {
    title: string;
    category: TriadCategory;
    sdtType: SDTType;
    allocationHours: number;
    deadlineDateTime: string;
    notes?: string;
  }) => {
    sound.playTap();
    // Auto-calculate SLA Priority based on deadline remaining
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
    sound.playComplete();
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
    const today = getTodayDateString();
    const deadlineTime = new Date(ticket.deadlineDateTime).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const newTask: AttackTask = {
      id: `task-from-${ticket.id}-${Date.now()}`,
      title: `[${ticket.id}] ${ticket.title}`,
      category: ticket.category,
      sdtType: ticket.sdtType,
      allocationMinutes: Math.round(ticket.allocationHours * 60),
      timeSpentMinutes: 0,
      allocationReached: false,
      deadlineTime: deadlineTime || '18:00',
      isCompleted: false,
      slaTicketId: ticket.id,
      date: today
    };

    setState(prev => ({
      ...prev,
      activeTab: 'today',
      tasks: [newTask, ...prev.tasks]
    }));
  };

  // Monthly Targets Handlers
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

  // Weekly & Mutation Handlers
  const setMutationLog = (log: string) => {
    setState(prev => ({ ...prev, mutationLog: log }));
  };

  const updateWeeklyDayFocus = (dayOfWeek: string, focusTitle: string) => {
    setState(prev => ({
      ...prev,
      weeklyPlans: prev.weeklyPlans.map(w =>
        w.dayOfWeek === dayOfWeek ? { ...w, focusTitle } : w
      )
    }));
  };

  const recordDrillScore = (score: number) => {
    sound.playFanfare();
    const today = getTodayDateString();
    setState(prev => ({
      ...prev,
      cognitiveDrillRecord: {
        lastCompletedDate: today,
        score,
        streakDays: prev.cognitiveDrillRecord.streakDays + 1
      }
    }));
  };

  // Data Exporters
  const exportMarkdown = () => {
    sound.playTap();
    const today = getTodayDateString();
    const activeTasks = state.tasks.filter(t => t.date === today && !t.isAnchor);
    const activeSla = state.slaTickets.filter(t => t.status === 'active');

    let md = `# ⚡ ATTACK MODE — Master Execution & SLA Report\n`;
    md += `*Generated: ${new Date().toLocaleString()}*\n\n`;

    md += `## 1. Top Logical Creed\n`;
    md += `> "${CREED_MANTRAS[state.activeCreedIndex]}"\n\n`;

    md += `## 2. Daily Quota (${state.dailyQuotaX} Tasks/Day Target)\n`;
    activeTasks.forEach((t, i) => {
      const status = t.isCompleted ? '[x]' : '[ ]';
      md += `${i + 1}. ${status} **[${t.category.toUpperCase()}]** ${t.title} — Cap: ${t.allocationMinutes}m | Deadline: ${t.deadlineTime} (${t.sdtType})\n`;
    });
    md += `\n`;

    md += `## 3. SLA Deadlines (The God Table)\n`;
    md += `| Ticket ID | Priority | Category | Deliverable | Hard Deadline | Cap (Hrs) | Status |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    state.slaTickets.forEach(s => {
      md += `| ${s.id} | ${s.priority} | ${s.category.toUpperCase()} | ${s.title} | ${new Date(s.deadlineDateTime).toLocaleString()} | ${s.allocationHours}h | ${s.status.toUpperCase()} |\n`;
    });
    md += `\n`;

    md += `## 4. V.IMP Monthly Targets (4-Week Big Rocks)\n`;
    state.monthlyTargets.forEach(m => {
      const pct = Math.round((m.currentCount / m.targetCount) * 100);
      md += `- **${m.title}**: ${m.currentCount} / ${m.targetCount} ${m.unit} (${pct}%)\n`;
    });
    md += `\n`;

    md += `## 5. Weekly Mutation Log\n`;
    md += `> ${state.mutationLog}\n\n`;

    md += `## 6. Performance Scoreboard\n`;
    state.weeklyScorecards.forEach(sc => {
      md += `- **${sc.label}**: ${sc.completedTasks} / ${sc.targetTasks} Tasks Completed (Grade: **${sc.grade}**, SLA On-Time: ${sc.slaOnTimeRate}%)\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AttackMode_Execution_Plan_${today}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    sound.playTap();
    const today = getTodayDateString();

    const headers = [
      'Record_Type',
      'ID',
      'Title',
      'Category',
      'SDT_Type',
      'Priority_or_Allocation',
      'Deadline',
      'Status',
      'Date'
    ];

    const rows: string[][] = [];

    // Daily tasks
    state.tasks.forEach(t => {
      rows.push([
        'DailyTask',
        t.id,
        `"${t.title.replace(/"/g, '""')}"`,
        t.category,
        t.sdtType,
        `${t.allocationMinutes} mins`,
        t.deadlineTime,
        t.isCompleted ? 'Completed' : 'Pending',
        t.date
      ]);
    });

    // SLA tickets
    state.slaTickets.forEach(s => {
      rows.push([
        'SLATicket',
        s.id,
        `"${s.title.replace(/"/g, '""')}"`,
        s.category,
        s.sdtType,
        `${s.priority} (${s.allocationHours}h cap)`,
        s.deadlineDateTime,
        s.status,
        s.createdAt.slice(0, 10)
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

  // Metrics computation
  const metrics = useMemo(() => {
    const today = getTodayDateString();
    const coreTasks = state.tasks.filter(t => !t.isAnchor && t.category !== 'mundane');
    const intrinsicCount = coreTasks.filter(t => t.sdtType === 'intrinsic').length;
    const extrinsicCount = coreTasks.filter(t => t.sdtType === 'extrinsic').length;
    const totalSdt = intrinsicCount + extrinsicCount;

    const intrinsicPct = totalSdt > 0 ? Math.round((intrinsicCount / totalSdt) * 100) : 70;
    const extrinsicPct = totalSdt > 0 ? 100 - intrinsicPct : 30;
    const isBalanced = intrinsicPct >= 60 && intrinsicPct <= 80;

    const richCount = coreTasks.filter(t => t.category === 'rich').length;
    const muscularCount = coreTasks.filter(t => t.category === 'muscular').length;
    const intelligentCount = coreTasks.filter(t => t.category === 'intelligent').length;
    const totalCore = richCount + muscularCount + intelligentCount;

    const richPct = totalCore > 0 ? Math.round((richCount / totalCore) * 100) : 33;
    const muscularPct = totalCore > 0 ? Math.round((muscularCount / totalCore) * 100) : 33;
    const intelligentPct = totalCore > 0 ? 100 - richPct - muscularPct : 34;

    const todayCore = state.tasks.filter(t => !t.isAnchor && t.category !== 'mundane' && t.date === today);
    const completedCore = todayCore.filter(t => t.isCompleted).length;
    const quotaTarget = state.dailyQuotaX;
    const percentage = Math.min(100, Math.round((completedCore / quotaTarget) * 100));

    const p1Active = state.slaTickets.filter(s => s.status === 'active' && s.priority === 'P1').length;
    const p2Active = state.slaTickets.filter(s => s.status === 'active' && s.priority === 'P2').length;
    const totalActive = state.slaTickets.filter(s => s.status === 'active').length;
    const resolvedCount = state.slaTickets.filter(s => s.status === 'resolved').length;

    return {
      sdtRatio: {
        intrinsicPct,
        extrinsicPct,
        intrinsicCount,
        extrinsicCount,
        isBalanced
      },
      triadBreakdown: {
        richCount,
        muscularCount,
        intelligentCount,
        totalCore,
        richPct,
        muscularPct,
        intelligentPct
      },
      todayProgress: {
        completedCore,
        quotaTarget,
        percentage,
        isQuotaMet: completedCore >= quotaTarget
      },
      slaSummary: {
        p1Active,
        p2Active,
        totalActive,
        resolvedCount
      }
    };
  }, [state.tasks, state.slaTickets, state.dailyQuotaX]);

  return (
    <AttackModeContext.Provider
      value={{
        state,
        setActiveTab,
        toggleAnchorMode,
        nextCreed,
        setDailyQuotaX,
        addTask,
        toggleTask,
        deleteTask,
        incrementTaskTime,
        addSLATicket,
        resolveTicket,
        deleteTicket,
        pushTicketToToday,
        incrementMonthlyTarget,
        decrementMonthlyTarget,
        addMonthlyTarget,
        deleteMonthlyTarget,
        setMutationLog,
        updateWeeklyDayFocus,
        recordDrillScore,
        exportMarkdown,
        exportCSV,
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
