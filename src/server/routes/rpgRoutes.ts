import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { GamificationEngine } from '../engines/GamificationEngine';
import { CryptoService } from '../crypto/CryptoService';
import { ServerEnv } from '../types';

export const rpgRoutes = new Hono<{ Bindings: ServerEnv }>();

// In-memory mock data
let mockHabits: any[] = [
  {
    id: 'habit_calisthenics',
    branchId: 'branch_body',
    title: 'Calisthenics & Handstand Flow',
    isKeystone: true,
    isSurvivalHabit: true,
    defaultDurationMinutes: 60,
    targetFrequency: 'DAILY',
    deepLinkType: 'WORKOUT_TIMER',
    deepLinkUrl: 'http://localhost:5173/?modal=workout',
    completedDates: ['2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04']
  },
  {
    id: 'habit_water',
    branchId: 'branch_body',
    title: '3L Water Hydration & Electrolytes',
    isKeystone: false,
    isSurvivalHabit: false,
    defaultDurationMinutes: 5,
    targetFrequency: 'DAILY',
    deepLinkType: 'NONE',
    deepLinkUrl: '',
    completedDates: ['2026-11-01', '2026-11-02']
  },
  {
    id: 'habit_reading',
    branchId: 'branch_mind',
    title: 'Active Reading & Margin Notes (30m)',
    isKeystone: true,
    isSurvivalHabit: true,
    defaultDurationMinutes: 30,
    targetFrequency: 'DAILY',
    deepLinkType: 'BOOK_TRACKER',
    deepLinkUrl: 'http://localhost:5173/?modal=book',
    completedDates: ['2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04']
  },
  {
    id: 'habit_music',
    branchId: 'branch_craft',
    title: 'Flute & Whistle Alankars 1-8 (30m)',
    isKeystone: true,
    isSurvivalHabit: true,
    defaultDurationMinutes: 30,
    targetFrequency: 'DAILY',
    deepLinkType: 'MUSIC_VAULT',
    deepLinkUrl: 'http://localhost:5173/?modal=music',
    completedDates: ['2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04']
  },
  {
    id: 'habit_crm',
    branchId: 'branch_bonds',
    title: 'Mom & Arman Check-in + Question CRM',
    isKeystone: true,
    isSurvivalHabit: true,
    defaultDurationMinutes: 20,
    targetFrequency: 'DAILY',
    deepLinkType: 'AI_COACH',
    deepLinkUrl: 'http://localhost:5173/?modal=english',
    completedDates: ['2026-11-01', '2026-11-02', '2026-11-03']
  },
  {
    id: 'habit_cloud_lab',
    branchId: 'branch_empire',
    title: 'Cloud Lab / Cybersec / AI Labs (60m)',
    isKeystone: true,
    isSurvivalHabit: true,
    defaultDurationMinutes: 60,
    targetFrequency: 'DAILY',
    deepLinkType: 'CAREER_LAB',
    deepLinkUrl: 'http://localhost:5173/?modal=career',
    completedDates: ['2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04']
  }
];

let mockQuests = [
  {
    id: 'quest_nov_main',
    seasonId: 'season_nov_2026',
    month: 11,
    year: 2026,
    branchId: 'branch_empire',
    questType: 'MAIN_QUEST',
    title: 'Deploy Production Cloudflare Workers Multi-Tenant Gateway',
    description: 'Complete architecture with D1 Delta Sync and AES-256 envelope encryption',
    isCompleted: true,
    completedAt: '2026-11-04'
  },
  {
    id: 'feat_craft_01',
    seasonId: 'season_nov_2026',
    month: 11,
    year: 2026,
    branchId: 'branch_craft',
    questType: 'FEAT',
    title: 'Master Alankar 7 & 8 at 120 BPM on E-Scale Bansuri',
    description: 'Record clean 60-second audio sample with zero breath slip',
    isCompleted: false,
    completedAt: null
  },
  {
    id: 'feat_body_01',
    seasonId: 'season_nov_2026',
    month: 11,
    year: 2026,
    branchId: 'branch_body',
    questType: 'FEAT',
    title: 'Hold 30-Second Freestanding Handstand Clean Form',
    description: 'Film video proof with locked shoulder extension',
    isCompleted: false,
    completedAt: null
  }
];

