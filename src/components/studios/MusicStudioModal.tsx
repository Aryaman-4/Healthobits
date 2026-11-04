import React, { useState } from 'react';
import { Music, Play, Check, X, ExternalLink, Sparkles, Award } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { ChunkyButton } from '../common/ChunkyButton';
import { sound } from '../../utils/audio';

export const MusicStudioModal: React.FC = () => {
  const { activeStudioModal, setActiveStudioModal, state, updateAlankarStatus, toggleHabitCompletion, selectedDate } = useGame();
  const { alankars, character } = state;

  if (activeStudioModal !== 'music') return null;

  const currentMonth = character.currentMonthIndex; // 1, 2, or 3

  const handleCompleteMusic = () => {
    sound.playLevelUp();
    const musicHabit = state.habits.find(h => h.id === 'h-craft-music');
    if (musicHabit && !musicHabit.completedDates.includes(selectedDate)) {
      toggleHabitCompletion(musicHabit.id, selectedDate);
    }
    setActiveStudioModal(null);
  };

  const getStatusBadge = (status: 'locked' | 'practicing' | 'mastered') => {
    switch (status) {
      case 'mastered':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#EBF9DC] text-[#347A01] border border-[#58CC02]">Mastered ✓</span>;
      case 'practicing':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#FFF5D6] text-[#A17200] border border-[#FFC800]">Practicing ⏳</span>;
      case 'locked':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-gray-400 bg-gray-100">Locked 🔒</span>;
    }
  };

  const cycleStatus = (current: 'locked' | 'practicing' | 'mastered'): 'locked' | 'practicing' | 'mastered' => {
    if (current === 'locked') return 'practicing';
    if (current === 'practicing') return 'mastered';
    return 'locked';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4 animate-pop">
      <div className="bg-white rounded-3xl border-2 border-b-8 border-[#FFC800] max-w-3xl w-full p-6 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF5D6] border-2 border-[#FFC800] flex items-center justify-center text-[#E5A400]">
              <Music size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-xl text-[#3C3C3C]">
                  Flute & Whistle Mastery Studio
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FFC800] text-[#3C3C3C]">
                  Nov 2026 – Jan 2027
                </span>
              </div>
              <p className="text-xs text-[#777777] font-semibold mt-0.5">
                Alankar speed drills, finger-sealing accuracy, and 1-take song ornamentation
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveStudioModal(null)}
            className="w-9 h-9 rounded-full border-2 border-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center font-black cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* 3-Month Roadmap Banner */}
        <div className="p-4 bg-gradient-to-r from-[#FFFDF0] via-[#FFF9E6] to-[#FFE8A3] rounded-2xl border-2 border-[#FFC800] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-sm uppercase text-[#A17200] flex items-center gap-1.5">
              <Sparkles size={16} />
              <span>3-Month Flute & Whistle Seasonal Milestone</span>
            </h4>
            <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-[#58CC02] text-white">
              Month {currentMonth} Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className={`p-3 rounded-xl border-2 ${currentMonth === 1 ? 'bg-white border-[#FFC800] shadow-sm' : 'bg-white/60 border-gray-200'}`}>
              <div className="font-black text-[#A17200]">Month 1 (Nov) • Foundation</div>
              <p className="text-[11px] text-[#777777] font-semibold mt-1">
                Clean finger sealing, Alankars 1–4, and whistle interval matching.
              </p>
            </div>
            <div className={`p-3 rounded-xl border-2 ${currentMonth === 2 ? 'bg-white border-[#FFC800] shadow-sm' : 'bg-white/60 border-gray-200'}`}>
              <div className="font-black text-[#A17200]">Month 2 (Dec) • Agility</div>
              <p className="text-[11px] text-[#777777] font-semibold mt-1">
                Octave transitions, Alankars 5–8, triplet & quatro patterns.
              </p>
            </div>
            <div className={`p-3 rounded-xl border-2 ${currentMonth === 3 ? 'bg-white border-[#FFC800] shadow-sm' : 'bg-white/60 border-gray-200'}`}>
              <div className="font-black text-[#A17200]">Month 3 (Jan) • 1-Take Song</div>
              <p className="text-[11px] text-[#777777] font-semibold mt-1">
                4-bar phrases, gamak/meend ornamentation, full 1-take video recording.
              </p>
            </div>
          </div>
        </div>

        {/* Alankars 1 to 8 Database Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-sm uppercase text-[#3C3C3C]">
              Alankars 1–8 Speed & Finger-Sealing Database:
            </h4>
            <span className="text-[11px] text-[#777777] font-semibold">
              Click status badges to cycle Locked ➔ Practicing ➔ Mastered
            </span>
          </div>

          <div className="overflow-x-auto border-2 border-gray-200 rounded-2xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F7F7F7] border-b-2 border-gray-200 font-black text-[#777777]">
                  <th className="p-3">#</th>
                  <th className="p-3">Alankar & Sargam Pattern</th>
                  <th className="p-3 text-center">BPM Target</th>
                  <th className="p-3 text-center">Bansuri Flute</th>
                  <th className="p-3 text-center">Tin Whistle</th>
                  <th className="p-3 text-center">YouTube Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold">
                {alankars.map(alankar => (
                  <tr key={alankar.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-3 font-black text-[#3C3C3C]">{alankar.id}</td>
                    <td className="p-3">
                      <div className="font-extrabold text-[#3C3C3C]">{alankar.name}</div>
                      <div className="text-[11px] font-mono text-[#777777] mt-0.5">{alankar.sargamNotes}</div>
                    </td>
                    <td className="p-3 text-center">
                      <span className="font-black text-[#3C3C3C] bg-gray-100 px-2 py-0.5 rounded-md">
                        {alankar.speedTargetBpm} BPM
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => updateAlankarStatus(alankar.id, 'flute', cycleStatus(alankar.fluteStatus))}
                        className="cursor-pointer"
                        title="Click to toggle status"
                      >
                        {getStatusBadge(alankar.fluteStatus)}
                      </button>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => updateAlankarStatus(alankar.id, 'whistle', cycleStatus(alankar.whistleStatus))}
                        className="cursor-pointer"
                        title="Click to toggle status"
                      >
                        {getStatusBadge(alankar.whistleStatus)}
                      </button>
                    </td>
                    <td className="p-3 text-center">
                      <a
                        href={alankar.youtubeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FFF5D6] text-[#A17200] font-black text-[11px] hover:bg-[#ffeec2] transition-colors"
                      >
                        <Play size={11} className="fill-[#A17200]" />
                        <span>Watch</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end pt-3 border-t">
          <ChunkyButton variant="yellow" size="md" onClick={handleCompleteMusic}>
            <Check size={18} strokeWidth={3} />
            <span>Finished Practice Session & Mark Done</span>
          </ChunkyButton>
        </div>
      </div>
    </div>
  );
};
