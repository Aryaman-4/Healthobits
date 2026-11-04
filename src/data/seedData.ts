import { AppState, AttributeBranch, BranchId, BuffOrDebuff, CharacterProfile, Habit, LootItem, MonthlyQuest } from '../types';

export const INITIAL_BRANCHES: Record<BranchId, AttributeBranch> = {
  body: {
    id: 'body',
    name: 'Body',
    colorHex: '#FF4B4B',
    borderHex: '#EA2B2B',
    tintHex: '#FFDFE0',
    icon: 'heart',
    seasonStartLevel: 4,
    currentMonthStartLevel: 5,
    priorMonthsSeasonalDays: 14, // from Month 1
    featIdeasScratchpad: [
      'Run a 10K without walking breaks',
      'Try a bouldering gym session',
      'Hit 15 pull-ups in a single set'
    ],
    unlockedNodes: [
      { threshold: 5, unlocked: true, unlockedInMonth: 1 },
      { threshold: 15, unlocked: true, unlockedInMonth: 2 },
      { threshold: 30, unlocked: false },
      { threshold: 50, unlocked: false },
      { threshold: 80, unlocked: false }
    ]
  },
  mind: {
    id: 'mind',
    name: 'Mind',
    colorHex: '#1CB0F6',
    borderHex: '#1899D6',
    tintHex: '#DDF4FF',
    icon: 'brain',
    seasonStartLevel: 5,
    currentMonthStartLevel: 6,
    priorMonthsSeasonalDays: 16,
    featIdeasScratchpad: [
      'Read 10 chapters of Dungeon Crawler Carl in one sitting',
      'Finish full audio course on ancient Roman architecture',
      'Solve 25 chess puzzles without hints'
    ],
    unlockedNodes: [
      { threshold: 5, unlocked: true, unlockedInMonth: 1 },
      { threshold: 15, unlocked: true, unlockedInMonth: 1 },
      { threshold: 30, unlocked: false },
      { threshold: 50, unlocked: false },
      { threshold: 80, unlocked: false }
    ]
  },
  craft: {
    id: 'craft',
    name: 'Craft',
    colorHex: '#FFC800',
    borderHex: '#E5A400',
    tintHex: '#FFF5D6',
    icon: 'palette',
    seasonStartLevel: 3,
    currentMonthStartLevel: 4,
    priorMonthsSeasonalDays: 12,
    featIdeasScratchpad: [
      'Master sourdough bread shaping technique',
      'Write & record a 2-minute acoustic fingerstyle riff',
      'Publish an interactive open-source mini tool'
    ],
    unlockedNodes: [
      { threshold: 5, unlocked: true, unlockedInMonth: 1 },
      { threshold: 15, unlocked: false },
      { threshold: 30, unlocked: false },
      { threshold: 50, unlocked: false },
      { threshold: 80, unlocked: false }
    ]
  },
  bonds: {
    id: 'bonds',
    name: 'Bonds',
    colorHex: '#58CC02',
    borderHex: '#46A302',
    tintHex: '#D7FFB8',
    icon: 'handshake',
    seasonStartLevel: 4,
    currentMonthStartLevel: 5,
    priorMonthsSeasonalDays: 15,
    featIdeasScratchpad: [
      'Host Sunday family campfire hot-pot dinner',
      'Surprise partner with a handmade handwritten card',
      'Catch up over coffee with an old college buddy'
    ],
    unlockedNodes: [
      { threshold: 5, unlocked: true, unlockedInMonth: 1 },
      { threshold: 15, unlocked: true, unlockedInMonth: 2 },
      { threshold: 30, unlocked: false },
      { threshold: 50, unlocked: false },
      { threshold: 80, unlocked: false }
    ]
  },
  empire: {
    id: 'empire',
    name: 'Empire',
    colorHex: '#CE82FF',
    borderHex: '#A560E8',
    tintHex: '#F3E5FF',
    icon: 'castle',
    seasonStartLevel: 4,
    currentMonthStartLevel: 5,
    priorMonthsSeasonalDays: 13,
    featIdeasScratchpad: [
      'Audit and cut 3 forgotten recurring SaaS subscriptions',
      'Organize personal tax & investment folder for Q4',
      'Clean garage workbench & organize all tool chests'
    ],
    unlockedNodes: [
      { threshold: 5, unlocked: true, unlockedInMonth: 1 },
      { threshold: 15, unlocked: false },
      { threshold: 30, unlocked: false },
      { threshold: 50, unlocked: false },
      { threshold: 80, unlocked: false }
    ]
  }
};

