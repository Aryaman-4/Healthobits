import {
  AttackModeState,
  SectionTask,
  SLATicket,
  MonthlyTarget,
  WeekScorecard,
  MonthlyHistoryRecord,
  DataDropEntry,
  AnchorHabit,
  SherlockCaseLog,
  DayOfWeek
} from '../types/attackMode';

export const CREED_MANTRAS: string[] = [
  'Am I at the top in this field? If no, get to work.',
  'Be a slave to your logical thinking. Mood and motivation are irrelevant.',
  'Consistency beats talent. Constant trials over innate ability.',
  'Deadline is God. Never start a job without a deadline.'
];

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export const TRIAD_SECTIONS = [
  {
    id: 'rich' as const,
    name: 'BECOME INCREDIBLY RICH',
    shortName: 'Rich',
    icon: '💰',
    colorHex: '#937485',
    bgClass: 'bg-[#937485]/10 text-[#937485] border-[#937485]/20',
    headerBadge: 'bg-[#937485] text-white',
    description: 'Wealth velocity, high-leverage freelancing, products, and capital building.'
  },
  {
    id: 'muscular' as const,
    name: 'BECOME INCREDIBLY MUSCULAR, FLEXIBLE',
    shortName: 'Muscular',
    icon: '💪',
    colorHex: '#ECA172',
    bgClass: 'bg-[#ECA172]/10 text-[#ECA172] border-[#ECA172]/20',
    headerBadge: 'bg-[#ECA172] text-white',
    description: 'Calisthenics strength, karate, yoga, flexibility, and physical vitality.'
  },
  {
    id: 'intelligent' as const,
    name: 'BECOME INCREDIBLY INTELLIGENT, SMART',
    shortName: 'Intelligent',
    icon: '🧠',
    colorHex: '#7EB982',
    bgClass: 'bg-[#7EB982]/10 text-[#7EB982] border-[#7EB982]/20',
    headerBadge: 'bg-[#7EB982] text-white',
    description: 'Algorithm practice, deep reading, meditation, and system architecture.'
  }
];

export const TRIAD_CONFIG: Record<string, { label: string; icon: string; badgeClass: string; bgClass: string; colorHex: string }> = {
  rich: {
    label: 'Rich',
    icon: '💰',
    badgeClass: 'bg-[#937485] text-white',
    bgClass: 'bg-[#937485]/10 text-[#937485] border-[#937485]/20',
    colorHex: '#937485'
  },
  muscular: {
    label: 'Muscular',
    icon: '💪',
    badgeClass: 'bg-[#ECA172] text-white',
    bgClass: 'bg-[#ECA172]/10 text-[#ECA172] border-[#ECA172]/20',
    colorHex: '#ECA172'
  },
  intelligent: {
    label: 'Intelligent',
    icon: '🧠',
    badgeClass: 'bg-[#7EB982] text-white',
    bgClass: 'bg-[#7EB982]/10 text-[#7EB982] border-[#7EB982]/20',
    colorHex: '#7EB982'
  },
  mundane: {
    label: 'Mundane',
    icon: '⚙️',
    badgeClass: 'bg-slate-500 text-white',
    bgClass: 'bg-slate-100 text-slate-700 border-slate-200',
    colorHex: '#64748B'
  }
};

export const getTodayDayOfWeek = (): DayOfWeek => {
  const days: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayIndex = new Date().getDay();
  return days[todayIndex];
};

export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getRelativeISO = (hoursFromNow: number): string => {
  const d = new Date(Date.now() + hoursFromNow * 3600 * 1000);
  return d.toISOString();
};

