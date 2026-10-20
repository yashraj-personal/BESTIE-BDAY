import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Award, RotateCcw, CheckCircle } from 'lucide-react';
import { sound } from '../utils/audio';
import { fireGrandConfetti } from '../utils/confetti';

interface GoldenScratchCardProps {
  bestieName: string;
  senderName: string;
  letterText: string;
}

export const GoldenScratchCard: React.FC<GoldenScratchCardProps> = ({
  bestieName,
  senderName,
  letterText,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const isDrawingRef = useRef(false);

  // Initialize Canvas Gold Glitter Cover
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.parentElement?.clientWidth || 500;
    const height = 280;
    canvas.width = width;
    canvas.height = height;

    // Golden metallic gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#d4af37');
    grad.addColorStop(0.25, '#fff4b8');
    grad.addColorStop(0.5, '#aa771c');
    grad.addColorStop(0.75, '#ffd700');
    grad.addColorStop(1, '#996515');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Add glitter pattern specks
    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.7)' : 'rgba(180,120,20,0.5)';
      ctx.beginPath();
      ctx.arc(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 2.5 + 1,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Centered Scratch Instruction Text
    ctx.fillStyle = '#3f2100';
    ctx.font = 'bold 18px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🪙 SCRATCH WITH CURSOR / FINGER 🪙', width / 2, height / 2 - 10);
    ctx.font = '13px Outfit, sans-serif';
    ctx.fillText('To Reveal Your Secret Birthday Letter & Wish!', width / 2, height / 2 + 18);

    setIsScratched(false);
    setScratchPercent(0);
  }, []);

  useEffect(() => {
    initCanvas();
    window.addEventListener('resize', initCanvas);
    return () => window.removeEventListener('resize', initCanvas);
  }, [initCanvas]);

  const lastCalcTimeRef = useRef<number>(0);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();

    // Check scratch percent throttled (max once every 120ms)
    const now = Date.now();
    if (now - lastCalcTimeRef.current > 120) {
      lastCalcTimeRef.current = now;
      sound.playChime(1.5);
      calculatePercent();
    }
  };

  const calculatePercent = () => {
    const canvas = canvasRef.current;
    if (!canvas || isScratched) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imgData.data;
      let transparentCount = 0;
      const totalPixels = pixels.length / 4;

      for (let i = 3; i < pixels.length; i += 16) {
        if (pixels[i] === 0) {
          transparentCount += 4;
        }
      }

      const percent = Math.min(100, Math.round((transparentCount / totalPixels) * 100));
      setScratchPercent(percent);

      if (percent > 45 && !isScratched) {
        setIsScratched(true);
        sound.playCelebrationFanfare();
        fireGrandConfetti();
      }
    } catch {}
  };

  // Mouse & Touch events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length > 0) {
      isDrawingRef.current = true;
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || e.touches.length === 0) return;
    scratch(e.touches[0].clientX, e.touches[0].clientY);
  };

  return (
    <div id="scratch-card-zone" className="relative w-full rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-8 bg-white border-8 border-yellow-400 shadow-[14px_14px_0px_rgba(253,224,71,0.5)] overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-100 text-amber-900 text-xs font-black border-2 border-yellow-300 mb-2">
            <Sparkles className="w-4 h-4 text-pink-500" />
            Interactive Golden Scratch & Reveal
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-display text-pink-600 leading-tight">
            Golden Secret Letter for {bestieName} 🪙
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 font-bold mt-1">
            Scratch the gold foil to reveal a personal message from {senderName}! ({scratchPercent}% Scratched)
          </p>
        </div>

        <button
          onClick={initCanvas}
          className="px-5 py-3 rounded-full bg-yellow-100 hover:bg-yellow-200 text-slate-900 text-xs font-black border-2 border-yellow-400 flex items-center gap-2 cursor-pointer transition active:scale-95 self-start sm:self-auto shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Cover & Scratch Again</span>
        </button>
      </div>

      {/* Scratch Canvas Container */}
      <div className="relative max-w-2xl mx-auto rounded-3xl overflow-hidden border-4 border-yellow-400 shadow-2xl min-h-[280px] bg-pink-50 text-slate-900">
        {/* Hidden Letter Below */}
        <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto text-left select-text">
          <div>
            <div className="flex items-center justify-between border-b-2 border-pink-200 pb-2 mb-3">
              <span className="text-xs font-black text-pink-600 uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                From the Heart of {senderName}
              </span>
              <span className="text-xs text-pink-700 font-black">Special Birthday Edition 💖</span>
            </div>

            <div className="text-slate-900 font-handwriting text-xl sm:text-2xl font-bold leading-relaxed whitespace-pre-line">
              {letterText}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t-2 border-pink-200 flex items-center justify-between text-xs text-pink-700 font-bold">
            <span>With unlimited love & blessings 💖</span>
            <span className="font-black font-sans">Forever Friends 🤞</span>
          </div>
        </div>

        {/* Scratch Canvas Overlay */}
        {!isScratched && (
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            className="relative z-10 w-full h-[280px] block cursor-grab active:cursor-grabbing touch-none"
          />
        )}

        {isScratched && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-3 right-3 z-20 px-4 py-1.5 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center gap-1 shadow-lg border-2 border-emerald-300"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Fully Revealed!</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};
