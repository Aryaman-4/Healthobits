import {
  AttackModeState,
  SectionTask,
  AttackTask,
  SLATicket,
  MonthlyTarget,
  WeekScorecard,
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
    colorHex: '#10B981',
    bgClass: 'bg-emerald-50 text-emerald-900 border-emerald-300',
    headerBadge: 'bg-emerald-600 text-white',
    description: 'Wealth velocity, high-leverage freelancing, products, and capital building.'
  },
  {
    id: 'muscular' as const,
    name: 'BECOME INCREDIBLY MUSCULAR, FLEXIBLE',
    shortName: 'Muscular',
    icon: '💪',
    colorHex: '#EF4444',
    bgClass: 'bg-red-50 text-red-900 border-red-300',
    headerBadge: 'bg-red-600 text-white',
    description: 'Calisthenics strength, karate, yoga, flexibility, and physical vitality.'
  },
  {
    id: 'intelligent' as const,
    name: 'BECOME INCREDIBLY INTELLIGENT, SMART',
    shortName: 'Intelligent',
    icon: '🧠',
    colorHex: '#3B82F6',
    bgClass: 'bg-blue-50 text-blue-900 border-blue-300',
    headerBadge: 'bg-blue-600 text-white',
    description: 'Algorithm practice, deep reading, meditation, and system architecture.'
  }
];

export const TRIAD_CONFIG: Record<string, { label: string; icon: string; badgeClass: string; bgClass: string; colorHex: string }> = {
  rich: {
    label: 'RICH',
    icon: '💰',
    badgeClass: 'bg-emerald-600 text-white',
    bgClass: 'bg-emerald-50 text-emerald-900 border-emerald-300',
    colorHex: '#10B981'
  },
  muscular: {
    label: 'MUSCULAR',
    icon: '💪',
    badgeClass: 'bg-red-600 text-white',
    bgClass: 'bg-red-50 text-red-900 border-red-300',
    colorHex: '#EF4444'
  },
  intelligent: {
    label: 'INTELLIGENT',
    icon: '🧠',
    badgeClass: 'bg-blue-600 text-white',
    bgClass: 'bg-blue-50 text-blue-900 border-blue-300',
    colorHex: '#3B82F6'
  },
  mundane: {
    label: 'MUNDANE',
    icon: '⚙️',
    badgeClass: 'bg-slate-600 text-white',
    bgClass: 'bg-slate-100 text-slate-700 border-slate-300',
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
      deadlineDateTime: getRelativeISO(8), // 8h remaining (< 24h P1 Red)
      status: 'active',
      createdAt: getRelativeISO(-16),
      notes: 'Finalize vulnerability matrix and patch guidelines.'
    },
    {
      id: 'ATK-102',
      title: 'Maximum Clean Grip Deadlift Test: 2.2x Bodyweight',
      category: 'muscular',
      sdtType: 'intrinsic',
      priority: 'P1',
      allocationHours: 1.5,
      deadlineDateTime: getRelativeISO(18), // 18h (< 24h P1 Red)
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
      deadlineDateTime: getRelativeISO(42), // 42h (< 72h P2 Amber)
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
      deadlineDateTime: getRelativeISO(65), // 65h (< 72h P2 Amber)
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
      deadlineDateTime: getRelativeISO(120), // 5 days (P3 Yellow)
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
      deadlineDateTime: getRelativeISO(240), // 10 days (> 7d P4 Green)
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

  // 4-Week Month Scorecard System
  const weeklyScorecards: WeekScorecard[] = [
    {
      weekNumber: 1,
      label: 'Week 1 (Days 1 - 7)',
      completedTasks: 31,
      targetTasks: 35,
      grade: 'A',
      slaOnTimeRate: 94
    },
    {
      weekNumber: 2,
      label: 'Week 2 (Days 8 - 14)',
      completedTasks: 33,
      targetTasks: 35,
      grade: 'S',
      slaOnTimeRate: 100
    },
    {
      weekNumber: 3,
      label: 'Week 3 (Current Sprint)',
      completedTasks: 22,
      targetTasks: 35,
      grade: 'A',
      slaOnTimeRate: 92
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
    account: {
      userId: 'usr_guest_demo',
      email: 'adventurer@attackmode.dev',
      name: 'Aryan',
      isLoggedIn: false, // Default unauthenticated to show the welcoming login screen!
      syncStatus: 'synced',
      lastSyncedAt: new Date().toISOString()
    },
    dailyQuotaX: 5,
    anchorModeActive: false,
    activeTab: 'sections',
    selectedDayOfWeek: currentDayOfWeek,
    viewMode: 'day',
    sectionTasks: INITIAL_SECTION_TASKS,
    tasks: [],
    slaTickets,
    monthlyTargets,
    weeklyScorecards,
    mutationLog: 'Week 2 Insight: Shifting deep cognitive work to morning before client pings increased completion from 88% to 94%.',
    activeCreedIndex: 0,
    isGuideDismissed: false,
    isOnboardingOpen: false,
    soundEnabled: true
  };
};