export const INITIAL_SECTION_TASKS: SectionTask[] = [
  // MONDAY
  { id: 'sec-mon-1', dayOfWeek: 'Monday', section: 'rich', title: 'learn about money', isCompleted: true, allocationMinutes: 30, deadlineTime: '11:00' },
  { id: 'sec-mon-2', dayOfWeek: 'Monday', section: 'rich', title: 'implement', isCompleted: true, allocationMinutes: 45, deadlineTime: '14:30' },
  { id: 'sec-mon-3', dayOfWeek: 'Monday', section: 'muscular', title: 'Push-ups & full-body mobility', isCompleted: true, allocationMinutes: 30, deadlineTime: '17:00' },
  { id: 'sec-mon-4', dayOfWeek: 'Monday', section: 'intelligent', title: 'Reading', isCompleted: true, allocationMinutes: 30, deadlineTime: '20:00' },
  { id: 'sec-mon-5', dayOfWeek: 'Monday', section: 'intelligent', title: 'Meditation', isCompleted: true, allocationMinutes: 15, deadlineTime: '21:00' },
  { id: 'sec-mon-6', dayOfWeek: 'Monday', section: 'intelligent', title: 'did problem solving', isCompleted: true, allocationMinutes: 45, deadlineTime: '22:00' },

  // TUESDAY
  { id: 'sec-tue-1', dayOfWeek: 'Tuesday', section: 'rich', title: 'learn about money', isCompleted: true, allocationMinutes: 30, deadlineTime: '11:00' },
  { id: 'sec-tue-2', dayOfWeek: 'Tuesday', section: 'muscular', title: 'Yoga', isCompleted: true, allocationMinutes: 20, deadlineTime: '16:00' },
  { id: 'sec-tue-3', dayOfWeek: 'Tuesday', section: 'muscular', title: 'karate', isCompleted: true, allocationMinutes: 30, deadlineTime: '17:00' },
  { id: 'sec-tue-4', dayOfWeek: 'Tuesday', section: 'muscular', title: 'meditation', isCompleted: true, allocationMinutes: 15, deadlineTime: '18:00' },
  { id: 'sec-tue-5', dayOfWeek: 'Tuesday', section: 'intelligent', title: 'Systems architecture paper', isCompleted: false, allocationMinutes: 45, deadlineTime: '20:30' },

  // WEDNESDAY
  { id: 'sec-wed-1', dayOfWeek: 'Wednesday', section: 'rich', title: 'write a book', isCompleted: true, allocationMinutes: 45, deadlineTime: '12:00' },
  { id: 'sec-wed-2', dayOfWeek: 'Wednesday', section: 'rich', title: 'learn about making money', isCompleted: true, allocationMinutes: 30, deadlineTime: '15:00' },
  { id: 'sec-wed-3', dayOfWeek: 'Wednesday', section: 'muscular', title: 'Ring calisthenics & core flow', isCompleted: true, allocationMinutes: 35, deadlineTime: '18:00' },
  { id: 'sec-wed-4', dayOfWeek: 'Wednesday', section: 'intelligent', title: 'Did algo playlist', isCompleted: true, allocationMinutes: 40, deadlineTime: '21:00' },

  // THURSDAY
  { id: 'sec-thu-1', dayOfWeek: 'Thursday', section: 'rich', title: 'learn about money', isCompleted: true, allocationMinutes: 30, deadlineTime: '11:00' },
  { id: 'sec-thu-2', dayOfWeek: 'Thursday', section: 'rich', title: 'write the book', isCompleted: true, allocationMinutes: 45, deadlineTime: '13:00' },
  { id: 'sec-thu-3', dayOfWeek: 'Thursday', section: 'muscular', title: 'Yoga', isCompleted: true, allocationMinutes: 20, deadlineTime: '16:00' },
  { id: 'sec-thu-4', dayOfWeek: 'Thursday', section: 'muscular', title: 'karate', isCompleted: true, allocationMinutes: 30, deadlineTime: '17:00' },
  { id: 'sec-thu-5', dayOfWeek: 'Thursday', section: 'muscular', title: 'meditation', isCompleted: true, allocationMinutes: 15, deadlineTime: '18:00' },
  { id: 'sec-thu-6', dayOfWeek: 'Thursday', section: 'intelligent', title: 'Deep reading & note synthesis', isCompleted: false, allocationMinutes: 30, deadlineTime: '21:00' },

  // FRIDAY
  { id: 'sec-fri-1', dayOfWeek: 'Friday', section: 'rich', title: 'Freelance', isCompleted: true, allocationMinutes: 60, deadlineTime: '14:00' },
  { id: 'sec-fri-2', dayOfWeek: 'Friday', section: 'rich', title: 'Business', isCompleted: false, allocationMinutes: 45, deadlineTime: '16:00' },
  { id: 'sec-fri-3', dayOfWeek: 'Friday', section: 'muscular', title: 'Explosive sprint intervals', isCompleted: false, allocationMinutes: 30, deadlineTime: '18:00' },
  { id: 'sec-fri-4', dayOfWeek: 'Friday', section: 'intelligent', title: 'Cloud lab & security automation', isCompleted: false, allocationMinutes: 45, deadlineTime: '21:00' },

  // SATURDAY
  { id: 'sec-sat-1', dayOfWeek: 'Saturday', section: 'rich', title: 'Freelance...maybe working on the business i have : ice cream, wood etc would work as well', isCompleted: false, allocationMinutes: 90, deadlineTime: '14:00' },
  { id: 'sec-sat-2', dayOfWeek: 'Saturday', section: 'muscular', title: 'Outdoor calisthenics & flexibility', isCompleted: false, allocationMinutes: 45, deadlineTime: '17:00' },
  { id: 'sec-sat-3', dayOfWeek: 'Saturday', section: 'intelligent', title: 'Video production & technical script', isCompleted: false, allocationMinutes: 60, deadlineTime: '20:00' },

  // SUNDAY
  { id: 'sec-sun-1', dayOfWeek: 'Sunday', section: 'rich', title: 'Review revenue, contracts & upcoming week', isCompleted: false, allocationMinutes: 30, deadlineTime: '11:00' },
  { id: 'sec-sun-2', dayOfWeek: 'Sunday', section: 'muscular', title: 'Restorative stretching & long walk', isCompleted: false, allocationMinutes: 40, deadlineTime: '16:00' },
  { id: 'sec-sun-3', dayOfWeek: 'Sunday', section: 'intelligent', title: 'Weekly retrospective & quiet meditation', isCompleted: false, allocationMinutes: 30, deadlineTime: '20:00' }
];

