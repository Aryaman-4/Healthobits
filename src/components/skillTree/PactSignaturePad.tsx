import React, { useRef, useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { ChunkyButton } from '../common/ChunkyButton';
import { Award, Check, PenTool, RotateCcw } from 'lucide-react';

export const PactSignaturePad: React.FC = () => {
  const { state, signSeasonalPact } = useGame();
  const { character } = state;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI scaling
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.strokeStyle = '#3C3C3C';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (character.pactSignatureDataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
      };
      img.src = character.pactSignatureDataUrl;
    }
  }, [character.pactSignatureDataUrl]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleStampPact = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    signSeasonalPact(dataUrl);
  };

  return (
    <div className="relative p-6 sm:p-8 rounded-3xl border-2 border-[#E2D4BC] bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F5EEDB] shadow-md overflow-hidden">
      {/* Decorative Wax Seal in top-right corner if signed */}
      {character.pactSigned && (
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex flex-col items-center animate-pop">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#E5A400] via-[#FFC800] to-[#C78700] border-4 border-[#FFF5D6] shadow-lg flex items-center justify-center transform rotate-12">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#FFF5D6]/70 flex flex-col items-center justify-center text-white">
              <Award size={22} className="fill-white" />
              <span className="text-[8px] font-black tracking-widest uppercase">SEALED</span>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase text-[#A17200] mt-1 bg-white/70 px-2 py-0.5 rounded-full">
            {character.pactSignedDate || 'Signed'}
          </span>
        </div>
      )}

      {/* Pact Header */}
      <div className="max-w-xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">📜</span>
          <h3 className="font-black text-lg sm:text-xl text-[#4A3B2C] tracking-tight">
            The Seasonal Signature Pact
          </h3>
        </div>
        <p className="text-xs sm:text-sm font-semibold text-[#7D6B58] italic leading-relaxed">
          &ldquo;I promise myself to give my best to this 90-day Skill Tree. I will focus on consistency over perfection, honor my Keystone habits on exhausting days, and celebrate each node unlocked.&rdquo;
        </p>
      </div>

      {/* Signature Canvas Area */}
      <div className="mt-5 max-w-lg">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-black uppercase tracking-wider text-[#7D6B58] flex items-center gap-1.5">
            <PenTool size={13} />
            <span>Hero Signature & Oath</span>
          </span>
          {!character.pactSigned && hasDrawn && (
            <button
              onClick={handleClear}
              className="text-xs font-bold text-[#7D6B58] hover:text-red-500 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Clear</span>
            </button>
          )}
        </div>

        <div className="relative bg-white/80 rounded-2xl border-2 border-[#D8C6A7] border-dashed p-1 shadow-inner">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-28 sm:h-32 rounded-xl cursor-crosshair touch-none"
          />

          {!hasDrawn && !character.pactSignatureDataUrl && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-xs font-bold text-[#B09E83]">
              ✍️ Sign with your mouse or finger here
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-4 flex items-center gap-3">
          <ChunkyButton
            variant="yellow"
            size="md"
            onClick={handleStampPact}
          >
            <Check size={18} strokeWidth={3} />
            <span>{character.pactSigned ? 'Re-Stamp Wax Seal Oath' : 'Seal Oath with Golden Wax'}</span>
          </ChunkyButton>

          {character.pactSigned && (
            <span className="text-xs font-extrabold text-[#58CC02] flex items-center gap-1">
              <Check size={16} strokeWidth={3} />
              Oath Bound for Season {character.seasonNumber}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

