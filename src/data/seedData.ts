import {
  AppState,
  AttributeBranch,
  BranchId,
  BuffOrDebuff,
  CharacterProfile,
  Habit,
  LootItem,
  MonthlyQuest,
  AlankarItem,
  BookTrackerState,
  FinelinerTrackerState,
  CareerLabItem,
  QuickLootState,
  SundayLinkPrep,
  BranchMilestoneNode,
  ShiftScheduleConfig,
  UserAccount
} from '../types';

export const DEFAULT_BRANCH_MILESTONES: Record<BranchId, BranchMilestoneNode[]> = {
  body: [
    {
      threshold: 5,
      rankTitle: 'Novice Initiate',
      milestoneGoal: 'Nail 5 days of joint prep + wall handstand holds',
      rewardType: 'rare',
      rewardDescription: '💎 Rare Loot Chest + +1 Branch Level',
      unlocked: true,
      unlockedInMonth: 1
    },
    {
      threshold: 15,
      rankTitle: 'Apprentice Strider',
      milestoneGoal: '30s freestanding frog stand / 10 archer pushups',
      rewardType: 'rare',
      rewardDescription: '💎 Rare Loot Chest + +1 Branch Level',
      unlocked: true,
      unlockedInMonth: 1
    },
    {
      threshold: 30,
      rankTitle: 'Adept Practitioner',
      milestoneGoal: 'Crow-to-Crane transition + explosive pistol squat reps',
      rewardType: 'rare',
      rewardDescription: '💎 Rare Loot Chest + +1 Branch Level',
      unlocked: false
    },
    {
      threshold: 50,
      rankTitle: 'Vanguard Specialist',
      milestoneGoal: 'Wall Handstand Push-Up (HSPU) reps + Eight-Angle pose hold',
      rewardType: 'rare',
      rewardDescription: '💎 Rare Loot Chest + +1 Branch Level',
      unlocked: false
    },
    {
      threshold: 80,
      rankTitle: 'Grandmaster Apex',
      milestoneGoal: 'Full 60m Calisthenics/Acrobatics mastery + Peacock pose',
      rewardType: 'epic',
      rewardDescription: '🔮 Epic Loot Chest + +1 Branch Level',
      unlocked: false
    }
  ],
  mind: [
    {
      threshold: 5,
      rankTitle: 'Novice Initiate',
      milestoneGoal: 'Read 145 pages + log 5 quotes',
      rewardType: 'rare',
      rewardDescription: '💎 Rare Loot Chest + +1 Branch Level',
      unlocked: true,
      unlockedInMonth: 1
    },
    {
      threshold: 15,
      rankTitle: 'Apprentice Strider',
      milestoneGoal: 'Complete 1st full 400-page book + Anki review',
      rewardType: 'rare',
      rewardDescription: '💎 Rare Loot Chest + +1 Branch Level',
      unlocked: true,
      unlockedInMonth: 1
    },
    {
      threshold: 30,
      rankTitle: 'Adept Practitioner',
      milestoneGoal: 'Complete 2nd book + 30-day meditation anchor',
      rewardType: 'rare',
      rewardDescription: '💎 Rare Loot Chest + +1 Branch Level',
      unlocked: false
    },
    {
      threshold: 50,
      rankTitle: 'Vanguard Specialist',
      milestoneGoal: 'Complete 3.5 books + 150 Anki cards mastered',
      rewardType: 'rare',
      rewardDescription: '💎 Rare Loot Chest + +1 Branch Level',
      unlocked: false
    },
    {
      threshold: 80,
      rankTitle: 'Grandmaster Apex',
      milestoneGoal: '6 books finished in Season (2,400 pages) + sharp recall',
      rewardType: 'epic',
      rewardDescription: '🔮 Epic Loot Chest + +1 Branch Level',
      unlocked: false
    }
  ],
  craft: [
    {
      threshold: 5,
      rankTitle: 'Novice Initiate',
      milestoneGoal: 'Clean finger sealing on Alankars 1–2 / 1st pencil grid',
      rewardType: 'rare',
      rewardDescription: '💎 Rare Loot Chest + +1 Branch Level',
      unlocked: true,
      unlockedInMonth: 1
    },
    {
      threshold: 15,
      rankTitle: 'Apprentice Strider',
      milestoneGoal: 'Master Alankars 1–4 + whistle match / Finish 1st Fineliner piece',
      rewardType: 'rare',
      rewardDescription: '💎 Rare Loot Chest + +1 Branch Level',
      unlocked: true,
      unlockedInMonth: 1
    },
    {
      threshold: 30,
      rankTitle: 'Adept Practitioner',
      milestoneGoal: 'Unlock Alankars 5–6 (triplets) + 2nd Fineliner shading mastery',
      rewardType: 'rare',
      rewardDescription: '💎 Rare Loot Chest + +1 Branch Level',
      unlocked: false
    },
    {
      threshold: 50,
      rankTitle: 'Vanguard Specialist',
      milestoneGoal: 'Master Alankars 7–8 across octaves + 1st AMV/Vlog milestone',
      rewardType: 'rare',
      rewardDescription: '💎 Rare Loot Chest + +1 Branch Level',
      unlocked: false
    },
    {
      threshold: 80,
      rankTitle: 'Grandmaster Apex',
      milestoneGoal: 'Record clean 1-take Flute song with gamak/meend + 5 Ink pieces',
      rewardType: 'epic',
      rewardDescription: '🔮 Epic Loot Chest + +1 Branch Level',
      unlocked: false
    }
  ],
  bonds: [
    {
      threshold: 5,
      rankTitle: 'Novice Initiate',
      milestoneGoal: '5 daily family check-ins + 2 AI English sessions',
      rewardType: 'rare',
      rewardDescription: '💎 Rare Loot Chest + +1 Branch Level',
      unlocked: true,
      unlockedInMonth: 1
    },
    {
      threshold: 15,
      rankTitle: 'Apprentice Strider',
      milestoneGoal: '2 weekly friend calls via Question Bank + 1st Vlog voiceover',
      rewardType: 'rare',
      rewardDescription: '💎 Rare Loot Chest + +1 Branch Level',
      unlocked: true,
      unlockedInMonth: 1
    },
    {
      threshold: 30,
      rankTitle: 'Adept Practitioner',
      milestoneGoal: '4 English video journals recorded + deep mentor catch-up',
      rewardType: 'rare',
      rewardDescription: '💎 Rare Loot Chest + +1 Branch Level',
      unlocked: false
    },
    {
      threshold: 50,
      rankTitle: 'Vanguard Specialist',
      milestoneGoal: 'Natural unscripted 3-min English storytelling flow',
      rewardType: 'rare',
      rewardDescription: '💎 Rare Loot Chest + +1 Branch Level',
      unlocked: false
    },
    {
      threshold: 80,
      rankTitle: 'Grandmaster Apex',
      milestoneGoal: 'Thriving inner circle + confident public/video communication',
      rewardType: 'epic',
      rewardDescription: '🔮 Epic Loot Chest + +1 Branch Level',
      unlocked: false
    }
  ],
  empire: [
    {
      threshold: 5,
      rankTitle: 'Novice Initiate',
      milestoneGoal: '5 days expense logging + 2 Cloud/Security lab setups',
      rewardType: 'rare',
      rewardDescription: '💎 Rare Loot Chest + +1 Branch Level',
      unlocked: true,
      unlockedInMonth: 1
    },
    {
      threshold: 15,
      rankTitle: 'Apprentice Strider',
      milestoneGoal: 'Deploy 1st Cloud VPC mini-project + 15d expense streak',
      rewardType: 'rare',
      rewardDescription: '💎 Rare Loot Chest + +1 Branch Level',
      unlocked: false
    },
    {
      threshold: 30,
      rankTitle: 'Adept Practitioner',
      milestoneGoal: 'Build Python Security Agent lab + publish LinkedIn case study',
      rewardType: 'rare',
      rewardDescription: '💎 Rare Loot Chest + +1 Branch Level',
      unlocked: false
    },
    {
      threshold: 50,
      rankTitle: 'Vanguard Specialist',
      milestoneGoal: 'Complete 4 Cloud/AI portfolio labs + full monthly budget audit',
      rewardType: 'rare',
      rewardDescription: '💎 Rare Loot Chest + +1 Branch Level',
      unlocked: false
    },
    {
      threshold: 80,
      rankTitle: 'Grandmaster Apex',
      milestoneGoal: 'Cloud + Cybersec + Agentic AI capstone ready + financial control',
      rewardType: 'epic',
      rewardDescription: '🔮 Epic Loot Chest + +1 Branch Level',
      unlocked: false
    }
  ]
};