export const INITIAL_DATA_DROPS: DataDropEntry[] = [
  {
    id: 'drop-1',
    content: 'Whenever I try to do creative writing after a heavy carb lunch, brain fog takes over. Moving writing strictly to 7:00 AM before any food or messages completely resolves this.',
    type: 'insight',
    createdAt: 'Nov 14, 2026 • 11:20 AM'
  },
  {
    id: 'drop-2',
    content: 'Reaching for phone between study sets to check notifications breaks immersion and turns a 5-minute break into 30 minutes of unconscious scrolling.',
    type: 'bad_habit',
    createdAt: 'Nov 13, 2026 • 04:15 PM'
  },
  {
    id: 'drop-3',
    content: 'Pattern: After 6 days of intense discipline, on day 7 my mind seeks an escapist indulgence unless I schedule intentional unstructured outdoor recovery.',
    type: 'behavior',
    createdAt: 'Nov 12, 2026 • 08:30 PM'
  },
  {
    id: 'drop-4',
    content: 'Over-optimizing the planning tool instead of actually doing the uncomfortable work is a sneaky form of procrastination.',
    type: 'thought_process',
    createdAt: 'Nov 10, 2026 • 02:40 PM'
  }
];

export const INITIAL_SHERLOCK_LOGS: SherlockCaseLog[] = [
  {
    id: 'case-01',
    createdAt: 'Nov 14, 2026',
    whatHappened: 'I got distracted from the things I had set for myself. I got tired and then didn\'t follow one day, then the next day.',
    whyHappened: 'I just can\'t focus and do all the things I have set for myself everyday. I don\'t know why, but this time I have a reason not to fail — to be and to give something for the world for better. There are so many things that are important to me. But these recent things made me realize that I can\'t change everything all at once, but gradually I can. For now I just need a focused distraction-free environment. Maybe I would quit everything from music to games to any entertainment thing just to achieve what my soul really wants. And one more thing: I am going to continue karate again.',
    howToSolve: 'Eliminate entertainment friction during working blocks. Re-engage karate for disciplined physical discharge. Focus on 1 primary habit per pillar instead of overwhelming with 10 things at once.',
    contingencyPlan: 'Trigger contingency mode when fatigue hits. Do 15m light yoga instead of dropping the habit entirely. Maintain the chain.'
  }
];

export const INITIAL_MONTHLY_HISTORY: MonthlyHistoryRecord[] = [
  {
    monthKey: '2026-11',
    monthName: 'November 2026',
    completedTasks: 118,
    targetTasks: 140,
    performancePct: 84,
    grade: 'A'
  },
  {
    monthKey: '2026-12',
    monthName: 'December 2026',
    completedTasks: 132,
    targetTasks: 140,
    performancePct: 94,
    grade: 'S'
  },
  {
    monthKey: '2027-01',
    monthName: 'January 2027',
    completedTasks: 124,
    targetTasks: 140,
    performancePct: 89,
    grade: 'A'
  }
];

export const DEFAULT_ANCHOR_HABITS: AnchorHabit[] = [
  {
    id: 'anchor-1',
    title: 'Listen to at least 1 podcast or audio lesson',
    icon: '🎧',
    isCompleted: false
  },
  {
    id: 'anchor-2',
    title: 'Draw or sketch something for 5 minutes',
    icon: '🎨',
    isCompleted: false
  },
  {
    id: 'anchor-3',
    title: 'Mini workout (10 pushups, stretch, or light walk)',
    icon: '🏃‍♂️',
    isCompleted: false
  },
  {
    id: 'anchor-4',
    title: 'Read just 1 page of a book',
    icon: '📖',
    isCompleted: false
  },
  {
    id: 'anchor-5',
    title: '5 deep breaths / 3-minute silent reset',
    icon: '🧘',
    isCompleted: false
  }
];

