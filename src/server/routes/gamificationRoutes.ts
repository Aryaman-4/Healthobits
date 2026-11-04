import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { GamificationEngine, GamificationConfig } from '../engines/GamificationEngine';
import { ServerEnv } from '../types';

export const gamificationRoutes = new Hono<{ Bindings: ServerEnv }>();

// In-memory state for dev / fallback
let activeConfig: GamificationConfig = { ...GamificationEngine.DEFAULT_CONFIG };

let mockBranches = [
  {
    id: 'branch_body',
    name: 'BODY',
    subtitle: 'Calisthenics, Acrobatics, Yoga, Water',
    primaryColor: '#FF4B4B',
    lipColor: '#EA2B2B',
    tintColor: '#FFDFE0',
    iconName: 'Flame',
    currentLevel: 4,
    unlockedNodesCount: 2,
    completedFeatsCount: 1
  },
  {
    id: 'branch_mind',
    name: 'MIND',
    subtitle: 'Active Reading, Meditation, Anki/Chess',
    primaryColor: '#1CB0F6',
    lipColor: '#1899D6',
    tintColor: '#DDF4FF',
    iconName: 'Brain',
    currentLevel: 5,
    unlockedNodesCount: 3,
    completedFeatsCount: 1
  },
  {
    id: 'branch_craft',
    name: 'CRAFT',
    subtitle: 'Flute, Whistle, Fineliner Art, Video Editing',
    primaryColor: '#FFC800',
    lipColor: '#E5A400',
    tintColor: '#FFF5D6',
    iconName: 'Music',
    currentLevel: 4,
    unlockedNodesCount: 2,
    completedFeatsCount: 1
  },
  {
    id: 'branch_bonds',
    name: 'BONDS',
    subtitle: 'Mom & Arman, Question CRM, English Fluency',
    primaryColor: '#58CC02',
    lipColor: '#46A302',
    tintColor: '#D7FFB8',
    iconName: 'HeartHandshake',
    currentLevel: 3,
    unlockedNodesCount: 1,
    completedFeatsCount: 1
  },
  {
    id: 'branch_empire',
    name: 'EMPIRE',
    subtitle: 'Cloud/Cybersec/Agentic AI, Finances, Personal Brand',
    primaryColor: '#CE82FF',
    lipColor: '#A560E8',
    tintColor: '#F3E5FF',
    iconName: 'Crown',
    currentLevel: 4,
    unlockedNodesCount: 2,
    completedFeatsCount: 1
  }
];

const configSchema = z.object({
  seasonDurationMonths: z.number().int().min(1).max(12).optional(),
  nodeThresholds: z.array(z.number().int().min(1)).optional(),
  maxBranchPointsPerDay: z.number().int().min(1).max(5).optional(),
  keystoneStreakForCommonLoot: z.number().int().min(1).max(30).optional(),
  featCompletionLevelBonus: z.number().int().min(1).max(10).optional(),
  requireKeystoneStarPerBranch: z.boolean().optional()
});

/**
 * GET /api/v1/gamification/config
 */
gamificationRoutes.get('/config', (c) => {
  return c.json({ success: true, data: activeConfig });
});

/**
 * PUT /api/v1/gamification/config
 */
gamificationRoutes.put('/config', zValidator('json', configSchema), async (c) => {
  const updates = c.req.valid('json');
  activeConfig = { ...activeConfig, ...updates };

  if (c.env?.DB) {
    try {
      await c.env.DB.prepare(
        'UPDATE users SET gamification_config_json = ? WHERE id = ?'
      ).bind(JSON.stringify(activeConfig), 'default_user').run();
    } catch (e: any) {
      console.warn('D1 config update failed:', e.message);
    }
  }

  return c.json({ success: true, data: activeConfig });
});

/**
 * GET /api/v1/gamification/branches
 */
gamificationRoutes.get('/branches', (c) => {
  return c.json({ success: true, data: mockBranches });
});

/**
 * PUT /api/v1/gamification/branches/:id
 */
gamificationRoutes.put('/branches/:id', async (c) => {
  const id = c.req.param('id');
  const updates = await c.req.json();
  const index = mockBranches.findIndex(b => b.id === id);

  if (index === -1) {
    return c.json({ success: false, error: 'Branch not found' }, 404);
  }

  mockBranches[index] = { ...mockBranches[index], ...updates };
  return c.json({ success: true, data: mockBranches[index] });
});

/**
 * POST /api/v1/gamification/month-end/calculate
 * Calculates end-of-month levels:
 * New Branch Level = Previous Month's Level + New Skill Nodes Unlocked This Month + Branch Feats Completed This Month
 * Overall Character Level = Sum of all 5 Branch Levels
 */
gamificationRoutes.post('/month-end/calculate', async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as {
    branches?: Array<{
      branchId: string;
      previousLevel: number;
      nodesUnlockedThisMonth: number;
      featsCompletedThisMonth: number;
    }>;
  };

  const branchCalculations = (body.branches || mockBranches.map(b => ({
    branchId: b.id,
    previousLevel: b.currentLevel,
    nodesUnlockedThisMonth: b.unlockedNodesCount,
    featsCompletedThisMonth: b.completedFeatsCount
  }))).map(b => {
    const newLevel = b.previousLevel + b.nodesUnlockedThisMonth + b.featsCompletedThisMonth;
    // update mock state
    const target = mockBranches.find(mb => mb.id === b.branchId);
    if (target) {
      target.currentLevel = newLevel;
    }
    return {
      branchId: b.branchId,
      previousLevel: b.previousLevel,
      nodesUnlockedThisMonth: b.nodesUnlockedThisMonth,
      featsCompletedThisMonth: b.featsCompletedThisMonth,
      newLevel
    };
  });

  const overallLevel = branchCalculations.reduce((acc, curr) => acc + curr.newLevel, 0);

  return c.json({
    success: true,
    data: {
      calculatedAt: new Date().toISOString(),
      branches: branchCalculations,
      overallLevel
    }
  });
});