export const DEFAULT_SHIFT_CONFIG: ShiftScheduleConfig = {
  workStartTime: '12:00',
  workEndTime: '21:00',
  weekOffDays: ['SAT', 'SUN'],
  commuteBufferMinutes: 45,
  preShiftWindowLabel: 'Pre-Shift Morning 6:30–11:15 AM',
  workShiftWindowLabel: 'Work Shift 12:00–9:00 PM',
  nightWindDownWindowLabel: 'Night Wind-Down 9:45 PM'
};

export const DEFAULT_ACCOUNT: UserAccount = {
  id: 'usr_polymath_01',
  email: 'aryan.quest@polymath.dev',
  characterName: 'Aryan',
  characterClass: 'Cloud-Native Polymath',
  token: 'mock_jwt_d1_session_token_xyz',
  isLoggedIn: true,
  lastSyncedAt: new Date().toISOString(),
  cloudD1Status: 'synced'
};

export const INITIAL_BRANCHES: Record<BranchId, AttributeBranch> = {
  body: {
    id: 'body',
    name: 'Body',
    focusArea: 'Calisthenics, Acrobatics, Yoga, Water',
    colorHex: '#FF4B4B',
    borderHex: '#EA2B2B',
    tintHex: '#FFDFE0',
    icon: 'dumbbell',
    seasonStartLevel: 6,
    currentMonthStartLevel: 7,
    priorMonthsSeasonalDays: 16,
    featIdeasScratchpad: [
      'Clean 10-second freestanding handstand hold',
      'Full Macaco to Bridge kickover sequence',
      'Solid 5-second Crow to Crane (Bakasana) transition'
    ],
    unlockedNodes: [
      { threshold: 5, unlocked: true, unlockedInMonth: 1 },
      { threshold: 15, unlocked: true, unlockedInMonth: 1 },
      { threshold: 30, unlocked: false },
      { threshold: 50, unlocked: false },
      { threshold: 80, unlocked: false }
    ],
    milestoneNodes: DEFAULT_BRANCH_MILESTONES.body
  },
  mind: {
    id: 'mind',
    name: 'Mind',
    focusArea: 'Active Reading, Meditation, Anki/Chess',
    colorHex: '#1CB0F6',
    borderHex: '#1899D6',
    tintHex: '#DDF4FF',
    icon: 'brain',
    seasonStartLevel: 7,
    currentMonthStartLevel: 8,
    priorMonthsSeasonalDays: 18,
    featIdeasScratchpad: [
      'Read 400 pages of High-Performance Systems in 14 days',
      'Export 50 Anki flashcards from tech & philosophy reading',
      '20-minute unguided Vipassana breath meditation'
    ],
    unlockedNodes: [
      { threshold: 5, unlocked: true, unlockedInMonth: 1 },
      { threshold: 15, unlocked: true, unlockedInMonth: 1 },
      { threshold: 30, unlocked: false },
      { threshold: 50, unlocked: false },
      { threshold: 80, unlocked: false }
    ],
    milestoneNodes: DEFAULT_BRANCH_MILESTONES.mind
  },
  craft: {
    id: 'craft',
    name: 'Craft',
    focusArea: 'Flute, Whistle, Fineliner Art, Video Editing',
    colorHex: '#FFC800',
    borderHex: '#E5A400',
    tintHex: '#FFF5D6',
    icon: 'palette',
    seasonStartLevel: 6,
    currentMonthStartLevel: 7,
    priorMonthsSeasonalDays: 15,
    featIdeasScratchpad: [
      'Master Alankars 1–4 at 100 BPM on Bansuri',
      'Finish 14-day complex Sakura Micron 005 A4 illustration',
      'Record 1-take flute ornamentation video for Instagram'
    ],
    unlockedNodes: [
      { threshold: 5, unlocked: true, unlockedInMonth: 1 },
      { threshold: 15, unlocked: true, unlockedInMonth: 1 },
      { threshold: 30, unlocked: false },
      { threshold: 50, unlocked: false },
      { threshold: 80, unlocked: false }
    ],
    milestoneNodes: DEFAULT_BRANCH_MILESTONES.craft
  },
  bonds: {
    id: 'bonds',
    name: 'Bonds',
    focusArea: 'Mom & Arman, Question CRM, English Fluency',
    colorHex: '#58CC02',
    borderHex: '#46A302',
    tintHex: '#D7FFB8',
    icon: 'handshake',
    seasonStartLevel: 6,
    currentMonthStartLevel: 7,
    priorMonthsSeasonalDays: 17,
    featIdeasScratchpad: [
      'Daily meaningful question call with Mom & Arman',
      'Record a 3-minute fluent English voiceover monologue',
      'Deep 1-on-1 coffee chat with batchmate on creative engineering'
    ],
    unlockedNodes: [
      { threshold: 5, unlocked: true, unlockedInMonth: 1 },
      { threshold: 15, unlocked: true, unlockedInMonth: 1 },
      { threshold: 30, unlocked: false },
      { threshold: 50, unlocked: false },
      { threshold: 80, unlocked: false }
    ],
    milestoneNodes: DEFAULT_BRANCH_MILESTONES.bonds
  },
  empire: {
    id: 'empire',
    name: 'Empire',
    focusArea: 'Cloud/Cybersec/Agentic AI, Finances, Personal Brand',
    colorHex: '#CE82FF',
    borderHex: '#A560E8',
    tintHex: '#F3E5FF',
    icon: 'castle',
    seasonStartLevel: 5,
    currentMonthStartLevel: 6,
    priorMonthsSeasonalDays: 14,
    featIdeasScratchpad: [
      'Deploy autonomous Python AI agent analyzing CloudWatch/GCP logs',
      'Publish technical breakdown case study on LinkedIn',
      'Sunday weekly expense reconciliation & savings audit'
    ],
    unlockedNodes: [
      { threshold: 5, unlocked: true, unlockedInMonth: 1 },
      { threshold: 15, unlocked: false },
      { threshold: 30, unlocked: false },
      { threshold: 50, unlocked: false },
      { threshold: 80, unlocked: false }
    ],
    milestoneNodes: DEFAULT_BRANCH_MILESTONES.empire
  }
};