export const INITIAL_HABITS: Habit[] = [
  // BODY
  {
    id: 'h-body-1',
    branchId: 'body',
    title: 'Morning Movement & 30m Workout',
    isKeystone: true, // ★ Keystone habit
    completedDates: ['2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04']
  },
  {
    id: 'h-body-2',
    branchId: 'body',
    title: 'Drink 2.5L Filtered Water',
    isKeystone: false,
    completedDates: ['2026-11-01', '2026-11-03', '2026-11-04']
  },
  {
    id: 'h-body-3',
    branchId: 'body',
    title: 'In Bed Before 11:00 PM (8h Rest)',
    isKeystone: false,
    completedDates: ['2026-11-02', '2026-11-03']
  },

  // MIND
  {
    id: 'h-mind-1',
    branchId: 'mind',
    title: 'Read 20 Pages of a Fiction/Nonfiction Book',
    isKeystone: true, // ★ Keystone habit
    completedDates: ['2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04']
  },
  {
    id: 'h-mind-2',
    branchId: 'mind',
    title: '15m Daily Language Practice & Vocab',
    isKeystone: false,
    completedDates: ['2026-11-01', '2026-11-04']
  },

  // CRAFT
  {
    id: 'h-craft-1',
    branchId: 'craft',
    title: '30m Deliberate Code or Design Deep Work',
    isKeystone: true, // ★ Keystone habit
    completedDates: ['2026-11-01', '2026-11-02', '2026-11-04']
  },
  {
    id: 'h-craft-2',
    branchId: 'craft',
    title: 'Daily Sketch, Journal, or Music Practice',
    isKeystone: false,
    completedDates: ['2026-11-03']
  },

  // BONDS
  {
    id: 'h-bonds-1',
    branchId: 'bonds',
    title: 'Connect with Loved One or Send Encouraging Text',
    isKeystone: true, // ★ Keystone habit
    completedDates: ['2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04']
  },
  {
    id: 'h-bonds-2',
    branchId: 'bonds',
    title: 'Shared Evening Walk or Family Dinner',
    isKeystone: false,
    completedDates: ['2026-11-02', '2026-11-04']
  },

  // EMPIRE
  {
    id: 'h-empire-1',
    branchId: 'empire',
    title: 'Daily Inbox Zero & Task Prioritization Plan',
    isKeystone: true, // ★ Keystone habit
    completedDates: ['2026-11-01', '2026-11-03', '2026-11-04']
  },
  {
    id: 'h-empire-2',
    branchId: 'empire',
    title: 'Log Daily Expenses & Check Budget App',
    isKeystone: false,
    completedDates: ['2026-11-01', '2026-11-02']
  }
];

export const INITIAL_CHARACTER: CharacterProfile = {
  name: 'Adventurer',
  classTitle: 'Recovering Couch Potato',
  avatarSeed: 'knight',
  avatarBg: '#58CC02',
  seasonNumber: 2,
  seasonName: 'Season of the Phoenix',
  currentMonthIndex: 2,
  currentYearMonth: '2026-11',
  pactSigned: true,
  pactSignatureDataUrl: '',
  pactSignedDate: '2026-10-01',
  monthlyReflectionNotes: 'November is feeling great! Keystone habit focus helps immensely on exhausting work days. Heading for rare loot!'
};

export const INITIAL_QUESTS: MonthlyQuest[] = [
  {
    id: 'q-main',
    title: 'Complete 100km Seasonal Trail Run Challenge',
    branchId: 'body',
    isMainQuest: true,
    difficultyStars: 5,
    customReward: 'Ultra lightweight hydration vest & trail shoes',
    isCompleted: false
  },
  {
    id: 'q-side-1',
    title: 'Read 10 chapters of Dungeon Crawler Carl in one sitting',
    branchId: 'mind',
    isMainQuest: false,
    isCompleted: false
  },
  {
    id: 'q-side-2',
    title: 'Master sourdough bread shaping technique',
    branchId: 'craft',
    isMainQuest: false,
    isCompleted: true
  },
  {
    id: 'q-side-3',
    title: 'Host Sunday family campfire hot-pot dinner',
    branchId: 'bonds',
    isMainQuest: false,
    isCompleted: false
  }
];

