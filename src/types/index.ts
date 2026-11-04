export type BranchId = 'body' | 'mind' | 'craft' | 'bonds' | 'empire';
export type LootRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type NodeThreshold = 5 | 15 | 30 | 50 | 80;

export interface NodeUnlockStatus {
  threshold: NodeThreshold;
  unlocked: boolean;
  unlockedInMonth?: 1 | 2 | 3;
}

export interface AttributeBranch {
  id: BranchId;
  name: string;
  colorHex: string;
  borderHex: string;
  tintHex: string;
  icon: string; // 'heart' | 'brain' | 'palette' | 'handshake' | 'castle'
  seasonStartLevel: number;       // Carried over from last season
  currentMonthStartLevel: number;  // Carried over from last month
  priorMonthsSeasonalDays: number; // Active days from earlier months in this 3-month season
  featIdeasScratchpad: string[];   // Brainstormed feat ideas stored under the Skill Key
  unlockedNodes: NodeUnlockStatus[];
}

export interface Habit {
  id: string;
  branchId: BranchId;
  title: string;
  isKeystone: boolean; // ★ Top priority habit for this branch
  completedDates: string[]; // ISO dates 'YYYY-MM-DD'
  createdDate?: string;
}

export interface MonthlyQuest {
  id: string;
  title: string;
  branchId: BranchId;
  isMainQuest: boolean;
  difficultyStars?: 1 | 2 | 3 | 4 | 5; // Required for Main Quest
  customReward?: string;               // Specific prize for Main Quest
  isCompleted: boolean;
}

export interface LootItem {
  id: string;
  rarity: LootRarity;
  title: string; // e.g., "Ice cream party", "Night of binging TV"
}

export interface ClaimedLootLog {
  id: string;
  rarity: LootRarity;
  rewardTitle: string;
  claimedDate: string;
  triggerReason: string; // e.g., "7-Day Keystone Streak" or "Unlocked Body Node 15"
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
  avatarSeed: string; // icon or avatar id
  avatarBg: string;
  seasonNumber: number;
  seasonName: string;
  currentMonthIndex: 1 | 2 | 3; // Month 1, 2, or 3 of the 3-month season
  currentYearMonth: string; // e.g. "2026-11"
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
}