export const INITIAL_HABITS: Habit[] = [
  // BODY (Daily Morning Anchor)
  {
    id: 'h-body-calisthenics',
    branchId: 'body',
    title: '60m Calisthenics, Acrobatics & Yoga Routine',
    subtitle: 'Phase 1: Joint/Breath (10m) ➔ Phase 2: Handstand/Acro (20m) ➔ Phase 3: Strength (20m) ➔ Phase 4: Yoga (10m)',
    isKeystone: true, // ★ KEYSTONE
    completedDates: ['2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04'],
    scheduleType: 'all',
    launchAction: 'workout',
    timeEstimateMinutes: 60
  },
  {
    id: 'h-body-water',
    branchId: 'body',
    title: 'Hydration Anchor: 3 Liters Filtered Water',
    subtitle: '1L upon waking + 1L desk bottle + 1L afternoon training',
    isKeystone: false,
    completedDates: ['2026-11-01', '2026-11-02', '2026-11-04'],
    scheduleType: 'all',
    launchAction: 'url',
    launchUrl: 'https://water-tracker.app',
    timeEstimateMinutes: 5
  },

  // MIND (Daily Reading & Reflection)
  {
    id: 'h-mind-reading',
    branchId: 'mind',
    title: 'Active Reading Cycle: 29 Pages + 1 Logged Quote',
    subtitle: '14-Day Cycle (400 pages total). Must capture 1 insight before closing book.',
    isKeystone: true, // ★ KEYSTONE
    completedDates: ['2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04'],
    scheduleType: 'all',
    launchAction: 'reading',
    timeEstimateMinutes: 45
  },
  {
    id: 'h-mind-meditation',
    branchId: 'mind',
    title: '10m Breathwork & Anki Flashcard Review',
    subtitle: 'Review Sargam, Cloud Architecture & English Vocab cards',
    isKeystone: false,
    completedDates: ['2026-11-02', '2026-11-04'],
    scheduleType: 'all',
    launchAction: 'english',
    timeEstimateMinutes: 15
  },

  // CRAFT - Flute & Art (Split by Schedule: MWF Flute, TTS Art Studio)
  {
    id: 'h-craft-music',
    branchId: 'craft',
    title: 'Bansuri & Whistle: Clean Finger Sealing & Alankars',
    subtitle: 'Alankars 1–4 speed drill + whistle interval matching',
    isKeystone: true, // ★ KEYSTONE
    completedDates: ['2026-11-02', '2026-11-04'],
    scheduleType: 'mwf',
    launchAction: 'music',
    launchUrl: 'https://www.youtube.com/watch?v=sargam-bansuri',
    timeEstimateMinutes: 35
  },
  {
    id: 'h-craft-art',
    branchId: 'craft',
    title: 'Art Studio: 20m Figure Study + 45m Micron 005 Masterpiece',
    subtitle: '14-Day Cycle. Days 4–8: Structural outlines & primary ink forms.',
    isKeystone: true, // ★ KEYSTONE
    completedDates: ['2026-11-01', '2026-11-03'],
    scheduleType: 'tts',
    launchAction: 'art',
    launchUrl: 'https://pinterest.com/pin/micron-pen-ink-studies',
    timeEstimateMinutes: 65
  },

  // BONDS - Daily Mom & Arman + Speech Fluency
  {
    id: 'h-bonds-crm',
    branchId: 'bonds',
    title: 'Relationship CRM: Meaningful Call (Mom & Arman)',
    subtitle: 'Use the Built-in Question Bank to skip small talk and connect deeply',
    isKeystone: true, // ★ KEYSTONE
    completedDates: ['2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04'],
    scheduleType: 'all',
    launchAction: 'english',
    timeEstimateMinutes: 20
  },
  {
    id: 'h-bonds-english',
    branchId: 'bonds',
    title: '15m Articulate Speech & AI Communication Coach',
    subtitle: 'Speak your daily learnings and get real-time phrasing polish from AI Coach',
    isKeystone: false,
    completedDates: ['2026-11-01', '2026-11-03'],
    scheduleType: 'tts',
    launchAction: 'english',
    launchUrl: 'https://chat.openai.com',
    timeEstimateMinutes: 15
  },

  // EMPIRE - MWF Cloud/AI Labs & Sunday Content
  {
    id: 'h-empire-labs',
    branchId: 'empire',
    title: 'Career Engine: Cloud + Cybersecurity + Agentic AI Lab',
    subtitle: 'Hands-on project: Python Autonomous Agent for GCP IAM logs',
    isKeystone: true, // ★ KEYSTONE
    completedDates: ['2026-11-02', '2026-11-04'],
    scheduleType: 'mwf',
    launchAction: 'career',
    launchUrl: 'https://console.cloud.google.com',
    timeEstimateMinutes: 60
  },
  {
    id: 'h-empire-sunday-content',
    branchId: 'empire',
    title: 'Sunday Content Engine: 2-Hr Video Edit & Case Study',
    subtitle: 'Assemble 12 weekly clips + English Voiceover + publish on LinkedIn/IG',
    isKeystone: true, // ★ KEYSTONE (on Sunday)
    completedDates: ['2026-11-01'],
    scheduleType: 'sunday',
    launchAction: 'career',
    launchUrl: 'https://linkedin.com',
    timeEstimateMinutes: 120
  },
  {
    id: 'h-empire-link-prep',
    branchId: 'empire',
    title: 'Sunday Zero-Friction Link Prep (2 mins)',
    subtitle: 'Embed next week’s Pinterest, Alankar & Cloud links into Google Calendar',
    isKeystone: false,
    completedDates: ['2026-11-01'],
    scheduleType: 'sunday',
    launchAction: 'career',
    timeEstimateMinutes: 10
  }
];

