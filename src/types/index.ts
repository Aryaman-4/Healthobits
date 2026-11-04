export type BranchId = 'body' | 'mind' | 'craft' | 'bonds' | 'empire';
export type LootRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type NodeThreshold = 5 | 15 | 30 | 50 | 80;
export type ScheduleFilter = 'today' | 'mwf' | 'tts' | 'sunday';
export type DayScheduleType = 'all' | 'mwf' | 'tts' | 'sunday';

export interface NodeUnlockStatus {
  threshold: NodeThreshold;
  unlocked: boolean;
  unlockedInMonth?: 1 | 2 | 3;
}

export interface AttributeBranch {
  id: BranchId;
  name: string;
  focusArea: string;
  colorHex: string;
  borderHex: string;
  tintHex: string;
  icon: string;
  seasonStartLevel: number;
  currentMonthStartLevel: number;
  priorMonthsSeasonalDays: number;
  featIdeasScratchpad: string[];
  unlockedNodes: NodeUnlockStatus[];
}

export interface Habit {
  id: string;
  branchId: BranchId;
  title: string;
  subtitle?: string;
  isKeystone: boolean; // ★ Keystone Habit
  completedDates: string[]; // ISO dates 'YYYY-MM-DD'
  scheduleType: DayScheduleType;
  launchUrl?: string; // Pinned Deep Link URL
  launchAction?: 'workout' | 'music' | 'art' | 'reading' | 'career' | 'english' | 'url';
  timeEstimateMinutes?: number;
  createdDate?: string;
}

export interface MonthlyQuest {
  id: string;
  title: string;
  branchId: BranchId;
  isMainQuest: boolean;
  difficultyStars?: 1 | 2 | 3 | 4 | 5;
  customReward?: string;
  isCompleted: boolean;
}

export interface LootItem {
  id: string;
  rarity: LootRarity;
  title: string;
}

export interface ClaimedLootLog {
  id: string;
  rarity: LootRarity;
  rewardTitle: string;
  claimedDate: string;
  triggerReason: string;
}

export interface BuffOrDebuff {
  id: string;
  type: 'buff' | 'debuff';
  description: string;
  branchId?: BranchId;
}

export interface CharacterProfile {
  name: string;
  classTitle: string;
  avatarSeed: string;
  avatarBg: string;
  seasonNumber: number;
  seasonName: string;
  currentMonthIndex: 1 | 2 | 3;
  currentYearMonth: string;
  pactSigned: boolean;
  pactSignatureDataUrl?: string;
  pactSignedDate?: string;
  monthlyReflectionNotes: string;
}

export interface MonthSummaryRecord {
  monthIndex: 1 | 2 | 3;
  monthName: string;
  branchDays: Record<BranchId, number>;
  nodesUnlocked: number;
  featsCompleted: number;
}

// POLYMATH SPECIFIC MODELS

export interface AlankarItem {
  id: number;
  name: string;
  sargamNotes: string;
  speedTargetBpm: number;
  fluteStatus: 'locked' | 'practicing' | 'mastered';
  whistleStatus: 'locked' | 'practicing' | 'mastered';
  youtubeUrl: string;
}

export interface BookTrackerState {
  title: string;
  totalPages: number;
  currentPage: number;
  targetDailyPages: number;
  quotes: { id: string; text: string; date: string }[];
}

export interface FinelinerTrackerState {
  pieceTitle: string;
  currentCycleDay: number; // 1 to 14
  referenceUrl: string;
  notes: string;
}

export interface CareerLabItem {
  id: string;
  title: string;
  techStack: string[];
  status: 'in_lab' | 'code_pushed' | 'published';
  repoUrl: string;
  caseStudyNotes: string;
}

export interface ExpenseItem {
  id: string;
  amount: number;
  category: string;
  date: string;
}

export interface AnkiCard {
  id: string;
  front: string;
  back: string;
  category: 'quote' | 'sargam' | 'cloud' | 'vocab';
  date: string;
}

export interface RelationshipContact {
  id: string;
  name: string;
  relationship: string;
  tier: 'daily' | 'weekly' | 'monthly';
  lastSpokenDate: string;
  notes: string;
}

export interface QuickLootState {
  expenses: ExpenseItem[];
  vlogClips: Record<string, { clip1: boolean; clip2: boolean }>; // date string key
  ankiCards: AnkiCard[];
  contacts: RelationshipContact[];
  amvCountdownWeeks: number;
}

export interface SundayLinkPrep {
  pinterestUrl: string;
  alankarYoutubeUrl: string;
  cloudLabUrl: string;
}

export interface AppState {
  character: CharacterProfile;
  branches: Record<BranchId, AttributeBranch>;
  habits: Habit[];
  monthlyQuests: MonthlyQuest[];
  lootPool: LootItem[];
  claimedLoot: ClaimedLootLog[];
  buffsDebuffs: BuffOrDebuff[];
  pendingChests: {
    common: number;
    rare: number;
    epic: number;
    legendary: number;
  };
  monthlySummaries: MonthSummaryRecord[];

  // Polymath Specific State
  alankars: AlankarItem[];
  bookTracker: BookTrackerState;
  finelinerTracker: FinelinerTrackerState;
  careerLabs: CareerLabItem[];
  quickLoot: QuickLootState;
  sundayLinks: SundayLinkPrep;
}
