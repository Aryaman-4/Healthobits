import { Hono } from 'hono';
import { DeltaSyncEngine, DeltaSyncRequest, SyncDeltaRecord } from '../engines/DeltaSyncEngine';
import { ServerEnv } from '../types';

export const syncRoutes = new Hono<{ Bindings: ServerEnv }>();

// In-memory CDC delta log for offline/local edge dev
const serverDeltaLog: SyncDeltaRecord[] = [];

/**
 * POST /api/v1/sync/delta
 * Bidirectional delta-synchronization for offline commute usage
 */
syncRoutes.post('/delta', async (c) => {
  const userId = 'default_user';
  const body = (await c.req.json()) as DeltaSyncRequest;

  if (typeof body.lastSyncSeq !== 'number' || !Array.isArray(body.clientMutations)) {
    return c.json({ success: false, error: 'Invalid delta sync payload' }, 400);
  }

  // If D1 is available, we could read from sync_deltas table
  if (c.env?.DB) {
    try {
      const { results } = await c.env.DB.prepare(
        'SELECT * FROM sync_deltas WHERE user_id = ? AND seq > ? ORDER BY seq ASC'
      ).bind(userId, body.lastSyncSeq).all<SyncDeltaRecord>();

      if (results && results.length > 0) {
        results.forEach(r => {
          if (!serverDeltaLog.some(d => d.seq === r.seq)) {
            serverDeltaLog.push(r);
          }
        });
      }
    } catch (e: any) {
      console.warn('D1 delta read failed:', e.message);
    }
  }

  const response = DeltaSyncEngine.processSyncPacket(userId, body, serverDeltaLog);

  // Append new deltas to the log
  response.serverDeltas.forEach(d => {
    if (!serverDeltaLog.some(existing => existing.seq === d.seq)) {
      serverDeltaLog.push(d);
    }
  });

  return c.json({
    success: true,
    data: response
  });
});

