export type TriadCategory = 'rich' | 'muscular' | 'intelligent' | 'mundane';

export type SDTType = 'intrinsic' | 'extrinsic';

export type SLAPriority = 'P1' | 'P2' | 'P3' | 'P4';

export interface AttackTask {
  id: string;
  title: string;
  category: TriadCategory;
  sdtType: SDTType; // Intrinsic (70%) or Extrinsic (30%)
  allocationMinutes: number; // e.g. 45 mins
  timeSpentMinutes: number; // tracked work
  allocationReached: boolean;
  deadlineTime: string; // e.g. "14:00" or ISO
  isCompleted: boolean;
  completedAt?: string;
  slaTicketId?: string; // If pushed from SLA
  isAnchor?: boolean; // For Anchor Mode
  date: string; // YYYY-MM-DD
}

export interface SLATicket {
  id: string; // e.g. "ATK-101"
  title: string;
  category: TriadCategory;
  sdtType: SDTType;
  priority: SLAPriority; // P1 (Red), P2 (Amber), P3 (Yellow), P4 (Green)
  allocationHours: number; // e.g. 2.0 Hrs Max
  deadlineDateTime: string; // ISO string e.g. "2026-11-15T18:00:00"
  status: 'active' | 'resolved' | 'breached';
  createdAt: string;
  resolvedAt?: string;
  notes?: string;
}

export interface MonthlyTarget {
  id: string;
  title: string;
  category: TriadCategory;
  targetCount: number; // e.g. 3
  currentCount: number; // e.g. 1
  unit: string; // e.g. "Books", "Videos", "%"
  month: string; // YYYY-MM
}

export interface WeeklyDayPlan {
  dayOfWeek: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  date: string; // YYYY-MM-DD
  taskCount: number;
  completedCount: number;
  focusTitle: string;
}

export interface WeekScorecard {
  weekNumber: 1 | 2 | 3 | 4;
  label: string; // e.g. "Nov 1 - Nov 7"
  completedTasks: number;
  targetTasks: number; // X * 7
  grade: 'S' | 'A' | 'B' | 'C';
  slaOnTimeRate: number; // %
}

export interface AttackModeState {
  dailyQuotaX: number; // Default 5 (Weekly = 35, Monthly = 140)
  anchorModeActive: boolean;
  activeTab: 'today' | 'sla' | 'weekly';
  tasks: AttackTask[];
  slaTickets: SLATicket[];
  monthlyTargets: MonthlyTarget[];
  weeklyPlans: WeeklyDayPlan[];
  weeklyScorecards: WeekScorecard[];
  mutationLog: string;
  activeCreedIndex: number;
  cognitiveDrillRecord: {
    lastCompletedDate?: string;
    score: number;
    streakDays: number;
  };
}