export const INITIAL_CHARACTER: CharacterProfile = {
  name: 'Aryan',
  classTitle: 'Cloud-Native Polymath',
  avatarSeed: 'wizard',
  avatarBg: '#58CC02',
  seasonNumber: 1,
  seasonName: 'Season 1: Foundation of the Polymath (Nov 2026 – Jan 2027)',
  currentMonthIndex: 1,
  currentYearMonth: '2026-11',
  pactSigned: true,
  pactSignatureDataUrl: '',
  pactSignedDate: '2026-11-01',
  monthlyReflectionNotes: 'November is kicking off strong! Pinned launch buttons remove all choice paralysis. The 14-day book and fineliner cycles are already building tangible momentum.'
};

export const INITIAL_QUESTS: MonthlyQuest[] = [
  {
    id: 'q-main',
    title: 'Master & Record 1-Take Bansuri Ornamentation Video + Publish Case Study',
    branchId: 'craft',
    isMainQuest: true,
    difficultyStars: 5,
    customReward: 'Handmade Professional E-Natural Bansuri by Subhash Dhiman',
    isCompleted: false
  },
  {
    id: 'q-side-1',
    title: 'Complete 14-Day Fineliner Masterpiece: Cybernetic Raven (Sakura 005)',
    branchId: 'craft',
    isMainQuest: false,
    isCompleted: false
  },
  {
    id: 'q-side-2',
    title: 'Deploy GCP IAM Autonomous Agent & Write Comprehensive GitHub Postmortem',
    branchId: 'empire',
    isMainQuest: false,
    isCompleted: true
  },
  {
    id: 'q-side-3',
    title: 'Hit 7-Day Straight Freestanding Handstand Attempt Streak',
    branchId: 'body',
    isMainQuest: false,
    isCompleted: false
  }
];

