import { AppState, AttributeBranch, BranchId, Habit, LootRarity, MonthlyQuest, NodeThreshold } from '../types';

export const NODE_THRESHOLDS: NodeThreshold[] = [5, 15, 30, 50, 80];

/**
 * Format a Date to 'YYYY-MM-DD'
 */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Parse 'YYYY-MM-DD' into a local Date
 */
export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Get total number of days in a year-month (e.g. '2026-11' -> 30)
 */
export function getDaysInMonth(yearMonth: string): number {
  const [y, m] = yearMonth.split('-').map(Number);
  return new Date(y, m, 0).getDate();
}

/**
 * RULE 1: THE "1 POINT PER BRANCH PER DAY" CAP
 * Returns the Set of ISO dates ('YYYY-MM-DD') where AT LEAST ONE habit for this branch was completed.
 * Even if user completes 3 Body habits on Tuesday, this Set contains Tuesday once (+1).
 */
export function getActiveBranchDates(
  branchId: BranchId,
  habits: Habit[],
  dateFilter?: (date: string) => boolean
): Set<string> {
  const activeDates = new Set<string>();
  const branchHabits = habits.filter(h => h.branchId === branchId);

  for (const habit of branchHabits) {
    for (const d of habit.completedDates) {
      if (!dateFilter || dateFilter(d)) {
        activeDates.add(d);
      }
    }
  }

  return activeDates;
}

/**
 * Calculate active days for a branch in a specific month
 */
export function getBranchDaysForMonth(
  branchId: BranchId,
  habits: Habit[],
  yearMonth: string
): { half1Days: number; half2Days: number; totalMonthDays: number; activeDates: Set<string> } {
  const activeDates = getActiveBranchDates(branchId, habits, (date) => date.startsWith(yearMonth));

  let half1Days = 0;
  let half2Days = 0;

  activeDates.forEach(date => {
    const day = parseInt(date.split('-')[2], 10);
    if (day <= 15) {
      half1Days++;
    } else {
      half2Days++;
    }
  });

  return {
    half1Days,
    half2Days,
    totalMonthDays: half1Days + half2Days,
    activeDates
  };
}

/**
 * Cumulative Seasonal Branch Days:
 * Prior Season Months' Days + Current Month Branch Days
 */
export function getCumulativeSeasonalBranchDays(
  branch: AttributeBranch,
  habits: Habit[],
  yearMonth: string
): number {
  const { totalMonthDays } = getBranchDaysForMonth(branch.id, habits, yearMonth);
  return branch.priorMonthsSeasonalDays + totalMonthDays;
}

/**
 * Check node status for a branch given cumulative days
 */
export function getBranchNodeProgress(
  branch: AttributeBranch,
  habits: Habit[],
  yearMonth: string
): {
  cumulativeDays: number;
  currentMonthDays: number;
  unlockedThresholds: NodeThreshold[];
  nextTargetThreshold: NodeThreshold | null;
  daysToNextNode: number;
  progressPercentToNext: number;
} {
  const { totalMonthDays } = getBranchDaysForMonth(branch.id, habits, yearMonth);
  const cumulativeDays = branch.priorMonthsSeasonalDays + totalMonthDays;

  const unlockedThresholds = NODE_THRESHOLDS.filter(t => cumulativeDays >= t);
  const nextTarget = NODE_THRESHOLDS.find(t => cumulativeDays < t) || null;

  let daysToNextNode = 0;
  let progressPercentToNext = 100;

  if (nextTarget !== null) {
    const prevThresholdIndex = NODE_THRESHOLDS.indexOf(nextTarget) - 1;
    const prevThreshold = prevThresholdIndex >= 0 ? NODE_THRESHOLDS[prevThresholdIndex] : 0;
    daysToNextNode = nextTarget - cumulativeDays;
    const span = nextTarget - prevThreshold;
    const progressInSpan = cumulativeDays - prevThreshold;
    progressPercentToNext = Math.min(100, Math.max(0, Math.round((progressInSpan / span) * 100)));
  }

  return {
    cumulativeDays,
    currentMonthDays: totalMonthDays,
    unlockedThresholds,
    nextTargetThreshold: nextTarget,
    daysToNextNode,
    progressPercentToNext
  };
}

/**
 * RULE 3: ★ KEYSTONE HABIT STREAK & COMMON LOOT TRIGGER
 * Calculates the current consecutive day streak for a habit ending today or yesterday.
 * Also checks if a 7-day consecutive streak was ever achieved.
 */
