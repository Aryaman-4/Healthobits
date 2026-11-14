export type TriadCategory = 'rich' | 'muscular' | 'intelligent' | 'mundane';

export type SDTType = 'intrinsic' | 'extrinsic';

export type SLAPriority = 'P1' | 'P2' | 'P3' | 'P4';

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface SectionTask {
  id: string;
  dayOfWeek: DayOfWeek;
  section: 'rich' | 'muscular' | 'intelligent';
  title: string;
  isCompleted: boolean;
  completedAt?: string;
  allocationMinutes: number; // e.g. 30m
  deadlineTime?: string; // e.g. "18:00"
}

export interface AttackTask {
  id: string;
  title: string;
  category: TriadCategory;
  sdtType: SDTType; // Intrinsic (70%) or Extrinsic (30%)
  allocationMinutes: number;
  timeSpentMinutes: number;
  allocationReached: boolean;
  deadlineTime: string;
  isCompleted: boolean;
  completedAt?: string;
  slaTicketId?: string;
  isAnchor?: boolean;
  date: string; // YYYY-MM-DD
}

export interface SLATicket {
  id: string; // e.g. "ATK-101"
  title: string;
  category: TriadCategory;
  sdtType: SDTType;
  priority: SLAPriority; // P1 (Red), P2 (Amber), P3 (Yellow), P4 (Green)
  allocationHours: number;
  deadlineDateTime: string;
  status: 'active' | 'resolved' | 'breached';
  createdAt: string;
  resolvedAt?: string;
  notes?: string;
}

export interface MonthlyTarget {
  id: string;
  title: string;
  category: TriadCategory;
  targetCount: number;
  currentCount: number;
  unit: string;
  month: string;
}

export interface WeekScorecard {
  weekNumber: 1 | 2 | 3 | 4;
  label: string; // e.g. "Week 1 (Days 1 - 7)"
  completedTasks: number;
  targetTasks: number;
  grade: 'S' | 'A' | 'B' | 'C';
  slaOnTimeRate: number; // %
}

export interface UserAccount {
  userId: string;
  email: string;
  name: string;
  isLoggedIn: boolean;
  authToken?: string;
  syncStatus: 'synced' | 'syncing' | 'offline';
  lastSyncedAt?: string;
}

export interface AttackModeState {
  account: UserAccount;
  dailyQuotaX: number; // Default 5 (Weekly = 35, Monthly = 140)
  anchorModeActive: boolean;
  activeTab: 'sections' | 'stats' | 'sla' | 'account';
  selectedDayOfWeek: DayOfWeek;
  viewMode: 'day' | 'weekGrid';
  sectionTasks: SectionTask[];
  tasks: AttackTask[];
  slaTickets: SLATicket[];
  monthlyTargets: MonthlyTarget[];
  weeklyScorecards: WeekScorecard[];
  mutationLog: string;
  activeCreedIndex: number;
  isGuideDismissed: boolean;
  isOnboardingOpen: boolean;
  soundEnabled: boolean;
}