export const INITIAL_LOOT_POOL: LootItem[] = [
  // COMMON (7-Day Keystone Streak)
  { id: 'l-c-1', rarity: 'common', title: 'Special artisan matcha latte & hot butter croissant' },
  { id: 'l-c-2', rarity: 'common', title: '1-Hour uninterrupted hammock reading in the sun' },
  { id: 'l-c-3', rarity: 'common', title: 'Buy a new set of Sakura Pigma Micron 005 and 01 pens' },
  { id: 'l-c-4', rarity: 'common', title: 'Guilt-free Friday anime binge session with favorite snacks' },

  // RARE (Skill Node Unlocked)
  { id: 'l-r-1', rarity: 'rare', title: 'Order deluxe dinner from top-rated authentic Japanese ramen bar' },
  { id: 'l-r-2', rarity: 'rare', title: 'High-quality Irish D Tin Whistle (Clarke Sweetone / Dixon)' },
  { id: 'l-r-3', rarity: 'rare', title: 'Premium heavy 300 GSM hot-press watercolor sketchpad' },
  { id: 'l-r-4', rarity: 'rare', title: 'Buy that indie technical book on Distributed Systems' },

  // EPIC (Branch Reached Node 80)
  { id: 'l-e-1', rarity: 'epic', title: 'Master-level Concert Flute (E-Bass or G-Natural) by Anubhav' },
  { id: 'l-e-2', rarity: 'epic', title: 'Weekend solo cabin retreat in the hills with sketchbook & flute' },
  { id: 'l-e-3', rarity: 'epic', title: 'Brand new high-grade Calisthenics Gymnastic Rings & Parallettes setup' },

  // LEGENDARY (All 5 Branches Reached 80 in Season)
  { id: 'l-l-1', rarity: 'legendary', title: 'Dream creative pilgrimage trip to Kyoto & Himalayan foothills' },
  { id: 'l-l-2', rarity: 'legendary', title: 'Complete ultimate home studio upgrade: 4K monitor, standing desk, audio interface' }
];