export function calculateHabitStreak(habit: Habit, referenceDateStr?: string): { currentStreak: number; longestStreak: number; has7DayStreak: boolean } {
  if (!habit.completedDates || habit.completedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, has7DayStreak: false };
  }

  // Sort dates ascending
  const sorted = Array.from(new Set(habit.completedDates)).sort();
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;

  for (const dateStr of sorted) {
    const currentDate = parseDate(dateStr);
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffDays = Math.round((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    prevDate = currentDate;
  }

  // Calculate current streak relative to reference date (default: today)
  const todayStr = referenceDateStr || formatDate(new Date());
  const today = parseDate(todayStr);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  let currentStreak = 0;
  if (sorted.includes(todayStr)) {
    // Count backwards from today
    let check = new Date(today);
    while (sorted.includes(formatDate(check))) {
      currentStreak++;
      check.setDate(check.getDate() - 1);
    }
  } else if (sorted.includes(yesterdayStr)) {
    // Count backwards from yesterday
    let check = new Date(yesterday);
    while (sorted.includes(formatDate(check))) {
      currentStreak++;
      check.setDate(check.getDate() - 1);
    }
  }

  return {
    currentStreak,
    longestStreak,
    has7DayStreak: longestStreak >= 7
  };
}

/**
 * Check if today has at least one habit completed for a branch
 */
export function isBranchActiveOnDate(branchId: BranchId, habits: Habit[], dateStr: string): boolean {
  return habits.some(h => h.branchId === branchId && h.completedDates.includes(dateStr));
}

/**
 * RULE 6: END-OF-MONTH LEVELING FORMULA
 */
export function calculateMonthLevelUp(
  branch: AttributeBranch,
  habits: Habit[],
  quests: MonthlyQuest[],
  yearMonth: string
): {
  previousLevel: number;
  monthBranchDays: number;
  cumulativeDays: number;
  nodesUnlockedThisMonth: number;
  unlockedThresholdsThisMonth: NodeThreshold[];
  featsCompletedThisMonth: number;
  newLevel: number;
} {
  const { totalMonthDays } = getBranchDaysForMonth(branch.id, habits, yearMonth);
  const cumulativeDays = branch.priorMonthsSeasonalDays + totalMonthDays;
  const priorCumulativeDays = branch.priorMonthsSeasonalDays;

  // New nodes unlocked in this specific month
  const unlockedThresholdsThisMonth = NODE_THRESHOLDS.filter(
    t => cumulativeDays >= t && priorCumulativeDays < t
  );
  const nodesUnlockedThisMonth = unlockedThresholdsThisMonth.length;

  // Feats completed for this branch this month (Main Quest if tagged + Side Quests)
  const featsCompletedThisMonth = quests.filter(
    q => q.branchId === branch.id && q.isCompleted
  ).length;

  const previousLevel = branch.currentMonthStartLevel;
  const newLevel = previousLevel + nodesUnlockedThisMonth + featsCompletedThisMonth;

  return {
    previousLevel,
    monthBranchDays: totalMonthDays,
    cumulativeDays,
    nodesUnlockedThisMonth,
    unlockedThresholdsThisMonth,
    featsCompletedThisMonth,
    newLevel
  };
}

/**
 * Total Character Level = sum of all 5 attribute branch levels
 */
export function calculateCharacterOverallLevel(
  branches: Record<BranchId, AttributeBranch>,
  habits: Habit[],
  quests: MonthlyQuest[],
  yearMonth: string
): {
  overallLevel: number;
  branchLevels: Record<BranchId, number>;
  seasonalGains: Record<BranchId, number>;
} {
  let overall = 0;
  const branchLevels: Record<BranchId, number> = {} as Record<BranchId, number>;
  const seasonalGains: Record<BranchId, number> = {} as Record<BranchId, number>;

  (Object.keys(branches) as BranchId[]).forEach(id => {
    const branch = branches[id];
    const calc = calculateMonthLevelUp(branch, habits, quests, yearMonth);
    branchLevels[id] = calc.newLevel;
    seasonalGains[id] = calc.newLevel - branch.seasonStartLevel;
    overall += calc.newLevel;
  });

  return {
    overallLevel: overall,
    branchLevels,
    seasonalGains
  };
}

/**
 * Check for newly triggered Loot Chests across the game state
 */
export function checkForLootTriggers(
  state: AppState
): { rarity: LootRarity; reason: string }[] {
  const triggers: { rarity: LootRarity; reason: string }[] = [];
  const { habits, branches, character, claimedLoot } = state;

  // 1. Check 🪵 Common Loot: 7 consecutive days of ANY Keystone Habit
  const keystoneHabits = habits.filter(h => h.isKeystone);
  for (const habit of keystoneHabits) {
    const streak = calculateHabitStreak(habit);
    if (streak.has7DayStreak) {
      const reason = `7-Day Keystone Streak on "${habit.title}"`;
      const alreadyClaimed = claimedLoot.some(c => c.triggerReason === reason);
      if (!alreadyClaimed) {
        triggers.push({ rarity: 'common', reason });
      }
    }
  }

  // 2. Check 💎 Rare Loot: Every time 1 Skill Node (5, 15, 30, 50, 80) is filled
  (Object.keys(branches) as BranchId[]).forEach(id => {
    const branch = branches[id];
    const progress = getBranchNodeProgress(branch, habits, character.currentYearMonth);
    for (const threshold of progress.unlockedThresholds) {
      const reason = `Unlocked ${branch.name} Node ${threshold}`;
      const alreadyClaimed = claimedLoot.some(c => c.triggerReason === reason);
      if (!alreadyClaimed) {
        triggers.push({ rarity: 'rare', reason });
      }
    }
  });

  // 3. Check 🔮 Epic Loot: 1 entire branch reaching Node 80
  (Object.keys(branches) as BranchId[]).forEach(id => {
    const branch = branches[id];
    const progress = getBranchNodeProgress(branch, habits, character.currentYearMonth);
    if (progress.unlockedThresholds.includes(80)) {
      const reason = `Completed Entire ${branch.name} Skill Tree (Node 80)`;
      const alreadyClaimed = claimedLoot.some(c => c.triggerReason === reason);
      if (!alreadyClaimed) {
        triggers.push({ rarity: 'epic', reason });
      }
    }
  });

  // 4. Check 👑 Legendary Loot: All 5 branches reaching Node 80
  let allBranches80 = true;
  (Object.keys(branches) as BranchId[]).forEach(id => {
    const branch = branches[id];
    const progress = getBranchNodeProgress(branch, habits, character.currentYearMonth);
    if (!progress.unlockedThresholds.includes(80)) {
      allBranches80 = false;
    }
  });

  if (allBranches80) {
    const reason = `Master of the Realm: All 5 Branches Reached Node 80!`;
    const alreadyClaimed = claimedLoot.some(c => c.triggerReason === reason);
    if (!alreadyClaimed) {
      triggers.push({ rarity: 'legendary', reason });
    }
  }

  return triggers;
}

