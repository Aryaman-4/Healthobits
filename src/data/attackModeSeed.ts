import { AttackModeState, AttackTask, SLATicket, MonthlyTarget, WeeklyDayPlan, WeekScorecard } from '../types/attackMode';

export const CREED_MANTRAS: string[] = [
  'Am I at the top in this field? If no, get to work.',
  'Be a slave to your logical thinking. Mood and motivation are irrelevant.',
  'Consistency beats talent. Constant trials over innate ability.',
  'Deadline is God. Never start a job without a deadline.'
];

export const TRIAD_CONFIG = {
  rich: {
    label: 'RICH',
    fullLabel: 'BECOME INCREDIBLY RICH',
    colorHex: '#10B981',
    bgClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    badgeClass: 'bg-emerald-600 text-white',
    icon: '💰',
    description: 'High-leverage engineering, client deliverables, capital growth, and income velocity.'
  },
  muscular: {
    label: 'MUSCULAR',
    fullLabel: 'BECOME INCREDIBLY MUSCULAR',
    colorHex: '#EF4444',
    bgClass: 'bg-red-50 text-red-800 border-red-300',
    badgeClass: 'bg-red-600 text-white',
    icon: '💪',
    description: 'Calisthenics strength, physique development, aerobic capacity, and physical mastery.'
  },
  intelligent: {
    label: 'INTELLIGENT',
    fullLabel: 'BECOME INCREDIBLY INTELLIGENT',
    colorHex: '#3B82F6',
    bgClass: 'bg-blue-50 text-blue-800 border-blue-300',
    badgeClass: 'bg-blue-600 text-white',
    icon: '🧠',
    description: 'Cognitive drills, technical deep-dives, book absorption, and systems architecture.'
  },
  mundane: {
    label: 'MUNDANE',
    fullLabel: 'MUNDANE / ADMIN ERRAND',
    colorHex: '#64748B',
    bgClass: 'bg-slate-100 text-slate-700 border-slate-300',
    badgeClass: 'bg-slate-600 text-white',
    icon: '⚙️',
    description: 'Essential real-world maintenance (bills, appointments, groceries) without diluting core metrics.'
  }
};

// Helper to get formatted local date (YYYY-MM-DD)
export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper for dynamic deadline ISO timestamps relative to now
export const getRelativeISO = (hoursFromNow: number): string => {
  const d = new Date(Date.now() + hoursFromNow * 3600 * 1000);
  return d.toISOString();
};