export const INITIAL_CLAIMED_LOOT = [
  {
    id: 'cl-1',
    rarity: 'common' as const,
    rewardTitle: 'Special artisan matcha latte & hot butter croissant',
    claimedDate: '2026-11-03',
    triggerReason: '7-Day Keystone Streak on Calisthenics & Yoga'
  }
];

export const INITIAL_BUFFS_DEBUFFS: BuffOrDebuff[] = [
  {
    id: 'b-1',
    type: 'buff',
    description: 'Calisthenics workout clothes, water thermos & Bansuri laid out on desk at 9 PM',
    branchId: 'body'
  },
  {
    id: 'b-2',
    type: 'buff',
    description: 'Micron pen & sketchbook open to current page with Pinterest reference tab pinned',
    branchId: 'craft'
  },
  {
    id: 'b-3',
    type: 'buff',
    description: 'Phone charging across the room in airplane mode 30 minutes before sleep',
    branchId: 'mind'
  },
  {
    id: 'd-1',
    type: 'debuff',
    description: 'Opening YouTube or social media before clicking the 7 PM Calendar deep-link',
    branchId: 'empire'
  },
  {
    id: 'd-2',
    type: 'debuff',
    description: 'Eating a heavy carb meal within 2 hours of Calisthenics training',
    branchId: 'body'
  },
  {
    id: 'd-3',
    type: 'debuff',
    description: 'Skipping the mandatory quote capture after reading 29 pages',
    branchId: 'mind'
  }
];

// POLYMATH SUB-STUDIO DATA

