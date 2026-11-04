import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { ShiftScheduleEngine, ShiftProfileInput, GeneratedTimeBlock } from '../engines/ShiftScheduleEngine';
import { ServerEnv } from '../types';

export const scheduleRoutes = new Hono<{ Bindings: ServerEnv }>();

// In-memory fallback / mock store for local development without active D1 binding
const mockProfiles: any[] = [
  {
    id: 'sp_uk_shift',
    userId: 'default_user',
    profileName: 'UK Shift (12:00 PM - 09:00 PM)',
    workStartTime: '12:00',
    workEndTime: '21:00',
    commuteBufferMins: 45,
    wakeUpTime: '06:15',
    sleepStartTime: '23:00',
    workingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
    weekOffDays: ['SAT', 'SUN'],
    isActive: true,
    dayRotations: {
      MON: 'TECH_CORE',
      TUE: 'ART_CORE',
      WED: 'TECH_CORE',
      THU: 'ART_CORE',
      FRI: 'TECH_CORE',
      SAT: 'ART_CORE',
      SUN: 'EMPIRE_RESET'
    }
  },
  {
    id: 'sp_standard_shift',
    userId: 'default_user',
    profileName: 'Standard Shift (09:00 AM - 06:00 PM)',
    workStartTime: '09:00',
    workEndTime: '18:00',
    commuteBufferMins: 30,
    wakeUpTime: '05:30',
    sleepStartTime: '22:30',
    workingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
    weekOffDays: ['SAT', 'SUN'],
    isActive: false,
    dayRotations: {
      MON: 'TECH_CORE',
      TUE: 'ART_CORE',
      WED: 'TECH_CORE',
      THU: 'ART_CORE',
      FRI: 'TECH_CORE',
      SAT: 'ART_CORE',
      SUN: 'EMPIRE_RESET'
    }
  }
];

let cachedBlocks: GeneratedTimeBlock[] = ShiftScheduleEngine.calculateScheduleBlocks({
  workStartTime: '12:00',
  workEndTime: '21:00',
  commuteBufferMins: 45,
  wakeUpTime: '06:15',
  sleepStartTime: '23:00',
  workingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
  weekOffDays: ['SAT', 'SUN'],
  dayRotations: {
    MON: 'TECH_CORE',
    TUE: 'ART_CORE',
    WED: 'TECH_CORE',
    THU: 'ART_CORE',
    FRI: 'TECH_CORE',
    SAT: 'ART_CORE',
    SUN: 'EMPIRE_RESET'
  }
});

// Zod schemas
const profileSchema = z.object({
  profileName: z.string().min(1),
  workStartTime: z.string().regex(/^\d{2}:\d{2}$/),
  workEndTime: z.string().regex(/^\d{2}:\d{2}$/),
  commuteBufferMins: z.number().int().min(0).max(180),
  wakeUpTime: z.string().regex(/^\d{2}:\d{2}$/),
  sleepStartTime: z.string().regex(/^\d{2}:\d{2}$/),
  workingDays: z.array(z.string()),
  weekOffDays: z.array(z.string()),
  dayRotations: z.record(z.string(), z.string())
});

/**
 * GET /api/v1/schedule/profiles
 */
scheduleRoutes.get('/profiles', async (c) => {
  if (c.env?.DB) {
    try {
      const { results } = await c.env.DB.prepare(
        'SELECT * FROM shift_profiles WHERE deleted_at IS NULL ORDER BY created_at DESC'
      ).all();
      return c.json({ success: true, data: results });
    } catch (e: any) {
      console.warn('D1 query failed, using mock data:', e.message);
    }
  }
  return c.json({ success: true, data: mockProfiles });
});

/**
 * POST /api/v1/schedule/profiles
 */
