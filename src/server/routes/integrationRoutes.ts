import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { IntegrationBridges, GCalEventPayload } from '../bridges/IntegrationBridges';
import { ServerEnv } from '../types';

export const integrationRoutes = new Hono<{ Bindings: ServerEnv }>();

/**
 * 1. AI ENGLISH COMMUNICATION COACH
 */
const coachSchema = z.object({
  userText: z.string().min(5),
  apiKey: z.string().optional()
});

integrationRoutes.post('/ai/english-coach', zValidator('json', coachSchema), async (c) => {
  const { userText, apiKey } = c.req.valid('json');
  const envKey = c.env?.GEMINI_API_KEY || apiKey;

  try {
    const feedback = await IntegrationBridges.executeEnglishCoachPrompt(userText, envKey);
    return c.json({ success: true, data: feedback });
  } catch (e: any) {
    return c.json({ success: false, error: e.message || 'AI coach execution failed' }, 500);
  }
});

/**
 * 2. GOOGLE CALENDAR DEEP-LINK BRIDGE
 */
const gcalSchema = z.object({
  title: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  deepLinkUrl: z.string(),
  description: z.string()
});

integrationRoutes.post('/integrations/gcal/generate', zValidator('json', gcalSchema), (c) => {
  const payload = c.req.valid('json') as GCalEventPayload;
  const url = IntegrationBridges.generateGoogleCalendarUrl(payload);
  return c.json({ success: true, url });
});

/**
 * 3. ANKI CONNECT & TSV EXPORT BRIDGE
 */
const ankiSchema = z.object({
  front: z.string(),
  back: z.string(),
  category: z.string()
});

integrationRoutes.post('/integrations/anki/payload', zValidator('json', ankiSchema), (c) => {
  const { front, back, category } = c.req.valid('json');
  const ankiNote = IntegrationBridges.createAnkiConnectPayload(front, back, category);
  return c.json({ success: true, data: ankiNote });
});

