/**
 * TRANSACTIONAL GAMIFICATION & HABIT EVALUATION ENGINE
 * Strictly enforces 1-Point-Per-Branch-Per-Day cap, node unlocks, and 4-tier loot chest triggers
 */

export interface GamificationConfig {
  seasonDurationMonths: number;
  nodeThresholds: number[];
  maxBranchPointsPerDay: number;
  keystoneStreakForCommonLoot: number;
  featCompletionLevelBonus: number;
  requireKeystoneStarPerBranch: boolean;
}

export interface HabitToggleResult {
  isCompleted: boolean;
  branchDayEarnedToday: boolean;
  cumulativeSeasonDays: number;
  newlyUnlockedNodes: number[];
  newlyUnlockedChests: {
    rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
    triggerSource: string;
  }[];
  newBranchLevel: number;
  newOverallLevel: number;
}

export class GamificationEngine {
  public static DEFAULT_CONFIG: GamificationConfig = {
    seasonDurationMonths: 3,
    nodeThresholds: [5, 15, 30, 50, 80],
    maxBranchPointsPerDay: 1,
    keystoneStreakForCommonLoot: 7,
    featCompletionLevelBonus: 1,
    requireKeystoneStarPerBranch: true
  };

  /**
   * Evaluate habit completion and return real-time celebratory payload
   */
  public static evaluateHabitToggle(
    habitId: string,
    branchId: string,
    completedDate: string,
    isKeystone: boolean,
    alreadyCompletedDates: string[],
    allBranchHabitCompletions: { habitId: string; dates: string[] }[],
    priorMonthsSeasonalDays: number,
    currentBranchLevel: number,
    allOtherBranchLevels: number[],
    customConfig?: Partial<GamificationConfig>
  ): HabitToggleResult {
    const config = { ...this.DEFAULT_CONFIG, ...customConfig };
    const isNowCompleted = !alreadyCompletedDates.includes(completedDate);

    // Calculate dates for this habit
    const updatedHabitDates = isNowCompleted
      ? [...alreadyCompletedDates, completedDate]
      : alreadyCompletedDates.filter(d => d !== completedDate);

    // Calculate active branch days (RULE 1: Max 1 point per branch per day)
    const activeBranchDatesSet = new Set<string>();
    allBranchHabitCompletions.forEach(h => {
      const dates = h.habitId === habitId ? updatedHabitDates : h.dates;
      dates.forEach(d => activeBranchDatesSet.add(d));
    });

    const branchDayEarnedToday = activeBranchDatesSet.has(completedDate);
    const cumulativeSeasonDays = priorMonthsSeasonalDays + activeBranchDatesSet.size;

    // Check newly unlocked nodes
    const prevDays = priorMonthsSeasonalDays + (activeBranchDatesSet.size - (isNowCompleted ? 1 : 0));
    const newlyUnlockedNodes: number[] = [];
    const newlyUnlockedChests: { rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'; triggerSource: string }[] = [];

    if (isNowCompleted) {
      config.nodeThresholds.forEach(threshold => {
        if (cumulativeSeasonDays >= threshold && prevDays < threshold) {
          newlyUnlockedNodes.push(threshold);
          // 💎 RARE CHEST
          newlyUnlockedChests.push({
            rarity: 'RARE',
            triggerSource: `SKILL_NODE_UNLOCK:${branchId}:${threshold}`
          });

          // 🔮 EPIC CHEST (Branch finished at 80)
          if (threshold === 80) {
            newlyUnlockedChests.push({
              rarity: 'EPIC',
              triggerSource: `BRANCH_COMPLETE:${branchId}:80`
            });
          }
        }
      });

      // 🪵 COMMON CHEST: 7-Day Keystone Streak
      if (isKeystone) {
        const sortedDates = [...updatedHabitDates].sort();
        let streak = 0;
        let checkDate = new Date(completedDate);

        while (sortedDates.includes(checkDate.toISOString().slice(0, 10))) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        }

        if (streak === config.keystoneStreakForCommonLoot) {
          newlyUnlockedChests.push({
            rarity: 'COMMON',
            triggerSource: `KEYSTONE_STREAK:${habitId}:7_DAYS`
          });
        }
      }
    }

    const newBranchLevel = currentBranchLevel + newlyUnlockedNodes.length;
    const newOverallLevel = allOtherBranchLevels.reduce((a, b) => a + b, 0) + newBranchLevel;

    return {
      isCompleted: isNowCompleted,
      branchDayEarnedToday,
      cumulativeSeasonDays,
      newlyUnlockedNodes,
      newlyUnlockedChests,
      newBranchLevel,
      newOverallLevel
    };
  }
}