export const INITIAL_ALANKARS: AlankarItem[] = [
  {
    id: 1,
    name: 'Alankar 1 (Simple Scale)',
    sargamNotes: 'Sa Re Ga Ma Pa Dha Ni Sa | Sa Ni Dha Pa Ma Ga Re Sa',
    speedTargetBpm: 100,
    fluteStatus: 'mastered',
    whistleStatus: 'mastered',
    youtubeUrl: 'https://www.youtube.com/watch?v=alankar-1-demo'
  },
  {
    id: 2,
    name: 'Alankar 2 (Double Notes)',
    sargamNotes: 'SaSa ReRe GaGa MaMa PaPa DhaDha NiNi SaSa | SaSa NiNi DhaDha PaPa MaMa GaGa ReRe SaSa',
    speedTargetBpm: 90,
    fluteStatus: 'mastered',
    whistleStatus: 'practicing',
    youtubeUrl: 'https://www.youtube.com/watch?v=alankar-2-demo'
  },
  {
    id: 3,
    name: 'Alankar 3 (Triple Notes)',
    sargamNotes: 'SaSaSa ReReRe GaGaGa MaMaMa PaPaPa DhaDhaDha NiNiNi SaSaSa | Rev',
    speedTargetBpm: 80,
    fluteStatus: 'practicing',
    whistleStatus: 'practicing',
    youtubeUrl: 'https://www.youtube.com/watch?v=alankar-3-demo'
  },
  {
    id: 4,
    name: 'Alankar 4 (Stepping Pairs)',
    sargamNotes: 'SaRe ReGa GaMa MaPa PaDha DhaNi NiSa | SaNi NiDha DhaPa PaMa MaGa GaRe ReSa',
    speedTargetBpm: 75,
    fluteStatus: 'practicing',
    whistleStatus: 'locked',
    youtubeUrl: 'https://www.youtube.com/watch?v=alankar-4-demo'
  },
  {
    id: 5,
    name: 'Alankar 5 (Skip Step)',
    sargamNotes: 'SaGa ReMa GaPa MaDha PaNi DhaSa | SaDha NiPa DhaMa PaGa MaRe GaSa',
    speedTargetBpm: 70,
    fluteStatus: 'practicing',
    whistleStatus: 'locked',
    youtubeUrl: 'https://www.youtube.com/watch?v=alankar-5-demo'
  },
  {
    id: 6,
    name: 'Alankar 6 (Four Note Ascents)',
    sargamNotes: 'SaReGaMa ReGaMaPa GaMaPaDha MaPaDhaNi PaDhaNiSa | SaNiDhaPa NiDhaPaMa DhaPaMaGa PaMaGaRe MaGaReSa',
    speedTargetBpm: 65,
    fluteStatus: 'locked',
    whistleStatus: 'locked',
    youtubeUrl: 'https://www.youtube.com/watch?v=alankar-6-demo'
  },
  {
    id: 7,
    name: 'Alankar 7 (Zig-Zag Triplet)',
    sargamNotes: 'SaReSa ReGaRe GaMaGa MaPaMa PaDhaPa DhaNiDha NiSaNi Sa | SaNiSa NiDhaNi DhaPaDha PaMaPa MaGaMa GaReGa ReSaRe Sa',
    speedTargetBpm: 60,
    fluteStatus: 'locked',
    whistleStatus: 'locked',
    youtubeUrl: 'https://www.youtube.com/watch?v=alankar-7-demo'
  },
  {
    id: 8,
    name: 'Alankar 8 (Wave Pattern)',
    sargamNotes: 'SaReGaRe ReGaMaGa GaMaPaMa MaPaDhaPa PaDhaNiDha DhaNiSaNi Sa | SaNiDhaNi NiDhaPaDha DhaPaMaPa PaMaGaMa MaGaReGa GaReSaRe Sa',
    speedTargetBpm: 60,
    fluteStatus: 'locked',
    whistleStatus: 'locked',
    youtubeUrl: 'https://www.youtube.com/watch?v=alankar-8-demo'
  }
];

export const INITIAL_BOOK_TRACKER: BookTrackerState = {
  title: 'Designing Data-Intensive Applications by Martin Kleppmann',
  totalPages: 400,
  currentPage: 174,
  targetDailyPages: 29,
  quotes: [
    {
      id: 'q-1',
      text: 'A complex system that works is invariably found to have evolved from a simple system that worked.',
      date: '2026-11-02'
    },
    {
      id: 'q-2',
      text: 'Reliability is continuing to work correctly even when things go wrong.',
      date: '2026-11-04'
    }
  ]
};

export const INITIAL_FINELINER_TRACKER: FinelinerTrackerState = {
  pieceTitle: 'Cybernetic Raven: Sacred Geometry & Mechanical Feathers',
  currentCycleDay: 6,
  referenceUrl: 'https://pinterest.com/pin/micron-pen-ink-studies',
  notes: 'Focusing on primary ink forms and structural wing joints with Sakura Pigma Micron 005.'
};

export const INITIAL_CAREER_LABS: CareerLabItem[] = [
  {
    id: 'cl-1',
    title: 'Autonomous Python AI Agent for GCP Cloud Audit & IAM Anomaly Hunting',
    techStack: ['Python', 'Google Cloud Platform', 'LangGraph', 'Agentic AI'],
    status: 'in_lab',
    repoUrl: 'https://github.com/Aryaman-4/gcp-ai-anomaly-hunter',
    caseStudyNotes: 'Built a streaming log analyzer using Gemini 1.5 Pro to detect privilege escalation in service accounts.'
  },
  {
    id: 'cl-2',
    title: 'Hardened Linux WireGuard Mesh Tunnel with Automated Key Rotation',
    techStack: ['Linux', 'Networking', 'WireGuard', 'Bash Automation'],
    status: 'code_pushed',
    repoUrl: 'https://github.com/Aryaman-4/mesh-wireguard-hardened',
    caseStudyNotes: 'Automated 24h key rotation and ephemeral peer setup across 3 cloud regions.'
  },
  {
    id: 'cl-3',
    title: 'Terraform Infrastructure-as-Code Multi-Region Zero-Trust Architecture',
    techStack: ['Terraform', 'AWS', 'Security', 'Docker'],
    status: 'published',
    repoUrl: 'https://github.com/Aryaman-4/terraform-zero-trust-template',
    caseStudyNotes: 'Published LinkedIn case study breaking down least-privilege IAM and secure VPC peering.'
  }
];

