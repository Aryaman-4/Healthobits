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
  allocationMinutes: number;
  deadlineTime?: string;
  isRecurring?: boolean;
  archivedAt?: string;
}

export interface AttackTask {
  id: string;
  title: string;
  category: TriadCategory;
  sdtType: SDTType;
  allocationMinutes: number;
  timeSpentMinutes: number;
  allocationReached: boolean;
  deadlineTime: string;
  isCompleted: boolean;
  completedAt?: string;
  slaTicketId?: string;
  isAnchor?: boolean;
  date: string;
}

export interface SLATicket {
  id: string;
  title: string;
  category: TriadCategory;
  sdtType: SDTType;
  priority: SLAPriority;
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
  label: string;
  completedTasks: number;
  targetTasks: number;
  grade: 'S' | 'A' | 'B' | 'C';
  slaOnTimeRate: number;
  isSaved?: boolean;
  savedAt?: string;
}

export interface MonthlyHistoryRecord {
  monthKey: string; // e.g. "2026-11"
  monthName: string; // e.g. "November"
  completedTasks: number;
  targetTasks: number;
  performancePct: number;
  grade: 'S' | 'A' | 'B' | 'C';
}

export type DataDropType = 'insight' | 'bad_habit' | 'behavior' | 'thought_process' | 'problem';

export interface DataDropEntry {
  id: string;
  content: string;
  type: DataDropType;
  createdAt: string;
}

export interface AnchorHabit {
  id: string;
  title: string;
  icon: string;
  isCompleted: boolean;
  notes?: string;
}

export interface SherlockCaseLog {
  id: string;
  createdAt: string;
  whatHappened: string;
  whyHappened: string;
  howToSolve: string;
  contingencyPlan: string;
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

export type AttackModeTab = 'sections' | 'stats' | 'sla' | 'account' | 'datadrop';

export interface AttackModeState {
  account: UserAccount;
  dailyQuotaX: number;
  anchorModeActive: boolean;
  isAnchorModalOpen: boolean;
  anchorHabits: AnchorHabit[];
  activeTab: AttackModeTab;
  selectedDayOfWeek: DayOfWeek;
  viewMode: 'day' | 'weekGrid';
  currentWeekNumber: 1 | 2 | 3 | 4;
  currentMonthName: string;
  sectionTasks: SectionTask[];
  archivedTasks: SectionTask[];
  tasks: AttackTask[];
  slaTickets: SLATicket[];
  monthlyTargets: MonthlyTarget[];
  weeklyScorecards: WeekScorecard[];
  monthlyHistory: MonthlyHistoryRecord[];
  dataDrops: DataDropEntry[];
  sherlockLogs: SherlockCaseLog[];
  mutationLog: string;
  activeCreedIndex: number;
  isGuideDismissed: boolean;
  isOnboardingOpen: boolean;
  isDataDropModalOpen: boolean;
  isSherlockModalOpen: boolean;
  isSundayResetModalOpen: boolean;
  soundEnabled: boolean;
}
