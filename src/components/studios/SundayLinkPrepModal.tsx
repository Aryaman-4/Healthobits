import React, { useState } from 'react';
import { Calendar, ExternalLink, Check, X, Sparkles, Link2 } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { ChunkyButton } from '../common/ChunkyButton';

export const SundayLinkPrepModal: React.FC = () => {
  const { activeStudioModal, setActiveStudioModal, state, updateSundayLinks } = useGame();
  const { sundayLinks } = state;

  const [pinterest, setPinterest] = useState(sundayLinks.pinterestUrl);
  const [alankar, setAlankar] = useState(sundayLinks.alankarYoutubeUrl);
  const [cloudLab, setCloudLab] = useState(sundayLinks.cloudLabUrl);

  if (activeStudioModal !== 'sundayLinks') return null;

  const handleSave = () => {
    updateSundayLinks({
      pinterestUrl: pinterest,
      alankarYoutubeUrl: alankar,
      cloudLabUrl: cloudLab
    });
    setActiveStudioModal(null);
  };

  // Google Calendar Link Generator
  const generateGCalLink = (title: string, detailsUrl: string, description: string) => {
    const text = encodeURIComponent(`Polymath Sprint: ${title}`);
    const details = encodeURIComponent(`${description}\n\n🚀 Pinned Deep Link URL: ${detailsUrl}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4 animate-pop">
      <div className="bg-white rounded-3xl border-2 border-b-8 border-[#1CB0F6] max-w-xl w-full p-6 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-[#DDF4FF] border-2 border-[#1CB0F6] flex items-center justify-center text-[#1CB0F6]">
              <Calendar size={24} />
            </div>
            <div>
              <h3 className="font-black text-xl text-[#3C3C3C]">
                Sunday Zero-Friction Link Prep
              </h3>
              <p className="text-xs text-[#777777] font-semibold mt-0.5">
                2-Minute Setup: Pre-link next week’s deep URLs into Google Calendar
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

        {/* Inputs */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase text-[#777777]">
              1. Next Week&apos;s Pinterest Drawing Study Reference:
            </label>
            <input
              type="text"
              value={pinterest}
              onChange={e => setPinterest(e.target.value)}
              placeholder="https://pinterest.com/pin/..."
              className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 text-xs font-semibold focus:border-[#1CB0F6] focus:outline-none"
            />
            <a
              href={generateGCalLink('Art Studio Session', pinterest, 'Sakura Pigma Micron 005 Inking Study')}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-black text-[#1CB0F6] hover:underline"
            >
              <ExternalLink size={12} />
              <span>📅 Add to Google Calendar with this link</span>
            </a>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase text-[#777777]">
              2. Next Week&apos;s Bansuri / Whistle Alankar YouTube Drill:
            </label>
            <input
              type="text"
              value={alankar}
              onChange={e => setAlankar(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 text-xs font-semibold focus:border-[#1CB0F6] focus:outline-none"
            />
            <a
              href={generateGCalLink('Flute & Whistle Practice', alankar, 'Bansuri finger sealing and tempo drills')}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-black text-[#1CB0F6] hover:underline"
            >
              <ExternalLink size={12} />
              <span>📅 Add to Google Calendar with this link</span>
            </a>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase text-[#777777]">
              3. Next Week&apos;s Cloud / Agentic AI Lab URL (GCP / GitHub Repo):
            </label>
            <input
              type="text"
              value={cloudLab}
              onChange={e => setCloudLab(e.target.value)}
              placeholder="https://console.cloud.google.com/..."
              className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 text-xs font-semibold focus:border-[#1CB0F6] focus:outline-none"
            />
            <a
              href={generateGCalLink('Career Engine Lab', cloudLab, 'Hands-on Cloud, Cybersec & Agentic AI Lab Sprint')}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-black text-[#1CB0F6] hover:underline"
            >
              <ExternalLink size={12} />
              <span>📅 Add to Google Calendar with this link</span>
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t">
          <ChunkyButton variant="blue" size="md" onClick={handleSave}>
            <Check size={18} strokeWidth={3} />
            <span>Save Pinned Links</span>
          </ChunkyButton>
        </div>
      </div>
    </div>
  );
};
