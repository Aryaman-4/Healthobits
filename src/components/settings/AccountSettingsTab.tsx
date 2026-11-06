import React, { useState } from 'react';
import {
  User,
  Shield,
  Cloud,
  RefreshCw,
  LogOut,
  Clock,
  Calendar,
  Volume2,
  VolumeX,
  Smartphone,
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  Star,
  Check,
  ExternalLink,
  ChevronRight,
  Sliders,
  Sparkles,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Habit, BranchId, ShiftScheduleConfig } from '../../types';
import { BranchIcon } from '../common/BranchIcon';
import { sound } from '../../utils/audio';

export const AccountSettingsTab: React.FC = () => {
  const {
    state,
    account,
    logoutUser,
    syncWithCloudD1,
    shiftConfig,
    updateShiftConfig,
    soundEnabled,
    toggleSound,
    hapticsEnabled,
    toggleHaptics,
    setIsOnboardingOpen,
    setIsCharacterGuideModalOpen,
    addHabit,
    editHabit,
    deleteHabit,
    resetAllDemoData
  } = useGame();

  const [activeSection, setActiveSection] = useState<'account' | 'shift' | 'habits' | 'prefs'>('account');
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Shift config state
  const [workStart, setWorkStart] = useState(shiftConfig.workStartTime || '12:00');
  const [workEnd, setWorkEnd] = useState(shiftConfig.workEndTime || '21:00');
  const [weekOffs, setWeekOffs] = useState<string[]>(shiftConfig.weekOffDays || ['SAT', 'SUN']);

  // Habit CRUD modal state
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [hTitle, setHTitle] = useState('');
  const [hSubtitle, setHSubtitle] = useState('');
  const [hBranch, setHBranch] = useState<BranchId>('body');
  const [hKeystone, setHKeystone] = useState(false);
  const [hSchedule, setHSchedule] = useState<'all' | 'mwf' | 'tts' | 'sunday'>('all');

  const handleManualSync = async () => {
    sound.playTap();
    setIsSyncing(true);
    await syncWithCloudD1();
    setIsSyncing(false);
    setSyncStatusMsg('Synced with Cloudflare D1 ✅');
    setTimeout(() => setSyncStatusMsg(null), 3000);
  };

  const handleSaveShift = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playCheck();
    updateShiftConfig({
      workStartTime: workStart,
      workEndTime: workEnd,
      weekOffDays: weekOffs,
      preShiftWindowLabel: `Pre-Shift Morning (6:30 AM – ${workStart})`,
      workShiftWindowLabel: `Work Shift (${workStart} – ${workEnd})`,
      nightWindDownWindowLabel: `Night Wind-Down (${workEnd})`
    });
  };

  const toggleWeekOff = (day: string) => {
    sound.playTap();
    setWeekOffs(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSaveHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hTitle.trim()) return;

    if (editingHabit) {
      editHabit(editingHabit.id, {
        title: hTitle.trim(),
        subtitle: hSubtitle.trim() || undefined,
        branchId: hBranch,
        isKeystone: hKeystone,
        scheduleType: hSchedule
      });
      setEditingHabit(null);
    } else {
      addHabit({
        title: hTitle.trim(),
        subtitle: hSubtitle.trim() || undefined,
        branchId: hBranch,
        isKeystone: hKeystone,
        scheduleType: hSchedule,
        timeEstimateMinutes: 30
      });
      setIsAddHabitOpen(false);
    }

    sound.playCheck();
    setHTitle('');
    setHSubtitle('');
    setHKeystone(false);
  };

  const openEditHabit = (h: Habit) => {
    sound.playTap();
    setEditingHabit(h);
    setHTitle(h.title);
    setHSubtitle(h.subtitle || '');
    setHBranch(h.branchId);
    setHKeystone(h.isKeystone);
    setHSchedule(h.scheduleType);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-6 p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#DDF4FF] border-2 border-[#1CB0F6] flex items-center justify-center text-2xl shrink-0">
            👤
          </div>
          <div>
            <h2 className="font-black text-xl text-[#3C3C3C] leading-tight">
              Account & App Settings
            </h2>
            <p className="text-xs text-[#777777] font-semibold">
              Manage Cloudflare D1 persistence, shifts, habits & sound preferences
            </p>
          </div>
        </div>

        {/* Sync Status Badge */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-3.5 py-2 rounded-2xl bg-[#EBF9DC] border-2 border-[#58CC02] border-b-4 text-[#347A01] font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer active:translate-y-0.5 transition-all shadow-xs disabled:opacity-50"
          >
            <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? 'Syncing...' : 'Sync D1'}</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'account', label: 'Cloud Account', icon: '👤' },
          { id: 'shift', label: 'Work Shift & Offs', icon: '⏰' },
          { id: 'habits', label: 'Habits & Goals', icon: '⭐' },
          { id: 'prefs', label: 'Audio & Preferences', icon: '🔊' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              sound.playTap();
              setActiveSection(tab.id as any);
            }}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === tab.id
                ? 'bg-[#3C3C3C] text-white shadow-sm border-b-3'
                : 'bg-white text-[#777777] border-2 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* SECTION 1: Account Profile & Cloudflare D1 Sync Status */}
      {activeSection === 'account' && (
        <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-6 p-5 sm:p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Cloud className="text-[#1CB0F6]" size={20} />
              <h3 className="font-black text-base text-[#3C3C3C]">
                Cloudflare D1 Account Persistence
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#EBF9DC] text-[#347A01] border border-[#58CC02] text-xs font-black uppercase flex items-center gap-1">
              <Check size={13} /> Synced with Cloudflare D1 ✅
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-1">
              <span className="text-[10px] font-black uppercase text-[#777777]">
                Logged-In Player Email
              </span>
              <p className="font-extrabold text-sm text-[#3C3C3C] truncate">
                {account.email || 'aryan.quest@polymath.dev'}
              </p>
              <span className="text-[10px] text-[#58CC02] font-bold block">
                Session Active • JWT Edge Authenticated
              </span>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-1">
              <span className="text-[10px] font-black uppercase text-[#777777]">
                Last Database Sync
              </span>
              <p className="font-extrabold text-xs text-[#3C3C3C]">
                {account.lastSyncedAt ? new Date(account.lastSyncedAt).toLocaleString() : 'Just now'}
              </p>
              <span className="text-[10px] text-[#1CB0F6] font-bold block">
                Zero-friction offline delta sync enabled
              </span>
            </div>
          </div>

          {syncStatusMsg && (
            <div className="p-3 rounded-2xl bg-[#EBF9DC] border border-[#58CC02] text-[#347A01] text-xs font-black flex items-center gap-2">
              <Check size={16} />
              <span>{syncStatusMsg}</span>
            </div>
          )}

          {/* Account Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => {
                sound.playTap();
                setIsCharacterGuideModalOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-white border-2 border-gray-200 hover:border-gray-300 font-black text-xs uppercase tracking-wider text-[#3C3C3C] cursor-pointer active:translate-y-0.5 transition-all"
            >
              🛡️ View Character Sheet & Guide
            </button>

            <button
              onClick={logoutUser}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-[#FFDFE0] border-2 border-[#FF4B4B] border-b-4 text-[#EA2B2B] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer active:translate-y-0.5 transition-all"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION 2: Shift & Schedule Customizer */}
      {activeSection === 'shift' && (
        <form onSubmit={handleSaveShift} className="bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-6 p-5 sm:p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Clock className="text-[#FFC800]" size={20} />
              <h3 className="font-black text-base text-[#3C3C3C]">
                Work Shift & Schedule Engine
              </h3>
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FFF5D6] text-[#A17200]">
              Customizable Hours
            </span>
          </div>

          <p className="text-xs text-[#777777]">
            Customize your work hours and week-off days. Habits will automatically group into <strong>Pre-Shift Focus</strong>, <strong>Core Work Shift</strong>, and <strong>Night Wind-Down</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase text-[#777777]">
                Work Shift Start
              </label>
              <input
                type="time"
                value={workStart}
                onChange={e => setWorkStart(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs font-black text-[#3C3C3C] outline-none focus:border-[#1CB0F6]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase text-[#777777]">
                Work Shift End
              </label>
              <input
                type="time"
                value={workEnd}
                onChange={e => setWorkEnd(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs font-black text-[#3C3C3C] outline-none focus:border-[#1CB0F6]"
              />
            </div>
          </div>

          {/* Week Off Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase text-[#777777]">
              Week-Off Days (Weekends / Off-Days)
            </label>
            <div className="grid grid-cols-7 gap-1.5">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => {
                const isOff = weekOffs.includes(day);
                return (
                  <button
                    type="button"
                    key={day}
                    onClick={() => toggleWeekOff(day)}
                    className={`py-2 rounded-xl font-black text-xs uppercase cursor-pointer transition-all ${
                      isOff
                        ? 'bg-[#58CC02] text-white border-2 border-b-4 border-[#46A302] shadow-xs'
                        : 'bg-gray-100 text-[#777777] border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#1CB0F6] border-2 border-b-4 border-[#1899D6] hover:bg-[#1899D6] text-white font-black text-xs uppercase tracking-wider cursor-pointer active:translate-y-0.5 transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Check size={16} />
            <span>Update Schedule Engine</span>
          </button>
        </form>
      )}

      {/* SECTION 3: Habit & Goal Customizer */}
      {activeSection === 'habits' && (
        <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-6 p-5 sm:p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Star className="text-[#FFC800] fill-[#FFC800]" size={20} />
              <h3 className="font-black text-base text-[#3C3C3C]">
                Habit & ★ Keystone Customizer
              </h3>
            </div>
            <button
              onClick={() => {
                sound.playTap();
                setEditingHabit(null);
                setHTitle('');
                setHSubtitle('');
                setHKeystone(false);
                setIsAddHabitOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#58CC02] border-2 border-b-4 border-[#46A302] text-white font-black text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer active:translate-y-0.5"
            >
              <Plus size={14} />
              <span>Add Habit</span>
            </button>
          </div>

          {/* Add / Edit Form Modal or Inline */}
          {(isAddHabitOpen || editingHabit) && (
            <form onSubmit={handleSaveHabit} className="bg-gray-50 border-2 border-[#1CB0F6] rounded-2xl p-4 space-y-3">
              <h4 className="font-black text-xs uppercase text-[#1CB0F6]">
                {editingHabit ? 'Edit Habit' : 'Create New Habit'}
              </h4>

              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase text-[#777777]">
                  Habit Title
                </label>
                <input
                  type="text"
                  required
                  value={hTitle}
                  onChange={e => setHTitle(e.target.value)}
                  placeholder="e.g. 20m Morning Acrobatics"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-[#3C3C3C] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase text-[#777777]">
                  Subtitle / Anchor Description
                </label>
                <input
                  type="text"
                  value={hSubtitle}
                  onChange={e => setHSubtitle(e.target.value)}
                  placeholder="e.g. Handstand prep & wrist drills"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#3C3C3C] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase text-[#777777] mb-1">
                    Branch Attribute
                  </label>
                  <select
                    value={hBranch}
                    onChange={e => setHBranch(e.target.value as BranchId)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-[#3C3C3C] outline-none"
                  >
                    <option value="body">Body</option>
                    <option value="mind">Mind</option>
                    <option value="craft">Craft</option>
                    <option value="bonds">Bonds</option>
                    <option value="empire">Empire</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-[#777777] mb-1">
                    Schedule Shift
                  </label>
                  <select
                    value={hSchedule}
                    onChange={e => setHSchedule(e.target.value as any)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-[#3C3C3C] outline-none"
                  >
                    <option value="all">Daily (All Days)</option>
                    <option value="mwf">MWF (Tech Shift)</option>
                    <option value="tts">TTS (Art Shift)</option>
                    <option value="sunday">Sunday (Reset)</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-black text-[#A17200] bg-[#FFF5D6] p-2.5 rounded-xl border border-[#FFC800] cursor-pointer">
                <input
                  type="checkbox"
                  checked={hKeystone}
                  onChange={e => setHKeystone(e.target.checked)}
                  className="rounded text-[#FFC800] focus:ring-0 w-4 h-4"
                />
                <span>★ Designate as Non-Negotiable KEYSTONE Habit</span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddHabitOpen(false);
                    setEditingHabit(null);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white border border-gray-300 text-xs font-bold text-[#777777]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#1CB0F6] text-white text-xs font-black uppercase"
                >
                  Save Habit
                </button>
              </div>
            </form>
          )}

          {/* List of Habits */}
          <div className="space-y-2.5">
            {state.habits.map(habit => {
              const b = state.branches[habit.branchId];
              return (
                <div
                  key={habit.id}
                  className="p-3 bg-white rounded-2xl border-2 border-gray-200 flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <BranchIcon branchId={habit.branchId} size={16} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs sm:text-sm text-[#3C3C3C] truncate">
                          {habit.title}
                        </span>
                        {habit.isKeystone && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-[#FFF5D6] text-[#A17200] border border-[#FFC800] shrink-0">
                            ★ KEYSTONE
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#777777] font-semibold block truncate">
                        {habit.subtitle || b.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditHabit(habit)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#1CB0F6] hover:bg-[#DDF4FF]"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => {
                        sound.playTap();
                        if (window.confirm(`Delete habit "${habit.title}"?`)) {
                          deleteHabit(habit.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 4: Audio, SFX & App Preferences */}
      {activeSection === 'prefs' && (
        <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-6 p-5 sm:p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Sliders className="text-[#CE82FF]" size={20} />
              <h3 className="font-black text-base text-[#3C3C3C]">
                Sound Effects (SFX) & App Preferences
              </h3>
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#F3E5FF] text-[#A560E8]">
              Tactile OS
            </span>
          </div>

          <div className="space-y-4">
            {/* SFX Toggle (Moved here from top navigation bar!) */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg ${soundEnabled ? 'bg-[#EBF9DC] text-[#58CC02]' : 'bg-gray-200 text-gray-400'}`}>
                  {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </div>
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-[#3C3C3C]">
                    Sound Effects (SFX)
                  </h4>
                  <p className="text-[11px] text-[#777777]">
                    Synthesizer audio clicks, habit checks, and celebratory fanfare chords
                  </p>
                </div>
              </div>

              <button
                onClick={toggleSound}
                className={`px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-wider cursor-pointer border-2 transition-all ${
                  soundEnabled
                    ? 'bg-[#58CC02] border-[#46A302] text-white shadow-xs'
                    : 'bg-gray-200 border-gray-300 text-gray-600'
                }`}
              >
                {soundEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Haptic Feedback Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg ${hapticsEnabled ? 'bg-[#DDF4FF] text-[#1CB0F6]' : 'bg-gray-200 text-gray-400'}`}>
                  <Smartphone size={20} />
                </div>
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-[#3C3C3C]">
                    Mobile Haptics Feedback
                  </h4>
                  <p className="text-[11px] text-[#777777]">
                    Vibration pulses when completing habits and unlocking chests
                  </p>
                </div>
              </div>

              <button
                onClick={toggleHaptics}
                className={`px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-wider cursor-pointer border-2 transition-all ${
                  hapticsEnabled
                    ? 'bg-[#1CB0F6] border-[#1899D6] text-white shadow-xs'
                    : 'bg-gray-200 border-gray-300 text-gray-600'
                }`}
              >
                {hapticsEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Replay Onboarding Wizard */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFF5D6] text-[#FFC800] flex items-center justify-center text-lg">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-[#3C3C3C]">
                    Replay Tutorial Wizard
                  </h4>
                  <p className="text-[11px] text-[#777777]">
                    Go through the 4-step beginner walkthrough and sign your pact again
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playTap();
                  setIsOnboardingOpen(true);
                }}
                className="px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-wider bg-white border-2 border-gray-200 hover:border-gray-300 text-[#3C3C3C] cursor-pointer shadow-xs active:translate-y-0.5"
              >
                Replay
              </button>
            </div>

            {/* Reset Demo Data */}
            <div className="pt-2">
              <button
                onClick={resetAllDemoData}
                className="w-full py-2.5 rounded-2xl text-xs font-extrabold text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all cursor-pointer"
              >
                ⚠️ Reset All Local Playground Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