let mockLootRewards = [
  {
    id: 'loot_c1',
    rarity: 'COMMON',
    title: 'Artisan Pour-Over Specialty Coffee Brew',
    description: 'Enjoy a single-origin Ethiopian pourover while journaling',
    iconName: 'Coffee',
    tierScore: 1
  },
  {
    id: 'loot_r1',
    rarity: 'RARE',
    title: 'Premium Fineliner Pen or Technical Drawing Pad',
    description: 'Order Sakura Pigma Micron set or high-weight watercolor paper',
    iconName: 'Sparkles',
    tierScore: 2
  },
  {
    id: 'loot_e1',
    rarity: 'EPIC',
    title: 'Acoustic / Studio Gear Upgrade or Masterclass',
    description: 'Bansuri flute in key of A Bass or Cloud/Cybersecurity exam voucher',
    iconName: 'ShieldAlert',
    tierScore: 3
  },
  {
    id: 'loot_l1',
    rarity: 'LEGENDARY',
    title: 'Weekend Creative Solo Retreat & High-End Tech Hardware',
    description: 'Uncapped creative freedom budget celebrating 80-day 5-branch mastery',
    iconName: 'Trophy',
    tierScore: 4
  }
];

let mockClaims = [
  {
    id: 'claim_c1',
    userId: 'default_user',
    rewardId: 'loot_c1',
    rarity: 'COMMON',
    triggerSource: '7-day Keystone Streak on Calisthenics',
    claimedAt: '2026-11-04',
    isOpened: false,
    encryptedLootNote: ''
  }
];

let mockBuffs = [
  {
    id: 'buff_1',
    name: 'Morning Momentum Surge',
    type: 'BUFF',
    description: '+15% Focus when Pre-Shift Morning Anchor is checked before 08:00 AM',
    isActive: true
  },
  {
    id: 'debuff_1',
    name: 'Late Shift Fatigue',
    type: 'DEBUFF',
    description: 'Post-shift cortisol spike if digital screens are active past 22:30 PM',
    isActive: false
  }
];

// Zod schemas
const habitSchema = z.object({
  branchId: z.string(),
  title: z.string().min(1),
  isKeystone: z.boolean(),
  isSurvivalHabit: z.boolean(),
  defaultDurationMinutes: z.number().int().min(1),
  targetFrequency: z.enum(['DAILY', 'WEEKDAYS', 'WEEKENDS', 'CUSTOM']),
  deepLinkType: z.string().optional(),
  deepLinkUrl: z.string().optional()
});

/**
 * 1. HABITS CRUD
 */
rpgRoutes.get('/habits', (c) => {
  return c.json({ success: true, data: mockHabits });
});

rpgRoutes.post('/habits', zValidator('json', habitSchema), async (c) => {
  const body = c.req.valid('json');
  const newHabit = {
    id: `habit_${Date.now()}`,
    ...body,
    completedDates: []
  };
  mockHabits.push(newHabit);
  return c.json({ success: true, data: newHabit }, 201);
});

rpgRoutes.put('/habits/:id', async (c) => {
  const id = c.req.param('id');
  const updates = await c.req.json();
  const index = mockHabits.findIndex(h => h.id === id);
  if (index === -1) return c.json({ success: false, error: 'Habit not found' }, 404);

  mockHabits[index] = { ...mockHabits[index], ...updates };
  return c.json({ success: true, data: mockHabits[index] });
});

rpgRoutes.delete('/habits/:id', (c) => {
  const id = c.req.param('id');
  mockHabits = mockHabits.filter(h => h.id !== id);
  return c.json({ success: true, message: 'Habit deleted' });
});

/**
 * POST /api/v1/rpg/habits/:id/toggle
 * Transactionally evaluate completion and rule enforcement
 */
