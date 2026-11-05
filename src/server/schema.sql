-- ==============================================================================
-- POLYMATH QUEST: CLOUDFLARE D1 (EDGE SQLITE) RELATIONAL SCHEMA
-- ==============================================================================

-- 1. USERS & CUSTOMIZABLE GAMIFICATION ENGINE CONFIG
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  character_name TEXT NOT NULL DEFAULT 'Aryan',
  character_class TEXT NOT NULL DEFAULT 'Cloud-Native Polymath',
  avatar_config_json TEXT NOT NULL DEFAULT '{"avatarSeed":"wizard","avatarBg":"#58CC02"}',
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  gamification_config_json TEXT NOT NULL DEFAULT '{
    "seasonDurationMonths": 3,
    "nodeThresholds": [5, 15, 30, 50, 80],
    "maxBranchPointsPerDay": 1,
    "keystoneStreakForCommonLoot": 7,
    "featCompletionLevelBonus": 1,
    "requireKeystoneStarPerBranch": true
  }',
  encryption_salt TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 2. DYNAMIC SHIFT PROFILES & SCHEDULE TEMPLATES (Full CRUD)
CREATE TABLE IF NOT EXISTS shift_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  profile_name TEXT NOT NULL, -- e.g., "UK Shift (12 PM - 9 PM) + Sat/Sun Off"
  is_active INTEGER NOT NULL DEFAULT 0,
  work_start_time TEXT NOT NULL DEFAULT '12:00', -- 24h format HH:mm
  work_end_time TEXT NOT NULL DEFAULT '21:00',   -- 24h format HH:mm
  commute_buffer_mins INTEGER NOT NULL DEFAULT 45,
  sleep_start_time TEXT NOT NULL DEFAULT '23:00',
  wake_up_time TEXT NOT NULL DEFAULT '06:15',
  working_days_json TEXT NOT NULL DEFAULT '["MON","TUE","WED","THU","FRI"]',
  week_off_days_json TEXT NOT NULL DEFAULT '["SAT","SUN"]',
  day_rotations_json TEXT NOT NULL DEFAULT '{
    "MON": "TECH_CORE",
    "TUE": "ART_CORE",
    "WED": "TECH_CORE",
    "THU": "ART_CORE",
    "FRI": "TECH_CORE",
    "SAT": "WEEKOFF_MASTERY",
    "SUN": "WEEKOFF_EMPIRE_RESET"
  }',
  updated_at INTEGER NOT NULL
);

-- 3. DYNAMIC TIME BLOCKS (Auto-shifted by Shift Profile or Manually Overridden)
CREATE TABLE IF NOT EXISTS schedule_time_blocks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  shift_profile_id TEXT NOT NULL REFERENCES shift_profiles(id),
  block_title TEXT NOT NULL,
  anchor_type TEXT NOT NULL, -- 'PRE_SHIFT' | 'DURING_SHIFT' | 'POST_SHIFT' | 'WEEK_OFF_FLEX'
  offset_minutes_from_anchor INTEGER NOT NULL,
  manual_start_time TEXT,
  duration_minutes INTEGER NOT NULL,
  applicable_rotation_types_json TEXT NOT NULL,
  notification_enabled INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 4. SEASONS & ATTRIBUTE BRANCHES (Customizable Names, Colors & Carryover Levels)