export const getInitialAttackModeState = (): AttackModeState => {
  const today = getTodayDateString();

  const tasks: AttackTask[] = [
    // 3 Core Triad Tasks
    {
      id: 'task-1',
      title: 'Deploy Cloudflare Workers + D1 Delta Sync Engine',
      category: 'rich',
      sdtType: 'extrinsic',
      allocationMinutes: 60,
      timeSpentMinutes: 45,
      allocationReached: false,
      deadlineTime: '15:30',
      isCompleted: true,
      completedAt: `${today}T11:20:00`,
      date: today
    },
    {
      id: 'task-2',
      title: 'Weighted Ring Dips (5x5) + L-Sit Hold Progression',
      category: 'muscular',
      sdtType: 'intrinsic',
      allocationMinutes: 45,
      timeSpentMinutes: 45,
      allocationReached: true, // Trigger allocation reached banner!
      deadlineTime: '18:00',
      isCompleted: true,
      completedAt: `${today}T12:45:00`,
      date: today
    },
    {
      id: 'task-3',
      title: 'Analyze Zero-Knowledge Proofs & Micro-Architecture Paper',
      category: 'intelligent',
      sdtType: 'intrinsic',
      allocationMinutes: 40,
      timeSpentMinutes: 20,
      allocationReached: false,
      deadlineTime: '20:30',
      isCompleted: false,
      date: today
    },

    // 2 Mundane / Admin Errands
    {
      id: 'task-4',
      title: 'Pay high-speed fiber broadband & server hosting invoices',
      category: 'mundane',
      sdtType: 'extrinsic',
      allocationMinutes: 15,
      timeSpentMinutes: 10,
      allocationReached: false,
      deadlineTime: '17:00',
      isCompleted: true,
      completedAt: `${today}T09:15:00`,
      date: today
    },
    {
      id: 'task-5',
      title: 'Review family logistics & weekend schedule coordination',
      category: 'mundane',
      sdtType: 'intrinsic',
      allocationMinutes: 15,
      timeSpentMinutes: 0,
      allocationReached: false,
      deadlineTime: '21:00',
      isCompleted: false,
      date: today
    },

    // 3 Anchor Mode Tasks (Pre-configured lightweight consistency safeguards)
    {
      id: 'anchor-1',
      title: '15m High-Intensity Calisthenics & Joint Mobility',
      category: 'muscular',
      sdtType: 'intrinsic',
      allocationMinutes: 15,
      timeSpentMinutes: 0,
      allocationReached: false,
      deadlineTime: '19:00',
      isCompleted: false,
      isAnchor: true,
      date: today
    },
    {
      id: 'anchor-2',
      title: '15m Deep Reading & Critical Synthesis Note Capture',
      category: 'intelligent',
      sdtType: 'intrinsic',
      allocationMinutes: 15,
      timeSpentMinutes: 0,
      allocationReached: false,
      deadlineTime: '21:30',
      isCompleted: false,
      isAnchor: true,
      date: today
    },
    {
      id: 'anchor-3',
      title: '10m Cognitive Peripheral Arithmetic Drill',
      category: 'intelligent',
      sdtType: 'intrinsic',
      allocationMinutes: 10,
      timeSpentMinutes: 0,
      allocationReached: false,
      deadlineTime: '22:00',
      isCompleted: false,
      isAnchor: true,
      date: today
    }
  ];

  const slaTickets: SLATicket[] = [
    {
      id: 'ATK-101',
      title: 'Deliver Production Security Audit for Enterprise Client',
      category: 'rich',
      sdtType: 'extrinsic',
      priority: 'P1',
      allocationHours: 3.5,
      deadlineDateTime: getRelativeISO(8), // 8 hours remaining (urgent red!)
      status: 'active',
      createdAt: getRelativeISO(-16),
      notes: 'Must finalize vulnerability disclosure matrix and remediation patch guidelines.'
    },
    {
      id: 'ATK-102',
      title: 'Maximum Clean Grip Deadlift Test: 2.2x Bodyweight Verification',
      category: 'muscular',
      sdtType: 'intrinsic',
      priority: 'P1',
      allocationHours: 1.5,
      deadlineDateTime: getRelativeISO(18), // 18 hours remaining (< 24h P1)
      status: 'active',
      createdAt: getRelativeISO(-24),
      notes: 'Record technique on video, analyze bar path and hip drive.'
    },
    {
      id: 'ATK-103',
      title: 'Publish Video Breakdown: "Why Linear + Things 3 Dominate Modern UX"',
      category: 'rich',
      sdtType: 'intrinsic',
      priority: 'P2',
      allocationHours: 2.0,
      deadlineDateTime: getRelativeISO(42), // 42 hours remaining (< 72h P2)
      status: 'active',
      createdAt: getRelativeISO(-30),
      notes: 'Render in 4K 60fps, write chapter markers and Notion companion summary.'
    },
    {
      id: 'ATK-104',
      title: 'Complete Distributed Consensus & Raft Implementation Benchmark',
      category: 'intelligent',
      sdtType: 'intrinsic',
      priority: 'P2',
      allocationHours: 4.0,
      deadlineDateTime: getRelativeISO(65), // 65 hours (< 72h P2)
      status: 'active',
      createdAt: getRelativeISO(-12),
      notes: 'Run chaos network partitions and stress test leader election failover.'
    },
    {
      id: 'ATK-105',
      title: 'Synthesize 50 Key Principles from "High Output Management"',
      category: 'intelligent',
      sdtType: 'intrinsic',
      priority: 'P3',
      allocationHours: 2.5,
      deadlineDateTime: getRelativeISO(120), // 5 days remaining (P3 Medium)
      status: 'active',
      createdAt: getRelativeISO(-48),
      notes: 'Transform chapters 1-8 into reusable decision heuristics.'
    },
    {
      id: 'ATK-106',
      title: 'Annual Corporate Tax Filing & Deduction Documentation',
      category: 'rich',
      sdtType: 'extrinsic',
      priority: 'P4',
      allocationHours: 2.0,
      deadlineDateTime: getRelativeISO(240), // 10 days remaining (> 7 days P4)
      status: 'active',
      createdAt: getRelativeISO(-20),
      notes: 'Review receipts, R&D credits, and cloud server expenses.'
    }
  ];

  const monthlyTargets: MonthlyTarget[] = [
    {
      id: 'target-1',
      title: 'Read 3 High-Impact Books',
      category: 'intelligent',
      targetCount: 3,
      currentCount: 1,
      unit: 'Books',
      month: today.slice(0, 7)
    },
    {
      id: 'target-2',
      title: 'Create & Ship 3 Deep-Dive Videos',
      category: 'rich',
      targetCount: 3,
      currentCount: 2,
      unit: 'Videos',
      month: today.slice(0, 7)
    },
    {
      id: 'target-3',
      title: 'Complete Cloud Security & AI Automation Pipeline',
      category: 'rich',
      targetCount: 100,
      currentCount: 65,
      unit: '%',
      month: today.slice(0, 7)
    }
  ];

  const weeklyPlans: WeeklyDayPlan[] = [
    { dayOfWeek: 'Mon', date: today, taskCount: 5, completedCount: 4, focusTitle: 'High-Velocity Cloud Ship' },
    { dayOfWeek: 'Tue', date: today, taskCount: 5, completedCount: 5, focusTitle: 'Ring Calisthenics & Systems' },
    { dayOfWeek: 'Wed', date: today, taskCount: 5, completedCount: 4, focusTitle: 'Architecture Deep Work' },
    { dayOfWeek: 'Thu', date: today, taskCount: 5, completedCount: 3, focusTitle: 'SLA Hard Deadlines' },
    { dayOfWeek: 'Fri', date: today, taskCount: 5, completedCount: 4, focusTitle: 'Client Audit Release' },
    { dayOfWeek: 'Sat', date: today, taskCount: 5, completedCount: 5, focusTitle: 'Long Run + Video Production' },
    { dayOfWeek: 'Sun', date: today, taskCount: 5, completedCount: 4, focusTitle: 'Weekly Mutation & Review' }
  ];

  const weeklyScorecards: WeekScorecard[] = [
    {
      weekNumber: 1,
      label: 'Week 1 (Nov 1 - Nov 7)',
      completedTasks: 31,
      targetTasks: 35,
      grade: 'A',
      slaOnTimeRate: 94
    },
    {
      weekNumber: 2,
      label: 'Week 2 (Nov 8 - Nov 14)',
      completedTasks: 33,
      targetTasks: 35,
      grade: 'S',
      slaOnTimeRate: 100
    },
    {
      weekNumber: 3,
      label: 'Week 3 (Current Sprint)',
      completedTasks: 21,
      targetTasks: 35,
      grade: 'A',
      slaOnTimeRate: 90
    },
    {
      weekNumber: 4,
      label: 'Week 4 (Upcoming)',
      completedTasks: 0,
      targetTasks: 35,
      grade: 'B',
      slaOnTimeRate: 0
    }
  ];

  return {
    dailyQuotaX: 5,
    anchorModeActive: false,
    activeTab: 'today',
    tasks,
    slaTickets,
    monthlyTargets,
    weeklyPlans,
    weeklyScorecards,
    mutationLog: 'Week 2 Insight: Shifting deep cognitive work to 7:00 AM before client pings increased task completion rate from 88% to 94%. Reduced phone checks during allocation caps.',
    activeCreedIndex: 0,
    cognitiveDrillRecord: {
      lastCompletedDate: today,
      score: 120,
      streakDays: 6
    }
  };
};