rpgRoutes.post('/habits/:id/toggle', async (c) => {
  const id = c.req.param('id');
  const body = (await c.req.json().catch(() => ({}))) as { date?: string };
  const dateStr = body.date || new Date().toISOString().split('T')[0];

  const habit = mockHabits.find(h => h.id === id);
  if (!habit) return c.json({ success: false, error: 'Habit not found' }, 404);

  const branchHabits = mockHabits
    .filter(h => h.branchId === habit.branchId)
    .map(h => ({ habitId: h.id, dates: h.completedDates }));

  const evalResult = GamificationEngine.evaluateHabitToggle(
    habit.id,
    habit.branchId,
    dateStr,
    habit.isKeystone,
    habit.completedDates,
    branchHabits,
    15, // prior cumulative seasonal days
    4,  // current branch level
    [4, 5, 4, 3, 4]
  );

  // Update dates
  if (evalResult.isCompleted) {
    if (!habit.completedDates.includes(dateStr)) {
      habit.completedDates.push(dateStr);
    }
  } else {
    habit.completedDates = habit.completedDates.filter((d: string) => d !== dateStr);
  }

  // Register any newly unlocked chests
  evalResult.newlyUnlockedChests.forEach(chest => {
    mockClaims.push({
      id: `claim_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      userId: 'default_user',
      rewardId: 'loot_c1',
      rarity: chest.rarity,
      triggerSource: chest.triggerSource,
      claimedAt: dateStr,
      isOpened: false,
      encryptedLootNote: ''
    });
  });

  return c.json({
    success: true,
    data: {
      habit,
      evaluation: evalResult
    }
  });
});

/**
 * 2. QUESTS & FEATS CRUD
 */
rpgRoutes.get('/quests', (c) => {
  return c.json({ success: true, data: mockQuests });
});

rpgRoutes.put('/quests/:id/toggle', (c) => {
  const id = c.req.param('id');
  const quest = mockQuests.find(q => q.id === id);
  if (!quest) return c.json({ success: false, error: 'Quest not found' }, 404);

  quest.isCompleted = !quest.isCompleted;
  quest.completedAt = quest.isCompleted ? new Date().toISOString().split('T')[0] : null;

  return c.json({ success: true, data: quest });
});

/**
 * 3. 4-TIER LOOT REWARDS CRUD
 */
rpgRoutes.get('/loot-rewards', (c) => {
  return c.json({ success: true, data: mockLootRewards });
});

rpgRoutes.put('/loot-rewards/:id', async (c) => {
  const id = c.req.param('id');
  const updates = await c.req.json();
  const index = mockLootRewards.findIndex(r => r.id === id);
  if (index === -1) return c.json({ success: false, error: 'Reward not found' }, 404);

  mockLootRewards[index] = { ...mockLootRewards[index], ...updates };
  return c.json({ success: true, data: mockLootRewards[index] });
});

/**
 * 4. LOOT CLAIMS & OPENING
 */
rpgRoutes.get('/loot-claims', (c) => {
  return c.json({ success: true, data: mockClaims });
});

rpgRoutes.post('/loot-claims/:id/open', async (c) => {
  const id = c.req.param('id');
  const claim = mockClaims.find(cl => cl.id === id);
  if (!claim) return c.json({ success: false, error: 'Claim not found' }, 404);

  claim.isOpened = true;

  // Pick matching rarity item
  const pool = mockLootRewards.filter(r => r.rarity === claim.rarity);
  const rewardItem = pool[Math.floor(Math.random() * pool.length)] || mockLootRewards[0];

  // Envelope-encrypt note
  const lootNotePlaintext = `Claimed: ${rewardItem.title} - ${rewardItem.description}`;
  const encryptedNote = await CryptoService.encrypt(lootNotePlaintext, 'default_user');
  claim.encryptedLootNote = encryptedNote;

  return c.json({
    success: true,
    data: {
      claim,
      reward: rewardItem,
      celebrationSound: 'CHEST_FANFARE_LEGENDARY',
      decryptedNote: lootNotePlaintext
    }
  });
});

/**
 * 5. BUFFS / DEBUFFS CRUD
 */
rpgRoutes.get('/buffs-debuffs', (c) => {
  return c.json({ success: true, data: mockBuffs });
});