CREATE TABLE IF NOT EXISTS seasons (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  season_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  signature_svg_encrypted TEXT,
  signed_at INTEGER,
  is_active INTEGER NOT NULL DEFAULT 1,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS attribute_branches (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  season_id TEXT NOT NULL REFERENCES seasons(id),
  slug TEXT NOT NULL,
  display_name TEXT NOT NULL,
  primary_color_hex TEXT NOT NULL,
  border_color_hex TEXT NOT NULL,
  tint_color_hex TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  season_start_level INTEGER NOT NULL DEFAULT 1,
  current_month_start_level INTEGER NOT NULL DEFAULT 1,
  feat_ideas_scratchpad_json TEXT NOT NULL DEFAULT '[]',
  sort_order INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 5. HABITS & 5-SECOND LAUNCHPAD LINKS (Full CRUD)
CREATE TABLE IF NOT EXISTS habits (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  branch_id TEXT NOT NULL REFERENCES attribute_branches(id),
  time_block_id TEXT REFERENCES schedule_time_blocks(id),
  title TEXT NOT NULL,
  description TEXT,
  is_keystone INTEGER NOT NULL DEFAULT 0,
  schedule_days_json TEXT NOT NULL DEFAULT '["MON","TUE","WED","THU","FRI","SAT","SUN"]',
  launch_action_type TEXT NOT NULL DEFAULT 'EXTERNAL_URL',
  launch_url TEXT,
  launch_label TEXT NOT NULL DEFAULT 'Launch Now',
  is_archived INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL
);

-- 6. DAILY HABIT COMPLETIONS & STRICT 1-PT-PER-BRANCH-PER-DAY LEDGER
CREATE TABLE IF NOT EXISTS habit_completions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  habit_id TEXT NOT NULL REFERENCES habits(id),
  branch_id TEXT NOT NULL REFERENCES attribute_branches(id),
  completed_date TEXT NOT NULL,
  completed_at INTEGER NOT NULL,
  UNIQUE(habit_id, completed_date)
);

CREATE TABLE IF NOT EXISTS branch_daily_points (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  season_id TEXT NOT NULL REFERENCES seasons(id),
  branch_id TEXT NOT NULL REFERENCES attribute_branches(id),
  active_date TEXT NOT NULL,
  points_awarded INTEGER NOT NULL DEFAULT 1,
  UNIQUE(user_id, season_id, branch_id, active_date)
);

-- 7. MONTHLY QUEST LOG (MAIN QUEST & SIDE QUEST FEATS)
CREATE TABLE IF NOT EXISTS monthly_quests (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  season_id TEXT NOT NULL REFERENCES seasons(id),
  branch_id TEXT NOT NULL REFERENCES attribute_branches(id),
  month_key TEXT NOT NULL,
  quest_type TEXT NOT NULL,
  title TEXT NOT NULL,
  difficulty_stars INTEGER DEFAULT 3,
  dedicated_reward TEXT,
  is_completed INTEGER NOT NULL DEFAULT 0,
  completed_at INTEGER,
  updated_at INTEGER NOT NULL
);

-- 8. TIERED LOOT TABLE, UNLOCKED CHESTS & BUFFS/DEBUFFS
CREATE TABLE IF NOT EXISTS loot_rewards (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  rarity TEXT NOT NULL,
  reward_title TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS loot_claims (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  season_id TEXT NOT NULL REFERENCES seasons(id),
  month_key TEXT NOT NULL,
  rarity TEXT NOT NULL,
  trigger_source TEXT NOT NULL,
  chosen_reward_title TEXT,
  is_opened INTEGER NOT NULL DEFAULT 0,
  unlocked_at INTEGER NOT NULL,
  claimed_at INTEGER
);

CREATE TABLE IF NOT EXISTS buffs_debuffs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  season_id TEXT NOT NULL REFERENCES seasons(id),
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  branch_id TEXT REFERENCES attribute_branches(id),
  updated_at INTEGER NOT NULL
);

-- 9. POLYMATH VAULTS & ENCRYPTED QUICK-LOOT BAG
CREATE TABLE IF NOT EXISTS polymath_vault_items (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  vault_type TEXT NOT NULL,
  title TEXT NOT NULL,
  metadata_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS quick_loot_captures (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  capture_type TEXT NOT NULL,
  captured_date TEXT NOT NULL,
  payload_encrypted TEXT NOT NULL,
  exported_to_anki INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL
);

-- 10. DELTA SYNCHRONIZATION LOG (Cloudflare D1 <-> Client Offline Engine)
CREATE TABLE IF NOT EXISTS sync_deltas (
  seq INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  operation TEXT NOT NULL,
  row_data_json TEXT NOT NULL,
  changed_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sync_deltas_user_seq ON sync_deltas(user_id, seq);
CREATE INDEX IF NOT EXISTS idx_habit_completions_date ON habit_completions(user_id, completed_date);
CREATE INDEX IF NOT EXISTS idx_branch_daily_points_lookup ON branch_daily_points(user_id, season_id, branch_id);

