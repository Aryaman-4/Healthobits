/**
 * POLYMATH QUEST OFFLINE-FIRST CLIENT API & SYNC ORCHESTRATOR
 * Works 100% offline during commutes and syncs deltas to Cloudflare Workers when online
 */

import { GeneratedTimeBlock, ShiftProfileInput } from '../server/engines/ShiftScheduleEngine';
import { GamificationConfig, HabitToggleResult } from '../server/engines/GamificationEngine';
import { ClientMutation, DeltaSyncResponse } from '../server/engines/DeltaSyncEngine';

const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:5173/api/v1'
  : '/api/v1';

const OUTBOX_STORAGE_KEY = 'polymath_sync_outbox';
const LAST_SYNC_SEQ_KEY = 'polymath_last_sync_seq';

export interface ShiftProfileRecord extends ShiftProfileInput {
  id: string;
  userId: string;
  profileName: string;
  isActive: boolean;
}

export interface AttributeBranchRecord {
  id: string;
  name: string;
  subtitle: string;
  primaryColor: string;
  lipColor: string;
  tintColor: string;
  iconName: string;
  currentLevel: number;
  unlockedNodesCount: number;
  completedFeatsCount: number;
}

export interface HabitRecord {
  id: string;
  branchId: string;
  title: string;
  isKeystone: boolean;
  isSurvivalHabit: boolean;
  defaultDurationMinutes: number;
  targetFrequency: string;
  deepLinkType?: string;
  deepLinkUrl?: string;
  completedDates: string[];
}

export interface LootClaimRecord {
  id: string;
  userId: string;
  rewardId: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  triggerSource: string;
  claimedAt: string;
  isOpened: boolean;
  encryptedLootNote?: string;
}