scheduleRoutes.post('/profiles', zValidator('json', profileSchema), async (c) => {
  const body = c.req.valid('json');
  const newProfile = {
    id: `sp_${Date.now()}`,
    userId: 'default_user',
    ...body,
    isActive: false,
    created_at: new Date().toISOString()
  };

  if (c.env?.DB) {
    try {
      await c.env.DB.prepare(
        `INSERT INTO shift_profiles (id, user_id, profile_name, work_start_time, work_end_time, commute_buffer_mins, wake_up_time, sleep_start_time, working_days_json, week_off_days_json, day_rotations_json, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        newProfile.id,
        newProfile.userId,
        newProfile.profileName,
        newProfile.workStartTime,
        newProfile.workEndTime,
        newProfile.commuteBufferMins,
        newProfile.wakeUpTime,
        newProfile.sleepStartTime,
        JSON.stringify(newProfile.workingDays),
        JSON.stringify(newProfile.weekOffDays),
        JSON.stringify(newProfile.dayRotations),
        0
      ).run();
      return c.json({ success: true, data: newProfile }, 201);
    } catch (e: any) {
      console.warn('D1 insert failed, storing in mock:', e.message);
    }
  }

  mockProfiles.push(newProfile);
  return c.json({ success: true, data: newProfile }, 201);
});

/**
 * PUT /api/v1/schedule/profiles/:id/activate
 */
scheduleRoutes.put('/profiles/:id/activate', async (c) => {
  const id = c.req.param('id');
  const profile = mockProfiles.find(p => p.id === id);

  if (!profile) {
    return c.json({ success: false, error: 'Shift profile not found' }, 404);
  }

  mockProfiles.forEach(p => (p.isActive = p.id === id));

  // Recalculate schedule blocks with newly active profile
  cachedBlocks = ShiftScheduleEngine.calculateScheduleBlocks(profile as ShiftProfileInput);

  if (c.env?.DB) {
    try {
      await c.env.DB.prepare('UPDATE shift_profiles SET is_active = 0 WHERE is_active = 1').run();
      await c.env.DB.prepare('UPDATE shift_profiles SET is_active = 1 WHERE id = ?').bind(id).run();
    } catch (e: any) {
      console.warn('D1 update failed:', e.message);
    }
  }

  return c.json({ success: true, data: profile, generatedBlocks: cachedBlocks });
});

/**
 * GET /api/v1/schedule/blocks
 */
scheduleRoutes.get('/blocks', (c) => {
  return c.json({ success: true, data: cachedBlocks });
});

/**
 * PATCH /api/v1/schedule/blocks/:id
 */
scheduleRoutes.patch('/blocks/:id', async (c) => {
  const id = c.req.param('id');
  const updates = await c.req.json();
  const index = cachedBlocks.findIndex(b => b.id === id);

  if (index === -1) {
    return c.json({ success: false, error: 'Time block not found' }, 404);
  }

  cachedBlocks[index] = { ...cachedBlocks[index], ...updates };
  return c.json({ success: true, data: cachedBlocks[index] });
});

/**
 * POST /api/v1/schedule/recalculate
 */
scheduleRoutes.post('/recalculate', async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as Partial<ShiftProfileInput>;
  const activeProfile = mockProfiles.find(p => p.isActive) || mockProfiles[0];

  const profileInput: ShiftProfileInput = {
    workStartTime: body.workStartTime || activeProfile.workStartTime,
    workEndTime: body.workEndTime || activeProfile.workEndTime,
    commuteBufferMins: body.commuteBufferMins ?? activeProfile.commuteBufferMins,
    wakeUpTime: body.wakeUpTime || activeProfile.wakeUpTime,
    sleepStartTime: body.sleepStartTime || activeProfile.sleepStartTime,
    workingDays: body.workingDays || activeProfile.workingDays,
    weekOffDays: body.weekOffDays || activeProfile.weekOffDays,
    dayRotations: body.dayRotations || activeProfile.dayRotations
  };

  cachedBlocks = ShiftScheduleEngine.calculateScheduleBlocks(profileInput);
  return c.json({ success: true, data: cachedBlocks });
});
