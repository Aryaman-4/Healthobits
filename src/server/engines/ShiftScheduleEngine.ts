/**
 * DYNAMIC SHIFT & TIME-BLOCK RECALCULATION ENGINE
 * Automatically computes prime creative/tech windows based on user shift profiles
 */

export interface ShiftProfileInput {
  workStartTime: string; // "12:00"
  workEndTime: string;   // "21:00"
  commuteBufferMins: number; // 45
  wakeUpTime: string;    // "06:15"
  sleepStartTime: string;// "23:00"
  workingDays: string[]; // ["MON", "TUE", "WED", "THU", "FRI"]
  weekOffDays: string[]; // ["SAT", "SUN"]
  dayRotations: Record<string, string>; // {"MON": "TECH_CORE", ...}
}

export interface GeneratedTimeBlock {
  id: string;
  title: string;
  anchorType: 'PRE_SHIFT' | 'DURING_SHIFT' | 'POST_SHIFT' | 'WEEK_OFF_FLEX';
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  durationMinutes: number;
  applicableRotationTypes: string[];
  description: string;
  deepLinkType?: 'WORKOUT_TIMER' | 'MUSIC_VAULT' | 'FINELINER_TRACKER' | 'BOOK_TRACKER' | 'AI_COACH' | 'CAREER_LAB';
  notificationEnabled: boolean;
  sortOrder: number;
}

export class ShiftScheduleEngine {
  private static timeToMinutes(timeStr: string): number {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  }

