import React, { useState } from 'react';
import { Terminal, Shield, Cpu, ExternalLink, Check, X, Sparkles, Plus } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { ChunkyButton } from '../common/ChunkyButton';

export const CareerLabModal: React.FC = () => {
  const { activeStudioModal, setActiveStudioModal, state, updateCareerLabStatus, toggleHabitCompletion, selectedDate } = useGame();
  const { careerLabs } = state;

  if (activeStudioModal !== 'career') return null;

  const handleCompleteCareerHabit = () => {
    const careerHabit = state.habits.find(h => h.id === 'h-empire-labs');
    if (careerHabit && !careerHabit.completedDates.includes(selectedDate)) {
      toggleHabitCompletion(careerHabit.id, selectedDate);
    }
    setActiveStudioModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-2 sm:p-4 animate-pop">
      <div className="bg-white rounded-3xl border-2 border-b-8 border-[#CE82FF] max-w-3xl w-full p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-6 max-h-[94vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-gray-100 pb-3 gap-2">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#F3E5FF] border-2 border-[#CE82FF] flex items-center justify-center text-[#A560E8] shrink-0">
              <Cpu size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h3 className="font-black text-sm sm:text-xl text-[#3C3C3C] truncate">
                  Career Triad Engine
                </h3>
                <span className="text-[9px] sm:text-[10px] font-black uppercase px-1.5 sm:px-2 py-0.5 rounded-full bg-[#CE82FF] text-white shrink-0">
                  Cloud + AI
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#777777] font-semibold mt-0.5 truncate">
                Linux, GCP/AWS Security Architecture, and Agentic AI Labs
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveStudioModal(null)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center font-black cursor-pointer shrink-0"
          >
            <X size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>

        {/* Pipeline Info */}
        <div className="p-4 bg-[#F7F7F7] rounded-2xl border-2 border-[#E5E5E5] flex items-center justify-between gap-4">
          <div>
            <div className="font-black text-xs uppercase text-[#777777]">The Polymath Publishing Pipeline:</div>
            <div className="text-xs text-[#3C3C3C] font-semibold mt-0.5">
              Hands-on MWF lab code ➔ Pushed to GitHub ➔ Converted to Sunday LinkedIn/Blog Case Study
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-black">
            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">In Lab</span>
            <span>➔</span>
            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">Code Pushed</span>
            <span>➔</span>
            <span className="px-2 py-0.5 rounded-md bg-green-100 text-green-800">Published</span>
          </div>
        </div>

        {/* Labs List */}
        <div className="space-y-3">
          {careerLabs.map(lab => (
            <div
              key={lab.id}
              className="p-4 bg-white rounded-2xl border-2 border-[#E5E5E5] border-b-4 space-y-3 hover:border-gray-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="font-black text-sm text-[#3C3C3C] leading-snug">
                  {lab.title}
                </h4>

                {/* Pipeline Status Buttons */}
                <div className="flex items-center gap-1 bg-[#F7F7F7] p-1 rounded-xl border border-gray-200 self-start sm:self-auto">
                  {(['in_lab', 'code_pushed', 'published'] as const).map(status => {
                    const isSelected = lab.status === status;
                    const labels = {
                      in_lab: '🧪 In Lab',
                      code_pushed: '💻 Pushed',
                      published: '🚀 Published'
                    };
                    return (
                      <button
                        key={status}
                        onClick={() => updateCareerLabStatus(lab.id, status)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase cursor-pointer transition-colors ${
                          isSelected
                            ? status === 'published'
                              ? 'bg-[#58CC02] text-white'
                              : status === 'code_pushed'
                              ? 'bg-[#1CB0F6] text-white'
                              : 'bg-[#FFC800] text-[#3C3C3C]'
                            : 'text-[#777777] hover:text-[#3C3C3C]'
                        }`}
                      >
                        {labels[status]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tech Stack Tags */}
              <div className="flex flex-wrap items-center gap-1.5">
                {lab.techStack.map(tech => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded-md bg-[#F3E5FF] text-[#A560E8] text-[10px] font-black uppercase border border-[#CE82FF]/40"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Notes & Repo Link */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#777777] pt-2 border-t border-gray-100">
                <span className="font-semibold italic truncate max-w-md">
                  &ldquo;{lab.caseStudyNotes}&rdquo;
                </span>
                <a
                  href={lab.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[#1CB0F6] font-black hover:underline shrink-0"
                >
                  <ExternalLink size={12} />
                  <span>View Repository</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end pt-3 border-t">
          <ChunkyButton variant="purple" size="md" onClick={handleCompleteCareerHabit}>
            <Check size={18} strokeWidth={3} />
            <span>Mark Today&apos;s Career Lab Complete</span>
          </ChunkyButton>
        </div>
      </div>
    </div>
  );
};