export const getInitialAttackModeState = (): AttackModeState => {
  const today = getTodayDateString();
  const currentDayOfWeek = getTodayDayOfWeek();

  const slaTickets: SLATicket[] = [
    {
      id: 'ATK-101',
      title: 'Deliver Production Security Audit for Enterprise Client',
      category: 'rich',
      sdtType: 'extrinsic',
      priority: 'P1',
      allocationHours: 3.5,
      deadlineDateTime: getRelativeISO(8),
      status: 'active',
      createdAt: getRelativeISO(-16),
      notes: 'Finalize vulnerability matrix and remediation guidelines.'
    },
    {
      id: 'ATK-102',
      title: 'Maximum Clean Grip Deadlift Test: 2.2x Bodyweight',
      category: 'muscular',
      sdtType: 'intrinsic',
      priority: 'P1',
      allocationHours: 1.5,
      deadlineDateTime: getRelativeISO(18),
      status: 'active',
      createdAt: getRelativeISO(-24),
      notes: 'Video record technique and analyze bar path.'
    },
    {
      id: 'ATK-103',
      title: 'Ship Linear UX Breakdown Video',
      category: 'rich',
      sdtType: 'intrinsic',
      priority: 'P2',
      allocationHours: 2.0,
      deadlineDateTime: getRelativeISO(42),
      status: 'active',
      createdAt: getRelativeISO(-30),
      notes: '4K render with chapter markers.'
    },
    {
      id: 'ATK-104',
      title: 'Distributed Consensus Raft Implementation Benchmark',
      category: 'intelligent',
      sdtType: 'intrinsic',
      priority: 'P2',
      allocationHours: 4.0,
      deadlineDateTime: getRelativeISO(65),
      status: 'active',
      createdAt: getRelativeISO(-12),
      notes: 'Chaos network partition test.'
    },
    {
      id: 'ATK-105',
      title: 'Synthesize Principles from High Output Management',
      category: 'intelligent',
      sdtType: 'intrinsic',
      priority: 'P3',
      allocationHours: 2.5,
      deadlineDateTime: getRelativeISO(120),
      status: 'active',
      createdAt: getRelativeISO(-48),
      notes: 'Translate into practical decision heuristics.'
    },
    {
      id: 'ATK-106',
      title: 'Annual Corporate Tax Deductions & Server Receipts',
      category: 'rich',
      sdtType: 'extrinsic',
      priority: 'P4',
      allocationHours: 2.0,
      deadlineDateTime: getRelativeISO(240),
      status: 'active',
      createdAt: getRelativeISO(-20),
      notes: 'Collect invoices and cloud server records.'
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

  const weeklyScorecards: WeekScorecard[] = [
    {
      weekNumber: 1,
      label: 'Week 1',
      completedTasks: 31,
      targetTasks: 35,
      grade: 'A',
      slaOnTimeRate: 94
    },
    {
      weekNumber: 2,
      label: 'Week 2',
      completedTasks: 33,
      targetTasks: 35,
      grade: 'S',
      slaOnTimeRate: 100
    },
    {
      weekNumber: 3,
      label: 'Week 3',
      completedTasks: 22,
      targetTasks: 35,
      grade: 'A',
      slaOnTimeRate: 92
    },
    {
      weekNumber: 4,
      label: 'Week 4',
      completedTasks: 0,
      targetTasks: 35,
      grade: 'B',
      slaOnTimeRate: 0
    }
  ];

  return {
    account: {
      userId: 'usr_guest_demo',
      email: 'adventurer@attackmode.dev',
      name: 'Aryan',
      isLoggedIn: false,
      syncStatus: 'synced',
      lastSyncedAt: new Date().toISOString()
    },
    dailyQuotaX: 5,
    anchorModeActive: false,
    isAnchorModalOpen: false,
    anchorHabits: DEFAULT_ANCHOR_HABITS,
    activeTab: 'sections',
    selectedDayOfWeek: currentDayOfWeek,
    viewMode: 'day',
    sectionTasks: INITIAL_SECTION_TASKS,
    archivedTasks: [],
    tasks: [],
    slaTickets,
    monthlyTargets,
    weeklyScorecards,
    monthlyHistory: INITIAL_MONTHLY_HISTORY,
    dataDrops: INITIAL_DATA_DROPS,
    sherlockLogs: INITIAL_SHERLOCK_LOGS,
    mutationLog: 'Week 2 Insight: Shifting deep cognitive work to morning before client pings increased completion from 88% to 94%.',
    activeCreedIndex: 0,
    isGuideDismissed: false,
    isOnboardingOpen: false,
    isDataDropModalOpen: false,
    isSherlockModalOpen: false,
    isSundayResetModalOpen: false,
    soundEnabled: true
  };
};