class ApiClient {
  private getOutbox(): ClientMutation[] {
    try {
      const raw = localStorage.getItem(OUTBOX_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveOutbox(mutations: ClientMutation[]) {
    try {
      localStorage.setItem(OUTBOX_STORAGE_KEY, JSON.stringify(mutations));
    } catch (e) {
      console.warn('Failed to save outbox to localStorage:', e);
    }
  }

  public queueMutation(table: string, operation: 'INSERT' | 'UPDATE' | 'DELETE', recordId: string, data: Record<string, unknown>) {
    const outbox = this.getOutbox();
    outbox.push({
      table,
      operation,
      recordId,
      data,
      clientTimestamp: Date.now()
    });
    this.saveOutbox(outbox);
  }

  // 1. Shift Profiles & Blocks
  public async getShiftProfiles(): Promise<ShiftProfileRecord[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/schedule/profiles`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Offline mode: fetching profiles from cache');
    }
    const cached = localStorage.getItem('polymath_cached_profiles');
    if (cached) return JSON.parse(cached);
    return [
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
      }
    ];
  }

  public async activateShiftProfile(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/schedule/profiles/${id}/activate`, { method: 'PUT' });
      if (res.ok) return true;
    } catch (e) {
      console.warn('Offline: queueing profile activation');
      this.queueMutation('shift_profiles', 'UPDATE', id, { isActive: true });
    }
    return true;
  }

  public async getScheduleBlocks(): Promise<GeneratedTimeBlock[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/schedule/blocks`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Offline: fetching schedule blocks from cache');
    }
    return [];
  }

  public async updateScheduleBlock(id: string, updates: Partial<GeneratedTimeBlock>): Promise<GeneratedTimeBlock | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/schedule/blocks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      this.queueMutation('schedule_time_blocks', 'UPDATE', id, updates);
    }
    return null;
  }

  public async recalculateSchedule(profile: ShiftProfileInput): Promise<GeneratedTimeBlock[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/schedule/recalculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Offline recalculation fallback');
    }
    return [];
  }

  // 2. Gamification Configuration
  public async getGamificationConfig(): Promise<GamificationConfig> {
    try {
      const res = await fetch(`${API_BASE_URL}/gamification/config`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Offline: loading cached gamification config');
    }
    const cached = localStorage.getItem('polymath_gamification_config');
    if (cached) return JSON.parse(cached);
    return {
      seasonDurationMonths: 3,
      nodeThresholds: [5, 15, 30, 50, 80],
      maxBranchPointsPerDay: 1,
      keystoneStreakForCommonLoot: 7,
      featCompletionLevelBonus: 1,
      requireKeystoneStarPerBranch: true
    };
  }

  public async updateGamificationConfig(config: Partial<GamificationConfig>): Promise<GamificationConfig> {
    try {
      const res = await fetch(`${API_BASE_URL}/gamification/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        const json = await res.json();
        localStorage.setItem('polymath_gamification_config', JSON.stringify(json.data));
        return json.data;
      }
    } catch (e) {
      this.queueMutation('gamification_config', 'UPDATE', 'default_user', config);
    }
    localStorage.setItem('polymath_gamification_config', JSON.stringify(config));
    return config as GamificationConfig;
  }

  // 3. Attribute Branches
  public async getAttributeBranches(): Promise<AttributeBranchRecord[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/gamification/branches`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Offline: loading attribute branches');
    }
    const cached = localStorage.getItem('polymath_cached_branches');
    if (cached) return JSON.parse(cached);
    return [];
  }

  public async updateAttributeBranch(id: string, updates: Partial<AttributeBranchRecord>): Promise<AttributeBranchRecord | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/gamification/branches/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      this.queueMutation('attribute_branches', 'UPDATE', id, updates);
    }
    return null;
  }

  // 4. Habits & Evaluation
  public async getHabits(): Promise<HabitRecord[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/rpg/habits`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Offline: loading habits');
    }
    const cached = localStorage.getItem('polymath_cached_habits');
    if (cached) return JSON.parse(cached);
    return [];
  }

  public async toggleHabit(id: string, date: string): Promise<{ habit: HabitRecord; evaluation: HabitToggleResult } | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/rpg/habits/${id}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date })
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      this.queueMutation('habit_completions', 'INSERT', `${id}_${date}`, { habitId: id, date });
    }
    return null;
  }

  // 5. Loot Claims & Opening
  public async getLootClaims(): Promise<LootClaimRecord[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/rpg/loot-claims`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Offline: loading loot claims');
    }
    return [];
  }

  public async openLootChest(id: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/rpg/loot-claims/${id}/open`, {
        method: 'POST'
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Offline: cannot open chest without connection');
    }
    return null;
  }

  // 6. Multi-App Bridges
  public async requestEnglishCoach(userText: string, apiKey?: string) {
    const res = await fetch(`${API_BASE_URL}/ai/english-coach`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userText, apiKey })
    });
    return res.json();
  }

  public async generateGoogleCalendarUrl(payload: {
    title: string;
    startTime: string;
    endTime: string;
    deepLinkUrl: string;
    description: string;
  }): Promise<string> {
    try {
      const res = await fetch(`${API_BASE_URL}/integrations/gcal/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        return json.url;
      }
    } catch (e) {
      console.warn('Using client-side GCal generator fallback');
    }
    const text = encodeURIComponent(`Polymath Sprint: ${payload.title}`);
    const details = encodeURIComponent(`${payload.description}\n\n🚀 Pinned Deep Link:\n${payload.deepLinkUrl}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}`;
  }

  // 7. Flush Offline Outbox via Delta Sync
  public async syncWithServer(): Promise<DeltaSyncResponse | null> {
    const outbox = this.getOutbox();
    const lastSyncSeq = Number(localStorage.getItem(LAST_SYNC_SEQ_KEY) || '0');

    try {
      const res = await fetch(`${API_BASE_URL}/sync/delta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lastSyncSeq,
          clientMutations: outbox
        })
      });

      if (res.ok) {
        const json = await res.json();
        const responseData: DeltaSyncResponse = json.data;
        // Clear flushed outbox
        this.saveOutbox([]);
        localStorage.setItem(LAST_SYNC_SEQ_KEY, String(responseData.newSyncSeq));
        return responseData;
      }
    } catch (e) {
      console.log('[DeltaSync] Device currently offline. Retaining outbox items.');
    }
    return null;
  }
}

export const apiClient = new ApiClient();