export const INITIAL_LOOT_POOL: LootItem[] = [
  // COMMON
  { id: 'l-c-1', rarity: 'common', title: 'Ice cream party' },
  { id: 'l-c-2', rarity: 'common', title: 'Night of binging TV' },
  { id: 'l-c-3', rarity: 'common', title: 'Fancy bakery chocolate croissant & artisan latte' },
  { id: 'l-c-4', rarity: 'common', title: '1 hour uninterrupted hammock reading session' },

  // RARE
  { id: 'l-r-1', rarity: 'rare', title: 'Order deluxe dinner from top-shelf sushi bar' },
  { id: 'l-r-2', rarity: 'rare', title: 'Buy that indie game on my Steam wishlist' },
  { id: 'l-r-3', rarity: 'rare', title: 'Afternoon movie theater ticket with butter popcorn' },
  { id: 'l-r-4', rarity: 'rare', title: 'New hardcover fantasy novel from local indie bookstore' },

  // EPIC
  { id: 'l-e-1', rarity: 'epic', title: 'Weekend mountain cabin getaway with hot tub' },
  { id: 'l-e-2', rarity: 'epic', title: 'Brand new premium noise-canceling headphones' },
  { id: 'l-e-3', rarity: 'epic', title: 'Full spa day & 90-minute deep tissue massage' },
  { id: 'l-e-4', rarity: 'epic', title: 'Special tasting menu dinner at Michelin-starred bistro' },

  // LEGENDARY
  { id: 'l-l-1', rarity: 'legendary', title: 'Dream vacation week in Kyoto & Alpine thermal springs' },
  { id: 'l-l-2', rarity: 'legendary', title: 'Ultimate dual-motor standing desk & ergonomic chair upgrade' }
];

export const INITIAL_CLAIMED_LOOT = [
  {
    id: 'cl-1',
    rarity: 'common' as const,
    rewardTitle: 'Ice cream party',
    claimedDate: '2026-10-18',
    triggerReason: '7-Day Keystone Streak on Morning Movement'
  },
  {
    id: 'cl-2',
    rarity: 'rare' as const,
    rewardTitle: 'Order deluxe dinner from top-shelf sushi bar',
    claimedDate: '2026-10-29',
    triggerReason: 'Unlocked Mind Node 15'
  }
];

export const INITIAL_BUFFS_DEBUFFS: BuffOrDebuff[] = [
  {
    id: 'b-1',
    type: 'buff',
    description: 'Laying out workout clothes & running shoes the night before',
    branchId: 'body'
  },
  {
    id: 'b-2',
    type: 'buff',
    description: 'Full 1L thermos of iced water sitting right on my desk at 9 AM',
    branchId: 'body'
  },
  {
    id: 'b-3',
    type: 'buff',
    description: '10-minute cozy wind-down alarm set at 10:30 PM with warm amber lamp',
    branchId: 'mind'
  },
  {
    id: 'd-1',
    type: 'debuff',
    description: 'Bringing phone into bed past 11:00 PM for doomscrolling',
    branchId: 'body'
  },
  {
    id: 'd-2',
    type: 'debuff',
    description: 'Skipping balanced lunch and drinking triple shot espresso on empty stomach',
    branchId: 'body'
  },
  {
    id: 'd-3',
    type: 'debuff',
    description: 'Leaving browser open with 47 unorganized tabs causing mental fog',
    branchId: 'mind'
  }
];

export const INITIAL_STATE: AppState = {
  character: INITIAL_CHARACTER,
  branches: INITIAL_BRANCHES,
  habits: INITIAL_HABITS,
  monthlyQuests: INITIAL_QUESTS,
  lootPool: INITIAL_LOOT_POOL,
  claimedLoot: INITIAL_CLAIMED_LOOT,
  buffsDebuffs: INITIAL_BUFFS_DEBUFFS,
  pendingChests: {
    common: 1, // Ready to open for excitement!
    rare: 1,   // Ready to open for excitement!
    epic: 0,
    legendary: 0
  },
  monthlySummaries: [
    {
      monthIndex: 1,
      monthName: 'October 2026',
      branchDays: {
        body: 14,
        mind: 16,
        craft: 12,
        bonds: 15,
        empire: 13
      },
      nodesUnlocked: 6,
      featsCompleted: 4
    }
  ]
};

