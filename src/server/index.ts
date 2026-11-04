import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { ServerEnv } from './types';
import { scheduleRoutes } from './routes/scheduleRoutes';
import { gamificationRoutes } from './routes/gamificationRoutes';
import { rpgRoutes } from './routes/rpgRoutes';
import { syncRoutes } from './routes/syncRoutes';
import { integrationRoutes } from './routes/integrationRoutes';

const app = new Hono<{ Bindings: ServerEnv }>();

// Global Middlewares
app.use('*', logger());
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Health Check
app.get('/api/health', (c) => {
  return c.json({
    status: 'online',
    system: 'PolymathQuest Edge Engine',
    timestamp: new Date().toISOString(),
    version: '2.0.0-edge'
  });
});

// Route Handlers
app.route('/api/v1/schedule', scheduleRoutes);
app.route('/api/v1/gamification', gamificationRoutes);
app.route('/api/v1/rpg', rpgRoutes);
app.route('/api/v1/sync', syncRoutes);
app.route('/api/v1', integrationRoutes);

// Global 404 & Error Handler
app.notFound((c) => {
  return c.json({ success: false, error: 'Endpoint Not Found' }, 404);
});

app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ success: false, error: err.message || 'Internal Server Error' }, 500);
});

/**
 * Cloudflare Scheduled Cron Handler (Runs every 15 minutes)
 * Evaluates current shift and dispatches push notifications with zero-friction deep-links
 */
export async function scheduled(event: { cron: string; scheduledTime: number }, env: ServerEnv, ctx: any) {
  console.log(`[CRON TRIGGER] Running 15-minute shift & habit evaluation: ${new Date(event.scheduledTime).toISOString()}`);
  // In production, queries active shift profile, checks if current time aligns with a block start time,
  // and dispatches Web Push payload containing the deep link URL.
}

export default {
  fetch: app.fetch,
  scheduled
};