  private static minutesToTime(mins: number): string {
    const normalized = ((mins % 1440) + 1440) % 1440;
    const h = Math.floor(normalized / 60);
    const m = normalized % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  /**
   * Recalculate daily time blocks for a given shift profile
   */
  public static calculateScheduleBlocks(profile: ShiftProfileInput): GeneratedTimeBlock[] {
    const blocks: GeneratedTimeBlock[] = [];
    let sortCounter = 1;

    const wakeMins = this.timeToMinutes(profile.wakeUpTime);
    const workStartMins = this.timeToMinutes(profile.workStartTime);
    const workEndMins = this.timeToMinutes(profile.workEndTime);
    const commuteBuffer = profile.commuteBufferMins;
    const commuteStartMins = workStartMins - commuteBuffer;

    const availablePreShiftMins = commuteStartMins - wakeMins;

    // 1. PRE-SHIFT DEEP WORK ENGINES (Working Days: Mon–Fri)
    if (availablePreShiftMins >= 180) {
      // 5-Hour Morning Prime Window (e.g. 6:15 AM - 11:15 AM)
      const workoutStart = wakeMins + 15;
      blocks.push({
        id: 'block_morning_anchor',
        title: 'Morning Anchor: Meditation & 60m Calisthenics/Yoga',
        anchorType: 'PRE_SHIFT',
        startTime: this.minutesToTime(workoutStart),
        endTime: this.minutesToTime(workoutStart + 60),
        durationMinutes: 60,
        applicableRotationTypes: ['TECH_CORE', 'ART_CORE'],
        description: 'Joint warm-up, handstand balance drills, strength/plyo, and yoga cool-down',
        deepLinkType: 'WORKOUT_TIMER',
        notificationEnabled: true,
        sortOrder: sortCounter++
      });

      const musicStart = workoutStart + 75; // e.g. 07:45 AM or 08:15 AM
      blocks.push({
        id: 'block_music_sprint',
        title: 'Music Sprint: 30m Bansuri & Whistle Alankars',
        anchorType: 'PRE_SHIFT',
        startTime: this.minutesToTime(musicStart),
        endTime: this.minutesToTime(musicStart + 30),
        durationMinutes: 30,
        applicableRotationTypes: ['TECH_CORE', 'ART_CORE'],
        description: 'Clean finger sealing, Alankars 1–4 speed tempo, and whistle interval training',
        deepLinkType: 'MUSIC_VAULT',
        notificationEnabled: true,
        sortOrder: sortCounter++
      });

      const deepFocusStart = musicStart + 35; // e.g. 08:50 AM or 09:00 AM
      blocks.push({
        id: 'block_deep_quest',
        title: 'Pre-Shift Deep Quest: Cloud Lab (MWF) / Art Studio (TTS)',
        anchorType: 'PRE_SHIFT',
        startTime: this.minutesToTime(deepFocusStart),
        endTime: this.minutesToTime(deepFocusStart + 90),
        durationMinutes: 90,
        applicableRotationTypes: ['TECH_CORE', 'ART_CORE'],
        description: 'Prime energy before work: hands-on Python/GCP lab or Sakura Micron 005 drawing session',
        deepLinkType: 'CAREER_LAB',
        notificationEnabled: true,
        sortOrder: sortCounter++
      });
    }

    // 2. DURING SHIFT & COMMUTE MICRO-HABITS
    blocks.push({
      id: 'block_shift_work',
      title: 'Company Work Shift & Focus Window',
      anchorType: 'DURING_SHIFT',
      startTime: profile.workStartTime,
      endTime: profile.workEndTime,
      durationMinutes: workEndMins - workStartMins,
      applicableRotationTypes: ['TECH_CORE', 'ART_CORE'],
      description: 'Professional shift execution. Micro-habits: 2.5L Water anchor and Quick-Loot ₹ expense captures',
      notificationEnabled: false,
      sortOrder: sortCounter++
    });

    // 3. POST-SHIFT LOW-CORTISOL WIND-DOWN (e.g. 09:45 PM – 10:45 PM)
    const postShiftStart = workEndMins + commuteBuffer; // e.g. 21:45 (9:45 PM)
    blocks.push({
      id: 'block_family_checkin',
      title: 'Relationship CRM: Call Mom & Arman',
      anchorType: 'POST_SHIFT',
      startTime: this.minutesToTime(postShiftStart),
      endTime: this.minutesToTime(postShiftStart + 20),
      durationMinutes: 20,
      applicableRotationTypes: ['TECH_CORE', 'ART_CORE'],
      description: 'Daily emotional anchor. Use Question Bank carousel to skip small talk',
      notificationEnabled: true,
      sortOrder: sortCounter++
    });

    const readingStart = postShiftStart + 20; // 10:05 PM
    blocks.push({
      id: 'block_active_reading',
      title: 'Active Reading: 29 Pages + Mandatory Quote Capture',
      anchorType: 'POST_SHIFT',
      startTime: this.minutesToTime(readingStart),
      endTime: this.minutesToTime(readingStart + 35),
      durationMinutes: 35,
      applicableRotationTypes: ['TECH_CORE', 'ART_CORE'],
      description: '14-Day Book Cycle pace (400 pages total). Must capture 1 insight into Anki bag before sleep',
      deepLinkType: 'BOOK_TRACKER',
      notificationEnabled: true,
      sortOrder: sortCounter++
    });

    // 4. WEEK-OFF EXPANDED POLYMATH SPRINT BLOCKS (Sat / Sun)
    blocks.push({
      id: 'block_sat_creative_mastery',
      title: 'Saturday Mastery: 90m Acro + 2.5h Deep Creative Jam',
      anchorType: 'WEEK_OFF_FLEX',
      startTime: '08:00',
      endTime: '12:00',
      durationMinutes: 240,
      applicableRotationTypes: ['WEEKOFF_MASTERY'],
      description: 'Expanded acrobatic flow, full flute improvisation jam, and extended fineliner/cloud code sprint',
      notificationEnabled: true,
      sortOrder: sortCounter++
    });

    blocks.push({
      id: 'block_sun_empire_reset',
      title: 'Sunday Empire Reset: 2h Video Edit & Content Publish',
      anchorType: 'WEEK_OFF_FLEX',
      startTime: '10:00',
      endTime: '13:00',
      durationMinutes: 180,
      applicableRotationTypes: ['WEEKOFF_EMPIRE_RESET'],
      description: 'Assemble 12 weekly clips + English Voiceover, publish LinkedIn case study, and run Sunday Link Prep',
      deepLinkType: 'CAREER_LAB',
      notificationEnabled: true,
      sortOrder: sortCounter++
    });

    return blocks;
  }
}