export const INITIAL_QUICK_LOOT: QuickLootState = {
  expenses: [
    { id: 'exp-1', amount: 80, category: 'Stationery (Micron 005 Nib)', date: '2026-11-02' },
    { id: 'exp-2', amount: 150, category: 'Healthy Snack / Coconut Water', date: '2026-11-03' }
  ],
  vlogClips: {
    '2026-11-01': { clip1: true, clip2: true },
    '2026-11-02': { clip1: true, clip2: false },
    '2026-11-03': { clip1: true, clip2: true },
    '2026-11-04': { clip1: true, clip2: false }
  },
  ankiCards: [
    {
      id: 'a-1',
      front: 'Alankar 5 Sargam Pattern',
      back: 'SaGa ReMa GaPa MaDha PaNi DhaSa | Rev',
      category: 'sargam',
      date: '2026-11-02'
    },
    {
      id: 'a-2',
      front: 'Difference between RPO and RTO in Cloud Disaster Recovery',
      back: 'RPO (Recovery Point Objective): acceptable data loss window. RTO (Recovery Time Objective): acceptable downtime duration.',
      category: 'cloud',
      date: '2026-11-03'
    },
    {
      id: 'a-3',
      front: 'Vocab: "Perspicacious"',
      back: 'Having a ready insight into and understanding of things; shrewd, acute.',
      category: 'vocab',
      date: '2026-11-04'
    }
  ],
  contacts: [
    {
      id: 'c-1',
      name: 'Mom',
      relationship: 'Family Anchor',
      tier: 'daily',
      lastSpokenDate: '2026-11-04',
      notes: 'Asked about her garden and health. Great energy.'
    },
    {
      id: 'c-2',
      name: 'Arman',
      relationship: 'Partner in Growth',
      tier: 'daily',
      lastSpokenDate: '2026-11-04',
      notes: 'Discussed coding sprints and calisthenics handstand progression.'
    },
    {
      id: 'c-3',
      name: 'Rohan (Batchmate)',
      relationship: 'Tech & Creative Peer',
      tier: 'weekly',
      lastSpokenDate: '2026-11-01',
      notes: 'Planning weekend collaboration on Web Audio & Agentic workflows.'
    },
    {
      id: 'c-4',
      name: 'Vikram Sir',
      relationship: 'Cloud Mentor',
      tier: 'monthly',
      lastSpokenDate: '2026-10-24',
      notes: 'Shared my Terraform zero-trust repository; got positive critique.'
    }
  ],
  amvCountdownWeeks: 6
};

export const INITIAL_SUNDAY_LINKS: SundayLinkPrep = {
  pinterestUrl: 'https://pinterest.com/pin/micron-pen-ink-studies',
  alankarYoutubeUrl: 'https://www.youtube.com/watch?v=sargam-bansuri',
  cloudLabUrl: 'https://console.cloud.google.com/welcome'
};

export const INITIAL_STATE: AppState = {
  character: INITIAL_CHARACTER,
  branches: INITIAL_BRANCHES,
  habits: INITIAL_HABITS,
  monthlyQuests: INITIAL_QUESTS,
  lootPool: INITIAL_LOOT_POOL,
  claimedLoot: INITIAL_CLAIMED_LOOT,
  buffsDebuffs: INITIAL_BUFFS_DEBUFFS,
  pendingChests: {
    common: 1, // Ready to celebrate!
    rare: 1,   // Ready to celebrate!
    epic: 0,
    legendary: 0
  },
  monthlySummaries: [
    {
      monthIndex: 1,
      monthName: 'November 2026',
      branchDays: {
        body: 4,
        mind: 4,
        craft: 4,
        bonds: 4,
        empire: 3
      },
      nodesUnlocked: 2,
      featsCompleted: 1
    }
  ],
  alankars: INITIAL_ALANKARS,
  bookTracker: INITIAL_BOOK_TRACKER,
  finelinerTracker: INITIAL_FINELINER_TRACKER,
  careerLabs: INITIAL_CAREER_LABS,
  quickLoot: INITIAL_QUICK_LOOT,
  sundayLinks: INITIAL_SUNDAY_LINKS,

  // Account, Shift & Preferences
  account: DEFAULT_ACCOUNT,
  shiftConfig: DEFAULT_SHIFT_CONFIG,
  showGameGuide: true,
  soundEffectsEnabled: true,
  hapticsEnabled: true,
  onboardingCompleted: true
};
